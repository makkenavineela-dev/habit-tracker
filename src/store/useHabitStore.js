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
            theme: 'dark',

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
            resetWeeklyHabits: () => set((state) => ({
                weeklyHabits: state.weeklyHabits.map(h => ({
                    ...h,
                    checks: Array.isArray(h.checks) ? Array(h.checks.length).fill(false) : 0
                }))
            })),
            setChallenges: (challenges) => set({ challenges }),
            setProblems: (problems) => set({ problems }),
            setPriorities: (priorities) => set({ priorities }),
            toggleTheme: () => set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),
        }),
        {
            name: 'habit-storage',
        }
    )
);

export default useHabitStore;
