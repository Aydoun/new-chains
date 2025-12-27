"use client";

import { useEffect } from "react";
import { cn } from "@/lib/utils";
import { CircleArrowRight, CircleArrowLeft } from "lucide-react";
import { translate } from "@/lib/i18n";
import { Button } from "@radix-ui/themes";

interface CarouselFrameProps {
  className?: string;
  children: React.ReactNode;
}

export function CarouselFrame({ className, children }: CarouselFrameProps) {
  return (
    <div
      className={cn(
        "flex h-48 w-full items-center justify-center rounded-lg bg-[#6f4e37] text-center text-black font-[400]",
        className
      )}
    >
      {children}
    </div>
  );
}

interface CarouselProps {
  frames: React.ReactNode[];
  className?: string;
  isEditMode?: boolean;
  currentIndex: number;
  onNext: () => void;
  onPrevious: () => void;
}

export function Carousel({
  frames,
  className,
  isEditMode,
  currentIndex: currentIndexProp,
  onNext,
  onPrevious,
}: CarouselProps) {
  const frameCount = frames.length;
  const currentMaxIndex = Math.max(currentIndexProp, 0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        onPrevious();
      }

      if (e.key === "ArrowRight") {
        onNext();
      }
    };

    if (!isEditMode) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onPrevious, onNext]);

  if (frameCount === 0) return null;

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <div className="overflow-hidden rounded-lg border border-border shadow-sm">
        <div
          className="flex items-center justify-center p-6"
          aria-live="polite"
        >
          <CarouselFrame>{frames[currentMaxIndex]}</CarouselFrame>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 px-6">
        <Button
          disabled={currentMaxIndex === 0}
          type="button"
          // variant="secondary"
          onClick={onPrevious}
        >
          <CircleArrowLeft />
        </Button>
        <span className="text-sm text-muted-foreground">
          {translate("carousel.progress", {
            current: currentMaxIndex + 1,
            total: frameCount,
          })}
        </span>
        <Button type="button" onClick={onNext}>
          <CircleArrowRight />
        </Button>
      </div>
    </div>
  );
}
