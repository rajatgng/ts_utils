import {
  addDays,
  addMonths,
  addWeeks,
  addYears,
  differenceInDays,
  format,
  isToday,
  isValid,
  isWithinInterval,
  isYesterday,
  set,
  subDays,
} from "date-fns";

export const getEndDate = (
  durationType: any,
  duration: number,
  startDate: any
) => {
  let endDate: any;
  switch (durationType) {
    case "days":
      endDate = subDays(addDays(new Date(startDate), duration), 1);
      break;
    case "weeks":
      endDate = subDays(addWeeks(new Date(startDate), duration), 1);
      break;
    case "months":
      endDate = subDays(addMonths(new Date(startDate), duration), 1);
      break;

    case "year":
      endDate = subDays(addYears(new Date(startDate), duration), 1);
      break;
    default:
      endDate = subDays(addDays(new Date(startDate), duration), 1);
  }

  return endDate;
};

export const convertTimeToDate = (time: string) => {
  if (!time || typeof time !== "string") return "";
  let [hours, minutes, seconds] = time.split(":").map(Number);
  let value = set(new Date(), { hours, minutes, seconds });
  return value;
};

export const convertDateToTime = (date: any) => {
  if (!date) return "";
  let value = format(new Date(date), "HH:mm:ss");
  return value;
};

export const convertTimeToMeridian = (time: string) => {
  if (!time || typeof time !== "string") return "";
  let [hours, minutes, seconds] = time.split(":").map(Number);
  let value = set(new Date(), { hours, minutes, seconds });
  return format(new Date(value), "h:mm a");
};

export const getIntervalText = (startDate: any, endDate: any) => {
  let totalDays = differenceInDays(
    addDays(new Date(endDate), 1),
    new Date(startDate)
  );

  let weeks = Math.floor(totalDays / 7);
  let days = Math.floor(totalDays % 7);

  let weeksText = weeks > 1 ? "weeks" : "week";
  let daysText = days > 1 ? "days" : "day";

  if (weeks && !days) {
    return `${weeks} ${weeksText}`;
  }

  if (!weeks && days) {
    return `${days} ${daysText}`;
  }

  return `${weeks} ${weeksText}, ${days} ${daysText}`;
};

export function sortDate<T = any>(
  arr: T[],
  key: string,
  descending?: boolean
): T[] {
  const newArr = arr?.slice();
  return newArr.sort((a: any, b: any) => {
    const d1 = new Date(a[key]).getTime();
    const d2 = new Date(b[key]).getTime();
    return descending ? d2 - d1 : d1 - d2;
  });
}

export function getDateMinTime(date: string): Date {
  const modDate = new Date(date);
  modDate.setHours(0, 0, 0, 0);
  return modDate;
}

export function getDateMaxTime(date: string): Date {
  const modDate = new Date(date);
  modDate.setHours(23, 59, 59, 999);
  return modDate;
}

export function isWithinMinMaxIntervalDate(
  date: string,
  startDate?: string,
  endDate?: string
): boolean {
  return isWithinInterval(new Date(date), {
    start: startDate ? getDateMinTime(startDate) : new Date(-8640000000000000),
    end: endDate ? getDateMaxTime(endDate) : new Date(8640000000000000),
  });
}

export const convertTime12to24 = (time12h: string) => {
  const [time, modifier] = time12h.split(" ");
  let [hours, minutes] = time.split(":");

  if (hours === "12") {
    hours = "00";
  }

  if (modifier === "pm") {
    hours = (parseInt(hours, 10) + 12).toString();
  }

  return `${hours}:${minutes}:00`;
};

export function getRelativeDate(date: string | Date) {
  const d = typeof date === "string" ? new Date(date) : date;

  if (!isValid(d)) {
    return "Invalid date";
  }

  if (isToday(d)) {
    return `Today, ${format(d, "h:mm a")}`;
  }

  if (isYesterday(d)) {
    return `Yesterday, ${format(d, "h:mm a")}`;
  }

  return format(d, "d MMM yyyy, h:mm a");
}
