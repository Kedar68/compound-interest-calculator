import React from 'react';
import { Target } from 'lucide-react';
import { formatCurrency } from '../utils/formatCurrency';

interface Props {
  goalAmount: number;
  currentAmount: number;
  onGoalAmountChange: (amount: number) => void;
  color: string;
}

export default function GoalSetting({
  goalAmount,
  currentAmount,
  onGoalAmountChange,
  color
}: Props) {
  const progress = goalAmount > 0 ? (currentAmount / goalAmount) * 100 : 0;
  const remaining = Math.max(0, goalAmount - currentAmount);

  const handleNumberInput = (value: string) => {
    if (value === '') {
      onGoalAmountChange(0);
      return;
    }
    
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      onGoalAmountChange(numValue);
    }
  };

  return (
    <div>
      <h3 className="flex items-center gap-2 text-lg font-medium text-gray-900 dark:text-white mb-4">
        <Target className="w-5 h-5" />
        Investment Goal
      </h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Target Amount
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 dark:text-gray-400 sm:text-sm">$</span>
            </div>
            <input
              type="number"
              value={goalAmount || ''}
              onChange={(e) => handleNumberInput(e.target.value)}
              className="pl-7 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
              min="0"
              step="1000"
            />
          </div>
        </div>

        {goalAmount > 0 && (
          <>
            <div className="relative pt-1">
              <div className="flex mb-2 items-center justify-between">
                <div>
                  <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full"
                    style={{ backgroundColor: `${color}20`, color }}>
                    Progress
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold inline-block dark:text-white" style={{ color }}>
                    {progress.toFixed(1)}%
                  </span>
                </div>
              </div>
              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200 dark:bg-gray-700">
                <div
                  style={{ 
                    width: `${Math.min(100, progress)}%`,
                    backgroundColor: color
                  }}
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center transition-all duration-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Current Amount:</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {formatCurrency(currentAmount, 'USD')}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Remaining:</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {formatCurrency(remaining, 'USD')}
                </span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}