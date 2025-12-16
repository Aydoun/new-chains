import Image from "next/image";
import { cn } from "@/lib/utils";

export interface CollectionCardProps {
  title: string;
  description: string;
  imageSrc: string;
  className?: string;
}

export function CollectionCard({
  title,
  description,
  imageSrc,
  className,
}: CollectionCardProps) {
  return (
    <article
      className={cn(
        "flex flex-col gap-3 rounded-lg border border-border bg-gray-800 p-4 shadow-sm",
        className
      )}
    >
      <div className="overflow-hidden rounded-md border border-border">
        <Image
          alt={title}
          src={imageSrc}
          width={640}
          height={360}
          className="h-48 w-full object-cover"
        />
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-semibold leading-tight text-white">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {description}
        </p>
      </div>
    </article>
  );
}
