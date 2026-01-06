"use client";

import { useEffect } from "react";
import { cn } from "@/lib/utils";
import { CircleArrowRight, CircleArrowLeft } from "lucide-react";
import { translate } from "@/lib/i18n";
import { IconButton, Text } from "@radix-ui/themes";

export interface CarouselControlsRenderProps {
  currentIndex: number;
  frameCount: number;
  onNext: () => void;
  onPrevious: () => void;
}

interface CarouselProps {
  frames: React.ReactNode[];
  className?: string;
  isEditMode?: boolean;
  currentIndex: number;
  onNext: () => void;
  onPrevious: () => void;
  renderControls?: (props: CarouselControlsRenderProps) => React.ReactNode;
}

export function Carousel({
  frames,
  className,
  isEditMode,
  currentIndex: currentIndexProp,
  onNext,
  onPrevious,
  renderControls,
}: CarouselProps) {
  const frameCount = frames.length;
  const currentMaxIndex = Math.max(currentIndexProp, 0);
  const getProgressLabel = (current: number, total: number) => {
    const label = translate("carousel.progress", { current, total });
    if (label === "carousel.progress") return `Frame ${current} of ${total}`;
    return label;
  };

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
  }, [onPrevious, onNext, isEditMode]);

  if (frameCount === 0) return null;

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <div>
        <div className="flex items-center justify-center py-6">
          <div className="flex h-48 w-full bg-frame-primary rounded-lg">
            {frames[currentMaxIndex]}
          </div>
        </div>
      </div>
      {renderControls ? (
        renderControls({
          currentIndex: currentMaxIndex,
          frameCount,
          onNext,
          onPrevious,
        })
      ) : (
        <div className="flex items-center justify-between gap-2">
          <IconButton
            disabled={currentMaxIndex === 0}
            variant="soft"
            type="button"
            size="3"
            className="cursor-pointer"
            radius="full"
            onClick={onPrevious}
            aria-label="carousel-previous"
          >
            <CircleArrowLeft />
          </IconButton>
          <Text className="text-sm text-muted-foreground">
            {getProgressLabel(currentMaxIndex + 1, frameCount)}
          </Text>
          <IconButton
            variant="soft"
            type="button"
            size="3"
            className="cursor-pointer"
            radius="full"
            onClick={onNext}
            aria-label="carousel-next"
          >
            <CircleArrowRight />
          </IconButton>
        </div>
      )}
    </div>
  );
}

export function CarouselFrame({ children }: { children: React.ReactNode }) {
  return <div className="w-full">{children}</div>;
}
