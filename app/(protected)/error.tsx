"use client";

import { Button } from "@/src/components/ui/button";

export default function ProtectedError({
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="rounded-lg border border-red-300 bg-red-50 p-4 text-red-700 dark:border-red-800 dark:bg-red-950/20">
      <p className="font-medium">
        Something went wrong while loading this page.
      </p>
      <Button className="mt-3" variant="outline" onClick={() => reset()}>
        Try again
      </Button>
    </div>
  );
}
