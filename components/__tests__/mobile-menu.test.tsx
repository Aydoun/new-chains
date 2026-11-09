import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Theme } from "@radix-ui/themes";
import { MobileMenu } from "../mobile-menu";
import { translate as t } from "@/lib/i18n";

vi.mock("next-auth/react", () => ({ signOut: vi.fn() }));
vi.mock("../theme-provider", () => ({
  useTheme: () => ({ theme: "light", setTheme: vi.fn() }),
}));

// Radix positions the menu with ResizeObserver, which jsdom lacks.
beforeAll(() => {
  globalThis.ResizeObserver ??= class {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as unknown as typeof ResizeObserver;
});

describe("MobileMenu", () => {
  it("lists the Assets folder after a divider", async () => {
    render(
      <Theme>
        <MobileMenu />
      </Theme>,
    );

    await userEvent.click(screen.getByRole("button", { name: t("navigation.self") }));

    const link = await screen.findByRole("link", { name: t("navigation.assets") });
    expect(link).toHaveAttribute("href", "/assets");
    const item = link.closest('[role="menuitem"]')!;
    expect(item.previousElementSibling).toHaveAttribute("role", "separator");
  });
});
