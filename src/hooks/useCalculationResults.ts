import { useMemo } from 'react';
import { Scenario } from '../types/scenario';
import { CalculationResult } from '../types/calculator';
import { calculateCompoundInterest } from '../utils/calculatorUtils';

export function useCalculationResults(scenarios: Scenario[]) {
  return useMemo(() => 
    scenarios.map(scenario => ({
      scenario,
      results: calculateCompoundInterest(
        scenario.initialInvestment,
        scenario.periods,
        Math.max(...scenario.periods.map(p => p.endYear)),
        scenario.inflationRate
      )
    })),
    // Deep comparison of scenarios to ensure updates
    [JSON.stringify(scenarios)]
  );
}