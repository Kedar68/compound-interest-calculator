import React from 'react';
import { Language, LANGUAGES } from '../types/language';

interface Props {
  value: Language;
  onChange: (language: Language) => void;
}

export default function LanguageSelect({ value, onChange }: Props) {
  return (
    <div className="flex items-center space-x-2">
      <label className="block text-sm font-medium text-gray-700">
        Language
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as Language)}
        className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
      >
        {LANGUAGES.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.localName}
          </option>
        ))}
      </select>
    </div>
  );
}