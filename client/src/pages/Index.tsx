
import { useState } from 'react';
import { SearchStep } from '@/components/SearchStep';
import { ValidationStep } from '@/components/ValidationStep';
import { DataExtractionStep } from '@/components/DataExtractionStep';
import { ModelCardGeneration } from '@/components/ModelCardGeneration';
import { Header } from '@/components/Header';
import { StepIndicator } from '@/components/StepIndicator';

export type ModelInfo = {
  name: string;
  papers: any[];
  githubRepo: any;
  huggingfaceCard: any;
  websiteData: any;
  confidence: number;
};

export type ModelCardData = {
  modelInfo: ModelInfo;
  extractedData: any;
  compliance: {
    hti1: boolean;
    ocr: boolean;
    issues: string[];
  };
};

const Index = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [modelInfo, setModelInfo] = useState<ModelInfo | null>(null);
  const [modelCardData, setModelCardData] = useState<ModelCardData | null>(null);

  const steps = [
    { number: 1, title: 'Search Model', description: 'Enter model name and search' },
    { number: 2, title: 'Validate Results', description: 'Confirm correct model found' },
    { number: 3, title: 'Extract Data', description: 'Parse papers, repos, and cards' },
    { number: 4, title: 'Generate Card', description: 'Create compliant model card' }
  ];

  const handleModelFound = (info: ModelInfo) => {
    setModelInfo(info);
    setCurrentStep(2);
  };

  const handleValidationComplete = () => {
    setCurrentStep(3);
  };

  const handleDataExtracted = (data: ModelCardData) => {
    setModelCardData(data);
    setCurrentStep(4);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Dermatology AI Model Card Generator
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Automatically generate HTI-1 and OCR compliant model cards for dermatology AI applications 
              using the Cardgen pipeline method. Simply enter a model name and let our system do the rest.
            </p>
          </div>

          <StepIndicator steps={steps} currentStep={currentStep} />

          <div className="bg-white rounded-lg shadow-lg p-8 mt-8">
            {currentStep === 1 && (
              <SearchStep onModelFound={handleModelFound} />
            )}
            
            {currentStep === 2 && modelInfo && (
              <ValidationStep 
                modelInfo={modelInfo} 
                onValidate={handleValidationComplete}
                onBack={() => setCurrentStep(1)}
              />
            )}
            
            {currentStep === 3 && modelInfo && (
              <DataExtractionStep 
                modelInfo={modelInfo}
                onDataExtracted={handleDataExtracted}
                onBack={() => setCurrentStep(2)}
              />
            )}
            
            {currentStep === 4 && modelCardData && (
              <ModelCardGeneration 
                modelCardData={modelCardData}
                onBack={() => setCurrentStep(3)}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
