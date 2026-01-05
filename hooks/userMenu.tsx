import { translate } from "@/lib/i18n";
import { DropdownMenu } from "@radix-ui/themes";
import { LogOut } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";

export function UserMenu() {
  const { data: session } = useSession();

  if (!session?.user) return null;

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <button
          aria-label="open profile menu"
          className="w-full justify-start rounded-xl cursor-pointer bg-white/5 p-4 hover:bg-white/10"
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
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content align="end">
        <DropdownMenu.Label>
          {session.user.email ?? translate("auth.error.email")}
        </DropdownMenu.Label>
        <DropdownMenu.Separator />
        <DropdownMenu.Item onClick={() => signOut({ callbackUrl: "/login" })}>
          <LogOut className="w-5 h-5 text-primary-main" />
          {translate("auth.logout")}
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
