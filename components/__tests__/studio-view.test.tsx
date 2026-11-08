import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Theme } from "@radix-ui/themes";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { StudioView } from "../studio-view";
import { translate as t } from "@/lib/i18n";

const createSequence = vi.fn();

vi.mock("next-auth/react", () => ({
  useSession: () => ({
    data: { user: { id: "1", name: "Tester" } },
    status: "authenticated",
  }),
}));

vi.mock("@/app/services/sequences", () => ({
  useCreateSequenceMutation: () => [createSequence, { isLoading: false }],
}));

vi.mock("@/app/services/assets", () => ({
  useUploadImageMutation: () => [vi.fn(), { isLoading: false }],
}));

vi.mock("@/app/services/snippets", () => ({
  useLazyGetSnippetsQuery: () => [vi.fn(), { data: [], isFetching: false }],
  useDeleteSnippetMutation: () => [vi.fn()],
}));

function renderStudio(props: Partial<Parameters<typeof StudioView>[0]> = {}) {
  return render(
    <Theme>
      <StudioView
        greeting="Hello Tester"
        sequences={[]}
        hasMore={false}
        isError={false}
        isLoading={false}
        loadMore={vi.fn()}
        filter={undefined}
        onFilterChange={vi.fn()}
        searchTerm=""
        onSearchChange={vi.fn()}
        {...props}
      />
    </Theme>
  );
}

// The label also holds a badge, so match the name by prefix.
const titleName = new RegExp(`^${t("sequence.draft.title")}`);
const titleField = () => screen.getByRole("textbox", { name: titleName });

describe("StudioView creation flow", () => {
  beforeEach(() => {
    createSequence.mockReset();
  });

  it("keeps the form closed by default", () => {
    renderStudio();

    expect(
      screen.queryByRole("textbox", { name: titleName })
    ).not.toBeInTheDocument();
  });

  it("opens the form on load when asked to, and reports it once", () => {
    const onCreateOpened = vi.fn();
    renderStudio({ openCreateOnLoad: true, onCreateOpened });

    expect(titleField()).toBeInTheDocument();
    expect(onCreateOpened).toHaveBeenCalledTimes(1);
  });

  it("closes the form, reloads the list and shows no banner after saving", async () => {
    const user = userEvent.setup();
    const onSequenceCreated = vi.fn();
    createSequence.mockReturnValue({
      unwrap: () => Promise.resolve({ id: 9, title: "Morning routine" }),
    });
    renderStudio({ openCreateOnLoad: true, onSequenceCreated });

    await user.type(titleField(), "Morning routine");
    await user.click(
      screen.getByRole("button", { name: t("common.next") })
    );
    await user.type(
      screen.getByRole("textbox", {
        name: t("sequence.draft.frameContent-label", { index: 1 }),
      }),
      "Wake up"
    );
    await user.click(
      screen.getByRole("button", { name: t("sequence.cta.publish") })
    );

    await waitFor(() => expect(onSequenceCreated).toHaveBeenCalledTimes(1));
    expect(createSequence).toHaveBeenCalledWith({
      title: "Morning routine",
      description: undefined,
      frames: [{ content: "Wake up", description: "" }],
    });
    expect(
      screen.queryByRole("textbox", { name: titleName })
    ).not.toBeInTheDocument();
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });
});
