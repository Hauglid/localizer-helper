"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { readFiles, sortStrings } from "@/lib/utils";
import { Upload } from "lucide-react";
import { useState, type ChangeEvent } from "react";

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

    setKeys((keys) => new Set([...keys, ...newKeySet]));
    setTranslations((translations) => ({
      ...translations,
      ...newTranslations,
    }));
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-start ">
      <div className="flex w-full flex-col gap-10 p-10">
        {/* Add file section */}
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
            type="file"
            className="hidden"
            onChange={filePickerOnChange}
          />
        </div>
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
                return (
                  <Textarea
                    key={`${key}-${locale}`}
                    className="min-h-0 flex-[2]"
                    rows={1}
                    value={translations?.[locale]?.[key] ?? ""}
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
