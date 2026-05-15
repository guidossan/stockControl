import { Skeleton } from "@/src/components/ui/skeleton";

export default function ProtectedLoading() {
  return (
    <div className="grid gap-4">
      <Skeleton className="h-10 w-52" />
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-72 w-full" />
    </div>
  );
}
