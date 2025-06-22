
import { CheckCircle, XCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ModelInfo } from '@/pages/Index';

type ValidationStepProps = {
  modelInfo: ModelInfo;
  onValidate: () => void;
  onBack: () => void;
};

export const ValidationStep = ({ modelInfo, onValidate, onBack }: ValidationStepProps) => {
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600';
    if (confidence >= 0.5) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getConfidenceIcon = (confidence: number) => {
    if (confidence >= 0.8) return <CheckCircle className="h-5 w-5 text-green-600" />;
    if (confidence >= 0.5) return <AlertCircle className="h-5 w-5 text-yellow-600" />;
    return <XCircle className="h-5 w-5 text-red-600" />;
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Validate Search Results
        </h2>
        <p className="text-gray-600">
          Please confirm this is the correct model and review the found information
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Model Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Model Summary
              <div className="flex items-center space-x-2">
                {getConfidenceIcon(modelInfo.confidence)}
                <span className={`text-sm font-medium ${getConfidenceColor(modelInfo.confidence)}`}>
                  {Math.round(modelInfo.confidence * 100)}% confidence
                </span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <h4 className="font-medium text-gray-900">Model Name</h4>
                <p className="text-gray-600">{modelInfo.name}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-900">Papers Found</h4>
                  <Badge variant={modelInfo.papers.length > 0 ? "default" : "secondary"}>
                    {modelInfo.papers.length} papers
                  </Badge>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900">GitHub Repo</h4>
                  <Badge variant={modelInfo.githubRepo ? "default" : "secondary"}>
                    {modelInfo.githubRepo ? "Found" : "Not found"}
                  </Badge>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-900">HuggingFace</h4>
                  <Badge variant={modelInfo.huggingfaceCard ? "default" : "secondary"}>
                    {modelInfo.huggingfaceCard ? "Found" : "Not found"}
                  </Badge>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900">Website Data</h4>
                  <Badge variant={modelInfo.websiteData ? "default" : "secondary"}>
                    {modelInfo.websiteData ? "Found" : "Not found"}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Found Sources */}
        <Card>
          <CardHeader>
            <CardTitle>Found Sources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {modelInfo.papers.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Research Papers</h4>
                  <div className="space-y-2">
                    {modelInfo.papers.slice(0, 3).map((paper, index) => (
                      <div key={index} className="text-sm">
                        <p className="font-medium text-gray-700 truncate">
                          {paper.title || 'Research Paper'}
                        </p>
                        <p className="text-gray-500 text-xs">
                          {paper.source || 'Academic Source'}
                        </p>
                      </div>
                    ))}
                    {modelInfo.papers.length > 3 && (
                      <p className="text-sm text-gray-500">
                        +{modelInfo.papers.length - 3} more papers
                      </p>
                    )}
                  </div>
                </div>
              )}

              {modelInfo.githubRepo && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">GitHub Repository</h4>
                  <div className="text-sm">
                    <p className="font-medium text-gray-700">
                      {modelInfo.githubRepo.name || 'Repository'}
                    </p>
                    <p className="text-gray-500 text-xs">
                      {modelInfo.githubRepo.url || 'GitHub'}
                    </p>
                  </div>
                </div>
              )}

              {modelInfo.huggingfaceCard && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">HuggingFace Model</h4>
                  <div className="text-sm">
                    <p className="font-medium text-gray-700">
                      {modelInfo.huggingfaceCard.name || 'Model Card'}
                    </p>
                    <p className="text-gray-500 text-xs">HuggingFace Hub</p>
                  </div>
                </div>
              )}

              {modelInfo.websiteData && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Website Information</h4>
                  <div className="text-sm">
                    <p className="font-medium text-gray-700">Model Information Page</p>
                    <p className="text-gray-500 text-xs">
                      {modelInfo.websiteData.url || 'Website Source'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Search
        </Button>
        
        <Button onClick={onValidate} className="bg-blue-600 hover:bg-blue-700">
          Continue with This Model
        </Button>
      </div>
    </div>
  );
};
