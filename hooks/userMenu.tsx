import { translate } from "@/lib/i18n";
import { Button, DropdownMenu } from "@radix-ui/themes";
import { signIn, signOut, useSession } from "next-auth/react";

export function UserMenu() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <Button variant="ghost" disabled>
        {translate("common.loading") ?? "Loading"}
      </Button>
    );
  }

  if (!session?.user) return null;

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <Button variant="soft">
          {session.user.name ?? session.user.email ?? translate("auth.me")}
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content align="end">
        <DropdownMenu.Label>
          {session.user.email ?? translate("auth.me")}
        </DropdownMenu.Label>
        <DropdownMenu.Separator />
        <DropdownMenu.Item onClick={() => signOut({ callbackUrl: "/login" })}>
          {translate("auth.logout") ?? "Log out"}
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
