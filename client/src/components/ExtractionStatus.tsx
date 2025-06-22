import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertCircle, ExternalLink, Loader2 } from 'lucide-react';
import { ModelCardData } from '@/pages/Index';

type ExtractionStatusProps = {
  modelCardData: ModelCardData;
};

export const ExtractionStatus = ({ modelCardData }: ExtractionStatusProps) => {
  const getExtractionSources = () => {
    const sources = [];
    
    if (modelCardData.modelInfo.papers?.length > 0) {
      modelCardData.modelInfo.papers.forEach((paper, index) => {
        sources.push({
          type: 'Academic Paper',
          name: paper.title,
          status: paper.isReal ? 'success' : 'placeholder',
          method: paper.isReal ? 'CrossRef API + DOI Resolution' : 'Search performed',
          url: paper.doi ? `https://doi.org/${paper.doi}` : null,
          extractedData: paper.isReal ? [
            'Performance metrics from results section',
            'Dataset information from methodology',
            'Clinical validation data'
          ] : ['Title and metadata only']
        });
      });
    }

    if (modelCardData.modelInfo.githubRepo) {
      sources.push({
        type: 'GitHub Repository',
        name: modelCardData.modelInfo.githubRepo.name,
        status: modelCardData.modelInfo.githubRepo.isReal ? 'success' : 'placeholder',
        method: modelCardData.modelInfo.githubRepo.isReal ? 'GitHub API + README parsing' : 'Repository search performed',
        url: modelCardData.modelInfo.githubRepo.url,
        extractedData: modelCardData.modelInfo.githubRepo.isReal ? [
          'Technical specifications from README',
          'Model architecture details',
          'Implementation requirements'
        ] : ['Repository metadata only']
      });
    }

    if (modelCardData.modelInfo.huggingfaceCard) {
      sources.push({
        type: 'HuggingFace Model',
        name: modelCardData.modelInfo.huggingfaceCard.name,
        status: modelCardData.modelInfo.huggingfaceCard.isReal ? 'success' : 'placeholder',
        method: modelCardData.modelInfo.huggingfaceCard.isReal ? 'HuggingFace API + Model Card parsing' : 'Model search performed',
        url: modelCardData.modelInfo.huggingfaceCard.url,
        extractedData: modelCardData.modelInfo.huggingfaceCard.isReal ? [
          'Model metadata and configurations',
          'Usage statistics and performance',
          'Community feedback and ratings'
        ] : ['Model listing only']
      });
    }

    if (modelCardData.modelInfo.websiteData) {
      sources.push({
        type: 'Official Website',
        name: modelCardData.modelInfo.websiteData.title,
        status: 'success',
        method: 'Web scraping + Content parsing',
        url: modelCardData.modelInfo.websiteData.url,
        extractedData: [
          'Performance metrics from documentation',
          'Technical specifications',
          'Usage guidelines and examples'
        ]
      });
    }

    return sources;
  };

  const sources = getExtractionSources();
  const realDataSources = sources.filter(s => s.status === 'success').length;
  const totalSources = sources.length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-900">
          Data Extraction Status
        </h3>
        <Badge variant={realDataSources > 0 ? "default" : "secondary"}>
          {realDataSources}/{totalSources} Real Sources
        </Badge>
      </div>

      <div className="grid gap-4">
        {sources.map((source, index) => (
          <Card key={index} className={`border-l-4 ${
            source.status === 'success' ? 'border-l-green-500' : 'border-l-yellow-500'
          }`}>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between text-base">
                <div className="flex items-center space-x-2">
                  {source.status === 'success' ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-yellow-600" />
                  )}
                  <span>{source.type}</span>
                </div>
                <Badge variant={source.status === 'success' ? "default" : "secondary"}>
                  {source.status === 'success' ? 'Real Data' : 'Search Only'}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <h4 className="font-medium text-gray-900">{source.name}</h4>
                <p className="text-sm text-gray-600">
                  Extraction Method: {source.method}
                </p>
                {source.url && (
                  <a 
                    href={source.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
                  >
                    <ExternalLink className="h-3 w-3 mr-1" />
                    View Source
                  </a>
                )}
              </div>
              
              <div>
                <h5 className="text-sm font-medium text-gray-800 mb-2">
                  Data Extracted:
                </h5>
                <ul className="text-xs text-gray-600 space-y-1">
                  {source.extractedData.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start space-x-2">
                      <span className={`mt-1 ${
                        source.status === 'success' ? 'text-green-500' : 'text-yellow-500'
                      }`}>•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {realDataSources === 0 && (
        <Card className="border-dashed border-gray-300">
          <CardContent className="text-center py-8">
            <AlertCircle className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
            <p className="text-gray-600 mb-2">
              No verified sources with extractable data were found for this model.
            </p>
            <p className="text-sm text-gray-500">
              Search was performed across academic databases, GitHub repositories, 
              and HuggingFace models, but no real performance metrics or detailed 
              documentation could be extracted.
            </p>
          </CardContent>
        </Card>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">Extraction Process</h4>
        <div className="text-sm text-blue-800 space-y-1">
          <p>✓ CrossRef API search for peer-reviewed papers</p>
          <p>✓ GitHub API search for open-source implementations</p>
          <p>✓ HuggingFace API search for pre-trained models</p>
          <p>✓ Web scraping for official documentation</p>
          <p>✓ Real-time parsing of structured content</p>
        </div>
      </div>
    </div>
  );
};