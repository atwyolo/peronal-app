import { describe, expect, it } from "vitest";
import { formatMonthYear, getDurationYears } from "./period";

const today = "2026-10-30";

describe("formatMonthYear", () => {
  it("reads the month and year from the date string", () => {
    expect(formatMonthYear("2024-11-01")).toBe("11/2024");
  });

  it("keeps the first and the last day of a year in their own year", () => {
    expect(formatMonthYear("2024-01-01")).toBe("01/2024");
    expect(formatMonthYear("2024-12-31")).toBe("12/2024");
  });
});

describe("getDurationYears", () => {
  it("rounds the whole months between two dates to one decimal", () => {
    expect(getDurationYears("2024-11-01", "2026-10-01", today)).toBe(1.9);
  });

  it("counts twelve months as exactly one year", () => {
    expect(getDurationYears("2023-03-01", "2024-03-01", today)).toBe(1);
  });

  it("rounds eleven months to 0.9", () => {
    expect(getDurationYears("2023-03-01", "2024-02-01", today)).toBe(0.9);
  });

  it("counts months across a year boundary", () => {
    expect(getDurationYears("2023-12-01", "2024-01-01", today)).toBe(0.1);
  });

  it("uses today for a job without an end date", () => {
    expect(getDurationYears("2025-10-01", null, today)).toBe(1);
  });

  it("gives zero for a job that started this month", () => {
    expect(getDurationYears("2026-10-01", null, today)).toBe(0);
  });
});
