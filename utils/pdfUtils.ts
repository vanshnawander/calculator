import { Platform } from "react-native";

interface ResultData {
  principal: string;
  yearlyRate: string;
  compoundingPeriod: string;
  totalInterest: string;
  totalAmount: string;
  periods: Array<{
    period: number;
    startDate: string;
    endDate: string;
    principal: string;
    interest: string;
    total: string;
  }>;
}

// Generate and save PDF file
export const generatePDF = async (data: ResultData): Promise<string> => {
  // PDF generation removed to reduce app size
  console.log('PDF generation disabled for smaller app size');
  return '';
};