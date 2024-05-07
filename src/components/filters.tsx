import { useState } from "react";
import { Checkbox } from "./ui/checkbox";
import { Label } from "@radix-ui/react-label";

export function Filters({
  callback,
}: {
  callback: (onlyMissingValues: boolean) => void;
}) {
  const [checked, setChecked] = useState(false);

  function onCheckedChange(checked: boolean) {
    setChecked(checked);
    callback(checked);
  }

  return (
    <div>
      <div>Filters</div>
      <div className="flex flex-row items-center gap-4 rounded border p-2">
        <Checkbox
          id="id1"
          checked={checked}
          onCheckedChange={onCheckedChange}
        />
        <Label htmlFor="id1">Only missing values</Label>
      </div>
    </div>
  );
}
