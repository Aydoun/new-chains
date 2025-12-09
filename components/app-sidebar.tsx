import { Home, Inbox, Settings, Link } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { translate } from "@/lib/i18n";

const items = [
  {
    titleKey: "home",
    url: "#",
    icon: Home,
  },
  {
    titleKey: "inbox",
    url: "#",
    icon: Inbox,
  },
  {
    titleKey: "settings",
    url: "#",
    icon: Settings,
  },
];

export function AppSidebar() {
  return (
    <Sidebar className="bg-gray-900">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            <Link />
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.titleKey}>
                  <SidebarMenuButton asChild>
                    <a href={item.url} className="text-white">
                      <item.icon />
                      <span>{translate(`navigation.${item.titleKey}`)}</span>
                    </a>
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
