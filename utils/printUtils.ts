import { Platform } from "react-native";

// Function to trigger printing on web
export const printResults = () => {
  if (Platform.OS !== 'web') {
    console.log('Printing is only available on web');
    return;
  }

  // Add print-specific CSS
  const style = document.createElement('style');
  style.innerHTML = `
    @media print {
      body * {
        visibility: hidden;
      }
      #printable-content, #printable-content * {
        visibility: visible;
      }
      #printable-content {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
      }
      @page {
        size: A4;
        margin: 0.5cm;
      }
    }
  `;
  document.head.appendChild(style);

  // Trigger print dialog
  window.print();

  // Remove the style after printing
  setTimeout(() => {
    document.head.removeChild(style);
  }, 1000);
};