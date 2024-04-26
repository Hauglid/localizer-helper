"use client";

import { AddKeyForm } from "@/components/add-key-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn, readFiles, sortStrings, unFlattenJson } from "@/lib/utils";
import { Download, Upload } from "lucide-react";
import { useState, type ChangeEvent, type FormEvent } from "react";

export default function HomePage() {
  const [keys, setKeys] = useState<Set<string>>(new Set());
  const [translations, setTranslations] = useState<
    Record<string, Record<string, string>>
  >({});

  async function filePickerOnChange(event: ChangeEvent<HTMLInputElement>) {
    const resultFromFiles = await readFiles(
      Array.from(event.target.files ?? []),
    );

    // Extract keys from the results
    const newKeySet = resultFromFiles
      .flatMap(([keys]) => keys)
      .sort(sortStrings);

    const newTranslations = resultFromFiles
      .map(([, translations]) => translations)
      .reduce((acc, curr) => ({ ...acc, ...curr }), {});

    addkeys(newKeySet);
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
    data: Record<string, string>,
    filename: string,
  ) {
    const expandedJson = unFlattenJson(keys, data);
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
    Object.entries(translations).forEach(([locale, translation]) => {
      JSONToFile(keys, translation, locale);
    });
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-start ">
      <div className="flex w-full flex-col gap-10 p-10">
        {/* Add file section */}
        <div className="flex flex-row gap-10">
          <div>
            <Label
              className="flex w-fit flex-row items-center gap-4 border p-2"
              htmlFor="file"
            >
              <div>Add new locale file</div>
              <Upload size={24} />
            </Label>
            <Input
              id="file"
              multiple
              defaultValue={""}
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
        <AddKeyForm callback={addkeys} />
        <div className="flex w-full flex-col gap-4">
          <div className="flex flex-row gap-4 ">
            <div className="flex-1 pl-4">
              <Label className="border-b border-black">Key</Label>
            </div>
            {Object.keys(translations).map((locale) => (
              <div key={locale} className="flex-[2] pl-4">
                <Label className="border-b border-black">{locale}</Label>
              </div>
            ))}
          </div>
          {[...keys].map((key) => (
            <div key={key} className="flex flex-row gap-4 border-b  pb-4">
              <Textarea
                className="min-h-0 flex-1"
                rows={2}
                id={key}
                readOnly
                value={key}
              />

              {Object.keys(translations).map((locale) => {
                const value = translations?.[locale]?.[key];
                return (
                  <Textarea
                    key={`${key}-${locale}`}
                    className={cn(
                      "min-h-0 flex-[2]",
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
          ))}
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
