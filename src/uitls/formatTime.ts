import { parseISO, differenceInMinutes, differenceInHours, differenceInDays, differenceInWeeks, differenceInYears } from 'date-fns';


export const formatTime = (timestamp:string) => {
  const date = parseISO(timestamp);
  const now = new Date();

  const timeUnits = [
    { unit: 'y', fn: differenceInYears },
    { unit: 'w', fn: differenceInWeeks },
    { unit: 'd', fn: differenceInDays },
    { unit: 'h', fn: differenceInHours },
    { unit: 'm', fn: differenceInMinutes }
  ];

  for (const { unit, fn } of timeUnits) {
    const diff = fn(now, date);
    if (diff > 0) return `${diff}${unit}`;
  }

  return 'just now';
};