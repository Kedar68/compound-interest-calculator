import React from 'react';
import { Scenario } from '../types/scenario';
import { CalculationResult } from '../types/calculator';
import InvestmentForm from './InvestmentForm';
import ResultsDisplay from './ResultsDisplay';
import AdvancedSettings from './AdvancedSettings';
import GoalSetting from './GoalSetting';

interface Props {
  scenarios: Scenario[];
  activeScenario: Scenario;
  results: Array<{
    scenario: Scenario;
    results: CalculationResult;
  }>;
  chartType: 'bar' | 'line' | 'area';
  onUpdateScenario: (id: string, updates: Partial<Scenario>) => void;
  onChartTypeChange: (type: 'bar' | 'line' | 'area') => void;
}

export default function MainContent({
  scenarios,
  activeScenario,
  results,
  chartType,
  onUpdateScenario,
  onChartTypeChange
}: Props) {
  const activeResult = results.find(r => r.scenario.id === activeScenario.id)!;

  const handleScenarioUpdate = (updates: Partial<Scenario>) => {
    onUpdateScenario(activeScenario.id, updates);
  };

  return (
    <div className="grid grid-cols-12 gap-8">
      <div className="col-span-12 lg:col-span-5">
        <div className="h-full flex flex-col">
          <div className="flex-grow bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <InvestmentForm
              scenario={activeScenario}
              onScenarioUpdate={handleScenarioUpdate}
            />
          </div>
        </div>
      </div>

      <div className="col-span-12 lg:col-span-7">
        <div className="h-full flex flex-col space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <GoalSetting
              goalAmount={activeScenario.goalAmount}
              currentAmount={activeResult.results.finalAmount}
              onGoalAmountChange={(amount) => handleScenarioUpdate({ goalAmount: amount })}
              color={activeScenario.color}
            />
          </div>

          <div className="flex-grow bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <AdvancedSettings
              taxRate={activeScenario.taxRate}
              inflationRate={activeScenario.inflationRate}
              finalAmount={activeResult.results.finalAmount}
              currency="USD"
              onTaxRateChange={(rate) => handleScenarioUpdate({ taxRate: rate })}
              onInflationRateChange={(rate) => handleScenarioUpdate({ inflationRate: rate })}
            />
          </div>
        </div>
      </div>

      <div className="col-span-12">
        <ResultsDisplay
          scenarios={scenarios}
          results={results}
          chartType={chartType}
          onUpdateScenario={onUpdateScenario}
          onChartTypeChange={onChartTypeChange}
        />
      </div>
    </div>
  );
}