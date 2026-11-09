import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Theme } from "@radix-ui/themes";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Home from "../HomeClient";
import { translate as t } from "@/lib/i18n";
import { STUDIO_CREATE_PATH } from "@/lib/constants";

const push = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push, replace: vi.fn() }),
}));

vi.mock("next-auth/react", () => ({
  useSession: () => ({
    data: { user: { id: "1", name: "Tester" } },
    status: "authenticated",
  }),
}));

vi.mock("../services/sequences", () => ({
  useLazyGetSequencesByUserQuery: () => [
    () => ({
      unwrap: () =>
        Promise.resolve({
          items: [],
          page: 1,
          pageSize: 20,
          hasMore: false,
          nextPage: null,
        }),
    }),
  ],
}));

describe("Home create button", () => {
  beforeEach(() => {
    push.mockReset();
    window.localStorage.clear();
  });

  it("sends the user to the studio with the form open, without a local form", async () => {
    const user = userEvent.setup();
    render(
      <Theme>
        <Home sequenceId={null} />
      </Theme>
    );

    await user.click(
      screen.getAllByRole("button", { name: t("sequence.cta.label") })[0]
    );

    expect(push).toHaveBeenCalledWith(STUDIO_CREATE_PATH);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("does the same from the empty state", async () => {
    const user = userEvent.setup();
    render(
      <Theme>
        <Home sequenceId={null} />
      </Theme>
    );

    await user.click(
      await screen.findByRole("button", {
        name: t("states.emptySequences.create"),
      })
    );

    await waitFor(() => expect(push).toHaveBeenCalledWith(STUDIO_CREATE_PATH));
  });
});
