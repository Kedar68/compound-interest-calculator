import React, { useMemo } from 'react';
import {
  BarChart,
  LineChart,
  AreaChart,
  Bar,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { BarChart as BarChartIcon, LineChart as LineChartIcon, AreaChart as AreaChartIcon, Eye, EyeOff, Palette } from 'lucide-react';
import { Scenario } from '../types/scenario';
import { CalculationResult } from '../types/calculator';
import { formatCurrency } from '../utils/formatCurrency';

interface Props {
  scenarios: Scenario[];
  results: Array<{
    scenario: Scenario;
    results: CalculationResult;
  }>;
  chartType: 'bar' | 'line' | 'area';
  onUpdateScenario: (id: string, updates: Partial<Scenario>) => void;
  onChartTypeChange: (type: 'bar' | 'line' | 'area') => void;
}

const CustomTooltip = ({ active, payload, label, chartType }: any) => {
  if (!active || !payload) return null;

  // For area chart, filter out non-total values
  const relevantPayload = chartType === 'area' 
    ? payload.filter((p: any) => p.name.includes('Total'))
    : payload;

  return (
    <div className="bg-gray-900 p-4 rounded-lg shadow-lg border border-gray-800">
      <div className="text-gray-200 font-medium border-b border-gray-700 pb-2 mb-3">
        Year {label}
      </div>
      <div className="space-y-4">
        {relevantPayload.reduce((acc: any[], entry: any) => {
          const [scenarioName, type] = entry.name.split(' - ');
          const existingScenario = acc.find(s => s.name === scenarioName);
          
          if (existingScenario) {
            existingScenario.values.push({ type, value: entry.value });
          } else {
            acc.push({
              name: scenarioName,
              color: entry.color,
              values: [{ type, value: entry.value }]
            });
          }
          
          return acc;
        }, []).map((scenario: any) => (
          <div key={scenario.name}>
            <div className="font-medium mb-2" style={{ color: scenario.color }}>
              {scenario.name}
            </div>
            <div className="space-y-1 pl-2">
              {scenario.values
                .sort((a: any, b: any) => {
                  // Custom sort order: Invested -> Interest -> Total
                  const order = { Invested: 1, Interest: 2, Total: 3 };
                  return order[a.type as keyof typeof order] - order[b.type as keyof typeof order];
                })
                .map((item: any, index: number) => (
                  <div key={index} className="text-sm text-gray-300 flex justify-between">
                    <span>{item.type}:</span>
                    <span>{formatCurrency(item.value, 'USD')}</span>
                  </div>
                ))
              }
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function ResultsDisplay({
  scenarios,
  results,
  chartType,
  onUpdateScenario,
  onChartTypeChange
}: Props) {
  const combinedData = useMemo(() => 
    results[0].results.yearlyData.map(yearData => {
      const yearEntry: any = { 
        year: yearData.year
      };
      
      results.forEach(({ scenario, results }) => {
        const yearResult = results.yearlyData.find(d => d.year === yearData.year);
        if (yearResult) {
          // Add scenario info for tooltip
          yearEntry.scenario = scenario;
          
          const prefix = `${scenario.id}`;
          if (chartType === 'area') {
            if (scenario.showTotal) yearEntry[`${prefix}-total`] = yearResult.total;
          } else {
            if (scenario.showInvested) yearEntry[`${prefix}-invested`] = yearResult.invested;
            if (scenario.showInterest) yearEntry[`${prefix}-interest`] = yearResult.interest;
            if (scenario.showTotal) yearEntry[`${prefix}-total`] = yearResult.total;
          }
        }
      });
      return yearEntry;
    }),
    [results, scenarios, chartType]
  );

  // Calculate dynamic chart height based on maximum value
  const chartHeight = useMemo(() => {
    const maxValue = Math.max(
      ...results.flatMap(({ results }) =>
        results.yearlyData.map(data => Math.max(
          chartType === 'area' ? data.total : Math.max(data.invested, data.interest, data.total)
        ))
      )
    );
    
    // Base height calculation
    const baseHeight = 400;
    const valueScale = Math.log10(maxValue) * 50; // Scale based on order of magnitude
    const scenarioScale = scenarios.length * 30; // Scale based on number of scenarios
    
    // Minimum and maximum heights
    const minHeight = 400;
    const maxHeight = 800;
    
    return Math.min(maxHeight, Math.max(minHeight, baseHeight + valueScale + scenarioScale));
  }, [results, scenarios.length, chartType]);

  const ChartComponent = {
    bar: BarChart,
    line: LineChart,
    area: AreaChart
  }[chartType];

  const DataComponent = chartType === 'bar' ? Bar : chartType === 'line' ? Line : Area;

  const toggleVisibility = (scenario: Scenario) => {
    const allHidden = !scenario.showInvested && !scenario.showInterest && !scenario.showTotal;
    if (chartType === 'area') {
      onUpdateScenario(scenario.id, {
        showInvested: false,
        showInterest: false,
        showTotal: !scenario.showTotal
      });
    } else {
      onUpdateScenario(scenario.id, {
        showInvested: allHidden,
        showInterest: allHidden,
        showTotal: allHidden && chartType !== 'bar'
      });
    }
  };

  const changeColor = (scenario: Scenario) => {
    const newColor = `#${Math.floor(Math.random()*16777215).toString(16)}`;
    onUpdateScenario(scenario.id, { color: newColor });
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {results.map(({ scenario, results }) => (
          <div
            key={scenario.id}
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
            style={{ borderLeft: `4px solid ${scenario.color}` }}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                {scenario.name}
              </h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => changeColor(scenario)}
                  className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                  title="Change Color"
                >
                  <Palette className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                </button>
                <button
                  onClick={() => toggleVisibility(scenario)}
                  className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                  title={scenario.showInvested || scenario.showInterest || scenario.showTotal ? "Hide All" : "Show All"}
                >
                  {scenario.showInvested || scenario.showInterest || scenario.showTotal ? (
                    <EyeOff className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  ) : (
                    <Eye className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Total Invested:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {formatCurrency(results.totalInvested, 'USD')}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Total Interest:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {formatCurrency(results.totalInterest, 'USD')}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Final Amount:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {formatCurrency(results.finalAmount, 'USD')}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {chartType !== 'area' && (
                  <>
                    <button
                      onClick={() => onUpdateScenario(scenario.id, { showInvested: !scenario.showInvested })}
                      className={`px-2 py-1 rounded text-xs transition-colors ${
                        scenario.showInvested 
                          ? 'text-white' 
                          : 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700'
                      }`}
                      style={scenario.showInvested ? { backgroundColor: scenario.color } : undefined}
                    >
                      Invested
                    </button>
                    <button
                      onClick={() => onUpdateScenario(scenario.id, { showInterest: !scenario.showInterest })}
                      className={`px-2 py-1 rounded text-xs transition-colors ${
                        scenario.showInterest 
                          ? 'text-white' 
                          : 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700'
                      }`}
                      style={scenario.showInterest ? { backgroundColor: scenario.color } : undefined}
                    >
                      Interest
                    </button>
                  </>
                )}
                {chartType !== 'bar' && (
                  <button
                    onClick={() => onUpdateScenario(scenario.id, { showTotal: !scenario.showTotal })}
                    className={`px-2 py-1 rounded text-xs transition-colors ${
                      scenario.showTotal 
                        ? 'text-white' 
                        : 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700'
                    }`}
                    style={scenario.showTotal ? { backgroundColor: scenario.color } : undefined}
                  >
                    Total
                  </button>
                )}
              </div>

              {scenario.goalAmount > 0 && (
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600 dark:text-gray-400">Goal Progress:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {Math.min(100, (results.finalAmount / scenario.goalAmount * 100)).toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${Math.min(100, (results.finalAmount / scenario.goalAmount * 100))}%`,
                        backgroundColor: scenario.color
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-2">
            <button
              onClick={() => onChartTypeChange('bar')}
              className={`p-2 rounded-lg transition-colors ${
                chartType === 'bar'
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400'
              }`}
              title="Bar Chart"
            >
              <BarChartIcon className="w-5 h-5" />
            </button>
            <button
              onClick={() => onChartTypeChange('line')}
              className={`p-2 rounded-lg transition-colors ${
                chartType === 'line'
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400'
              }`}
              title="Line Chart"
            >
              <LineChartIcon className="w-5 h-5" />
            </button>
            <button
              onClick={() => onChartTypeChange('area')}
              className={`p-2 rounded-lg transition-colors ${
                chartType === 'area'
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400'
              }`}
              title="Area Chart"
            >
              <AreaChartIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div style={{ height: `${chartHeight}px` }} className="transition-all duration-300">
          <ResponsiveContainer width="100%" height="100%">
            <ChartComponent
              data={combinedData}
              margin={{ top: 20, right: 30, left: 120, bottom: 50 }}
            >
              <CartesianGrid strokeDasharray="3 3" className="dark:opacity-20" />
              <XAxis
                dataKey="year"
                label={{
                  value: 'Year',
                  position: 'insideBottom',
                  offset: -20,
                  fill: 'currentColor'
                }}
                tick={{ fill: 'currentColor' }}
              />
              <YAxis
                tickFormatter={(value) => formatCurrency(value, 'USD')}
                width={120}
                domain={[0, 'auto']}
                label={{
                  value: 'Amount (USD)',
                  angle: -90,
                  position: 'insideLeft',
                  offset: -40,
                  fill: 'currentColor'
                }}
                tick={{ fill: 'currentColor' }}
              />
              <Tooltip content={(props) => <CustomTooltip {...props} chartType={chartType} />} />
              <Legend 
                verticalAlign="bottom"
                height={36}
                wrapperStyle={{
                  paddingTop: '20px'
                }}
              />

              {scenarios.map((scenario) => (
                <React.Fragment key={scenario.id}>
                  {chartType === 'bar' ? (
                    <>
                      {scenario.showInvested && (
                        <Bar
                          dataKey={`${scenario.id}-invested`}
                          name={`${scenario.name} - Invested`}
                          fill={scenario.color}
                          fillOpacity={0.3}
                          stackId={scenario.id}
                        />
                      )}
                      {scenario.showInterest && (
                        <Bar
                          dataKey={`${scenario.id}-interest`}
                          name={`${scenario.name} - Interest`}
                          fill={scenario.color}
                          fillOpacity={0.7}
                          stackId={scenario.id}
                        />
                      )}
                    </>
                  ) : chartType === 'area' ? (
                    scenario.showTotal && (
                      <Area
                        type="monotone"
                        dataKey={`${scenario.id}-total`}
                        name={`${scenario.name} - Total`}
                        stroke={scenario.color}
                        fill={scenario.color}
                        fillOpacity={0.3}
                        strokeWidth={2}
                        dot={false}
                      />
                    )
                  ) : (
                    <>
                      {scenario.showInvested && (
                        <Line
                          type="monotone"
                          dataKey={`${scenario.id}-invested`}
                          name={`${scenario.name} - Invested`}
                          stroke={scenario.color}
                          strokeWidth={2}
                          dot={false}
                        />
                      )}
                      {scenario.showInterest && (
                        <Line
                          type="monotone"
                          dataKey={`${scenario.id}-interest`}
                          name={`${scenario.name} - Interest`}
                          stroke={scenario.color}
                          strokeWidth={2}
                          strokeDasharray="5 5"
                          dot={false}
                        />
                      )}
                      {scenario.showTotal && (
                        <Line
                          type="monotone"
                          dataKey={`${scenario.id}-total`}
                          name={`${scenario.name} - Total`}
                          stroke={scenario.color}
                          strokeWidth={3}
                          dot={false}
                        />
                      )}
                    </>
                  )}
                </React.Fragment>
              ))}

              {scenarios.map((scenario) => (
                scenario.goalAmount > 0 && (
                  <ReferenceLine
                    key={`goal-${scenario.id}`}
                    y={scenario.goalAmount}
                    stroke={scenario.color}
                    strokeDasharray="3 3"
                    label={{
                      position: 'left',
                      value: `${scenario.name} Goal: ${formatCurrency(scenario.goalAmount, 'USD')}`,
                      fill: scenario.color,
                      fontSize: 12
                    }}
                  />
                )
              ))}
            </ChartComponent>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}