import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useHabitStore = create(
    persist(
        (set) => ({
            dailyHabits: [],
            weeklyHabits: [],
            challenges: [],
            problems: [],
            priorities: [
                { id: 1, text: "Master dynamic programming patterns" },
                { id: 2, text: "Finish System Design fundamentals" },
                { id: 3, text: "Update professional portfolio" }
            ],

            setDailyHabits: (habits) => set({ dailyHabits: habits }),
            addDailyHabit: (name, icon = 'sparkles') => set((state) => ({
                dailyHabits: [...state.dailyHabits, { id: Date.now(), name, icon, completedDates: [] }]
            })),
            deleteDailyHabit: (id) => set((state) => ({
                dailyHabits: state.dailyHabits.filter(h => h.id !== id)
            })),
            updateDailyHabit: (id, newName) => set((state) => ({
                dailyHabits: state.dailyHabits.map(h => h.id === id ? { ...h, name: newName } : h)
            })),

            setWeeklyHabits: (habits) => set({ weeklyHabits: habits }),
            setChallenges: (challenges) => set({ challenges }),
            setProblems: (problems) => set({ problems }),
            setPriorities: (priorities) => set({ priorities }),
        }),
        {
            name: 'habit-storage',
        }
    )
);

export default useHabitStore;
