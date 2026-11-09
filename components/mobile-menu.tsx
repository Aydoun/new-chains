import { Button, DropdownMenu, Text } from "@radix-ui/themes";
import { LogOut, Menu } from "lucide-react";
import { navigationItems } from "./app-sidebar";
import Link from "next/link";
import { useTranslation } from "@/components/locale-provider";
import { LanguageMenu } from "./language-menu";
import { signOut } from "next-auth/react";
import clsx from "clsx";
import { Fragment } from "react";
import { ThemePreference, useTheme } from "./theme-provider";

export function MobileMenu() {
  const { t } = useTranslation();
  const { theme, setTheme } = useTheme();

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <Button
          variant="ghost"
          className="cursor-pointer"
          aria-label={t("navigation.self")}
        >
          <Menu className="h-5 w-5" aria-hidden="true" />
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content className="px-1 py-1 w-40">
        <DropdownMenu.Label>{t("navigation.self")}</DropdownMenu.Label>
        {navigationItems.map((item, index) => (
          <Fragment key={item.titleKey}>
            {item.separatorBefore && <DropdownMenu.Separator />}
            <DropdownMenu.Item
              className={clsx("mb-4", {
                "mb-0": index === navigationItems.length - 1,
              })}
            >
              <Link href={item.url} className="flex gap-2">
                <item.icon className="w-5 h-5" />
                <Text>{t(`navigation.${item.titleKey}`)}</Text>
              </Link>
            </DropdownMenu.Item>
          </Fragment>
        ))}
        <DropdownMenu.Label>{t("menu.appearance")}</DropdownMenu.Label>
        <DropdownMenu.RadioGroup
          value={theme}
          onValueChange={(value) => setTheme(value as ThemePreference)}
        >
          <DropdownMenu.RadioItem value="light">
            {t("menu.light")}
          </DropdownMenu.RadioItem>
          <DropdownMenu.RadioItem value="dark">
            {t("menu.dark")}
          </DropdownMenu.RadioItem>
        </DropdownMenu.RadioGroup>
        <DropdownMenu.Separator />
        <LanguageMenu />
        <DropdownMenu.Label>{t("auth.me")}</DropdownMenu.Label>
        <DropdownMenu.Separator />
        <DropdownMenu.Item onClick={() => signOut({ callbackUrl: "/login" })}>
          <LogOut className="w-5 h-5 text-primary-main" />
          {t("auth.logout")}
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
