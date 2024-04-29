"use client";

import * as Sentry from "@sentry/nextjs";
import Error from "next/error";
import { useEffect } from "react";
import { toast } from "sonner";

export default function GlobalError(props: { error: unknown }) {
  useEffect(() => {
    Sentry.captureException(props.error);
    toast.error("An error occurred. Please try again later.");
  }, [props.error]);

  return (
    <html>
      <body>
        <Error statusCode={500} title="Error" />
      </body>
    </html>
  );
}
