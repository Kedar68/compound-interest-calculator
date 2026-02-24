import { useReducer, useCallback } from 'react';
import { Scenario } from '../types/scenario';

type State = {
  scenarios: Scenario[];
  activeScenarioId: string;
  chartType: 'bar' | 'line' | 'area';
};

type Action = 
  | { type: 'ADD_SCENARIO' }
  | { type: 'REMOVE_SCENARIO'; payload: string }
  | { type: 'SET_ACTIVE_SCENARIO'; payload: string }
  | { type: 'UPDATE_SCENARIO'; payload: { id: string; updates: Partial<Scenario> } }
  | { type: 'SET_CHART_TYPE'; payload: 'bar' | 'line' | 'area' };

const defaultScenarioColors = [
  '#3B82F6', // Blue
  '#10B981', // Green
  '#9333EA', // Purple
  '#F59E0B', // Yellow
  '#EF4444', // Red
  '#06B6D4', // Cyan
];

const createNewScenario = (index: number): Scenario => ({
  id: crypto.randomUUID(),
  name: `Scenario ${index + 1}`,
  initialInvestment: 10000,
  periods: [{
    id: crypto.randomUUID(),
    startYear: 1,
    endYear: 5,
    monthlyInvestment: 500,
    yearlyInterestRate: 7
  }],
  goalAmount: 50000,
  taxRate: 0,
  inflationRate: 0,
  color: defaultScenarioColors[index % defaultScenarioColors.length],
  showInvested: true,
  showInterest: true,
  showTotal: true
});

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'ADD_SCENARIO': {
      const newScenario = createNewScenario(state.scenarios.length);
      return {
        ...state,
        scenarios: [...state.scenarios, newScenario],
        activeScenarioId: newScenario.id
      };
    }
    case 'REMOVE_SCENARIO': {
      if (state.scenarios.length <= 1) return state;
      const remainingScenarios = state.scenarios.filter(s => s.id !== action.payload);
      return {
        ...state,
        scenarios: remainingScenarios,
        activeScenarioId: remainingScenarios[0].id
      };
    }
    case 'SET_ACTIVE_SCENARIO':
      return { ...state, activeScenarioId: action.payload };
    case 'UPDATE_SCENARIO': {
      const { id, updates } = action.payload;
      return {
        ...state,
        scenarios: state.scenarios.map(s =>
          s.id === id ? { ...s, ...updates } : s
        )
      };
    }
    case 'SET_CHART_TYPE':
      return { ...state, chartType: action.payload };
    default:
      return state;
  }
}

const initialState: State = {
  scenarios: [createNewScenario(0)],
  activeScenarioId: '',
  chartType: 'bar'
};

export function useScenarioManager() {
  const [state, dispatch] = useReducer(reducer, {
    ...initialState,
    activeScenarioId: initialState.scenarios[0].id
  });

  const addScenario = useCallback(() => {
    dispatch({ type: 'ADD_SCENARIO' });
  }, []);

  const removeScenario = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_SCENARIO', payload: id });
  }, []);

  const setActiveScenario = useCallback((id: string) => {
    dispatch({ type: 'SET_ACTIVE_SCENARIO', payload: id });
  }, []);

  const updateScenario = useCallback((id: string, updates: Partial<Scenario>) => {
    dispatch({ type: 'UPDATE_SCENARIO', payload: { id, updates } });
  }, []);

  const setChartType = useCallback((type: 'bar' | 'line' | 'area') => {
    dispatch({ type: 'SET_CHART_TYPE', payload: type });
  }, []);

  return {
    scenarios: state.scenarios,
    activeScenarioId: state.activeScenarioId,
    chartType: state.chartType,
    activeScenario: state.scenarios.find(s => s.id === state.activeScenarioId)!,
    addScenario,
    removeScenario,
    setActiveScenario,
    updateScenario,
    setChartType
  };
}