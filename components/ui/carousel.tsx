"use client";

import { translate } from "@/lib/i18n";
import { Button } from "./button";
import { cn } from "@/lib/utils";

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
  currentIndex: number;
  onNext: () => void;
  onPrevious: () => void;
}

export function Carousel({
  frames,
  className,
  currentIndex: currentIndexProp,
  onNext,
  onPrevious,
}: CarouselProps) {
  const frameCount = frames.length;
  const currentMaxIndex = Math.max(currentIndexProp, 0);

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

      <div className="flex items-center justify-between gap-2">
        <Button
          disabled={currentMaxIndex === 0}
          type="button"
          variant="secondary"
          onClick={onPrevious}
        >
          {translate("common.previous")}
        </Button>
        <span className="text-sm text-muted-foreground">
          {translate("frame.self")} {currentMaxIndex + 1} of {frameCount}
        </span>
        <Button type="button" variant="secondary" onClick={onNext}>
          {translate("common.next")}
        </Button>
      </div>
    </div>
  );
}
