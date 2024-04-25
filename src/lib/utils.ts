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

export function unFlattenJson(
  keys: Set<string>,
  data: Record<string, unknown>,
) {
  const result: Record<string, unknown> = {};

  for (const basekey of keys.values()) {
    const keys = basekey.split(".");
    keys.reduce((res, key, i) => {
      return (res[key] =
        keys.length === i + 1 ? data[basekey] ?? "" : res[key] || {});
    }, result);
  }

  return result;
}

export function sortStrings(a: string, b: string) {
  return a.localeCompare(b);
}

export async function readFiles(files: File[]) {
  const filePromiseList = Array.from(files ?? []).map((file) => {
    // Define a new file reader
    const reader = new FileReader();

    // Create a new promise
    return new Promise<[string[], Record<string, Record<string, string>>]>(
      (resolve) => {
        // Resolve the promise after reading file
        reader.onload = () => {
          const locale = file.name.split(".")[0]!;

          const content = reader.result as string;
          const json = JSON.parse(content) as Record<string, unknown>;
          const flattenedJson = flattenJson(json);
          const keys = Object.keys(flattenedJson);
          return resolve([keys, { [locale]: flattenedJson }]);
        };

        // Read the file as a text
        reader.readAsText(file);
      },
    );
  });

  // At this point you'll have an array of results
  return Promise.all(filePromiseList);
}
