import { useState } from 'react';
import { Search, Loader2, Globe, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { ModelSearchService } from '@/services/ModelSearchService';
import { ModelInfo } from '@/pages/Index';

type SearchStepProps = {
  onModelFound: (modelInfo: ModelInfo) => void;
};

export const SearchStep = ({ onModelFound }: SearchStepProps) => {
  const [modelName, setModelName] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchType, setSearchType] = useState('name');
  const { toast } = useToast();

  const handleSearch = async () => {
    const searchQuery = searchType === 'name' ? modelName.trim() : websiteUrl.trim();
    
    if (!searchQuery) {
      toast({
        title: "Error",
        description: `Please enter a ${searchType === 'name' ? 'model name' : 'website URL'}`,
        variant: "destructive",
      });
      return;
    }

    if (searchType === 'website' && !isValidUrl(websiteUrl)) {
      toast({
        title: "Error",
        description: "Please enter a valid website URL",
        variant: "destructive",
      });
      return;
    }

    setIsSearching(true);
    
    try {
      console.log('Searching for model:', searchQuery);
      const modelInfo = searchType === 'name' 
        ? await ModelSearchService.searchModel(modelName, undefined)
        : await ModelSearchService.searchModelByWebsite(websiteUrl);
      
      if (modelInfo.confidence > 0.3) {
        toast({
          title: "Success",
          description: `Found model information with ${Math.round(modelInfo.confidence * 100)}% confidence`,
        });
        onModelFound(modelInfo);
      } else {
        toast({
          title: "Limited Results",
          description: "Found some information but confidence is low. Please review carefully.",
        });
        onModelFound(modelInfo);
      }
    } catch (error) {
      console.error('Search error:', error);
      toast({
        title: "Search Failed",
        description: "Failed to search for model information. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const isValidUrl = (string: string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Search for AI Model
        </h2>
        <p className="text-gray-600">
          Search by model name or website URL to begin automated model card generation
        </p>
      </div>

      <div className="max-w-lg mx-auto">
        <Tabs value={searchType} onValueChange={setSearchType} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="name" className="flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span>Model Name</span>
            </TabsTrigger>
            <TabsTrigger value="website" className="flex items-center space-x-2">
              <Globe className="h-4 w-4" />
              <span>Website URL</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="name" className="space-y-4 mt-6">
            <div className="space-y-2">
              <Label htmlFor="modelName">Model Name</Label>
              <Input
                id="modelName"
                type="text"
                placeholder="e.g., DermNet, SkinCancer-AI, MoleMapper"
                value={modelName}
                onChange={(e) => setModelName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full"
              />
              <p className="text-xs text-gray-500">
                Enter the name of the dermatology AI model you want to generate a card for
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="website" className="space-y-4 mt-6">
            <div className="space-y-2">
              <Label htmlFor="websiteUrl">Website URL</Label>
              <Input
                id="websiteUrl"
                type="url"
                placeholder="https://example.com/model-documentation"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full"
              />
              <p className="text-xs text-gray-500">
                Enter the URL of a website containing model documentation or information
              </p>
            </div>
          </TabsContent>
        </Tabs>

        <Button
          onClick={handleSearch}
          disabled={isSearching || (searchType === 'name' && !modelName.trim()) || (searchType === 'website' && !websiteUrl.trim())}
          className="w-full mt-6"
          size="lg"
        >
          {isSearching ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Searching...
            </>
          ) : (
            <>
              <Search className="h-4 w-4 mr-2" />
              Search Model
            </>
          )}
        </Button>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
          <h3 className="font-semibold text-blue-900 mb-2">What we'll search for:</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Published research papers (PubMed, arXiv, Google Scholar)</li>
            <li>• GitHub repositories and README files</li>
            <li>• HuggingFace model cards and metadata</li>
            <li>• Website information and documentation</li>
            <li>• Technical specifications and performance metrics</li>
          </ul>
        </div>
      </div>
    </div>
  );
};