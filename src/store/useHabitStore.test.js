import { describe, it, expect, beforeEach } from 'vitest';
import useHabitStore from './useHabitStore';

describe('useHabitStore', () => {
    beforeEach(() => {
        // Reset the store before each test
        const { setDailyHabits, setWeeklyHabits, setChallenges, setProblems, setPriorities } = useHabitStore.getState();
        setDailyHabits([]);
        setWeeklyHabits([]);
        setChallenges([]);
        setProblems([]);
        setPriorities([]);
    });

    it('adds a daily habit', () => {
        const { addDailyHabit } = useHabitStore.getState();
        addDailyHabit('Drink Water', 'droplets');

        const habits = useHabitStore.getState().dailyHabits;
        expect(habits).toHaveLength(1);
        expect(habits[0].name).toBe('Drink Water');
        expect(habits[0].icon).toBe('droplets');
        expect(habits[0].completedDates).toEqual([]);
    });

    it('updates a daily habit name while preserving icon', () => {
        const { addDailyHabit, updateDailyHabit } = useHabitStore.getState();
        addDailyHabit('Drink Water', 'droplets');
        const habitId = useHabitStore.getState().dailyHabits[0].id;

        updateDailyHabit(habitId, 'Drink Gallon');

        const habits = useHabitStore.getState().dailyHabits;
        expect(habits[0].name).toBe('Drink Gallon');
        expect(habits[0].icon).toBe('droplets');
    });

    it('deletes a daily habit', () => {
        const { addDailyHabit, deleteDailyHabit } = useHabitStore.getState();
        addDailyHabit('Temp Habit');
        const habitId = useHabitStore.getState().dailyHabits[0].id;

        deleteDailyHabit(habitId);

        expect(useHabitStore.getState().dailyHabits).toHaveLength(0);
    });

    it('sets weekly habits correctly', () => {
        const { setWeeklyHabits } = useHabitStore.getState();
        const mockWeekly = [{ id: 1, name: 'Gym', target: 3, checks: [true, false, false] }];
        setWeeklyHabits(mockWeekly);

        expect(useHabitStore.getState().weeklyHabits).toEqual(mockWeekly);
    });

    it('manages priorities state', () => {
        const { setPriorities } = useHabitStore.getState();
        const mockPriorities = [{ id: 1, text: 'New Priority' }];
        setPriorities(mockPriorities);

        expect(useHabitStore.getState().priorities).toEqual(mockPriorities);
    });

    it('stores DSA problems with slug information', () => {
        const { setProblems } = useHabitStore.getState();
        const mockProblems = [{ id: 1, name: 'Two Sum', slug: 'two-sum', status: 'Done' }];
        setProblems(mockProblems);

        expect(useHabitStore.getState().problems[0].slug).toBe('two-sum');
    });
});
