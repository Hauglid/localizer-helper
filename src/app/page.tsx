"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { sortStrings } from "@/lib/utils";
import { Upload, X } from "lucide-react";
import { useState, type ChangeEvent } from "react";

export default function HomePage() {
  const keys = Object.keys(data).sort(sortStrings);
  const [files, setFiles] = useState<File[]>([]);
  const [locales, setLocales] = useState<string[]>([]);

  function filePickerOnChange(event: ChangeEvent<HTMLInputElement>) {
    const newFiles = Array.from(event.target.files ?? []);

    const newLocales = newFiles
      .map((file) => file.name.split(".")[0] ?? "")
      .filter((locale) => locale !== "");

    setLocales([...locales, ...newLocales]);
    setFiles([...files, ...newFiles]);
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center ">
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
        <div className="flex w-fit flex-col">
          <div>Files:</div>
          {files.map((file) => (
            <div
              className="flex min-w-48 flex-row justify-between border p-2"
              key={`file - ${file.name}`}
            >
              <div>{file.name}</div>
              <X
                size={24}
                onClick={() =>
                  setFiles(files.filter((f) => f.name !== file.name))
                }
              />
            </div>
          ))}
        </div>
        <div className="flex w-full flex-col gap-4">
          <div className="flex flex-row gap-4 ">
            <div className="flex-1 pl-4">
              <Label className="border-b border-black">Key</Label>
            </div>
            {files.map((file) => (
              <div key={file.name} className="flex-[2] pl-4">
                <Label className="border-b border-black">{file.name}</Label>
              </div>
            ))}
          </div>
          {keys.map((key) => (
            <div key={key} className="flex flex-row gap-4 border-b  pb-4">
              <Textarea
                className="min-h-0 flex-1"
                rows={2}
                id={key}
                readOnly
                value={key}
              />
              {Object.entries(data[key] as Record<string, string>).map(
                ([locale, value]) => (
                  <Textarea
                    key={`${key}-${locale}`}
                    className="min-h-0 flex-[2]"
                    rows={2}
                    id={locale}
                    readOnly
                    value={value}
                  />
                ),
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

const data = {
  discount: {
    no: "Rabatt",
    en: "Discount",
    fi: "Alennus",
  },
  total: {
    no: "Totalt",
    en: "Total",
    fi: "Yhteensä",
  },
  subtotal: {
    no: "Delsum",
    en: "Subtotal",
    fi: "Välisumma",
  },
};
