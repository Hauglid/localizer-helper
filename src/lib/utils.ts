import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function flattenJson(
  json: Record<string, unknown>,
  prefix = "",
): Record<string, string> {
  return Object.entries(json).reduce((acc, [key, value]) => {
    const prefixedKey = prefix ? `${prefix}.${key}` : key;
    if (typeof value === "object" && value !== null) {
      return {
        ...acc,
        ...flattenJson(value as Record<string, string>, prefixedKey),
      };
    }
    return { ...acc, [prefixedKey]: value };
  }, {});
}

export function unFlattenJson(json: Record<string, string>) {
  return Object.entries(json).reduce(
    (acc, [key, value]) => {
      const keys = key.split(".");
      const lastKey = keys.pop()!;
      return (keys.reduce((acc, k) => {
        if (!acc[k]) {
          acc[k] = {};
        }
        return acc[k];
      }, acc)[lastKey] = value);
    },
    {} as Record<string, string>,
  );
}

export function sortStrings(a: string, b: string) {
  return a.localeCompare(b);
}
