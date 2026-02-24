import { Currency } from '../types/currency';

export interface ExchangeRates {
  [key: string]: {
    [key: string]: number;
  };
}

export function convertAmount(
  amount: number,
  fromCurrency: Currency,
  toCurrency: Currency,
  rates: ExchangeRates
): number {
  if (fromCurrency === toCurrency) return amount;
  
  const rate = rates[fromCurrency][toCurrency];
  return amount * rate;
}

export function convertToUSD(
  amount: number,
  fromCurrency: Currency,
  rates: ExchangeRates
): number {
  return convertAmount(amount, fromCurrency, 'USD', rates);
}

export function convertFromUSD(
  amount: number,
  toCurrency: Currency,
  rates: ExchangeRates
): number {
  return convertAmount(amount, 'USD', toCurrency, rates);
}