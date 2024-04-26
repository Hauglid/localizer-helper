"use client";

import { Button } from "@/components/ui/button";
import { Shell } from "lucide-react";
import { useFormContext } from "react-hook-form";

export function FormSubmitButton({
  title,
  disabled,
}: {
  title: string;
  disabled?: boolean;
}) {
  const formContext = useFormContext();
  const isLoading = formContext.formState.isSubmitting;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-end p-4 px-8">
        <Shell className={"animate-spin"} />
      </div>
    );
  } else {
    return (
      <div className="flex flex-col justify-end">
        <Button disabled={disabled} type="submit">
          {title}
        </Button>
      </div>
    );
  }
}
