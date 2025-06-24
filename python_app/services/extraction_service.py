import httpx
from bs4 import BeautifulSoup
import re
from typing import Dict, Any, List, Optional
from datetime import datetime

from models import ExtractedData, PaperData, GitHubData


class ExtractionService:
    """Service for extracting data from various sources"""
    
    @staticmethod
    async def scrape_website(url: str) -> ExtractedData:
        """Scrape and extract data from a website"""
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                headers = {
                    'User-Agent': 'Mozilla/5.0 (compatible; ModelCardBot/1.0)'
                }
                response = await client.get(url, headers=headers)
                response.raise_for_status()
            
            soup = BeautifulSoup(response.text, 'html.parser')
            
            # Extract structured data
            title = soup.find('title')
            title_text = title.text.strip() if title else ''
            
            description_meta = soup.find('meta', attrs={'name': 'description'})
            description = description_meta.get('content', '') if description_meta else ''
            
            extracted_data = ExtractedData(
                title=title_text,
                description=description,
                content=ExtractionService._extract_text_content(soup),
                metrics=ExtractionService._extract_metrics(soup),
                datasetInfo=ExtractionService._extract_dataset_info(soup),
                technicalSpecs=ExtractionService._extract_technical_specs(soup),
                sourceUrl=url,
                sourceType="website"
            )
            
            return extracted_data
            
        except Exception as e:
            raise Exception(f"Failed to scrape website: {str(e)}")
    
    @staticmethod
    async def extract_from_paper(doi: str) -> PaperData:
        """Extract data from academic paper using DOI"""
        try:
            # Use CrossRef API to get paper metadata
            async with httpx.AsyncClient() as client:
                crossref_url = f"https://api.crossref.org/works/{doi}"
                response = await client.get(crossref_url)
                response.raise_for_status()
                
                data = response.json()
                paper_metadata = data['message']
            
            # Extract authors
            authors = []
            if 'author' in paper_metadata:
                for author in paper_metadata['author']:
                    given = author.get('given', '')
                    family = author.get('family', '')
                    if given and family:
                        authors.append(f"{given} {family}")
            
            # Extract publication year
            year = 'Unknown Year'
            if 'published' in paper_metadata and 'date-parts' in paper_metadata['published']:
                date_parts = paper_metadata['published']['date-parts']
                if date_parts and len(date_parts[0]) > 0:
                    year = str(date_parts[0][0])
            
            paper_data = PaperData(
                title=paper_metadata.get('title', ['Unknown Title'])[0],
                authors=authors,
                journal=paper_metadata.get('container-title', ['Unknown Journal'])[0],
                year=year,
                doi=doi,
                abstract=paper_metadata.get('abstract', ''),
                metrics=await ExtractionService._extract_paper_metrics(doi),
                datasetInfo=await ExtractionService._extract_dataset_from_paper(doi)
            )
            
            return paper_data
            
        except Exception as e:
            raise Exception(f"Failed to extract from paper: {str(e)}")
    
    @staticmethod
    async def extract_from_github(repo_url: str) -> GitHubData:
        """Extract data from GitHub repository"""
        try:
            # Convert GitHub URL to API format
            repo_path = repo_url.replace('https://github.com/', '')
            api_url = f"https://api.github.com/repos/{repo_path}"
            
            async with httpx.AsyncClient() as client:
                # Get repository metadata
                repo_response = await client.get(api_url)
                repo_response.raise_for_status()
                repo_data = repo_response.json()
                
                # Get README content
                readme_url = f"{api_url}/readme"
                readme_headers = {'Accept': 'application/vnd.github.v3.raw'}
                readme_response = await client.get(readme_url, headers=readme_headers)
                readme_content = readme_response.text if readme_response.status_code == 200 else ''
            
            github_data = GitHubData(
                name=repo_data['name'],
                description=repo_data.get('description', ''),
                stars=repo_data['stargazers_count'],
                language=repo_data.get('language'),
                readme=readme_content,
                metrics=ExtractionService._extract_metrics_from_readme(readme_content),
                technicalSpecs=ExtractionService._extract_technical_specs_from_readme(readme_content),
                requirements=ExtractionService._extract_requirements(readme_content),
                sourceUrl=repo_url
            )
            
            return github_data
            
        except Exception as e:
            raise Exception(f"Failed to extract from GitHub: {str(e)}")
    
    @staticmethod
    def _extract_text_content(soup: BeautifulSoup) -> str:
        """Extract main text content from HTML"""
        # Remove script and style elements
        for script in soup(["script", "style"]):
            script.decompose()
        
        # Get text content
        text = soup.get_text()
        lines = (line.strip() for line in text.splitlines())
        chunks = (phrase.strip() for line in lines for phrase in line.split("  "))
        text = ' '.join(chunk for chunk in chunks if chunk)
        
        return text[:5000]  # Limit to first 5000 characters
    
    @staticmethod
    def _extract_metrics(soup: BeautifulSoup) -> Dict[str, Any]:
        """Extract performance metrics from HTML"""
        metrics = {}
        
        # Look for common metric patterns
        text = soup.get_text().lower()
        
        # Accuracy patterns
        accuracy_match = re.search(r'accuracy[:\s]*(\d+(?:\.\d+)?%?)', text)
        if accuracy_match:
            metrics['accuracy'] = accuracy_match.group(1)
        
        # AUC patterns
        auc_match = re.search(r'auc[:\s]*(\d+(?:\.\d+)?)', text)
        if auc_match:
            metrics['auc'] = float(auc_match.group(1))
        
        # Sensitivity/Specificity patterns
        sensitivity_match = re.search(r'sensitivity[:\s]*(\d+(?:\.\d+)?%?)', text)
        if sensitivity_match:
            metrics['sensitivity'] = sensitivity_match.group(1)
        
        specificity_match = re.search(r'specificity[:\s]*(\d+(?:\.\d+)?%?)', text)
        if specificity_match:
            metrics['specificity'] = specificity_match.group(1)
        
        return metrics
    
    @staticmethod
    def _extract_dataset_info(soup: BeautifulSoup) -> Dict[str, Any]:
        """Extract dataset information from HTML"""
        dataset_info = {}
        text = soup.get_text().lower()
        
        # Look for dataset size
        size_match = re.search(r'(\d+(?:,\d+)*)\s*(?:images|samples|cases)', text)
        if size_match:
            dataset_info['size'] = size_match.group(1)
        
        # Look for dataset name
        dataset_patterns = [
            r'dataset[:\s]*([a-zA-Z0-9\-_\s]+)',
            r'trained on[:\s]*([a-zA-Z0-9\-_\s]+)',
            r'using[:\s]*([a-zA-Z0-9\-_\s]+)\s*dataset'
        ]
        
        for pattern in dataset_patterns:
            match = re.search(pattern, text)
            if match:
                dataset_info['name'] = match.group(1).strip()
                break
        
        return dataset_info
    
    @staticmethod
    def _extract_technical_specs(soup: BeautifulSoup) -> Dict[str, Any]:
        """Extract technical specifications from HTML"""
        specs = {}
        text = soup.get_text().lower()
        
        # Look for model architecture
        arch_patterns = ['resnet', 'densenet', 'efficientnet', 'inception', 'vgg', 'mobilenet']
        for arch in arch_patterns:
            if arch in text:
                specs['architecture'] = arch
                break
        
        # Look for framework
        frameworks = ['tensorflow', 'pytorch', 'keras', 'scikit-learn']
        for framework in frameworks:
            if framework in text:
                specs['framework'] = framework
                break
        
        return specs
    
    @staticmethod
    async def _extract_paper_metrics(doi: str) -> Dict[str, Any]:
        """Extract metrics from research paper"""
        # This would typically involve more sophisticated NLP
        # For now, return empty dict
        return {}
    
    @staticmethod
    async def _extract_dataset_from_paper(doi: str) -> Dict[str, Any]:
        """Extract dataset information from research paper"""
        # This would typically involve more sophisticated NLP
        # For now, return empty dict
        return {}
    
    @staticmethod
    def _extract_metrics_from_readme(readme_content: str) -> Dict[str, Any]:
        """Extract metrics from README content"""
        metrics = {}
        text = readme_content.lower()
        
        # Look for common metric patterns in README
        accuracy_match = re.search(r'accuracy[:\s]*(\d+(?:\.\d+)?%?)', text)
        if accuracy_match:
            metrics['accuracy'] = accuracy_match.group(1)
        
        return metrics
    
    @staticmethod
    def _extract_technical_specs_from_readme(readme_content: str) -> Dict[str, Any]:
        """Extract technical specs from README content"""
        specs = {}
        text = readme_content.lower()
        
        # Look for Python version
        python_match = re.search(r'python\s*(\d+\.\d+)', text)
        if python_match:
            specs['python_version'] = python_match.group(1)
        
        return specs
    
    @staticmethod
    def _extract_requirements(readme_content: str) -> List[str]:
        """Extract requirements from README content"""
        requirements = []
        
        # Look for requirements section
        lines = readme_content.split('\n')
        in_requirements = False
        
        for line in lines:
            if 'requirements' in line.lower() or 'dependencies' in line.lower():
                in_requirements = True
                continue
            
            if in_requirements:
                if line.strip().startswith('- ') or line.strip().startswith('* '):
                    req = line.strip()[2:].strip()
                    if req:
                        requirements.append(req)
                elif line.strip() == '':
                    continue
                else:
                    break
        
        return requirements