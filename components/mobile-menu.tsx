import { Button, DropdownMenu, Text } from "@radix-ui/themes";
import { LogOut, Menu } from "lucide-react";
import { navigationItems } from "./app-sidebar";
import Link from "next/link";
import { translate } from "@/lib/i18n";
import { signOut } from "next-auth/react";
import clsx from "clsx";
import { ThemePreference, useTheme } from "./theme-provider";

export function MobileMenu() {
  const { theme, setTheme } = useTheme();

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <Button variant="ghost" className="cursor-pointer">
          <Menu className="h-5 w-5" aria-hidden="true" />
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content className="px-1 py-1 w-40">
        <DropdownMenu.Label>{translate("navigation.self")}</DropdownMenu.Label>
        {navigationItems.map((item, index) => (
          <DropdownMenu.Item
            className={clsx("mb-4", {
              "mb-0": index === navigationItems.length - 1,
            })}
            key={item.titleKey}
          >
            <Link href={item.url} className="flex gap-2">
              <item.icon className="w-5 h-5" />
              <Text>{translate(`navigation.${item.titleKey}`)}</Text>
            </Link>
          </DropdownMenu.Item>
        ))}
        <DropdownMenu.Label>{translate("menu.appearance")}</DropdownMenu.Label>
        <DropdownMenu.RadioGroup
          value={theme}
          onValueChange={(value) => setTheme(value as ThemePreference)}
        >
          <DropdownMenu.RadioItem value="light">
            {translate("menu.light")}
          </DropdownMenu.RadioItem>
          <DropdownMenu.RadioItem value="dark">
            {translate("menu.dark")}
          </DropdownMenu.RadioItem>
        </DropdownMenu.RadioGroup>
        <DropdownMenu.Label>{translate("auth.me")}</DropdownMenu.Label>
        <DropdownMenu.Separator />
        <DropdownMenu.Item onClick={() => signOut({ callbackUrl: "/login" })}>
          <LogOut className="w-5 h-5 text-primary-main" />
          {translate("auth.logout")}
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
