import { Platform } from "react-native";
import { printToFileAsync } from 'expo-print';
import { shareAsync } from 'expo-sharing';

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
export const generatePDF = async (data: ResultData): Promise<void> => {
  // Calculate total months and days from all periods
  let totalMonths = 0;
  let totalDays = 0;
  
  data.periods.forEach((period: any) => {
    totalMonths += period.months || 0;
    totalDays += period.remainingDays || 0;
  });
  
  // Convert excess days to months (30 days = 1 month)
  const additionalMonths = Math.floor(totalDays / 30);
  totalMonths += additionalMonths;
  totalDays = totalDays % 30;

  // Get current date for the PDF
  const currentDate = new Date().toLocaleDateString();

  const htmlContent = `
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; color: #333; line-height: 1.5; }
          h1 { color: #4169E1; text-align: center; font-size: 24px; margin-bottom: 5px; }
          .date { text-align: center; margin-bottom: 20px; font-size: 14px; color: #666; }
          h2 { color: #4169E1; margin-top: 30px; font-size: 18px; }
          
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th, td { padding: 10px; text-align: left; border: 1px solid #ddd; }
          th { background-color: #f2f2f2; }
          td.number { text-align: right; }
          td.green { color: #00A86B; font-weight: bold; }
          td.blue { color: #4169E1; font-weight: bold; }
          
          .footer { margin-top: 40px; text-align: center; font-size: 12px; color: #666; }
          .note { font-style: italic; text-align: center; margin-top: 20px; font-size: 12px; }
        </style>
      </head>
      <body>
        <h1>Marwari Interest Calculation</h1>
        <div class="date">Calculation Date: ${currentDate}</div>
        
        <h2>Summary</h2>
        <table>
          <tr>
            <td>Principal Amount</td>
            <td class="number">${data.principal}</td>
          </tr>
          <tr>
            <td>Yearly Interest Rate</td>
            <td class="number">${data.yearlyRate}%</td>
          </tr>
          <tr>
            <td>Compounding Period</td>
            <td class="number">${data.compoundingPeriod} months</td>
          </tr>
          <tr>
            <td>Total Duration</td>
            <td class="number">${totalMonths} months${totalDays > 0 ? `, ${totalDays} days` : ''}</td>
          </tr>
          <tr>
            <td>Total Interest</td>
            <td class="number green">${data.totalInterest}</td>
          </tr>
          <tr>
            <td>Final Amount</td>
            <td class="number blue">${data.totalAmount}</td>
          </tr>
        </table>
        
        <h2>Compounding Periods</h2>
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
            ${data.periods.map((period: any, index: number) => `
              <tr>
                <td>Period ${period.period}</td>
                <td>${period.startDate} - ${period.endDate}</td>
                <td class="number">${period.days || 0}</td>
                <td>${period.months || 0}m, ${period.remainingDays || 0}d</td>
                <td class="number">${period.principal}</td>
                <td class="number green">${period.interest}</td>
                <td class="number blue">${period.total}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        
        <div class="note">
          This calculation follows the Marwari interest system using a 30-day month (360-day year).
        </div>
        
        <div class="footer">
          <p>© 2025 Marwari Interest Calculator</p>
          <p>Designed and developed by Krishna Malani</p>
          <p>Contact: Krishnamalani166@gmail.com</p>
        </div>
      </body>
    </html>
  `;

  try {
    // Generate PDF file
    const file = await printToFileAsync({
      html: htmlContent,
      base64: false
    });
    
    // Share the PDF file
    await shareAsync(file.uri, {
      mimeType: 'application/pdf',
      dialogTitle: 'Share Calculation Results',
    });
  } catch (error) {
    console.error('Error generating or sharing PDF:', error);
    throw error;
  }
};