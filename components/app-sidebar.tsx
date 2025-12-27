import {
  Home,
  Search,
  Blend,
  Mail,
  UserRound,
  type LucideIcon,
} from "lucide-react";
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
  const pathname = usePathname();
  const isAuthenticated = Boolean(session?.user?.id);

  if (!isAuthenticated) return null;

  return (
    <Sidebar className="bg-[#0f1723] border-r border-gray-600">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem key="icon">
                <div className="flex m-4 mx-2 h-10 w-10 items-center justify-center rounded-xl bg-[#F87171] ring-1 ring-white/10">
                  <span className="text-1xl font-extrabold text-white">
                    {translate("app.nameShortcut")}
                  </span>
                </div>
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
                  <SidebarMenuButton asChild isActive={pathname === item.url}>
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
