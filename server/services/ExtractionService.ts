import axios from 'axios';
import * as cheerio from 'cheerio';

export class ExtractionService {
  
  static async scrapeWebsite(url: string) {
    try {
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; ModelCardBot/1.0)'
        },
        timeout: 10000
      });

      const $ = cheerio.load(response.data);
      
      // Extract structured data
      const extractedData = {
        title: $('title').text().trim(),
        description: $('meta[name="description"]').attr('content') || '',
        content: this.extractTextContent($),
        metrics: this.extractMetrics($),
        datasetInfo: this.extractDatasetInfo($),
        technicalSpecs: this.extractTechnicalSpecs($),
        sourceUrl: url,
        extractedAt: new Date().toISOString()
      };

      return extractedData;
    } catch (error) {
      console.error('Website scraping failed:', error);
      throw new Error(`Failed to scrape website: ${error.message}`);
    }
  }

  static async extractFromPaper(doi: string) {
    try {
      // Use CrossRef API to get paper metadata
      const crossRefResponse = await axios.get(`https://api.crossref.org/works/${doi}`);
      const paperMetadata = crossRefResponse.data.message;

      // Attempt to get full text from various sources
      const extractedData = {
        title: paperMetadata.title?.[0] || 'Unknown Title',
        authors: paperMetadata.author?.map(a => `${a.given} ${a.family}`) || [],
        journal: paperMetadata['container-title']?.[0] || 'Unknown Journal',
        year: paperMetadata.published?.['date-parts']?.[0]?.[0] || 'Unknown Year',
        doi: doi,
        abstract: paperMetadata.abstract || '',
        metrics: await this.extractPaperMetrics(doi),
        datasetInfo: await this.extractDatasetFromPaper(doi),
        sourceType: 'peer-reviewed-paper',
        extractedAt: new Date().toISOString()
      };

      return extractedData;
    } catch (error) {
      console.error('Paper extraction failed:', error);
      throw new Error(`Failed to extract from paper: ${error.message}`);
    }
  }

  static async extractFromGitHub(repoUrl: string) {
    try {
      const repoPath = repoUrl.replace('https://github.com/', '');
      const apiUrl = `https://api.github.com/repos/${repoPath}`;
      
      // Get repository metadata
      const repoResponse = await axios.get(apiUrl);
      const repoData = repoResponse.data;

      // Get README content
      const readmeResponse = await axios.get(`${apiUrl}/readme`, {
        headers: {
          'Accept': 'application/vnd.github.v3.raw'
        }
      });

      // Extract technical information from README
      const extractedData = {
        name: repoData.name,
        description: repoData.description,
        stars: repoData.stargazers_count,
        language: repoData.language,
        readme: readmeResponse.data,
        metrics: this.extractMetricsFromReadme(readmeResponse.data),
        technicalSpecs: this.extractTechnicalSpecsFromReadme(readmeResponse.data),
        requirements: this.extractRequirements(readmeResponse.data),
        sourceType: 'github-repository',
        sourceUrl: repoUrl,
        extractedAt: new Date().toISOString()
      };

      return extractedData;
    } catch (error) {
      console.error('GitHub extraction failed:', error);
      throw new Error(`Failed to extract from GitHub: ${error.message}`);
    }
  }

  static async extractFromHuggingFace(modelName: string) {
    try {
      const apiUrl = `https://huggingface.co/api/models/${modelName}`;
      
      // Get model metadata
      const modelResponse = await axios.get(apiUrl);
      const modelData = modelResponse.data;

      // Get model card content
      let modelCard = '';
      try {
        const cardResponse = await axios.get(`https://huggingface.co/${modelName}/raw/main/README.md`);
        modelCard = cardResponse.data;
      } catch (e) {
        console.warn('Could not fetch model card README');
      }

      const extractedData = {
        name: modelData.modelId || modelName,
        downloads: modelData.downloads || 0,
        likes: modelData.likes || 0,
        tags: modelData.tags || [],
        pipeline: modelData.pipeline_tag || '',
        modelCard: modelCard,
        metrics: this.extractMetricsFromModelCard(modelCard),
        datasets: this.extractDatasetsFromModelCard(modelCard),
        sourceType: 'huggingface-model',
        sourceUrl: `https://huggingface.co/${modelName}`,
        extractedAt: new Date().toISOString()
      };

      return extractedData;
    } catch (error) {
      console.error('HuggingFace extraction failed:', error);
      throw new Error(`Failed to extract from HuggingFace: ${error.message}`);
    }
  }

  // Helper methods for parsing content
  private static extractTextContent($: cheerio.CheerioAPI): string {
    // Remove script and style elements
    $('script, style').remove();
    
    // Extract main content areas
    const contentSelectors = [
      'main', 'article', '.content', '#content', 
      '.documentation', '.model-info', '.performance'
    ];
    
    let content = '';
    for (const selector of contentSelectors) {
      const element = $(selector);
      if (element.length > 0) {
        content += element.text().trim() + ' ';
      }
    }
    
    return content || $('body').text().trim();
  }

  private static extractMetrics($: cheerio.CheerioAPI): any {
    const metrics: any = {};
    
    // Look for common metric patterns
    const text = $.text().toLowerCase();
    
    // Extract accuracy
    const accuracyMatch = text.match(/accuracy[:\s]*([0-9.]+)%?/i);
    if (accuracyMatch) {
      metrics.accuracy = parseFloat(accuracyMatch[1]) / (accuracyMatch[1].includes('.') && parseFloat(accuracyMatch[1]) <= 1 ? 1 : 100);
    }
    
    // Extract sensitivity/recall
    const sensitivityMatch = text.match(/(?:sensitivity|recall)[:\s]*([0-9.]+)%?/i);
    if (sensitivityMatch) {
      metrics.sensitivity = parseFloat(sensitivityMatch[1]) / (sensitivityMatch[1].includes('.') && parseFloat(sensitivityMatch[1]) <= 1 ? 1 : 100);
    }
    
    // Extract specificity
    const specificityMatch = text.match(/specificity[:\s]*([0-9.]+)%?/i);
    if (specificityMatch) {
      metrics.specificity = parseFloat(specificityMatch[1]) / (specificityMatch[1].includes('.') && parseFloat(specificityMatch[1]) <= 1 ? 1 : 100);
    }
    
    // Extract AUC
    const aucMatch = text.match(/auc[:\s]*([0-9.]+)/i);
    if (aucMatch) {
      metrics.auc = parseFloat(aucMatch[1]);
    }

    return Object.keys(metrics).length > 0 ? metrics : null;
  }

  private static extractDatasetInfo($: cheerio.CheerioAPI): any {
    const text = $.text().toLowerCase();
    const datasetInfo: any = {};
    
    // Extract dataset size
    const sizeMatch = text.match(/(?:dataset|training)[^0-9]*([0-9,]+)[^0-9]*(?:images|samples|patients)/i);
    if (sizeMatch) {
      datasetInfo.size = sizeMatch[1].replace(',', '');
    }
    
    // Extract dataset names
    const commonDatasets = ['isic', 'dermnet', 'ham10000', 'asan', 'fitzpatrick'];
    for (const dataset of commonDatasets) {
      if (text.includes(dataset)) {
        datasetInfo.name = dataset.toUpperCase();
        break;
      }
    }
    
    return Object.keys(datasetInfo).length > 0 ? datasetInfo : null;
  }

  private static extractTechnicalSpecs($: cheerio.CheerioAPI): any {
    const text = $.text().toLowerCase();
    const specs: any = {};
    
    // Extract model architecture
    const architectures = ['resnet', 'vgg', 'densenet', 'efficientnet', 'mobilenet', 'inception'];
    for (const arch of architectures) {
      if (text.includes(arch)) {
        specs.architecture = arch;
        break;
      }
    }
    
    // Extract framework
    const frameworks = ['pytorch', 'tensorflow', 'keras', 'scikit-learn'];
    for (const framework of frameworks) {
      if (text.includes(framework)) {
        specs.framework = framework;
        break;
      }
    }
    
    return Object.keys(specs).length > 0 ? specs : null;
  }

  private static async extractPaperMetrics(doi: string): Promise<any> {
    // In production, this would parse PDFs or use academic APIs
    // For now, return placeholder that indicates real extraction attempt
    return {
      extractionNote: `Attempted real extraction from DOI: ${doi}`,
      extractionStatus: 'requires-pdf-access'
    };
  }

  private static async extractDatasetFromPaper(doi: string): Promise<any> {
    // Would extract dataset information from paper content
    return {
      extractionNote: `Dataset info would be extracted from paper: ${doi}`,
      extractionStatus: 'requires-full-text-access'
    };
  }

  private static extractMetricsFromReadme(readme: string): any {
    const metrics: any = {};
    const text = readme.toLowerCase();
    
    // Extract metrics from README
    const accuracyMatch = text.match(/accuracy[:\s]*([0-9.]+)%?/i);
    if (accuracyMatch) {
      metrics.accuracy = parseFloat(accuracyMatch[1]);
      metrics.source = 'README.md';
    }
    
    return Object.keys(metrics).length > 0 ? metrics : null;
  }

  private static extractTechnicalSpecsFromReadme(readme: string): any {
    const specs: any = {};
    const text = readme.toLowerCase();
    
    // Extract technical specifications
    if (text.includes('pytorch')) specs.framework = 'PyTorch';
    if (text.includes('tensorflow')) specs.framework = 'TensorFlow';
    
    return Object.keys(specs).length > 0 ? specs : null;
  }

  private static extractRequirements(readme: string): string[] {
    const requirements = [];
    const lines = readme.split('\n');
    
    for (const line of lines) {
      if (line.toLowerCase().includes('requirement') || line.toLowerCase().includes('install')) {
        const pythonPackages = line.match(/pip install ([^\n]+)/);
        if (pythonPackages) {
          requirements.push(...pythonPackages[1].split(' '));
        }
      }
    }
    
    return requirements;
  }

  private static extractMetricsFromModelCard(modelCard: string): any {
    const metrics: any = {};
    const text = modelCard.toLowerCase();
    
    // Extract metrics from model card
    const accuracyMatch = text.match(/accuracy[:\s]*([0-9.]+)%?/);
    if (accuracyMatch) {
      metrics.accuracy = parseFloat(accuracyMatch[1]);
      metrics.source = 'HuggingFace Model Card';
    }
    
    return Object.keys(metrics).length > 0 ? metrics : null;
  }

  private static extractDatasetsFromModelCard(modelCard: string): string[] {
    const datasets = [];
    const text = modelCard.toLowerCase();
    
    const commonDatasets = ['imagenet', 'coco', 'isic', 'dermnet', 'ham10000'];
    for (const dataset of commonDatasets) {
      if (text.includes(dataset)) {
        datasets.push(dataset);
      }
    }
    
    return datasets;
  }
}