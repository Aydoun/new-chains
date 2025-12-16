import { Skeleton } from "./ui/skeleton";
import { Separator } from "@radix-ui/react-separator";
import { cn } from "@/lib/utils";

export function CollectionSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex w-full max-w-md flex-col gap-3 rounded-xl bg-gray-800/70 p-4",
        className
      )}
      data-testid="collection-skeleton"
    >
      <div className="flex items-start gap-3">
        <Skeleton className="h-20 w-20 rounded-lg" />
        <div className="flex flex-1 flex-col gap-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-full" />
        </div>
      </div>
      <Separator className="bg-gray-700" />
      <div className="h-3 w-28 rounded-md bg-primary/10" />
    </div>
  );
}
