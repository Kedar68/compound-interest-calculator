import React from 'react';
import { Calculator, Download, Undo2, Redo2 } from 'lucide-react';
import { Currency } from '../types/currency';

interface Props {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  onExport: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

export default function Header({
  currency,
  setCurrency,
  onExport,
  onUndo,
  onRedo,
  canUndo,
  canRedo
}: Props) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Calculator className="w-10 h-10 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">
            Compound Interest Calculator
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex gap-1 mr-2">
            <button
              onClick={onUndo}
              disabled={!canUndo}
              className="p-2 rounded hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-transparent"
              title="Undo"
            >
              <Undo2 className="w-5 h-5" />
            </button>
            <button
              onClick={onRedo}
              disabled={!canRedo}
              className="p-2 rounded hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-transparent"
              title="Redo"
            >
              <Redo2 className="w-5 h-5" />
            </button>
          </div>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value as Currency)}
            className="px-3 py-2 rounded border border-gray-300 bg-white"
          >
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
            <option value="CZK">CZK (Kč)</option>
          </select>
          <button
            onClick={onExport}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>
      <p className="text-gray-600">
        Calculate your investment growth with customizable periods
      </p>
    </div>
  );
}