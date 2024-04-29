import { type ClassValue, clsx } from "clsx";
import { toast } from "sonner";
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

// Function to unflatten a flattened JSON object
export function unFlattenJson(
  keys: Set<string>, // Set of keys representing the flattened structure
  data: Record<string, unknown>, // Flattened JSON data
) {
  // Initialize the result object
  const result: Record<string, unknown> = {};

  // Iterate through each key
  for (const basekey of keys) {
    // Start with the result object
    let currentObj: Record<string, unknown> = result;
    // Split the key by dot to get nested keys
    const keyArr = basekey.split(".");

    // Iterate through each nested key
    for (const key of keyArr) {
      // If it's the last key
      // Assign the value from the flattened data
      if (key === keyArr[keyArr.length - 1]) {
        currentObj[key] = data[basekey] ?? "";
      } else {
        // Create an empty object if the key doesn't exist
        currentObj[key] = currentObj[key] || {};
        // Move to the next nested object
        currentObj = currentObj[key] as Record<string, unknown>;
      }
    }
  }

  return result; // Return the unflattened JSON object
}

export function sortStrings(a: string, b: string) {
  return a.localeCompare(b);
}

export async function readFile(file: File) {
  const reader = new FileReader();

  // Create a new promise
  return new Promise<[string[], Record<string, Record<string, string>>]>(
    (resolve) => {
      // Resolve the promise after reading file
      reader.onload = () => {
        try {
          const locale = file.name.split(".")[0]!;
          const content = reader.result as string;

          const json = JSON.parse(content) as Record<string, unknown>;
          const flattenedJson = flattenJson(json);

          const keys = Object.keys(flattenedJson);

          return resolve([keys, { [locale]: flattenedJson }]);
        } catch (e) {
          toast.error(`Error parsing "${file.name}": \n${e}`);
          return resolve([[], {}]);
        }
      };

      // Read the file as a text
      reader.readAsText(file);
    },
  );
}

export async function readFiles(files: File[]) {
  try {
    const filePromiseList = files.map((file) => {
      return readFile(file);
    });

    // At this point you'll have an array of results
    return Promise.all(filePromiseList);
  } catch (error) {
    console.error("satans puler error reading files: ", error);
    return [];
  }
}
