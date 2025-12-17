"use client";

import * as React from "react";
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
  currentIndex?: number;
  onNext?: () => void;
  onPrevious?: () => void;
}

export function Carousel({
  frames,
  className,
  currentIndex: currentIndexProp,
  onNext,
  onPrevious,
}: CarouselProps) {
  const frameCount = frames.length;
  const [internalIndex, setInternalIndex] = React.useState(0);
  const currentMaxIndex = Math.max(currentIndexProp ?? internalIndex, 0) %
    frameCount;

  if (frameCount === 0) return null;

  const handleNext = () => {
    if (onNext) {
      onNext();
      return;
    }

    setInternalIndex((previous) => (previous + 1) % frameCount);
  };

  const handlePrevious = () => {
    if (onPrevious) {
      onPrevious();
      return;
    }

    setInternalIndex((previous) =>
      previous === 0 ? frameCount - 1 : previous - 1
    );
  };

  const isPreviousDisabled = onPrevious ? currentMaxIndex === 0 : false;

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
          disabled={isPreviousDisabled}
          type="button"
          variant="secondary"
          onClick={handlePrevious}
        >
          {translate("carousel.previous")}
        </Button>
        <span className="text-sm text-muted-foreground">
          {translate("carousel.frame")} {currentMaxIndex + 1} of {frameCount}
        </span>
        <Button type="button" variant="secondary" onClick={handleNext}>
          {translate("carousel.next")}
        </Button>
      </div>
    </div>
  );
}
