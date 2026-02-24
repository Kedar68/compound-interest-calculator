import React from 'react';
import { BarChart, LineChart, AreaChart, Eye, EyeOff, Palette } from 'lucide-react';
import { Scenario } from '../types/scenario';

type ChartType = 'bar' | 'line' | 'area';

interface Props {
  scenarios: Scenario[];
  activeScenario: Scenario;
  chartType: ChartType;
  onChartTypeChange: (type: ChartType) => void;
  onUpdateScenario: (id: string, updates: Partial<Scenario>) => void;
}

export default function ChartControls({
  scenarios,
  activeScenario,
  chartType,
  onChartTypeChange,
  onUpdateScenario
}: Props) {
  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <button
            onClick={() => onChartTypeChange('bar')}
            className={`p-2 rounded ${chartType === 'bar' ? 'bg-blue-100 dark:bg-blue-900' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
            title="Bar Chart"
          >
            <BarChart className="w-5 h-5" />
          </button>
          <button
            onClick={() => onChartTypeChange('line')}
            className={`p-2 rounded ${chartType === 'line' ? 'bg-blue-100 dark:bg-blue-900' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
            title="Line Chart"
          >
            <LineChart className="w-5 h-5" />
          </button>
          <button
            onClick={() => onChartTypeChange('area')}
            className={`p-2 rounded ${chartType === 'area' ? 'bg-blue-100 dark:bg-blue-900' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
            title="Area Chart"
          >
            <AreaChart className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {scenarios.map(scenario => (
          <div
            key={scenario.id}
            className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
            style={{ borderLeft: `4px solid ${scenario.color}` }}
          >
            <div className="flex justify-between items-center mb-3">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                {scenario.name}
              </h4>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onUpdateScenario(scenario.id, { color: `#${Math.floor(Math.random()*16777215).toString(16)}` })}
                  className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                  title="Change Color"
                >
                  <Palette className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onUpdateScenario(scenario.id, { 
                    showInvested: false,
                    showInterest: false,
                    showTotal: false,
                    ...(!scenario.showInvested && !scenario.showInterest && !scenario.showTotal ? {
                      showInvested: true,
                      showInterest: true,
                      showTotal: chartType !== 'area'
                    } : {})
                  })}
                  className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                  title={scenario.showInvested || scenario.showInterest || scenario.showTotal ? "Hide All" : "Show All"}
                >
                  {scenario.showInvested || scenario.showInterest || scenario.showTotal ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {chartType !== 'area' && (
                <>
                  <button
                    onClick={() => onUpdateScenario(scenario.id, { showInvested: !scenario.showInvested })}
                    className={`px-2 py-1 rounded text-xs transition-colors ${
                      scenario.showInvested ? 'bg-opacity-100' : 'bg-opacity-20'
                    }`}
                    style={{ backgroundColor: scenario.color, color: scenario.showInvested ? 'white' : scenario.color }}
                  >
                    Invested
                  </button>
                  <button
                    onClick={() => onUpdateScenario(scenario.id, { showInterest: !scenario.showInterest })}
                    className={`px-2 py-1 rounded text-xs transition-colors ${
                      scenario.showInterest ? 'bg-opacity-100' : 'bg-opacity-20'
                    }`}
                    style={{ backgroundColor: scenario.color, color: scenario.showInterest ? 'white' : scenario.color }}
                  >
                    Interest
                  </button>
                </>
              )}
              {(chartType === 'area' || chartType === 'line') && (
                <button
                  onClick={() => onUpdateScenario(scenario.id, { showTotal: !scenario.showTotal })}
                  className={`px-2 py-1 rounded text-xs transition-colors ${
                    scenario.showTotal ? 'bg-opacity-100' : 'bg-opacity-20'
                  }`}
                  style={{ backgroundColor: scenario.color, color: scenario.showTotal ? 'white' : scenario.color }}
                >
                  Total
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}