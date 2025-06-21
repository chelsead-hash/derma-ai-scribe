
import { Brain, Shield, FileText } from 'lucide-react';

export const Header = () => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">DermAI Card Generator</h1>
              <p className="text-sm text-gray-600">HTI-1 & OCR Compliant</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Shield className="h-4 w-4 text-green-600" />
              <span>HTI-1 Compliant</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <FileText className="h-4 w-4 text-blue-600" />
              <span>OCR Compliant</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
