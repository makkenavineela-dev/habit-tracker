import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent, screen } from '@testing-library/react';
import WeeklyTracker from './WeeklyTracker';

describe('WeeklyTracker', () => {
    const mockHabits = [
        { id: 1, name: 'Running', target: 3, checks: 2 }, // Legacy format (number)
        { id: 2, name: 'Reading', target: 2, checks: [true, false] } // New format (array)
    ];

    it('renders correct number of habits', () => {
        render(<WeeklyTracker weeklyHabits={mockHabits} setWeeklyHabits={() => { }} />);
        expect(screen.getByText('Running')).toBeInTheDocument();
        expect(screen.getByText('Reading')).toBeInTheDocument();
    });

    it('handles legacy numeric checks by treating them as sequential', () => {
        // checks: 2 means First and Second are checked, Third is not.
        render(<WeeklyTracker weeklyHabits={mockHabits} setWeeklyHabits={() => { }} />);
        const checkboxes = screen.getAllByRole('checkbox');

        // Running has 3 targets, Reading has 2. Total 5 checkboxes.
        // Running checkboxes [0, 1, 2]
        expect(checkboxes[0]).toBeChecked(); // 1st check
        expect(checkboxes[1]).toBeChecked(); // 2nd check
        expect(checkboxes[2]).not.toBeChecked(); // 3rd check
    });

    it('toggles independent checkboxes correctly', () => {
        const setWeeklyHabits = vi.fn();
        render(<WeeklyTracker weeklyHabits={mockHabits} setWeeklyHabits={setWeeklyHabits} />);

        const checkboxes = screen.getAllByRole('checkbox');

        // Toggle 3rd checkbox of 'Running' (index 2)
        fireEvent.click(checkboxes[2]);

        // Should convert legacy '2' to [true, true, true]
        expect(setWeeklyHabits).toHaveBeenCalledWith(expect.arrayContaining([
            expect.objectContaining({
                id: 1,
                checks: [true, true, true]
            })
        ]));
    });

    it('unchecks a middle checkbox independently in array mode', () => {
        const setWeeklyHabits = vi.fn();
        render(<WeeklyTracker weeklyHabits={mockHabits} setWeeklyHabits={setWeeklyHabits} />);

        const checkboxes = screen.getAllByRole('checkbox');

        // Reading is at checkboxes [3, 4]
        // Reading initial checks: [true, false]
        fireEvent.click(checkboxes[3]); // Toggle the first one (currently true)

        expect(setWeeklyHabits).toHaveBeenCalledWith(expect.arrayContaining([
            expect.objectContaining({
                id: 2,
                checks: [false, false]
            })
        ]));
    });

    it('calculates progress percentage correctly', () => {
        render(<WeeklyTracker weeklyHabits={mockHabits} setWeeklyHabits={() => { }} />);

        // Running: 2/3 = 67%
        expect(screen.getByText(/67%/)).toBeInTheDocument();
        // Reading: 1/2 = 50%
        expect(screen.getByText(/50%/)).toBeInTheDocument();
    });
});
