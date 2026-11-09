import { render, screen } from "@testing-library/react";
import { Theme } from "@radix-ui/themes";
import { AppSidebar, navigationItems } from "../app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { translate as t } from "@/lib/i18n";

vi.mock("next-auth/react", () => ({
  useSession: () => ({ data: { user: { id: "1", name: "Tester" } }, status: "authenticated" }),
  signOut: vi.fn(),
}));
vi.mock("next/navigation", () => ({ usePathname: () => "/assets" }));
vi.mock("@/hooks/userMenu", () => ({ UserMenu: () => null }));

// The sidebar checks the screen width; jsdom has no matchMedia.
beforeAll(() => {
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      addEventListener: () => {},
      removeEventListener: () => {},
    }),
  });
});

describe("AppSidebar", () => {
  it("puts a divider right before the Assets folder link, and marks it active", () => {
    render(
      <Theme>
        <SidebarProvider>
          <AppSidebar />
        </SidebarProvider>
      </Theme>,
    );

    const link = screen.getByRole("link", { name: t("navigation.assets") });
    expect(link).toHaveAttribute("href", "/assets");
    expect(link).toHaveAttribute("data-active", "true");

    const separators = screen.getAllByRole("separator");
    expect(separators).toHaveLength(1);
    expect(separators[0].nextElementSibling).toContainElement(link);
  });

  it("only the Assets folder item asks for a divider", () => {
    expect(
      navigationItems.filter((item) => item.separatorBefore).map((item) => item.titleKey),
    ).toEqual(["assets"]);
  });
});
