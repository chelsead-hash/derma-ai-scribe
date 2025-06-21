
import { useState } from 'react';
import { Search, Loader2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  const [showWebsiteInput, setShowWebsiteInput] = useState(false);
  const { toast } = useToast();

  const handleSearch = async () => {
    if (!modelName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a model name",
        variant: "destructive",
      });
      return;
    }

    setIsSearching(true);
    
    try {
      console.log('Searching for model:', modelName);
      const modelInfo = await ModelSearchService.searchModel(modelName, websiteUrl);
      
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

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Search for Dermatology AI Model
        </h2>
        <p className="text-gray-600">
          Enter the name of the dermatology AI model you want to generate a model card for
        </p>
      </div>

      <div className="max-w-md mx-auto space-y-4">
        <div>
          <label htmlFor="model-name" className="block text-sm font-medium text-gray-700 mb-2">
            Model Name *
          </label>
          <Input
            id="model-name"
            type="text"
            value={modelName}
            onChange={(e) => setModelName(e.target.value)}
            placeholder="e.g., DermNet, SkinVision, MoleMapper"
            className="w-full"
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
        </div>

        {!showWebsiteInput && (
          <Button
            variant="outline"
            onClick={() => setShowWebsiteInput(true)}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Website URL (Optional)
          </Button>
        )}

        {showWebsiteInput && (
          <div>
            <label htmlFor="website-url" className="block text-sm font-medium text-gray-700 mb-2">
              Model Website URL (Optional)
            </label>
            <Input
              id="website-url"
              type="url"
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              placeholder="https://example.com/model-info"
              className="w-full"
            />
            <p className="text-xs text-gray-500 mt-1">
              Add a website URL if the model has a dedicated information page
            </p>
          </div>
        )}

        <Button
          onClick={handleSearch}
          disabled={isSearching}
          className="w-full bg-blue-600 hover:bg-blue-700"
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
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-2xl mx-auto">
        <h3 className="font-semibold text-blue-900 mb-2">What we'll search for:</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Published research papers (PubMed, arXiv, Google Scholar)</li>
          <li>• GitHub repositories and README files</li>
          <li>• HuggingFace model cards and metadata</li>
          <li>• Website information pages (if URL provided)</li>
          <li>• Documentation and technical specifications</li>
        </ul>
      </div>
    </div>
  );
};
