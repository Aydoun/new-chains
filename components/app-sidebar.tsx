import { Home, Search, Blend, Mail, UserRound } from "lucide-react";
import Link from "next/link";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { translate } from "@/lib/i18n";

const items = [
  {
    titleKey: "home",
    url: "/",
    icon: Home,
  },
  {
    titleKey: "studio",
    url: "/studio",
    icon: Blend,
  },
  {
    titleKey: "profile",
    url: "/profile",
    icon: UserRound,
  },
  {
    titleKey: "contact",
    url: "/contact",
    icon: Mail,
  },
];

export function AppSidebar() {
  return (
    <Sidebar className="bg-gray-900">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem key="search">
                <SidebarMenuButton asChild>
                  <div className="flex w-full items-center gap-2">
                    <Search className="h-4 w-4 text-white" aria-hidden="true" />
                    <Input
                      type="search"
                      placeholder={translate("navigation.search")}
                      aria-label="Search"
                      className="h-10 border-transparent bg-gray-800 text-white placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
              {items.map((item) => (
                <SidebarMenuItem key={item.titleKey}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url} className="text-white">
                      <item.icon />
                      <span>{translate(`navigation.${item.titleKey}`)}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
