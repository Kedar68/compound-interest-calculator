import React, { useState } from 'react';
import { Moon, Sun, HelpCircle, Plus, X, BookOpen } from 'lucide-react';
import MainContent from './components/MainContent';
import Tutorial from './components/Tutorial';
import EducationalTips from './components/EducationalTips';
import { useScenarioManager } from './hooks/useScenarioManager';
import { useCalculationResults } from './hooks/useCalculationResults';

type Theme = 'light' | 'dark';

export default function App() {
  const [theme, setTheme] = useState<Theme>('light');
  const [showTutorial, setShowTutorial] = useState(false);
  const [showTips, setShowTips] = useState(false);

  const {
    scenarios,
    activeScenario,
    chartType,
    addScenario,
    removeScenario,
    setActiveScenario,
    updateScenario,
    setChartType
  } = useScenarioManager();

  const results = useCalculationResults(scenarios);

  // Update body class when theme changes
  React.useEffect(() => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
  }, [theme]);

  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      theme === 'dark' 
        ? 'bg-gray-900 text-gray-100' 
        : 'bg-gray-50 text-gray-900'
    }`}>
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">
            Compound Interest Calculator
          </h1>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowTips(!showTips)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                showTips
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              <BookOpen className="w-5 h-5" />
              Tips
            </button>
            <button
              onClick={() => setShowTutorial(!showTutorial)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all bg-blue-600 hover:bg-blue-700 text-white"
            >
              <HelpCircle className="w-5 h-5" />
              Tutorial
            </button>
            <button
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              className={`p-2 rounded-lg transition-all ${
                theme === 'dark'
                  ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-6 overflow-x-auto">
          {scenarios.map((scenario) => (
            <div
              key={scenario.id}
              className="flex items-center"
            >
              <div
                onClick={() => setActiveScenario(scenario.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-all cursor-pointer flex items-center gap-2 ${
                  scenario.id === activeScenario.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700'
                }`}
                style={{
                  borderLeft: `4px solid ${scenario.color}`
                }}
              >
                {scenario.name}
              </div>
              {scenarios.length > 1 && (
                <button
                  onClick={() => removeScenario(scenario.id)}
                  className="ml-2 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                  aria-label={`Remove ${scenario.name}`}
                >
                  <X className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                </button>
              )}
            </div>
          ))}
          <button
            onClick={addScenario}
            className="px-4 py-2 rounded-lg font-medium transition-all bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Scenario
          </button>
        </div>

        <MainContent
          scenarios={scenarios}
          activeScenario={activeScenario}
          results={results}
          chartType={chartType}
          onUpdateScenario={updateScenario}
          onChartTypeChange={setChartType}
        />

        {showTutorial && (
          <Tutorial onClose={() => setShowTutorial(false)} />
        )}

        {showTips && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-2xl w-full mx-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Investment Tips</h3>
                <button
                  onClick={() => setShowTips(false)}
                  className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <EducationalTips onClose={() => setShowTips(false)} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}