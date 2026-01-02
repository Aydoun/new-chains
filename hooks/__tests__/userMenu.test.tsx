import { render, screen } from "@testing-library/react";
import { Theme } from "@radix-ui/themes";
import { UserMenu } from "../userMenu";
import { vi } from "vitest";

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
      <Theme appearance="dark">
        <UserMenu />
      </Theme>
    );

    expect(
      screen.getByRole("button", { name: /open profile menu/i })
    ).toBeInTheDocument();
    expect(screen.getByText("tester@example.com")).toBeInTheDocument();
  });
});
