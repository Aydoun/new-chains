import { Button, DropdownMenu, Flex } from "@radix-ui/themes";
import { Menu } from "lucide-react";
import { navigationItems } from "./app-sidebar";
import Link from "next/link";
import { translate } from "@/lib/i18n";

export function MobileMenu() {
  return (
    <>
      <Flex gap="3" className="absolute top-3 right-3">
        <DropdownMenu.Root>
          <DropdownMenu.Trigger>
            <button className="rounded-lg px-3 py-2 text-sm font-medium text-[#92a9c9] transition hover:bg-[#1a2533] block md:hidden">
              <Menu className="h-5 w-5" aria-hidden="true" />
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content variant="soft" color="indigo">
            {navigationItems.map((item) => (
              <DropdownMenu.Item className="w-20 h-20" key={item.titleKey}>
                <Link
                  href={item.url}
                  className="text-white py-5 px-3 hover:bg-slate-800"
                >
                  <item.icon />
                  <span>{translate(`navigation.${item.titleKey}`)}</span>
                </Link>
              </DropdownMenu.Item>
            ))}
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </Flex>
    </>
  );
}
