import { useTranslation } from "@/components/locale-provider";
import { LanguageMenu } from "@/components/language-menu";
import { DropdownMenu, Text } from "@radix-ui/themes";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { useTheme, ThemePreference } from "@/components/theme-provider";
import { LogOut } from "lucide-react";

export function UserMenu() {
  const { t } = useTranslation();
  const { data: session } = useSession();
  const { theme, setTheme } = useTheme();

  if (!session?.user) return null;

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <button
          aria-label={t("auth.menu")}
          className="w-full justify-start cursor-pointer bg-card p-4 hover:bg-accent outline-none"
        >
          <div className="flex items-center gap-3">
            <Image
              src={session.user.image ?? "/image-placeholder.svg"}
              alt={t("auth.avatarAlt", {
                name: session.user.name ?? "User",
              })}
              width={32}
              height={32}
              unoptimized
              className="h-8 w-8 rounded-full bg-cover bg-center shadow-xl"
            />
            <div className="text-left">
              <Text className="text-sm font-medium leading-none dark:text-white">
                {session.user.name}
              </Text>
            </div>
          </div>
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content align="end">
        <DropdownMenu.Label>
          {session.user.email ?? t("auth.error.email")}
        </DropdownMenu.Label>
        <DropdownMenu.Separator />
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
        <DropdownMenu.Separator />
        <DropdownMenu.Item onClick={() => signOut({ callbackUrl: "/login" })}>
          <LogOut className="w-5 h-5 text-primary-main" />
          {t("auth.logout")}
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
