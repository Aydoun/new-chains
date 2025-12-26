import {
  Home,
  Search,
  Blend,
  Mail,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";

import { ReactNode } from "react";
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
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

type NavigationItem = {
  icon: LucideIcon;
  isProtected: boolean;
  titleKey: string;
  url: string;
};

const items: NavigationItem[] = [
  {
    titleKey: "home",
    url: "/",
    icon: Home,
    isProtected: false,
  },
  {
    titleKey: "studio",
    url: "/studio",
    icon: Blend,
    isProtected: true,
  },
  {
    titleKey: "profile",
    url: "/profile",
    icon: UserRound,
    isProtected: true,
  },
  {
    titleKey: "contact",
    url: "/contact",
    icon: Mail,
    isProtected: true,
  },
];

export function AppSidebar() {
  const { data: session } = useSession();
  const isAuthenticated = Boolean(session?.user?.id);
  const pathname = usePathname();

  if (!isAuthenticated) return null;

  return (
    <Sidebar className="bg-background border-r border-gray-600">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem key="icon">
                <img src={"/lt-icon-64.svg"} alt={`site icon`} />
              </SidebarMenuItem>
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
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.url}
                  >
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
