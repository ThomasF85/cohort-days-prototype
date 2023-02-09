const DAYS_PER_COHORT = 60;

const isWeekday = (date) => date.getUTCDay() !== 0 && date.getUTCDay() !== 6;

const publicHolidaysCache = {};

// TODO: Add cohort breaks to model and replace dummy implementation
function isWinterBreak(date) {
  if (date.getUTCMonth() === 11 && date.getUTCDate() >= 23) {
    return true;
  }
  if (date.getUTCMonth() === 0 && date.getUTCDate() <= 3) {
    return true;
  }
  return false;
}

async function isPublicHoliday(date, federalState) {
  if (!publicHolidaysCache[federalState]?.[date.getUTCFullYear()]) {
    const publicHolidays = await fetch(
      `https://feiertage-api.de/api/?jahr=${date.getUTCFullYear()}&nur_land=${federalState}`
    ).then((res) => res.json());
    publicHolidaysCache[federalState] = publicHolidaysCache[federalState] || {};
    publicHolidaysCache[federalState][date.getUTCFullYear()] = Object.values(
      publicHolidays
    ).map((holiday) => {
      const date = holiday.datum.split("-").map((date) => parseInt(date));
      return new Date(Date.UTC(date[0], date[1] - 1, date[2]));
    });
  }
  return publicHolidaysCache[federalState][date.getUTCFullYear()].some(
    (holiday) => holiday.getTime() === date.getTime()
  );
}

export async function getCohortDays(startDate, federalState) {
  const days = [];
  const day = startDate;
  while (days.length < DAYS_PER_COHORT) {
    if (
      isWeekday(day) &&
      !isWinterBreak(day) &&
      !(await isPublicHoliday(day, federalState))
    ) {
      days.push(new Date(day));
    }
    day.setUTCDate(day.getUTCDate() + 1);
  }
  return days;
}
