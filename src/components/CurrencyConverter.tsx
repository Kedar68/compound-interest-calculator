import React from 'react';
import { Currency } from '../types/currency';
import { DollarSign } from 'lucide-react';
import { ExchangeRates } from '../utils/currencyConverter';

interface Props {
  currency: Currency;
  exchangeRates: ExchangeRates;
  onCurrencyChange: (currency: Currency, convertValues: boolean) => void;
}

export default function CurrencyConverter({
  currency,
  exchangeRates,
  onCurrencyChange
}: Props) {
  const availableCurrencies = Object.keys(exchangeRates) as Currency[];

  return (
    <div className="inline-flex items-center gap-2 bg-white dark:bg-gray-800 rounded-lg px-3 py-2 border border-gray-200 dark:border-gray-700">
      <DollarSign className="w-4 h-4 text-gray-400" />
      <select
        value={currency}
        onChange={(e) => onCurrencyChange(e.target.value as Currency, true)}
        className="text-sm font-medium bg-transparent border-none focus:ring-0 text-gray-900 dark:text-white"
      >
        {availableCurrencies.map(code => (
          <option key={code} value={code}>
            {code} ({code === 'USD' ? '$' : code === 'EUR' ? '€' : 'Kč'})
          </option>
        ))}
      </select>
    </div>
  );
}