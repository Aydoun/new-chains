"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { translate } from "@/lib/i18n";

import { Button } from "./button";
import { cn } from "@/lib/utils";

interface CarouselFrameProps {
  asChild?: boolean;
  className?: string;
  children: React.ReactNode;
}

export function CarouselFrame({
  asChild,
  className,
  children,
}: CarouselFrameProps) {
  const Comp = asChild ? Slot : "div";

  return (
    <Comp
      className={cn(
        "flex h-48 w-full items-center justify-center rounded-lg bg-[#6f4e37] text-center text-black font-[400]",
        className
      )}
    >
      {children}
    </Comp>
  );
}

interface CarouselProps {
  frames: React.ReactNode[];
  initialIndex?: number;
  className?: string;
}

export function Carousel({
  frames,
  initialIndex = 0,
  className,
}: CarouselProps) {
  const frameCount = frames.length;
  const [currentIndex, setCurrentIndex] = React.useState(() => {
    if (frameCount === 0) return 0;
    return ((initialIndex % frameCount) + frameCount) % frameCount;
  });

  React.useEffect(() => {
    if (frameCount === 0) return;
    setCurrentIndex(
      (previous) => ((previous % frameCount) + frameCount) % frameCount
    );
  }, [frameCount]);

  const showPrevious = React.useCallback(() => {
    if (frameCount === 0) return;
    setCurrentIndex((index) => (index - 1 + frameCount) % frameCount);
  }, [frameCount]);

  const showNext = React.useCallback(() => {
    if (frameCount === 0) return;
    setCurrentIndex((index) => (index + 1) % frameCount);
  }, [frameCount]);

  if (frameCount === 0) {
    return null;
  }

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <div className="overflow-hidden rounded-lg border border-border shadow-sm">
        <div
          className="flex items-center justify-center p-6"
          aria-live="polite"
        >
          <CarouselFrame>{frames[currentIndex]}</CarouselFrame>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2">
        <Button type="button" variant="secondary" onClick={showPrevious}>
          {translate("carousel.previous")}
        </Button>
        <span className="text-sm text-muted-foreground">
          {translate("carousel.frame")} {currentIndex + 1} of {frameCount}
        </span>
        <Button type="button" variant="secondary" onClick={showNext}>
          {translate("carousel.next")}
        </Button>
      </div>
    </div>
  );
}
