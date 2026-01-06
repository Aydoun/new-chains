import { render, screen } from "@testing-library/react";
import { UserMenu } from "../userMenu";
import { vi } from "vitest";
import { ThemeProvider } from "@/components/theme-provider";

vi.mock("next-auth/react", () => ({
  useSession: () => ({
    data: {
      user: {
        id: "1",
        name: "Test User",
        email: "tester@example.com",
        image: "https://example.com/avatar.png",
      },
    },
    status: "authenticated",
  }),
  signOut: vi.fn(),
}));

describe("UserMenu accessibility", () => {
  it("renders a focusable trigger with a descriptive label", () => {
    render(
      <ThemeProvider>
        <UserMenu />
      </ThemeProvider>
    );

    expect(
      screen.getByRole("button", { name: /open profile menu/i })
    ).toBeInTheDocument();
  });
});
