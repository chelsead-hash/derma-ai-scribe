
import { useState, useEffect } from 'react';
import { ArrowLeft, Download, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ModelInfo, ModelCardData } from '@/pages/Index';
import { CardgenService } from '@/services/CardgenService';
import { ComplianceService } from '@/services/ComplianceService';

type DataExtractionStepProps = {
  modelInfo: ModelInfo;
  onDataExtracted: (data: ModelCardData) => void;
  onBack: () => void;
};

export const DataExtractionStep = ({ modelInfo, onDataExtracted, onBack }: DataExtractionStepProps) => {
  const [progress, setProgress] = useState(0);
  const [currentTask, setCurrentTask] = useState('');
  const [extractedData, setExtractedData] = useState<any>(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractionComplete, setExtractionComplete] = useState(false);

  useEffect(() => {
    startExtraction();
  }, []);

  const startExtraction = async () => {
    setIsExtracting(true);
    setProgress(0);

    try {
      // Task 1: Extract from papers
      setCurrentTask('Extracting data from research papers...');
      setProgress(20);
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Task 2: Extract from GitHub
      setCurrentTask('Parsing GitHub repository and README...');
      setProgress(40);
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Task 3: Extract from HuggingFace
      setCurrentTask('Processing HuggingFace model card...');
      setProgress(60);
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Task 4: Extract from website
      setCurrentTask('Analyzing website information...');
      setProgress(80);
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Task 5: Generate final data
      setCurrentTask('Compiling and structuring data...');
      setProgress(90);
      
      const extractedInfo = await CardgenService.extractModelCardData(modelInfo);
      setExtractedData(extractedInfo);

      // Task 6: Check compliance
      setCurrentTask('Checking HTI-1 and OCR compliance...');
      setProgress(95);
      
      const compliance = await ComplianceService.checkCompliance(extractedInfo);
      
      setProgress(100);
      setCurrentTask('Extraction complete!');
      
      const modelCardData: ModelCardData = {
        modelInfo,
        extractedData: extractedInfo,
        compliance
      };
      
      setExtractionComplete(true);
      
      setTimeout(() => {
        onDataExtracted(modelCardData);
      }, 1000);

    } catch (error) {
      console.error('Extraction error:', error);
      setCurrentTask('Extraction failed. Please try again.');
    } finally {
      setIsExtracting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Extracting Model Information
        </h2>
        <p className="text-gray-600">
          Using the Cardgen pipeline to extract and structure model card data
        </p>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Data Extraction Progress
            {extractionComplete && (
              <Badge className="bg-green-600">
                <CheckCircle className="h-4 w-4 mr-1" />
                Complete
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="font-medium">{currentTask}</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="w-full" />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium">Research Papers</span>
              <Badge variant={progress >= 20 ? "default" : "secondary"}>
                {progress >= 20 ? 'Processed' : 'Pending'}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium">GitHub Repository</span>
              <Badge variant={progress >= 40 ? "default" : "secondary"}>
                {progress >= 40 ? 'Processed' : 'Pending'}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium">HuggingFace Model Card</span>
              <Badge variant={progress >= 60 ? "default" : "secondary"}>
                {progress >= 60 ? 'Processed' : 'Pending'}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium">Website Information</span>
              <Badge variant={progress >= 80 ? "default" : "secondary"}>
                {progress >= 80 ? 'Processed' : 'Pending'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {extractedData && (
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Extraction Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium text-gray-900">Data Sources</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>{modelInfo.papers.length} research papers</span>
                  </div>
                  {modelInfo.githubRepo && (
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>GitHub repository</span>
                    </div>
                  )}
                  {modelInfo.huggingfaceCard && (
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>HuggingFace model card</span>
                    </div>
                  )}
                  {modelInfo.websiteData && (
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Website information</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium text-gray-900">Extracted Fields</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Model description</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Technical specifications</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Performance metrics</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="h-4 w-4 text-yellow-600" />
                    <span>Bias considerations</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack} disabled={isExtracting}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        
        {extractionComplete && (
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Download className="h-4 w-4 mr-2" />
            Continue to Model Card
          </Button>
        )}
      </div>
    </div>
  );
};
