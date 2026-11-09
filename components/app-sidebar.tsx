import {
  Home,
  Images,
  Mail,
  UserRound,
  type LucideIcon,
  LayoutGrid,
} from "lucide-react";
import Link from "next/link";
import { Fragment } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useTranslation } from "@/components/locale-provider";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { UserMenu } from "@/hooks/userMenu";

type NavigationItem = {
  icon: LucideIcon;
  isProtected: boolean;
  titleKey: string;
  url: string;
  /** Draws a divider above the item, in the sidebar and the mobile menu. */
  separatorBefore?: boolean;
};

export const navigationItems: NavigationItem[] = [
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
  {
    titleKey: "assets",
    url: "/assets",
    icon: Images,
    isProtected: true,
    separatorBefore: true,
  },
];

export function AppSidebar() {
  const { t } = useTranslation();
  const { data: session } = useSession();
  const pathname = usePathname();
  const isAuthenticated = Boolean(session?.user?.id);

  if (!isAuthenticated) return null;

  return (
    <Sidebar className="border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-colors">
      <SidebarContent className="relative">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem key="icon">
                <Link href="/">
                  <div className="flex my-4 h-10 w-10 items-center justify-center rounded-xl bg-primary-main">
                    <span className="text-1xl font-extrabold text-white">
                      {t("app.nameShortcut")}
                    </span>
                  </div>
                </Link>
              </SidebarMenuItem>
              {navigationItems.map((item) => (
                <Fragment key={item.titleKey}>
                  {item.separatorBefore && (
                    <li
                      role="separator"
                      data-testid="sidebar-separator"
                      className="mx-3 my-2 h-px bg-sidebar-border"
                    />
                  )}
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={pathname === item.url}>
                      <Link
                        href={item.url}
                        className="py-5 px-3 text-foreground transition-colors hover:bg-muted"
                      >
                        <item.icon />
                        <span>{t(`navigation.${item.titleKey}`)}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </Fragment>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <div className="absolute bottom-3 left-3 z-20 w-[calc(100%-25px)]">
          <UserMenu />
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
