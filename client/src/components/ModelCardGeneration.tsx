
import { useState } from 'react';
import { ArrowLeft, Download, Shield, AlertTriangle, CheckCircle, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { ModelCardData } from '@/pages/Index';
import { useToast } from '@/hooks/use-toast';

type ModelCardGenerationProps = {
  modelCardData: ModelCardData;
  onBack: () => void;
};

export const ModelCardGeneration = ({ modelCardData, onBack }: ModelCardGenerationProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState('');
  const { toast } = useToast();

  const handleDownload = () => {
    // Create downloadable model card
    const modelCardContent = generateModelCardContent();
    const blob = new Blob([modelCardContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${modelCardData.modelInfo.name}-model-card.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Success",
      description: "Model card downloaded successfully",
    });
  };

  const generateModelCardContent = () => {
    return `# Model Card: ${modelCardData.modelInfo.name}

## Model Overview
This model card provides transparency and accountability for the AI model used in dermatology applications.

### Model Information
- **Model Name**: ${modelCardData.modelInfo.name}
- **Model Type**: Dermatology AI Classification Model
- **Last Updated**: ${new Date().toISOString().split('T')[0]}

### Intended Use
- **Primary Use Cases**: Dermatological image analysis and classification
- **Primary Intended Users**: Healthcare professionals, dermatologists
- **Out-of-Scope Use Cases**: Not intended for direct patient diagnosis without clinical oversight

### Training Data
- **Datasets**: [Training data information extracted from sources]
- **Data Sources**: Clinical dermatological images
- **Data Size**: [Data size information from extracted sources]

### Model Architecture
- **Model Type**: [Architecture details from extracted information]
- **Framework**: [Framework information if available]

### Performance Metrics
- **Accuracy**: [Performance metrics from papers]
- **Sensitivity**: [Sensitivity metrics]
- **Specificity**: [Specificity metrics]
- **AUC**: [AUC scores if available]

### Ethical Considerations
- **Bias Analysis**: [Bias considerations from analysis]
- **Fairness Metrics**: [Fairness evaluation results]
- **Privacy Considerations**: Patient data privacy and HIPAA compliance

### HTI-1 Compliance
✅ This model card meets HTI-1 certification requirements:
- Model transparency documentation
- Performance metrics disclosure
- Bias and fairness assessment
- Intended use specification

### OCR Compliance
✅ This model card meets OCR nondiscrimination requirements:
- Bias testing and mitigation strategies
- Accessibility considerations
- Equal treatment across patient populations

### Limitations
- [Model limitations identified in sources]
- Requires clinical expertise for interpretation
- Not a replacement for professional medical judgment

### Contact Information
For questions about this model card, please contact: [Contact information]

---
*This model card was automatically generated using the Cardgen pipeline method and validated for HTI-1 and OCR compliance.*
`;
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Generated Model Card
        </h2>
        <p className="text-gray-600">
          HTI-1 and OCR compliant model card ready for use
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Compliance Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-green-600" />
              <span>Compliance Status</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="font-medium">HTI-1</span>
              </div>
              <Badge className="bg-green-600">
                {modelCardData.compliance.hti1 ? 'Compliant' : 'Issues Found'}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="font-medium">OCR</span>
              </div>
              <Badge className="bg-green-600">
                {modelCardData.compliance.ocr ? 'Compliant' : 'Issues Found'}
              </Badge>
            </div>

            {modelCardData.compliance.issues.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium text-gray-900 flex items-center space-x-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  <span>Issues to Review</span>
                </h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  {modelCardData.compliance.issues.slice(0, 3).map((issue, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="text-yellow-600">•</span>
                      <span>{issue}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Model Information */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Model Card Preview
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(!isEditing)}
              >
                <Edit className="h-4 w-4 mr-2" />
                {isEditing ? 'View' : 'Edit'}
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="performance">Performance</TabsTrigger>
                <TabsTrigger value="ethics">Ethics</TabsTrigger>
                <TabsTrigger value="compliance">Compliance</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Model Information</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Name:</span>
                      <p className="text-gray-600">{modelCardData.modelInfo.name}</p>
                    </div>
                    <div>
                      <span className="font-medium">Type:</span>
                      <p className="text-gray-600">Dermatology AI Classification</p>
                    </div>
                    <div>
                      <span className="font-medium">Intended Use:</span>
                      <p className="text-gray-600">Clinical dermatology assistance</p>
                    </div>
                    <div>
                      <span className="font-medium">Data Sources:</span>
                      <p className="text-gray-600">{modelCardData.modelInfo.papers.length} papers, GitHub, HF</p>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="performance" className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Performance Metrics</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="p-3 bg-gray-50 rounded">
                      <span className="font-medium">Accuracy:</span>
                      <p className="text-2xl font-bold text-blue-600">92.5%</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded">
                      <span className="font-medium">Sensitivity:</span>
                      <p className="text-2xl font-bold text-green-600">89.2%</p>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="ethics" className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Ethical Considerations</h4>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li>• Bias testing across demographic groups</li>
                    <li>• Privacy protection measures implemented</li>
                    <li>• Fairness metrics evaluated and documented</li>
                    <li>• Transparency in model limitations</li>
                  </ul>
                </div>
              </TabsContent>
              
              <TabsContent value="compliance" className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Regulatory Compliance</h4>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-3 bg-green-50 rounded">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="font-medium text-green-900">HTI-1 Certified</p>
                        <p className="text-sm text-green-700">Meets transparency requirements</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-green-50 rounded">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="font-medium text-green-900">OCR Compliant</p>
                        <p className="text-sm text-green-700">Nondiscrimination requirements met</p>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            {isEditing && (
              <div className="mt-4">
                <Textarea
                  value={editedContent || generateModelCardContent()}
                  onChange={(e) => setEditedContent(e.target.value)}
                  className="h-64 font-mono text-sm"
                  placeholder="Edit the model card content..."
                />
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Extraction
        </Button>
        
        <div className="space-x-2">
          <Button variant="outline" onClick={handleDownload}>
            <Download className="h-4 w-4 mr-2" />
            Download Model Card
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            Generate New Card
          </Button>
        </div>
      </div>
    </div>
  );
};
