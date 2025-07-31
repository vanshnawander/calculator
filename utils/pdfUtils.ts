import { Platform } from "react-native";
import * as FileSystem from 'expo-file-system';
import * as Print from 'expo-print';

interface Period {
  startDate: string;
  endDate: string;
  days: number;
  months: number;
  remainingDays: number;
  interest: string;
  balance: string;
  principalForPeriod: string;
}

interface ResultData {
  principal: string;
  yearlyRate: string;
  compoundingPeriod: number;
  totalInterest: string; // Changed from interest to totalInterest to match component props
  totalAmount: string;   // Changed from total to totalAmount to match component props
  periods: Period[];
}

// Generate HTML content for the PDF
const generateHtml = (data: ResultData): string => {
  const totalDays = data.periods.reduce((total, period) => total + period.days, 0);
  const totalMonths = Math.floor(totalDays / 30);
  const remainingDays = totalDays % 30;
  
  const currentDate = new Date().toLocaleDateString();
  
  // Log the data to help with debugging
  console.log('PDF Data:', {
    principal: data.principal,
    yearlyRate: data.yearlyRate,
    totalInterest: data.totalInterest,
    totalAmount: data.totalAmount,
    periodsCount: data.periods.length
  });
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
      <style>
        body {
          font-family: 'Helvetica', Arial, sans-serif;
          margin: 0;
          padding: 20px;
          color: #1F2937;
        }
        .header {
          text-align: center;
          margin-bottom: 20px;
          padding-bottom: 10px;
          border-bottom: 1px solid #E5E7F2;
        }
        .title {
          font-size: 24px;
          font-weight: bold;
          color: #5B6EF5;
          margin-bottom: 5px;
        }
        .subtitle {
          font-size: 14px;
          color: #6B7280;
        }
        .section {
          margin-bottom: 20px;
        }
        .section-title {
          font-size: 18px;
          font-weight: bold;
          color: #5B6EF5;
          margin-bottom: 10px;
          padding-bottom: 5px;
          border-bottom: 1px solid #E5E7F2;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 15px;
        }
        th, td {
          border: 1px solid #E5E7F2;
          padding: 8px;
          text-align: right;
        }
        th {
          background-color: #F9FAFF;
          font-weight: bold;
          color: #1F2937;
          text-align: center;
        }
        .summary-table td:first-child {
          background-color: #F9FAFF;
          font-weight: 500;
          text-align: left;
          width: 50%;
        }
        .highlight {
          color: #5B6EF5;
          font-weight: bold;
        }
        .success {
          color: #10B981;
          font-weight: bold;
        }
        .footer {
          margin-top: 20px;
          padding-top: 10px;
          border-top: 1px solid #E5E7F2;
          font-size: 12px;
          color: #6B7280;
          text-align: center;
        }
        @page {
          size: A4;
          margin: 1cm;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="title">Marwari Interest Calculation</div>
        <div class="subtitle">Calculation Date: ${currentDate}</div>
      </div>
      
      <div class="section">
        <div class="section-title">Summary</div>
        <table class="summary-table">
          <tr>
            <td>Principal Amount</td>
            <td>${data.principal}</td>
          </tr>
          <tr>
            <td>Yearly Interest Rate</td>
            <td>${data.yearlyRate}%</td>
          </tr>
          <tr>
            <td>Compounding Period</td>
            <td>${data.compoundingPeriod} months</td>
          </tr>
          <tr>
            <td>Total Duration</td>
            <td>${totalMonths} months, ${remainingDays} days</td>
          </tr>
          <tr>
            <td>Total Interest</td>
            <td class="success">${data.totalInterest}</td>
          </tr>
          <tr>
            <td>Final Amount</td>
            <td class="highlight">${data.totalAmount}</td>
          </tr>
        </table>
      </div>
      
      <div class="section">
        <div class="section-title">Compounding Periods</div>
        <table>
          <thead>
            <tr>
              <th>Period</th>
              <th>Date Range</th>
              <th>Days</th>
              <th>Duration</th>
              <th>Principal</th>
              <th>Interest</th>
              <th>Balance</th>
            </tr>
          </thead>
          <tbody>
            ${data.periods.map((period, index) => `
              <tr>
                <td style="text-align: center;">Period ${index + 1}</td>
                <td>${period.startDate} - ${period.endDate}</td>
                <td>${period.days}</td>
                <td>${period.months}m, ${period.remainingDays}d</td>
                <td>${period.principalForPeriod}</td>
                <td class="success">${period.interest}</td>
                <td class="highlight">${period.balance}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
      
      <div class="footer">
        <p>This calculation follows the Marwari interest system using a 30-day month (360-day year).</p>
        <p>© ${new Date().getFullYear()} Marwari Interest Calculator</p>
      </div>
    </body>
    </html>
  `;
};

// Generate and save PDF file
export const generatePDF = async (data: ResultData): Promise<string> => {
  try {
    if (Platform.OS === 'web') {
      console.log('PDF generation not supported on web');
      return '';
    }
    
    const html = generateHtml(data);
    
    // Generate the PDF using expo-print
    const { uri } = await Print.printToFileAsync({
      html,
      base64: false
    });
    
    // Create a more user-friendly filename
    const fileName = `marwari_interest_${new Date().getTime()}.pdf`;
    const newUri = FileSystem.documentDirectory + fileName;
    
    // Copy the file to the new location with the better name
    await FileSystem.moveAsync({
      from: uri,
      to: newUri
    });
    
    console.log('PDF created at:', newUri);
    return newUri;
    
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};