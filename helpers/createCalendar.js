/* Function for creating a calendar for 2024-2050 */

const generateCalendar = (parent_id, child_id, child_name, cost_for_per_hour) => {
    /* Helper functions */
    function getISOWeek(date) {
        const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
        const dayNum = d.getUTCDay() || 7;
        d.setUTCDate(d.getUTCDate() + 4 - dayNum);
        const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
        return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
    }

    function getMonthName(monthIndex) {
        const months = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
        return months[monthIndex];
    }

    function formatDateRange(startDate, endDate) {
        const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
        const start = startDate.toLocaleDateString(undefined, options).replace(/\./g, '/');
        const end = endDate.toLocaleDateString(undefined, options).replace(/\./g, '/');
        return `${start} - ${end}`;
    }

    function addDays(date, days) {
        const result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    }

    function generateDays(startDate, numDays) {
        const days = [];

        for (let i = 0; i < numDays; i++) {
            const currentDate = addDays(startDate, i);

            const dayObj = {
                title: getDayTitle(currentDate),
                arrived: '',
                isGone: '',
                completed: false,
                disabled: false
            };

            days.push(dayObj);
        }

        return days;
    }

    function getDayTitle(date) {
        const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const dayIndex = date.getDay();
        return `${daysOfWeek[dayIndex]} ${date.getDate()}`;
    }

    /* Main code for generating the calendar */
    const startDate = new Date('2023-12-31');
    const endDate = new Date('2050-12-31');

    const calendar = [];

    let currentDate = new Date(startDate);

    while (currentDate <= endDate) {
        if (currentDate.getDay() === 6) { /* Saturday */
            /* Adjust currentDate to be Sunday */
            const sundayDate = new Date(currentDate);
            sundayDate.setDate(currentDate.getDate() - 6);

            const saturdayObj = {
                week: getISOWeek(currentDate),
                month: getMonthName(currentDate.getMonth()),
                year: currentDate.getFullYear(),
                parent_id,
                child_id,
                child_name,
                cost_for_per_hour,
                dates: formatDateRange(sundayDate, currentDate),
                total_time_in_week: '0',
                total_days: 0,
                days: generateDays(sundayDate, 7),
            };

            /* Check if it's the end of the month */
            if (currentDate.getMonth() !== addDays(currentDate, 1).getMonth()) {
                saturdayObj.days[6] = {}; /* Set the last day of the month to an empty object */
            }

            calendar.push(saturdayObj);
            currentDate = addDays(currentDate, 7); /* Move to next Saturday */
        } else {
            currentDate = addDays(currentDate, 1); /* Move to next day */
        }
    }

    /* Check if January ends on a Saturday and add an empty week if needed */
    const lastDayOfJanuary = new Date('2024-01-31');

    if (lastDayOfJanuary.getDay() === 6) { /* Saturday */
        const emptySaturdayObj = {
            week: 6,
            month: 'January', /* Hardcode month as January */
            year: 2024, /* Hardcode year if needed */
            parent_id: '',
            child_id: '',
            child_name: '',
            cost_for_per_hour,
            dates: 'Sat 27 - Fri 2', /* Update the date range as needed */
            total_time_in_week: '0', /* Assuming zero initially */
            days: [
                {}, // Sat 27
                {}, // Sun 28
                {}, // Mon 29
                {}, // Tue 30
                {}, // Wed 31
                {}, // Thu 1
                {}  // Fri 2
            ],
            total_days: 0 /* Count of completed days */
        };
        calendar.push(emptySaturdayObj);
    }

    /* Output the generated calendar */
    return calendar;
}

module.exports = {
    generateCalendar,
}
