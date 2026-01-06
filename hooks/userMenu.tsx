import { translate } from "@/lib/i18n";
import { Button, DropdownMenu, Text } from "@radix-ui/themes";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { useTheme, ThemePreference } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";

export function UserMenu() {
  const { data: session } = useSession();
  const { theme, resolvedTheme, setTheme, toggleTheme } = useTheme();

  if (!session?.user) return null;

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <Button
          variant="ghost"
          radius="large"
          aria-label="open profile menu"
          className="w-full justify-start cursor-pointer border border-border bg-card p-4 shadow-sm transition-colors hover:bg-accent"
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
              <span className="text-sm font-medium leading-none dark:text-white">
                {session.user.name}
              </span>
            </div>
          </div>
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content align="end">
        <DropdownMenu.Label>
          {session.user.email ?? translate("auth.error.email")}
        </DropdownMenu.Label>
        <DropdownMenu.Separator />
        <DropdownMenu.Label>Appearance</DropdownMenu.Label>
        <DropdownMenu.Item
          aria-label="Toggle theme"
          className="justify-between"
          onClick={toggleTheme}
        >
          <Text>Quick toggle</Text>
          <ThemeToggle
            theme={theme}
            resolvedTheme={resolvedTheme}
            onToggle={toggleTheme}
          />
        </DropdownMenu.Item>
        <DropdownMenu.RadioGroup
          value={theme}
          onValueChange={(value) => setTheme(value as ThemePreference)}
        >
          <DropdownMenu.RadioItem value="light">Light</DropdownMenu.RadioItem>
          <DropdownMenu.RadioItem value="dark">Dark</DropdownMenu.RadioItem>
          <DropdownMenu.RadioItem value="system">System</DropdownMenu.RadioItem>
        </DropdownMenu.RadioGroup>
        <DropdownMenu.Separator />
        <DropdownMenu.Item onClick={() => signOut({ callbackUrl: "/login" })}>
          {translate("auth.logout")}
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
