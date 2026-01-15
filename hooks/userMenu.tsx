import { translate } from "@/lib/i18n";
import { DropdownMenu, Text } from "@radix-ui/themes";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { useTheme, ThemePreference } from "@/components/theme-provider";
import { LogOut } from "lucide-react";

export function UserMenu() {
  const { data: session } = useSession();
  const { theme, setTheme } = useTheme();

  if (!session?.user) return null;

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <button
          aria-label="open profile menu"
          className="w-full justify-start cursor-pointer bg-card p-4 hover:bg-accent outline-none"
        >
          <div className="flex items-center gap-3">
            <Image
              src={session.user.image ?? "/avatar-placeholder.png"}
              alt={translate("auth.avatarAlt", {
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
          {session.user.email ?? translate("auth.error.email")}
        </DropdownMenu.Label>
        <DropdownMenu.Separator />
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
        <DropdownMenu.Separator />
        <DropdownMenu.Item onClick={() => signOut({ callbackUrl: "/login" })}>
          <LogOut className="w-5 h-5 text-primary-main" />
          {translate("auth.logout")}
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
