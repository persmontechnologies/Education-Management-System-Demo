
export const formatYYYYMMDD = (date: Date): string => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const formatMonthDayYear = (date: Date): string => {
    const options: Intl.DateTimeFormatOptions = { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' };
    return new Intl.DateTimeFormat('en-US', options).format(date);
};

export const formatFullDate = (date: Date): string => {
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' };
    return new Intl.DateTimeFormat('en-US', options).format(date);
};
