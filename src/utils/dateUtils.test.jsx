import { describe, it, expect } from 'vitest';
import { calculateStreak, formatDate } from './dateUtils';

describe('dateUtils', () => {
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
            // dates = [today, yesterday, day before, day before that]
            expect(calculateStreak(dates)).toBe(4);
        });

        it('breaks streak if a day is missed', () => {
            const today = new Date();
            const d1 = new Date(today);
            const d3 = new Date(today);
            d3.setDate(d3.getDate() - 2); // Missed yesterday (offset 1)

            const dates = [formatDate(d1), formatDate(d3)];
            expect(calculateStreak(dates)).toBe(1);
        });

        it('handles non-sequential duplicates gracefully', () => {
            const today = formatDate(new Date());
            expect(calculateStreak([today, today])).toBe(1);
        });
    });
});
