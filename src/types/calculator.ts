export interface InvestmentPeriod {
  id: string;
  startYear: number;
  endYear: number;
  monthlyInvestment: number;
  yearlyInterestRate: number;
}

export interface CalculationResult {
  totalInvested: number;
  totalInterest: number;
  finalAmount: number;
  yearlyData: YearlyData[];
}

export interface YearlyData {
  year: number;
  invested: number;
  interest: number;
  total: number;
}