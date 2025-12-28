"use client";

import { translate } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { LayoutDashboard, RefreshCcw, ServerCrash } from "lucide-react";
import { Button, Card, Flex, Heading, Text } from "@radix-ui/themes";

interface SequenceErrorStateProps {
  onRetry?: () => void;
  onNavigateDashboard?: () => void;
  className?: string;
}

export function SequenceErrorState({
  onRetry,
  onNavigateDashboard,
  className,
}: SequenceErrorStateProps) {
  return (
    <Flex
      align="center"
      justify="center"
      className={cn("px-6 py-10", className)}
    >
      <Card
        className="w-full max-w-2xl border border-slate-200/70 bg-white/90 p-8 shadow-2xl backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/80"
        variant="surface"
      >
        <Flex direction="column" align="center" gap="5">
          <Flex
            align="center"
            justify="center"
            className="rounded-full bg-red-50 p-5 ring-1 ring-red-100 dark:bg-red-900/20 dark:ring-red-800/40"
          >
            <ServerCrash className="h-12 w-12 text-red-500" aria-hidden />
          </Flex>

          <Heading size="7" className="text-center tracking-tight">
            {translate("states.sequenceError.title")}
          </Heading>
          <Text
            as="p"
            size="2"
            color="gray"
            className="max-w-xl text-center leading-relaxed"
          >
            {translate("states.sequenceError.description")}
          </Text>

          <Flex
            gap="3"
            direction={{ initial: "column", sm: "row" }}
            className="w-full sm:w-auto"
          >
            <Button size="3" onClick={onRetry} className="w-full sm:w-auto">
              <RefreshCcw className="h-5 w-5" aria-hidden />
              {translate("states.sequenceError.retry")}
            </Button>
            <Button
              size="3"
              variant="outline"
              onClick={onNavigateDashboard}
              className="w-full sm:w-auto"
            >
              <LayoutDashboard className="h-5 w-5" aria-hidden />
              {translate("states.sequenceError.dashboard")}
            </Button>
          </Flex>
        </Flex>
      </Card>
    </Flex>
  );
}
