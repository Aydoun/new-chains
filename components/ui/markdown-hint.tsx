"use client";

import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip";

type Props = {
  className?: string;
};

export function MarkdownHint({ className }: Props) {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <Info
            aria-hidden
            className={className ?? "h-4 w-4 cursor-help text-amber-400"}
          />
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs text-sm leading-relaxed">
          Markdown supported: **bold**, _italics_, bullet lists, and `code`.
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
