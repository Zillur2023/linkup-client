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

export const formatLastActive = (timestamp: number) => {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);

  if (seconds < 60) return "Active now";
  if (seconds < 3600) return `Active ${Math.floor(seconds / 60)} min ago`;
  if (seconds < 86400) return `Active ${Math.floor(seconds / 3600)} hours ago`;
  if (seconds < 2592000)
    return `Active ${Math.floor(seconds / 86400)} days ago`;
  if (seconds < 31536000)
    return `Active ${Math.floor(seconds / 2592000)} months ago`;
  return `Active ${Math.floor(seconds / 31536000)} years ago`;
};

export const formatLastSentMessage = (timestamp: string): string => {
  const date = new Date(timestamp).getTime();
  const now = Date.now();

  if (isNaN(date)) return "Invalid date";

  const seconds = Math.floor((now - date) / 1000);

  if (seconds < 60) return "just now";

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} h ago`;

  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} d ago`;

  const months = Math.floor(days / 30);
  if (months < 12) return `${months} mo ago`;

  const years = Math.floor(months / 12);
  return `${years} y ago`;
};
