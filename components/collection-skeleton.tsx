import { cn } from "@/lib/utils";

import { Skeleton } from "./ui/skeleton";

interface CollectionSkeletonProps {
  className?: string;
}

export function CollectionSkeleton({
  className,
}: CollectionSkeletonProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-lg border border-border bg-gray-800 p-4",
        className
      )}
      data-testid="collection-skeleton"
    >
      <Skeleton className="h-48 w-full" />

      <div className="space-y-2">
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>
    </div>
  );
}
