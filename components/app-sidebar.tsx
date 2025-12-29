import {
  Home,
  Mail,
  UserRound,
  type LucideIcon,
  LayoutGrid,
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
import { translate } from "@/lib/i18n";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { UserMenu } from "@/hooks/userMenu";

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
    icon: LayoutGrid,
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
      <SidebarContent className="relative">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem key="icon">
                <div className="flex my-4 h-10 w-10 items-center justify-center rounded-xl bg-primary-main">
                  <span className="text-1xl font-extrabold text-white">
                    {translate("app.nameShortcut")}
                  </span>
                </div>
              </SidebarMenuItem>
              {items.map((item) => (
                <SidebarMenuItem key={item.titleKey}>
                  <SidebarMenuButton asChild isActive={pathname === item.url}>
                    <Link
                      href={item.url}
                      className="text-white py-5 px-3 hover:bg-slate-800"
                    >
                      <item.icon />
                      <span>{translate(`navigation.${item.titleKey}`)}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <div className="absolute bottom-3 left-3 z-20">
          <UserMenu />
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
