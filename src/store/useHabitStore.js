import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { formatDate } from '../utils/dateUtils';

// This Zustand store extracts state management from App.jsx
// It natively supports local storage persistence (Offline-First)
const useHabitStore = create(
    persist(
        (set) => ({
            dailyHabits: [],
            weeklyHabits: [],
            challenges: [],
            problems: [],

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
        }),
        {
            name: 'habit-storage', // unique name for local storage key
        }
    )
);

export default useHabitStore;
