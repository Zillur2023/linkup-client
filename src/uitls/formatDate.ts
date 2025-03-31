import {
  format,
  parseISO,
  differenceInMinutes,
  differenceInHours,
  differenceInDays,
  differenceInWeeks,
  differenceInYears,
} from "date-fns";

export const formatCommentDate = (timestamp: string) => {
  const date = parseISO(timestamp);
  const now = new Date();

  const timeUnits = [
    { unit: "y", fn: differenceInYears },
    { unit: "w", fn: differenceInWeeks },
    { unit: "d", fn: differenceInDays },
    { unit: "h", fn: differenceInHours },
    { unit: "m", fn: differenceInMinutes },
  ];

  for (const { unit, fn } of timeUnits) {
    const diff = fn(now, date);
    if (diff > 0) return `${diff}${unit}`;
  }

  return "just now";
};

export const formatPostDate = (timestamp: string) => {
  const date = parseISO(timestamp);
  const now = new Date();

  const minutesDiff = differenceInMinutes(now, date);
  const hoursDiff = differenceInHours(now, date);
  const daysDiff = differenceInDays(now, date);

  if (daysDiff < 1) {
    if (minutesDiff < 60) return `${minutesDiff} min `;

    return `${hoursDiff} hr `;
  } else if (daysDiff === 1) {
    return format(date, "'Yesterday at' h:mm ");
  } else {
    return format(date, "MMMM d 'at' h:mm ");
  }
};

export const formatPostTooltipDate = (timestamp: string) => {
  const date = parseISO(timestamp);
  return format(date, "EEEE, MMMM dd, yyyy 'at' hh:mm ");
};

export const formatChatTooltipDate = (timestamp: string) => {
  const date = parseISO(timestamp);
  const now = new Date();

  const minutesDiff = differenceInMinutes(now, date);
  const hoursDiff = differenceInHours(now, date);
  const daysDiff = differenceInDays(now, date);

  if (daysDiff < 1) {
    if (minutesDiff < 60) return `${minutesDiff} min`;
    return `${hoursDiff} hr`;
  } else if (daysDiff < 4) {
    return format(date, "EEEE h:mm "); // Friday 10:23 AM
  } else {
    return format(date, "MMMM d, yyyy, h:mm "); // April 22, 2025, 10:23 AM
  }
};
