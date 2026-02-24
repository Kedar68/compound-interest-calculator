import { CalculationResult } from '../types/calculator';
import { Currency } from '../types/currency';
import { formatCurrency } from './formatCurrency';

export function exportToCsv(results: CalculationResult, currency: Currency): string {
  const headers = ['Year', 'Invested Amount', 'Interest Earned', 'Total Value'];
  const rows = results.yearlyData.map(data => [
    data.year,
    formatCurrency(data.invested, currency),
    formatCurrency(data.interest, currency),
    formatCurrency(data.total, currency)
  ]);

  return [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');
}

export function generateShareableUrl(scenarioId: string): string {
  const baseUrl = window.location.origin;
  return `${baseUrl}?scenario=${scenarioId}`;
}