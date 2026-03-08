import { describe, it, expect } from 'vitest';
import {
    calculateStreak,
    formatDate,
    getPastNDays,
    getShortDayName,
    getMonthName,
    getDaysInMonth,
    getCalendarGrid
} from './dateUtils';

describe('dateUtils', () => {
    describe('formatDate', () => {
        it('formats Date object to YYYY-MM-DD', () => {
            const date = new Date(2026, 2, 8); // March 8, 2026
            expect(formatDate(date)).toBe('2026-03-08');
        });

        it('handles single digit months and days with leading zeros', () => {
            const date = new Date(2026, 0, 1); // Jan 1, 2026
            expect(formatDate(date)).toBe('2026-01-01');
        });
    });

    describe('calculateStreak', () => {
        it('returns 0 for no completed dates', () => {
            expect(calculateStreak([])).toBe(0);
        });

        it('returns 1 if only today is completed', () => {
            const today = formatDate(new Date());
            expect(calculateStreak([today])).toBe(1);
        });

        it('calculates a multi-day streak correctly', () => {
            const today = new Date();
            const dates = [0, 1, 2, 3].map(offset => {
                const d = new Date(today);
                d.setDate(d.getDate() - offset);
                return formatDate(d);
            });
            expect(calculateStreak(dates)).toBe(4);
        });

        it('breaks streak if yesterday is missed but today is done', () => {
            const today = new Date();
            const d1 = new Date(today);
            const d3 = new Date(today);
            d3.setDate(d3.getDate() - 2);

            const dates = [formatDate(d1), formatDate(d3)];
            expect(calculateStreak(dates)).toBe(1);
        });

        it('returns multi-day streak ending yesterday if today is not done', () => {
            const today = new Date();
            const d2 = new Date(today);
            d2.setDate(d2.getDate() - 1);
            const d3 = new Date(today);
            d3.setDate(d3.getDate() - 2);

            const dates = [formatDate(d3), formatDate(d2)];
            expect(calculateStreak(dates)).toBe(2);
        });

        it('returns 0 if today and yesterday are missed', () => {
            const today = new Date();
            const d3 = new Date(today);
            d3.setDate(d3.getDate() - 2);
            expect(calculateStreak([formatDate(d3)])).toBe(0);
        });

        it('handles non-sequential duplicates gracefully', () => {
            const today = formatDate(new Date());
            expect(calculateStreak([today, today])).toBe(1);
        });

        it('handles unordered dates correctly', () => {
            const today = new Date();
            const dates = [3, 0, 2, 1].map(offset => {
                const d = new Date(today);
                d.setDate(d.getDate() - offset);
                return formatDate(d);
            });
            expect(calculateStreak(dates)).toBe(4);
        });

        it('handles very large date arrays efficiently', () => {
            const items = 1000;
            const today = new Date();
            const dates = Array.from({ length: items }).map((_, i) => {
                const d = new Date(today);
                d.setDate(d.getDate() - i);
                return formatDate(d);
            });
            expect(calculateStreak(dates)).toBe(items);
        });
    });

    describe('getPastNDays', () => {
        it('returns correct number of days', () => {
            const days = getPastNDays(7);
            expect(days).toHaveLength(7);
        });
    });

    describe('getShortDayName', () => {
        it('returns correct abbreviations', () => {
            expect(getShortDayName(0)).toBe('Mon');
            expect(getShortDayName(6)).toBe('Sun');
        });
    });

    describe('getMonthName', () => {
        it('returns correct month strings', () => {
            expect(getMonthName(0)).toBe('January');
            expect(getMonthName(11)).toBe('December');
        });
    });

    describe('getDaysInMonth', () => {
        it('returns 31 for March 2026', () => {
            // Source: getDaysInMonth(year, month)
            expect(getDaysInMonth(2026, 2)).toHaveLength(31);
        });
        it('returns 28 for February 2025', () => {
            expect(getDaysInMonth(2025, 1)).toHaveLength(28);
        });
        it('returns 29 for February 2024', () => {
            expect(getDaysInMonth(2024, 1)).toHaveLength(29);
        });
    });

    describe('getCalendarGrid', () => {
        it('generates a grid of weeks', () => {
            const grid = getCalendarGrid(2026, 2); // March 2026
            expect(grid[0]).toHaveLength(7);
            expect(grid.length).toBeGreaterThanOrEqual(4);
        });
    });
});
