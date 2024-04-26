"use client";

import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
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
      <div className="flex flex-col items-center justify-center p-4 px-8">
        <Loader className={"animate-spin"} />
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
