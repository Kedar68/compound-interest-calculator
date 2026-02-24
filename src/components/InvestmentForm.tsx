import React from 'react';
import { PlusCircle, MinusCircle } from 'lucide-react';
import { Scenario } from '../types/scenario';

interface Props {
  scenario: Scenario;
  onScenarioUpdate: (updates: Partial<Scenario>) => void;
}

export default function InvestmentForm({
  scenario,
  onScenarioUpdate
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

  const addPeriod = () => {
    const lastPeriod = scenario.periods[scenario.periods.length - 1];
    const newPeriod = {
      id: crypto.randomUUID(),
      startYear: lastPeriod ? lastPeriod.endYear + 1 : 1,
      endYear: lastPeriod ? lastPeriod.endYear + 5 : 5,
      monthlyInvestment: lastPeriod ? lastPeriod.monthlyInvestment : 0,
      yearlyInterestRate: lastPeriod ? lastPeriod.yearlyInterestRate : 0,
    };
    onScenarioUpdate({ periods: [...scenario.periods, newPeriod] });
  };

  const removePeriod = (id: string) => {
    onScenarioUpdate({ periods: scenario.periods.filter(p => p.id !== id) });
  };

  const updatePeriod = (id: string, updates: Partial<typeof scenario.periods[0]>) => {
    onScenarioUpdate({
      periods: scenario.periods.map(p => (p.id === id ? { ...p, ...updates } : p))
    });
  };

  return (
    <div className="space-y-6">
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
          Scenario Name
        </label>
        <input
          type="text"
          value={scenario.name}
          onChange={(e) => onScenarioUpdate({ name: e.target.value })}
          className="w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
          One-Time Initial Investment
        </label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-500 dark:text-gray-400 sm:text-sm">$</span>
          </div>
          <input
            type="number"
            value={scenario.initialInvestment || ''}
            onChange={(e) => handleNumberInput(e.target.value, 
              (value) => onScenarioUpdate({ initialInvestment: value }))}
            className="pl-7 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="0"
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Investment Periods</h3>
          <button
            onClick={addPeriod}
            className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
          >
            <PlusCircle className="w-5 h-5" />
            Add Period
          </button>
        </div>
        
        {scenario.periods.map((period, index) => (
          <div key={period.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Period {index + 1}</h3>
              {scenario.periods.length > 1 && (
                <button
                  onClick={() => removePeriod(period.id)}
                  className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                >
                  <MinusCircle className="w-5 h-5" />
                </button>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Start Year
                </label>
                <input
                  type="number"
                  value={period.startYear || ''}
                  onChange={(e) => handleNumberInput(e.target.value, 
                    (value) => updatePeriod(period.id, { startYear: value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  min="1"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  End Year
                </label>
                <input
                  type="number"
                  value={period.endYear || ''}
                  onChange={(e) => handleNumberInput(e.target.value,
                    (value) => updatePeriod(period.id, { endYear: value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  min={period.startYear}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Monthly Investment
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 dark:text-gray-400 sm:text-sm">$</span>
                  </div>
                  <input
                    type="number"
                    value={period.monthlyInvestment || ''}
                    onChange={(e) => handleNumberInput(e.target.value,
                      (value) => updatePeriod(period.id, { monthlyInvestment: value }))}
                    className="pl-7 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    min="0"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Yearly Interest Rate
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    type="number"
                    step="0.1"
                    value={period.yearlyInterestRate || ''}
                    onChange={(e) => updatePeriod(period.id, { yearlyInterestRate: parseFloat(e.target.value) || 0 })}
                    className="block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Enter rate"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 dark:text-gray-400 sm:text-sm">%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}