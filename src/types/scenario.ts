export interface Scenario {
  id: string;
  name: string;
  initialInvestment: number;
  periods: InvestmentPeriod[];
  goalAmount: number;
  taxRate: number;
  inflationRate: number;
  color: string;
  showInvested: boolean;
  showInterest: boolean;
  showTotal: boolean;
}

export interface InvestmentPeriod {
  id: string;
  startYear: number;
  endYear: number;
  monthlyInvestment: number;
  yearlyInterestRate: number;
}