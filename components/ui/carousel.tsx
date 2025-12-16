"use client";

import * as React from "react";
import { translate } from "@/lib/i18n";

import { Button } from "./button";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

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
  initialIndex?: number;
  onNext?: () => void;
  onPrevious?: () => void;
}

export function Carousel({
  frames,
  className,
  initialIndex = 0,
  currentIndex: currentIndexProp,
  onNext,
  onPrevious,
}: CarouselProps) {
  const frameCount = frames.length;
  const [uncontrolledIndex, setUncontrolledIndex] = useState(initialIndex);
  const isControlled = typeof currentIndexProp === "number";
  const clampIndex = (index: number) =>
    Math.min(Math.max(index, 0), Math.max(frameCount - 1, 0));
  const currentMaxIndex = clampIndex(
    isControlled ? currentIndexProp : uncontrolledIndex
  );
  const disablePrevious = isControlled && currentMaxIndex === 0;

  useEffect(() => {
    if (!isControlled) {
      setUncontrolledIndex(clampIndex(initialIndex));
    }
  }, [initialIndex, isControlled, frameCount]);

  const handleNext = () => {
    if (isControlled) {
      onNext?.();
      return;
    }

    setUncontrolledIndex((previous) => (previous + 1) % frameCount);
  };

  const handlePrevious = () => {
    if (isControlled) {
      onPrevious?.();
      return;
    }

    setUncontrolledIndex((previous) =>
      previous === 0 ? frameCount - 1 : previous - 1
    );
  };

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
          disabled={disablePrevious}
          type="button"
          variant="secondary"
          onClick={handlePrevious}
        >
          {translate("carousel.previous")}
        </Button>
        <span className="text-sm text-muted-foreground">
          {translate("carousel.frameLabel", {
            current: currentMaxIndex + 1,
            total: frameCount,
          })}
        </span>
        <Button type="button" variant="secondary" onClick={handleNext}>
          {translate("carousel.next")}
        </Button>
      </div>
    </div>
  );
}
