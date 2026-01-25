import type { Meta, StoryObj } from "@storybook/react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const meta: Meta = {
  title: "UI/Tooltip",
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button className="rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-900 shadow-sm transition hover:bg-slate-50">
            Hover me
          </button>
        </TooltipTrigger>
        <TooltipContent>Helpful tooltip copy.</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
};
