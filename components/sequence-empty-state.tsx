"use client";

import { translate } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { FilterX, HelpCircle, Plus, SearchX } from "lucide-react";
import { Box, Button, Card, Flex, Heading, Text } from "@radix-ui/themes";

interface SequenceEmptyStateProps {
  onClear?: () => void;
  onCreate?: () => void;
  className?: string;
}

export function SequenceEmptyState({
  onClear,
  onCreate,
  className,
}: SequenceEmptyStateProps) {
  return (
    <Flex align="center" justify="center">
      <Card
        className="w-full bg-white/80 p-8 shadow-2xl dark:bg-slate-900/80"
        variant="surface"
      >
        <Flex direction="column" align="center" gap="4" className="text-center">
          <Box className="relative">
            <Box className="absolute inset-0 scale-150 rounded-full bg-sky-500/10 blur-2xl" />
            <Flex
              align="center"
              justify="center"
              className="relative h-24 w-24 rounded-full bg-slate-50 shadow-xl dark:bg-slate-800"
            >
              <SearchX
                className="h-12 w-12 text-slate-600 dark:text-slate-300"
                aria-hidden
              />
            </Flex>
            <Flex
              align="center"
              justify="center"
              className="absolute -right-2 -top-2 h-8 w-8 rounded-full  bg-white text-sky-500 shadow-md dark:bg-slate-900"
            >
              <HelpCircle className="h-4 w-4" aria-hidden />
            </Flex>
          </Box>

          <Heading size="6" className="tracking-tight">
            {translate("states.emptySequences.title")}
          </Heading>
          <Text
            as="p"
            size="2"
            color="gray"
            className="max-w-lg leading-relaxed"
          >
            {translate("states.emptySequences.description")}
          </Text>
          <Flex
            direction={{ initial: "column", sm: "row" }}
            gap="3"
            className="w-full sm:w-auto"
          >
            {onClear && (
              <Button
                size="3"
                onClick={onClear}
                className="w-full sm:w-auto"
                aria-label={translate("states.emptySequences.clear")}
              >
                <FilterX className="h-5 w-5" aria-hidden />
                {translate("states.emptySequences.clear")}
              </Button>
            )}

            {onCreate && (
              <Button
                size="3"
                variant="outline"
                onClick={onCreate}
                className="w-full sm:w-auto"
                aria-label={translate("states.emptySequences.create")}
              >
                <Plus className="h-5 w-5" aria-hidden />
                {translate("states.emptySequences.create")}
              </Button>
            )}
          </Flex>
        </Flex>
      </Card>
    </Flex>
  );
}
