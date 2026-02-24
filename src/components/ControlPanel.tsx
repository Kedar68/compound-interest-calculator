import React from 'react';
import { Save, Download, Share2, Undo2, Redo2 } from 'lucide-react';
import { Currency } from '../types/currency';
import { CalculationResult } from '../types/calculator';
import { exportToCsv, generateShareableUrl } from '../utils/export';
import CurrencySelect from './CurrencySelect';
import type { ReturnType } from '../hooks/useScenarioManager';

interface Props {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  scenarioManager: ReturnType<typeof useScenarioManager>;
  results: CalculationResult;
}

export default function ControlPanel({
  currency,
  setCurrency,
  scenarioManager,
  results
}: Props) {
  const { 
    currentScenario,
    saveScenario,
    undo,
    redo,
    canUndo,
    canRedo
  } = scenarioManager;

  return (
    <div className="mb-6 flex justify-between items-center">
      <div className="flex gap-2">
        <button
          onClick={undo}
          disabled={!canUndo}
          className="p-2 rounded hover:bg-gray-100 disabled:opacity-50"
          title="Undo"
        >
          <Undo2 className="w-5 h-5" />
        </button>
        <button
          onClick={redo}
          disabled={!canRedo}
          className="p-2 rounded hover:bg-gray-100 disabled:opacity-50"
          title="Redo"
        >
          <Redo2 className="w-5 h-5" />
        </button>
      </div>
      <div>
        <CurrencySelect value={currency} onChange={setCurrency} />
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => saveScenario({
            id: crypto.randomUUID(),
            name: 'New Scenario',
            initialInvestment: 0,
            periods: [],
            currency,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          })}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <Save className="w-4 h-4" />
          Save
        </button>
        <button
          onClick={() => {
            const csv = exportToCsv(results, currency);
            const blob = new Blob([csv], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'investment-calculation.csv';
            a.click();
            URL.revokeObjectURL(url);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          <Download className="w-4 h-4" />
          Export
        </button>
        <button
          onClick={() => {
            if (currentScenario) {
              const url = generateShareableUrl(currentScenario.id);
              navigator.clipboard.writeText(url);
              alert('Share URL copied to clipboard!');
            }
          }}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
        >
          <Share2 className="w-4 h-4" />
          Share
        </button>
      </div>
    </div>
  );
}