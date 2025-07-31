import { parseDate, calculate30DayPeriod, addMonths, formatDate } from "./dateUtils";

interface Period {
  startDate: string;
  endDate: string;
  days: number;
  months: number;
  remainingDays: number;
  interest: string;
  balance: string;
  principalForPeriod: string; // Added to show the amount on which interest is calculated
}

interface CalculationResult {
  interest: string;
  principal: string;
  total: string;
  yearlyRate: string;
  compoundingPeriod: number;
  periods: Period[];
}

export const calculateInterest = (
  principal: string,
  rate: string,
  startDateStr: string,
  endDateStr: string,
  interestPeriod: "yearly" | "monthly",
  compoundingMonths: string
): CalculationResult | null => {
  try {
    let principalAmount = parseFloat(principal);
    const rateValue = parseFloat(rate);
    const compoundingPeriodMonths = parseInt(compoundingMonths);
    
    if (isNaN(principalAmount) || isNaN(rateValue) || isNaN(compoundingPeriodMonths)) {
      throw new Error("Invalid numeric inputs");
    }
    
    if (principalAmount <= 0 || rateValue <= 0 || compoundingPeriodMonths <= 0) {
      throw new Error("Values must be greater than zero");
    }

    // Convert rate to yearly if it's monthly
    const yearlyRate = interestPeriod === "yearly" ? rateValue : rateValue * 12;

    // Parse dates
    const startDate = parseDate(startDateStr);
    const endDate = parseDate(endDateStr);
    
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      throw new Error("Invalid dates");
    }
    
    if (startDate >= endDate) {
      throw new Error("Start date must be before end date");
    }

    // Calculate interest
    let totalAmount = principalAmount;
    let totalInterest = 0;
    let periods: Period[] = [];
    let currentDate = new Date(startDate);

    while (currentDate < endDate) {
      const periodEndDate = addMonths(currentDate, compoundingPeriodMonths);
      const actualEndDate = periodEndDate > endDate ? endDate : periodEndDate;

      const { totalDays, months, remainingDays } = calculate30DayPeriod(
        currentDate,
        actualEndDate
      );

      // Store the principal amount for this period (before interest is added)
      const principalForPeriod = totalAmount;

      // Daily rate based on 360-day year (Marwari system)
      const periodRate = yearlyRate / 360 / 100;
      const periodInterest = totalAmount * periodRate * totalDays;

      totalInterest += periodInterest;
      totalAmount += periodInterest;

      periods.push({
        startDate: formatDate(currentDate),
        endDate: formatDate(actualEndDate),
        days: totalDays,
        months,
        remainingDays,
        interest: periodInterest.toFixed(2),
        balance: totalAmount.toFixed(2),
        principalForPeriod: principalForPeriod.toFixed(2), // Add the principal amount for this period
      });

      if (actualEndDate >= endDate) break;
      currentDate = new Date(periodEndDate);
    }

    return {
      interest: totalInterest.toFixed(2),
      principal: principalAmount.toFixed(2),
      total: totalAmount.toFixed(2),
      yearlyRate: yearlyRate.toFixed(2),
      compoundingPeriod: compoundingPeriodMonths,
      periods,
    };
  } catch (error) {
    console.error("Calculation error:", error);
    return null;
  }
};