import { InvestmentPeriod, CalculationResult, YearlyData } from '../types/calculator';

export const calculateCompoundInterest = (
  initialInvestment: number,
  periods: InvestmentPeriod[],
  totalYears: number,
  inflationRate: number = 0
): CalculationResult => {
  let yearlyData: YearlyData[] = [];
  let currentAmount = initialInvestment;
  let totalInvested = initialInvestment;
  
  // Sort periods by start year to ensure correct order
  const sortedPeriods = [...periods].sort((a, b) => a.startYear - b.startYear);
  
  for (let year = 1; year <= totalYears; year++) {
    // Find all periods that affect this year
    const activePeriod = sortedPeriods.find(p => year >= p.startYear && year <= p.endYear);
    
    // Find the applicable interest rate for this year
    const applicablePeriod = sortedPeriods
      .filter(p => year >= p.startYear)
      .sort((a, b) => b.startYear - a.startYear)[0];
    
    if (!applicablePeriod) continue;

    // Add yearly investment if in an active period
    const yearlyInvestment = (activePeriod?.monthlyInvestment ?? 0) * 12;
    currentAmount += yearlyInvestment;
    totalInvested += yearlyInvestment;

    // Apply interest to the entire accumulated amount
    const yearlyInterestRate = applicablePeriod.yearlyInterestRate / 100;
    const interestEarned = currentAmount * yearlyInterestRate;
    currentAmount += interestEarned;

    // Apply inflation after interest
    if (inflationRate > 0) {
      const inflationAdjustment = currentAmount * (inflationRate / 100);
      currentAmount -= inflationAdjustment;
    }

    yearlyData.push({
      year,
      invested: totalInvested,
      interest: currentAmount - totalInvested,
      total: currentAmount
    });
  }

  return {
    totalInvested,
    totalInterest: currentAmount - totalInvested,
    finalAmount: currentAmount,
    yearlyData
  };
};