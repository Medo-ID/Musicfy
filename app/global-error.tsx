"use client";

import { Box } from "@/components/ui/Box";
import { Button } from "@/components/ui/Button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <Box classname="h-full flex flex-col gap-4 items-center justify-center">
          <h2 className="text-neutral-200 text-xl font-semibold">
            Something went wrong!
          </h2>
          <Button className="max-w-md" onClick={() => reset()}>
            Try again
          </Button>
        </Box>
      </body>
    </html>
  );
}
