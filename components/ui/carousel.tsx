"use client";

import { useEffect } from "react";
import { cn } from "@/lib/utils";
import { CircleArrowRight, CircleArrowLeft } from "lucide-react";
import { translate } from "@/lib/i18n";
import { Button, Text } from "@radix-ui/themes";
import { FrameContainer } from "../sequence-card";

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
          className="flex items-center justify-center py-6"
          aria-live="polite"
        >
          <FrameContainer className="bg-background">
            {frames[currentMaxIndex]}
          </FrameContainer>
        </div>
      </div>
      <div className="flex items-center justify-between gap-2">
        <Button
          disabled={currentMaxIndex === 0}
          type="button"
          onClick={onPrevious}
          className="cursor-pointer"
          aria-label="Previous"
        >
          <CircleArrowLeft />
        </Button>
        <Text className="text-sm text-muted-foreground">
          {translate("carousel.progress", {
            current: currentMaxIndex + 1,
            total: frameCount,
          })}
        </Text>
        <Button
          className="cursor-pointer"
          type="button"
          onClick={onNext}
          aria-label="Next"
        >
          <CircleArrowRight />
        </Button>
      </div>
    </div>
  );
}
