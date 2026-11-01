const MONTHS_IN_YEAR = 12;

/** Dates stay "YYYY-MM-DD" strings here: reading the parts directly leaves no time zone to shift them. */
const getMonthIndex = (date: string): number => {
  const [year, month] = date.split("-").map(Number);

  return year * MONTHS_IN_YEAR + month;
};

/** "2024-11-01" → "11/2024". */
export const formatMonthYear = (date: string): string => {
  const [year, month] = date.split("-");

  return `${month}/${year}`;
};

/**
 * The job's calendar months in years, with one decimal. Both the first and the last month count, so 11/2024 – 10/2026
 * is two years. `today` closes a job that is still running; it is an argument because a static render must not read
 * the clock.
 */
export const getDurationYears = (startDate: string, endDate: string | null, today: string): number => {
  const months = getMonthIndex(endDate ?? today) - getMonthIndex(startDate) + 1;

  return Math.round((months / MONTHS_IN_YEAR) * 10) / 10;
};
