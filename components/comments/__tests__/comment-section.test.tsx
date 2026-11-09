import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Theme } from "@radix-ui/themes";
import { CommentSection } from "../comment-section";
import { translate as t } from "@/lib/i18n";
import type { SequenceComment } from "@/app/types";

const hooks = vi.hoisted(() => ({
  query: vi.fn(),
  create: vi.fn(),
  remove: vi.fn(),
}));

vi.mock("@/app/services/comments", () => ({
  useGetCommentsInfiniteQuery: (...args: unknown[]) => hooks.query(...args),
  useCreateCommentMutation: () => [hooks.create, { isLoading: false }],
  useDeleteCommentMutation: () => [hooks.remove],
}));

const comment = (id: number, authorId: number, username = `User ${authorId}`): SequenceComment => ({
  id,
  content: `Comment ${id}`,
  sequenceId: 5,
  authorId,
  author: { id: authorId, username, avatarUrl: null },
  createdAt: new Date(Date.now() - 2 * 60_000).toISOString(),
  updatedAt: new Date().toISOString(),
});

const queryResult = (overrides: Record<string, unknown> = {}) => ({
  data: {
    pages: [{ items: [comment(3, 2, "Sofie"), comment(2, 1)], hasMore: true, nextCursor: 2, total: 5 }],
  },
  isLoading: false,
  isError: false,
  refetch: vi.fn(),
  hasNextPage: true,
  fetchNextPage: vi.fn(),
  isFetchingNextPage: false,
  ...overrides,
});

const renderSection = (props: Partial<Parameters<typeof CommentSection>[0]> = {}) =>
  render(
    <Theme>
      <CommentSection
        sequenceId={5}
        sequenceOwnerId={9}
        viewer={{ id: "1", name: "Me" }}
        {...props}
      />
    </Theme>,
  );

beforeEach(() => {
  vi.clearAllMocks();
  hooks.query.mockReturnValue(queryResult());
});

describe("CommentSection", () => {
  it("lists comments with author, time and the total, and reports the count", () => {
    const onCountChange = vi.fn();
    renderSection({ onCountChange });

    expect(hooks.query).toHaveBeenCalledWith(5);
    expect(screen.getAllByTestId("comment")).toHaveLength(2);
    expect(screen.getByText("Sofie")).toBeInTheDocument();
    expect(screen.getByText("Comment 3")).toBeInTheDocument();
    expect(screen.getAllByText("2 minutes ago")).toHaveLength(2);
    expect(screen.getByTestId("comment-total")).toHaveTextContent("5");
    expect(onCountChange).toHaveBeenCalledWith(5);
  });

  it("loads the next page from the button", async () => {
    const result = queryResult();
    hooks.query.mockReturnValue(result);
    renderSection();

    await userEvent.click(screen.getByRole("button", { name: t("comments.loadMore") }));
    expect(result.fetchNextPage).toHaveBeenCalled();
  });

  it("hides the button on the last page", () => {
    hooks.query.mockReturnValue(queryResult({ hasNextPage: false }));
    renderSection();
    expect(screen.queryByRole("button", { name: t("comments.loadMore") })).not.toBeInTheDocument();
  });

  it("invites the first comment when there are none", () => {
    hooks.query.mockReturnValue(
      queryResult({
        data: { pages: [{ items: [], hasMore: false, nextCursor: null, total: 0 }] },
        hasNextPage: false,
      }),
    );
    renderSection();
    expect(screen.getByText(t("comments.empty"))).toBeInTheDocument();
  });

  it("offers a retry when comments fail to load", async () => {
    const result = queryResult({ data: undefined, isError: true });
    hooks.query.mockReturnValue(result);
    renderSection();

    await userEvent.click(screen.getByRole("button", { name: t("comments.retry") }));
    expect(result.refetch).toHaveBeenCalled();
  });

  it("lets a viewer delete only their own comments", () => {
    renderSection();
    // Viewer 1 wrote comment 2 but not comment 3.
    expect(screen.getAllByRole("button", { name: t("comments.delete") })).toHaveLength(1);
  });

  it("lets the sequence owner delete every comment", () => {
    renderSection({ viewer: { id: "9", name: "Owner" } });
    expect(screen.getAllByRole("button", { name: t("comments.delete") })).toHaveLength(2);
  });

  it("deletes after confirming", async () => {
    hooks.remove.mockReturnValue({ unwrap: () => Promise.resolve({}) });
    renderSection();

    await userEvent.click(screen.getByRole("button", { name: t("comments.delete") }));
    expect(screen.getByText(t("comments.confirmDelete"))).toBeInTheDocument();
    expect(hooks.remove).not.toHaveBeenCalled();

    await userEvent.click(screen.getByRole("button", { name: t("comments.delete") }));
    expect(hooks.remove).toHaveBeenCalledWith({ id: 2, sequenceId: 5 });
  });

  it("keeps the comment when the delete is cancelled", async () => {
    renderSection();

    await userEvent.click(screen.getByRole("button", { name: t("comments.delete") }));
    await userEvent.click(screen.getByRole("button", { name: t("comments.cancel") }));

    expect(hooks.remove).not.toHaveBeenCalled();
    expect(screen.queryByText(t("comments.confirmDelete"))).not.toBeInTheDocument();
  });
});
