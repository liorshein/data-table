import {
  differenceInHours,
  differenceInMinutes,
  endOfDay,
  format,
  isToday,
  parseISO,
  startOfDay,
} from 'date-fns';
import { DateRange } from 'react-day-picker';

const formatDateUI = (date: string) => {
  try {
    const parsedDate = parseISO(date);
    const formattedDate = format(parsedDate, 'MMM dd, yyyy HH:mm');
    return formattedDate;
  } catch {
    return '';
  }
};

const formatDateApi = (date: Date): string => {
  try {
    // Ensure that 'date' is a valid Date object
    if (!(date instanceof Date) || isNaN(date.getTime())) {
      throw new Error('Invalid Date object');
    }

    return date.toISOString();
  } catch (error) {
    console.error('Error in formatDateApi:', error);
    return '';
  }
};

const formatDateRangeApi = ({ from, to }: DateRange): { from?: string; to?: string } => {
  if (from && (!(from instanceof Date) || isNaN(from.getTime()))) {
    throw new Error('Invalid start Date object');
  }
  if (to && (!(to instanceof Date) || isNaN(to.getTime()))) {
    throw new Error('Invalid end Date object');
  }

  if (from && to && from.getTime() > to.getTime()) {
    throw new Error('Start date must be before end date');
  }

  return {
    from: from ? formatDateApi(startOfDay(from)) : undefined,
    to: to ? formatDateApi(endOfDay(to)) : undefined,
  };
};

const displayDate = (date: string) => {
  const minutes = differenceInMinutes(new Date(), new Date(date));
  const hours = differenceInHours(new Date(), new Date(date));

  if (isToday(new Date(date))) {
    if (minutes < 60) {
      return `${minutes}m`;
    }
    return `${hours}h`;
  }
  return format(new Date(date), 'dd/MM/yyyy');
};

export { displayDate, formatDateApi, formatDateRangeApi, formatDateUI };
