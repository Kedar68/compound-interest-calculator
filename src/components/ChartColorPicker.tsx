import React from 'react';
import { Palette } from 'lucide-react';

interface Props {
  scenario: {
    id: string;
    name: string;
    color: string;
  };
  onColorChange: (color: string) => void;
}

export default function ChartColorPicker({ scenario, onColorChange }: Props) {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Palette className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        <h3 className="text-sm font-medium text-gray-900 dark:text-white">
          {scenario.name} Colors
        </h3>
      </div>
      
      <div>
        <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
          Scenario Color
        </label>
        <input
          type="color"
          value={scenario.color}
          onChange={(e) => onColorChange(e.target.value)}
          className="w-full h-8 rounded cursor-pointer"
        />
      </div>
    </div>
  );
}