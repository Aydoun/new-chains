"use client";

import { DropdownMenu } from "@radix-ui/themes";
import { Languages } from "lucide-react";
import { isLocale, localeOptions } from "@/lib/i18n";
import { useTranslation } from "./locale-provider";
import { FlagIcon } from "./flag-icon";

/**
 * Language picker rendered as a submenu inside a Radix Themes dropdown
 * (the sidebar user menu and the mobile hamburger menu).
 */
export function LanguageMenu() {
  const { locale, setLocale, t } = useTranslation();
  const current =
    localeOptions.find((option) => option.code === locale) ?? localeOptions[0];

  return (
    <DropdownMenu.Sub>
      <DropdownMenu.SubTrigger data-testid="language-menu-trigger">
        <span className="flex w-full items-center gap-2">
          <Languages className="h-4 w-4" aria-hidden="true" />
          <span>{t("menu.language")}</span>
          <FlagIcon country={current.country} className="ml-auto h-3 w-[18px] shrink-0 rounded-[2px]" />
        </span>
      </DropdownMenu.SubTrigger>
      <DropdownMenu.SubContent>
        <DropdownMenu.RadioGroup
          value={locale}
          onValueChange={(value) => {
            if (isLocale(value)) setLocale(value);
          }}
        >
          {localeOptions.map((option) => (
            <DropdownMenu.RadioItem
              key={option.code}
              value={option.code}
              lang={option.code}
            >
              <span className="flex items-center gap-2">
                <FlagIcon country={option.country} />
                {option.nativeName}
              </span>
            </DropdownMenu.RadioItem>
          ))}
        </DropdownMenu.RadioGroup>
      </DropdownMenu.SubContent>
    </DropdownMenu.Sub>
  );
}
