// Format a Date object to DD/MM/YYYY string
export const formatDate = (date: Date): string => {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

// Parse a DD/MM/YYYY string to a Date object
export const parseDate = (dateStr: string): Date => {
  if (!dateStr || !dateStr.includes("/")) return new Date();
  
  const [day, month, year] = dateStr.split("/").map(Number);
  return new Date(year, month - 1, day);
};

// Add months to a date
export const addMonths = (date: Date, months: number): Date => {
  const newDate = new Date(date);
  newDate.setMonth(newDate.getMonth() + months);
  return newDate;
};

// Calculate period using 30-day month system
export const calculate30DayPeriod = (startDate: Date, endDate: Date) => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  const yearDiff = end.getFullYear() - start.getFullYear();
  const monthDiff = end.getMonth() - start.getMonth();
  const totalMonths = yearDiff * 12 + monthDiff;

  let startDay = start.getDate();
  let endDay = end.getDate();

  // Adjust for 31st day (Marwari system treats it as 30th)
  if (startDay === 31) startDay = 30;
  if (endDay === 31) endDay = 30;

  const dayDiff = endDay - startDay;

  const totalDays = totalMonths * 30 + dayDiff;
  return {
    totalDays,
    months: Math.floor(totalDays / 30),
    remainingDays: totalDays % 30,
  };
};

// Validate date format (DD/MM/YYYY)
export const isValidDateFormat = (dateStr: string): boolean => {
  if (!dateStr) return false;
  
  const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
  if (!regex.test(dateStr)) return false;
  
  const [, day, month, year] = dateStr.match(regex) || [];
  const dayNum = parseInt(day, 10);
  const monthNum = parseInt(month, 10);
  const yearNum = parseInt(year, 10);
  
  if (monthNum < 1 || monthNum > 12) return false;
  
  const daysInMonth = new Date(yearNum, monthNum, 0).getDate();
  if (dayNum < 1 || dayNum > daysInMonth) return false;
  
  return true;
};

// Format date input as user types (add slashes automatically)
export const formatDateInput = (value: string): string => {
  // Remove non-digits
  const numericValue = value.replace(/\D/g, "");
  
  if (numericValue.length === 0) return "";
  
  if (numericValue.length <= 2) {
    return numericValue;
  } else if (numericValue.length <= 4) {
    return `${numericValue.slice(0, 2)}/${numericValue.slice(2)}`;
  } else {
    return `${numericValue.slice(0, 2)}/${numericValue.slice(2, 4)}/${numericValue.slice(4, 8)}`;
  }
};