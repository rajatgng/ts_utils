import { Dictionary } from "constants/types";
import { format } from "date-fns";
import { updatedDiff } from "deep-object-diff";

export function getSelectedKeys(obj: any, keysToKeep: string[]): any {
  return Object.fromEntries(keysToKeep.map((key) => [key, obj[key]]));
}

export const filterSelectedKeys = <T = any>(
  arr: T[],
  keysToKeep: string[]
): T[] => {
  return arr.map((item) => getSelectedKeys(item, keysToKeep));
};

export const debounce = (fn: Function, ms = 300) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  return function (this: any, ...args: any[]) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), ms);
  };
};

export function getAverageBy(
  data: any[] | null | undefined,
  key: string,
  fractionalDigit = 2
): number {
  if (!data?.length) {
    return 0;
  }

  return +(
    data.reduce((acc: number, ele: any) => acc + ele[key], 0) / data.length
  ).toFixed(fractionalDigit);
}

export const logger = {
  logDev: (data: any) => {
    if (process.env.NODE_ENV === "development") {
      console.log(data);
    }
  },
};

export function sortBy<T = any>(
  arr: T[],
  key: string,
  descending?: boolean,
  shallowClone?: boolean
): T[] {
  const newArr: any[] = !shallowClone
    ? JSON.parse(JSON.stringify(arr))
    : [...arr];

  const multiplier = !descending ? 1 : -1;

  const sorter = function (a: any, b: any) {
    if (a[key] === b[key])
      // identical? return 0
      return 0;
    else if (a[key] === null)
      // a is null? last
      return 1;
    else if (b[key] === null)
      // b is null? last
      return -1;
    // compare, negate if descending
    else return a[key].toString().localeCompare(b[key].toString()) * multiplier;
  };

  return newArr.sort(sorter);
}

export function falseSafeParseInt(value?: string): number {
  return value && !!parseInt(value) ? parseInt(value) : 0;
}

export function falseSafeParseFloat(value?: string): number {
  return value && !!parseFloat(value) ? parseFloat(value) : 0;
}

export function toFixedIfDecimal(value: number, precision: number = 2) {
  if (!isNaN(value) && value.toString().includes(".")) {
    const v = value.toFixed(precision);
    return (Math.round(+v) === +v ? Math.round(+v) : v).toString();
  }

  return !isNaN(value) ? value.toString() : "--";
}

export const isMobile = (() => {
  if (
    typeof navigator === "undefined" ||
    typeof navigator.userAgent !== "string"
  ) {
    return false;
  }
  return /Mobile/.test(navigator.userAgent);
})();

export async function getDeviceInfo() {
  const devices = await navigator.mediaDevices.enumerateDevices();

  return {
    audioInputDevices: devices.filter((device) => device.kind === "audioinput"),
    videoInputDevices: devices.filter((device) => device.kind === "videoinput"),
    audioOutputDevices: devices.filter(
      (device) => device.kind === "audiooutput"
    ),
    hasAudioInputDevices: devices.some(
      (device) => device.kind === "audioinput"
    ),
    hasVideoInputDevices: devices.some(
      (device) => device.kind === "videoinput"
    ),
  };
}

// This function will return 'true' when the specified permission has been denied by the user.
// If the API doesn't exist, or the query function returns an error, 'false' will be returned.
export async function isPermissionDenied(name: "camera" | "microphone") {
  if (navigator.permissions) {
    try {
      const result = await navigator.permissions.query({ name } as any);
      return result.state === "denied";
    } catch {
      return false;
    }
  } else {
    return false;
  }
}

export function getNumberArray(n: number) {
  return Array(n)
    .fill(0)
    .map((_, i) => i + 1);
}

export function getUniqueArray<T = any>(array: T[], key: string) {
  return Array.from(
    new Map(array.map((item: any) => [item[key], item])).values()
  );
}

export function getDiffArray<T = any>(arr1: T[], arr2: T[], key?: keyof T) {
  if (key) {
    return arr1.filter((x) => !arr2.find((i) => i[key] === x[key]));
  }

  return arr1.filter((x) => !arr2.includes(x));
}

export function getIntersectionArray<T = any>(
  arr1: T[],
  arr2: T[],
  key?: keyof T
) {
  if (key) {
    return arr1.filter((x) => arr2.find((i) => i[key] === x[key]));
  }

  return arr1.filter((x) => arr2.includes(x));
}

// works for one level object nesting
export const getDetailedArrayDiff = <T = any>(
  oldArr: T[],
  newArr: T[],
  key?: keyof T
) => {
  const removed = getDiffArray(oldArr, newArr, key);
  const added = getDiffArray(newArr, oldArr, key);
  const retained = {
    old: key
      ? sortBy(getIntersectionArray(oldArr, newArr, key), key as string)
      : getIntersectionArray(oldArr, newArr)
          .map((i) => (i as unknown as string | number).toString())
          .sort(),
    new: key
      ? sortBy(getIntersectionArray(newArr, oldArr, key), key as string)
      : getIntersectionArray(newArr, oldArr, key)
          .map((i) => (i as unknown as string | number).toString())
          .sort(),
  };
  const uDiff: Dictionary = updatedDiff(retained.old, retained.new);
  const updated = Object.keys(uDiff).map((i) => ({
    from: retained.old[+i],
    to: retained.new[+i],
    keysUpdated: Object.keys(uDiff[i]),
  }));

  return {
    added,
    removed,
    updated,
  };
};

export function getDisplayValue(
  value?: string | null | number,
  type: "string" | "date" = "string"
) {
  if (type === "date" && value) {
    return format(new Date(value), "dd MMM, yyyy");
  }

  if (value || value === 0) {
    return value.toString();
  }

  return "---";
}
