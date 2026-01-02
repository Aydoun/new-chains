import { translate } from "@/lib/i18n";
import { Button, DropdownMenu } from "@radix-ui/themes";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";

export function UserMenu() {
  const { data: session } = useSession();

  if (!session?.user) return null;

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <Button
          variant="ghost"
          radius="large"
          aria-label={translate("auth.openProfileMenu")}
          className="w-full justify-start bg-white/5 p-4 shadow-sm hover:bg-white/10"
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
            <div className="flex flex-col text-left">
              <span className="text-sm font-medium leading-none dark:text-white">
                {session.user.name}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-300">
                {session.user.email ?? translate("auth.error.email")}
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
        <DropdownMenu.Item onClick={() => signOut({ callbackUrl: "/login" })}>
          {translate("auth.logout")}
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
