import React from 'react';
import { Settings } from 'lucide-react';
import { Currency } from '../types/currency';
import { formatCurrency } from '../utils/formatCurrency';

interface Props {
  taxRate: number;
  inflationRate: number;
  finalAmount: number;
  currency: Currency;
  onTaxRateChange: (rate: number) => void;
  onInflationRateChange: (rate: number) => void;
}

export default function AdvancedSettings({
  taxRate,
  inflationRate,
  finalAmount,
  currency,
  onTaxRateChange,
  onInflationRateChange
}: Props) {
  const handleNumberInput = (value: string, onChange: (value: number) => void) => {
    if (value === '') {
      onChange(0);
      return;
    }
    
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      onChange(numValue);
    }
  };

  const taxAmount = (finalAmount * taxRate) / 100;
  const afterTaxAmount = finalAmount - taxAmount;

  return (
    <div>
      <h3 className="flex items-center gap-2 text-lg font-medium text-gray-900 dark:text-white mb-4">
        <Settings className="w-5 h-5" />
        Advanced Settings
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Avg. Inflation Rate (%)
          </label>
          <input
            type="number"
            value={inflationRate || ''}
            onChange={(e) => handleNumberInput(e.target.value, onInflationRateChange)}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
            step="0.1"
            min="0"
            max="100"
          />
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Adjusts future values for purchasing power
          </p>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Tax Rate (%)
          </label>
          <input
            type="number"
            value={taxRate || ''}
            onChange={(e) => handleNumberInput(e.target.value, onTaxRateChange)}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
            step="0.1"
            min="0"
            max="100"
          />
          <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-md">
            <div className="text-sm text-gray-600 dark:text-gray-300">
              After Tax Amount: <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(afterTaxAmount, currency)}</span>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              Tax Amount: <span className="font-medium text-red-600 dark:text-red-400">{formatCurrency(taxAmount, currency)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}