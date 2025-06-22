
import { Check } from 'lucide-react';

type Step = {
  number: number;
  title: string;
  description: string;
};

type StepIndicatorProps = {
  steps: Step[];
  currentStep: number;
};

export const StepIndicator = ({ steps, currentStep }: StepIndicatorProps) => {
  return (
    <div className="flex items-center justify-between">
      {steps.map((step, index) => (
        <div key={step.number} className="flex items-center">
          <div className="flex flex-col items-center">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                step.number < currentStep
                  ? 'bg-green-600 border-green-600 text-white'
                  : step.number === currentStep
                  ? 'bg-blue-600 border-blue-600 text-white'
                  : 'bg-white border-gray-300 text-gray-400'
              }`}
            >
              {step.number < currentStep ? (
                <Check className="h-6 w-6" />
              ) : (
                <span className="font-semibold">{step.number}</span>
              )}
            </div>
            <div className="mt-2 text-center">
              <p className={`text-sm font-medium ${
                step.number <= currentStep ? 'text-gray-900' : 'text-gray-400'
              }`}>
                {step.title}
              </p>
              <p className="text-xs text-gray-500 mt-1 max-w-24">
                {step.description}
              </p>
            </div>
          </div>
          
          {index < steps.length - 1 && (
            <div className={`h-0.5 w-24 mx-4 ${
              step.number < currentStep ? 'bg-green-600' : 'bg-gray-300'
            }`} />
          )}
        </div>
      ))}
    </div>
  );
};
