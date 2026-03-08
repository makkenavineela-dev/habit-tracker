export const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

export const getPastNDays = (n, endDate = new Date()) => {
    const days = [];
    for (let i = n - 1; i >= 0; i--) {
        const d = new Date(endDate);
        d.setDate(d.getDate() - i);
        days.push(d);
    }
    return days;
};

export const getDaysInMonth = (year, month) => {
    const days = [];
    const date = new Date(year, month, 1);
    while (date.getMonth() === month) {
        days.push(new Date(date));
        date.setDate(date.getDate() + 1);
    }
    return days;
};

// Get a calendar grid (matrix of weeks)
export const getCalendarGrid = (year, month) => {
    const firstDayOfMonth = new Date(year, month, 1);
    const startingDayOfWeek = firstDayOfMonth.getDay(); // 0 is Sunday, 1 is Monday ...

    // Adjust so Monday is 0, Sunday is 6
    const startOffset = startingDayOfWeek === 0 ? 6 : startingDayOfWeek - 1;

    const daysInMonth = getDaysInMonth(year, month);
    const grid = [];
    let currentWeek = Array(startOffset).fill(null);

    daysInMonth.forEach((date) => {
        currentWeek.push(date);
        if (currentWeek.length === 7) {
            grid.push(currentWeek);
            currentWeek = [];
        }
    });

    if (currentWeek.length > 0) {
        while (currentWeek.length < 7) {
            currentWeek.push(null);
        }
        grid.push(currentWeek);
    }

    return grid;
};

export const getMonthName = (monthIndex) => {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return months[monthIndex];
};

export const getShortDayName = (dayIndex) => {
    // 0 = Monday, ... 6 = Sunday in our calendar grid
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return days[dayIndex];
};

export const calculateStreak = (completedDates = []) => {
    if (completedDates.length === 0) return 0;

    const sortedDates = [...new Set(completedDates)].sort((a, b) => new Date(b) - new Date(a));
    const today = formatDate(new Date());
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yStr = formatDate(yesterday);

    // If today is not completed and yesterday is not completed, streak is 0
    if (sortedDates[0] !== today && sortedDates[0] !== yStr) return 0;

    const dateSet = new Set(completedDates);
    let streak = 0;
    let checkDate = new Date(sortedDates[0]);

    while (true) {
        const dStr = formatDate(checkDate);
        if (dateSet.has(dStr)) {
            streak++;
            checkDate.setDate(checkDate.getDate() - 1);
        } else {
            break;
        }
    }
    return streak;
};
