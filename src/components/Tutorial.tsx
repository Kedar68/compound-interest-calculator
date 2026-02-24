import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Target, DollarSign, LineChart, Settings, BookOpen } from 'lucide-react';

interface Step {
  title: string;
  content: string;
  icon: React.ReactNode;
}

const tutorialSteps: Step[] = [
  {
    title: 'Welcome to the Compound Interest Calculator!',
    content: 'This interactive tool will help you plan your financial future by visualizing the power of compound interest. Let\'s explore its features together.',
    icon: <DollarSign className="w-6 h-6 text-blue-500" />
  },
  {
    title: 'Initial Investment',
    content: 'Start by entering your one-time initial investment. This is the amount you\'ll begin with. Try different amounts to see how your starting point affects long-term growth.',
    icon: <DollarSign className="w-6 h-6 text-green-500" />
  },
  {
    title: 'Investment Periods',
    content: 'Add different investment periods to model changes in your contribution strategy. Each period can have its own monthly investment amount and interest rate.',
    icon: <LineChart className="w-6 h-6 text-purple-500" />
  },
  {
    title: 'Setting Goals',
    content: 'Define your financial goals by setting a target amount. The calculator will show your progress and help you stay motivated.',
    icon: <Target className="w-6 h-6 text-red-500" />
  },
  {
    title: 'Advanced Settings',
    content: 'Fine-tune your calculations by considering tax rates and inflation. These factors can significantly impact your real returns.',
    icon: <Settings className="w-6 h-6 text-orange-500" />
  },
  {
    title: 'Multiple Scenarios',
    content: 'Create and compare different investment scenarios. This helps you evaluate various strategies and make informed decisions.',
    icon: <BookOpen className="w-6 h-6 text-indigo-500" />
  }
];

interface Props {
  onClose: () => void;
}

export default function Tutorial({ onClose }: Props) {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-2xl w-full mx-4">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            {tutorialSteps[currentStep].icon}
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              {tutorialSteps[currentStep].title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="mb-8">
          <p className="text-gray-600 dark:text-gray-300">
            {tutorialSteps[currentStep].content}
          </p>
        </div>
        
        <div className="flex justify-between items-center">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className={`flex items-center gap-2 px-4 py-2 rounded ${
              currentStep === 0
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-700'
                : 'bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>
          
          <div className="flex gap-2">
            {tutorialSteps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentStep 
                    ? 'bg-blue-600 w-4' 
                    : 'bg-gray-300 dark:bg-gray-600'
                }`}
              />
            ))}
          </div>
          
          <button
            onClick={handleNext}
            className="flex items-center gap-2 px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            {currentStep === tutorialSteps.length - 1 ? 'Finish' : 'Next'}
            {currentStep < tutorialSteps.length - 1 && <ChevronRight className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}