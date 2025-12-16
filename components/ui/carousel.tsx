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
  currentIndex?: number;
  onIndexChange?: (index: number) => void;
  onNext?: (currentIndex: number) => void;
  onPrevious?: (currentIndex: number) => void;
  loop?: boolean;
}

export function Carousel({
  frames,
  initialIndex = 0,
  className,
  currentIndex: currentIndexProp,
  onIndexChange,
  onNext,
  onPrevious,
  loop = true,
}: CarouselProps) {
  const frameCount = frames.length;
  const [uncontrolledIndex, setUncontrolledIndex] = React.useState(() => {
    if (frameCount === 0) return 0;
    return ((initialIndex % frameCount) + frameCount) % frameCount;
  });
  const isControlled = currentIndexProp !== undefined;
  const currentIndex =
    typeof currentIndexProp === "number"
      ? Math.min(Math.max(currentIndexProp, 0), Math.max(frameCount - 1, 0))
      : uncontrolledIndex;
  const setCurrentIndex = React.useCallback(
    (nextIndex: number | ((previousIndex: number) => number)) => {
      if (isControlled) {
        const computedIndex =
          typeof nextIndex === "function"
            ? nextIndex(currentIndex)
            : nextIndex;
        onIndexChange?.(computedIndex);
      } else {
        setUncontrolledIndex(nextIndex);
      }
    },
    [currentIndex, isControlled, onIndexChange]
  );

  React.useEffect(() => {
    if (frameCount === 0 || isControlled) return;
    setUncontrolledIndex((previous) => {
      if (frameCount === 0) return 0;
      return Math.min(Math.max(previous, 0), frameCount - 1);
    });
  }, [frameCount, isControlled]);

  const showPrevious = React.useCallback(() => {
    if (frameCount === 0) return;
    if (onPrevious) {
      onPrevious(currentIndex);
      return;
    }
    if (!loop && currentIndex === 0) return;
    setCurrentIndex((index) =>
      loop ? (index - 1 + frameCount) % frameCount : Math.max(index - 1, 0)
    );
  }, [currentIndex, frameCount, loop, onPrevious, setCurrentIndex]);

  const showNext = React.useCallback(() => {
    if (frameCount === 0) return;
    if (onNext) {
      onNext(currentIndex);
      return;
    }
    if (!loop && currentIndex === frameCount - 1) return;
    setCurrentIndex((index) =>
      loop ? (index + 1) % frameCount : Math.min(index + 1, frameCount - 1)
    );
  }, [currentIndex, frameCount, loop, onNext, setCurrentIndex]);

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
