// Function to trigger printing on web
export const printResults = () => {
  if (typeof window !== 'undefined') {
    window.print();
  }
};