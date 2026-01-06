"use client";

import { useMemo, useState, type InputHTMLAttributes } from "react";
import { Info } from "lucide-react";
import { Text, TextField } from "@radix-ui/themes";
import { translate } from "@/lib/i18n";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

type Field = {
  id: string;
  label: string;
  tooltip: string;
  helper: string;
  inputProps?: InputHTMLAttributes<HTMLInputElement>;
  value: string;
  onChange: (value: string) => void;
};

const InfoHint = ({ id, tooltip }: { id: string; tooltip: string }) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <button
        type="button"
        aria-label={translate("settings.advanced.tooltipLabel", {
          field: translate(id),
        })}
        className="flex h-6 w-6 items-center justify-center rounded-full border border-white/15 bg-white/5 text-[#c8d3e5] transition hover:border-primary-main hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        <Info className="h-4 w-4" aria-hidden="true" />
      </button>
    </TooltipTrigger>
    <TooltipContent
      side="top"
      align="start"
      className="max-w-xs text-left leading-relaxed"
    >
      {tooltip}
    </TooltipContent>
  </Tooltip>
);

export function AdvancedSettingsPanel() {
  const [timeoutSeconds, setTimeoutSeconds] = useState("30");
  const [temperature, setTemperature] = useState("0.7");
  const [maxTokens, setMaxTokens] = useState("512");
  const [topP, setTopP] = useState("1");
  const [retries, setRetries] = useState("2");

  const fields: Field[] = useMemo(
    () => [
      {
        id: "settings.advanced.timeout.label",
        label: translate("settings.advanced.timeout.label"),
        tooltip: translate("settings.advanced.timeout.tooltip"),
        helper: translate("settings.advanced.timeout.helper"),
        value: timeoutSeconds,
        onChange: setTimeoutSeconds,
        inputProps: {
          type: "number",
          min: 5,
          max: 300,
          step: 5,
        },
      },
      {
        id: "settings.advanced.temperature.label",
        label: translate("settings.advanced.temperature.label"),
        tooltip: translate("settings.advanced.temperature.tooltip"),
        helper: translate("settings.advanced.temperature.helper"),
        value: temperature,
        onChange: setTemperature,
        inputProps: {
          type: "number",
          min: 0,
          max: 1,
          step: 0.1,
        },
      },
      {
        id: "settings.advanced.maxTokens.label",
        label: translate("settings.advanced.maxTokens.label"),
        tooltip: translate("settings.advanced.maxTokens.tooltip"),
        helper: translate("settings.advanced.maxTokens.helper"),
        value: maxTokens,
        onChange: setMaxTokens,
        inputProps: {
          type: "number",
          min: 16,
          max: 4096,
          step: 16,
        },
      },
      {
        id: "settings.advanced.topP.label",
        label: translate("settings.advanced.topP.label"),
        tooltip: translate("settings.advanced.topP.tooltip"),
        helper: translate("settings.advanced.topP.helper"),
        value: topP,
        onChange: setTopP,
        inputProps: {
          type: "number",
          min: 0,
          max: 1,
          step: 0.05,
        },
      },
      {
        id: "settings.advanced.retries.label",
        label: translate("settings.advanced.retries.label"),
        tooltip: translate("settings.advanced.retries.tooltip"),
        helper: translate("settings.advanced.retries.helper"),
        value: retries,
        onChange: setRetries,
        inputProps: {
          type: "number",
          min: 0,
          max: 6,
          step: 1,
        },
      },
    ],
    [timeoutSeconds, temperature, maxTokens, topP, retries]
  );

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Text weight="bold" size="4">
            {translate("settings.advanced.title")}
          </Text>
          <Text color="gray" size="2">
            {translate("settings.advanced.description")}
          </Text>
        </div>
      </div>
      <TooltipProvider delayDuration={0}>
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          {fields.map((field) => {
            const inputId = field.id.replaceAll(".", "-");
            const helperId = `${inputId}-helper`;

            return (
              <div key={field.id} className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <label
                    className="text-sm font-semibold text-white"
                    htmlFor={inputId}
                  >
                    {field.label}
                  </label>
                  <InfoHint id={field.id} tooltip={field.tooltip} />
                </div>
                <TextField.Root
                  id={inputId}
                  aria-describedby={helperId}
                  {...field.inputProps}
                  value={field.value}
                  onChange={(event) => field.onChange(event.target.value)}
                />
                <Text
                  id={helperId}
                  size="1"
                  className="text-[#92a9c9]"
                  as="p"
                >
                  {field.helper}
                </Text>
              </div>
            );
          })}
        </div>
      </TooltipProvider>
    </div>
  );
}
