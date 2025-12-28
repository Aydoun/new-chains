import { translate } from "@/lib/i18n";
import { Button, DropdownMenu } from "@radix-ui/themes";
import { signOut, useSession } from "next-auth/react";

export function UserMenu() {
  const { data: session } = useSession();

  if (!session?.user) return null;

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <div className="p-4 rounded-2xl bg-gray-50 bg-white/5 cursor-pointer">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="rounded-full bg-cover bg-center shadow-xl"
                style={{
                  backgroundImage: `url(${session?.user?.image})`,
                  width: "2rem",
                  height: "2rem",
                }}
              />
              <div className="flex flex-col">
                <span className="text-sm font-medium dark:text-white leading-none">
                  {session?.user?.name}
                </span>
              </div>
            </div>
          </div>
        </div>
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
