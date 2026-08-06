export const isLeapYear = (year: number): boolean => {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
};

export const getDaysInMonth = (year: number, month: number): number => {
  return new Date(year, month + 1, 0).getDate();
};

export const formatTwoDigits = (num: number): string => {
  return num < 10 ? `0${String(num)}` : String(num);
};

export const parseYMD = (ymdString: string): Date => {
  if (!ymdString) return new Date();
  const parts = ymdString.split('-').map(Number);
  if (parts.length < 3 || parts.some(isNaN)) return new Date();
  return new Date(parts[0], parts[1] - 1, parts[2], 0, 0, 0, 0);
};

export const formatYMD = (date: Date): string => {
  if (isNaN(date.getTime())) return new Date().toISOString().split('T')[0];
  const yyyy = String(date.getFullYear());
  const mm = formatTwoDigits(date.getMonth() + 1);
  const dd = formatTwoDigits(date.getDate());
  return `${yyyy}-${mm}-${dd}`;
};

export const parseISODate = (isoString: string): Date => {
  return new Date(isoString);
};

export const toISODateString = (date: Date): string => {
  return formatYMD(date);
};

export const formatTimeString = (date: Date, includeSeconds = false): string => {
  const hours = formatTwoDigits(date.getHours());
  const minutes = formatTwoDigits(date.getMinutes());
  if (includeSeconds) {
    const seconds = formatTwoDigits(date.getSeconds());
    return `${hours}:${minutes}:${seconds}`;
  }
  return `${hours}:${minutes}`;
};

export const format12HourTime = (date: Date): string => {
  let hours = date.getHours();
  const minutes = formatTwoDigits(date.getMinutes());
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // convert 0 to 12
  return `${String(hours)}:${minutes} ${ampm}`;
};

export const isSameDay = (d1: Date, d2: Date): boolean => {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
};

export const isToday = (date: Date): boolean => {
  return isSameDay(date, new Date());
};

export const getStartOfWeek = (date: Date, startOnMonday = false): Date => {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0);
  const day = d.getDay();
  const diff = d.getDate() - day + (startOnMonday ? (day === 0 ? -6 : 1) : 0);
  d.setDate(diff);
  return d;
};

export const getEndOfWeek = (date: Date, startOnMonday = false): Date => {
  const start = getStartOfWeek(date, startOnMonday);
  const end = new Date(start.getFullYear(), start.getMonth(), start.getDate() + 6, 23, 59, 59, 999);
  return end;
};

export const getMonthGrid = (year: number, month: number, startOnMonday = false): Date[][] => {
  const firstDayOfMonth = new Date(year, month, 1);
  const startDay = getStartOfWeek(firstDayOfMonth, startOnMonday);

  const grid: Date[][] = [];
  const currentDay = new Date(startDay);

  for (let week = 0; week < 6; week++) {
    const weekDays: Date[] = [];
    for (let day = 0; day < 7; day++) {
      weekDays.push(new Date(currentDay));
      currentDay.setDate(currentDay.getDate() + 1);
    }
    grid.push(weekDays);
    if (currentDay.getMonth() !== month && week >= 4) {
      break;
    }
  }

  return grid;
};

export const addMinutes = (date: Date, minutes: number): Date => {
  const result = new Date(date);
  result.setMinutes(result.getMinutes() + minutes);
  return result;
};

export const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

export const getDifferenceInMinutes = (start: Date, end: Date): number => {
  return Math.round((end.getTime() - start.getTime()) / (1000 * 60));
};
