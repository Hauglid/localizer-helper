"use client";

import { AddKeyForm } from "@/components/add-key-form";
import { Filters } from "@/components/filters";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn, readFiles, sortStrings, unFlattenJson } from "@/lib/utils";
import { Download, X } from "lucide-react";
import { useState, type ChangeEvent } from "react";
import { toast } from "sonner";

export default function HomePage() {
  const [onlyMissingValues, setOnlyMissingValues] = useState(false);

  const [keys, setKeys] = useState<Set<string>>(new Set());
  const [translations, setTranslations] = useState<
    Record<string, Record<string, string>>
  >({});

  async function filePickerOnChange(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);

    const resultFromFiles = await readFiles(files);

    // Extract keys from the results
    const newKeySet = resultFromFiles
      .flatMap(([keys]) => keys)
      .sort(sortStrings);

    const newTranslations = resultFromFiles
      .map(([, translations]) => translations)
      .reduce((acc, curr) => ({ ...acc, ...curr }), {});

    addkeys(newKeySet);
    addTranslations(newTranslations);
  }

  function addTranslations(
    newTranslations: Record<string, Record<string, string>>,
  ) {
    setTranslations((translations) => ({
      ...translations,
      ...newTranslations,
    }));
  }

  function addkeys(newKeys: string[]) {
    setKeys((keys) => new Set([...keys, ...newKeys].sort(sortStrings)));
  }

  function JSONToFile(
    keys: Set<string>,
    translations: Record<string, string>,
    filename: string,
  ) {
    const expandedJson = unFlattenJson(keys, translations);
    const blob = new Blob([JSON.stringify(expandedJson, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${filename}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function exportFiles() {
    if (Object.keys(translations).length === 0) {
      toast.error("No translations to export");
      return;
    }

    Object.entries(translations).forEach(([locale, translation]) => {
      JSONToFile(keys, translation, locale);
    });
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-start ">
      <div className="flex w-full flex-col gap-10 p-10">
        {/* Add file section */}
        <div className="flex flex-row justify-between gap-10">
          <div>
            <Input
              id="file"
              multiple
              type="file"
              onChange={filePickerOnChange}
            />
          </div>
          <div>
            <Button
              variant={"secondary"}
              className="flex w-fit flex-row items-center gap-4 border p-2"
              onClick={exportFiles}
            >
              <div>Export files</div>
              <Download size={24} />
            </Button>
          </div>
        </div>
        <div className="flex flex-row gap-10">
          <AddKeyForm callback={addkeys} />
          <Filters callback={setOnlyMissingValues} />
        </div>
        <div className="flex w-full flex-col gap-4">
          {/* Header */}
          <div className="flex flex-row gap-4 ">
            <div className="min-w-56 flex-1 ">
              <Label className="border-b border-black">Key</Label>
            </div>
            {Object.keys(translations).map((locale) => (
              <div key={locale} className="min-w-56 flex-[2] pl-4">
                <Label className="border-b border-black">{locale}</Label>
              </div>
            ))}
          </div>

          {[...keys].map((key) => {
            const values: string[] = [];

            Object.keys(translations).forEach((locale) => {
              const value = translations?.[locale]?.[key];
              if (value) {
                values.push(value);
              }
            });
            if (
              onlyMissingValues &&
              values.length === Object.keys(translations).length
            ) {
              return null;
            }

            return (
              <div
                key={key}
                className="flex flex-row items-center gap-4 border-b  pb-4"
              >
                <div className="flex flex-row items-center gap-4">
                  <X
                    className="cursor-pointer "
                    onClick={() => {
                      const newKeys = new Set(keys);
                      newKeys.delete(key);
                      setKeys(newKeys);
                    }}
                  />
                  <Textarea
                    className="min-h-0 min-w-56 flex-1"
                    rows={1}
                    id={key}
                    value={key}
                    readOnly
                  />
                </div>

                {Object.keys(translations).map((locale) => {
                  const value = translations?.[locale]?.[key];
                  return (
                    <Textarea
                      key={`${key}-${locale}`}
                      className={cn(
                        "min-h-0 min-w-56 flex-[2]",
                        value ? "" : "border-2 border-red-500",
                      )}
                      rows={1}
                      value={value ?? ""}
                      onChange={(e) => {
                        const newTranslations = { ...translations };
                        newTranslations[locale]![key] = e.target.value;
                        setTranslations(newTranslations);
                      }}
                    />
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}

// const data = {
//   en: {
//     discount: "Discount",
//     total: "Total",
//     subtotal: "Subtotal",
//   },
//   fi: {
//     discount: "Alennus",
//     total: "Yhteensä",
//     subtotal: "Välisumma",
//   },
//   no: {
//     discount: "Rabatt",
//     total: "Totalt",
//     subtotal: "Delsum",
//   },
// };
