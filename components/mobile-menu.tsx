import { Button, DropdownMenu, Flex, Text } from "@radix-ui/themes";
import { Menu } from "lucide-react";
import { navigationItems } from "./app-sidebar";
import Link from "next/link";
import { translate } from "@/lib/i18n";

export function MobileMenu() {
  return (
    <Flex gap="3">
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          <Button
            type="button"
            variant="soft"
            className="block md:hidden ml-3"
            aria-label="Open navigation menu"
          >
            <Menu className="h-5 w-5" aria-hidden="true" />
          </Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content
          className="p-4 px-3"
          variant="soft"
          color="indigo"
        >
          {navigationItems.map((item) => (
            <DropdownMenu.Item
              className="flex flex-col items-center gap-2 p-3 text-center mb-8"
              key={item.titleKey}
            >
              <Link href={item.url}>
                <item.icon className="mx-auto h-5 w-5" />
                <Text>{translate(`navigation.${item.titleKey}`)}</Text>
              </Link>
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </Flex>
  );
}
