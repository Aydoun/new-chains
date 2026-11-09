import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Theme } from "@radix-ui/themes";
import { SequenceErrorState } from "../sequence-error-state";
import { SequenceEmptyState } from "../sequence-empty-state";
import { SequenceList } from "../sequence-list";
import { translate as t } from "@/lib/i18n";

const pathname = vi.hoisted(() => ({ current: "/studio" }));
vi.mock("next/navigation", () => ({ usePathname: () => pathname.current }));

const wrap = (ui: React.ReactNode) => render(<Theme>{ui}</Theme>);

beforeEach(() => {
  pathname.current = "/studio";
});

describe("SequenceErrorState", () => {
  it("retries when Retry is clicked", async () => {
    const onRetry = vi.fn();
    wrap(<SequenceErrorState onRetry={onRetry} />);

    await userEvent.click(screen.getByRole("button", { name: t("states.sequenceError.retry") }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it("links Home to the home page", () => {
    wrap(<SequenceErrorState onRetry={vi.fn()} />);

    expect(
      screen.getByRole("link", { name: t("states.sequenceError.dashboard") }),
    ).toHaveAttribute("href", "/");
  });

  it("hides Home on the home page itself", () => {
    pathname.current = "/";
    wrap(<SequenceErrorState onRetry={vi.fn()} />);

    expect(
      screen.queryByRole("link", { name: t("states.sequenceError.dashboard") }),
    ).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: t("states.sequenceError.retry") })).toBeInTheDocument();
  });
});

describe("SequenceEmptyState", () => {
  it("clears the search and starts a new sequence", async () => {
    const onClear = vi.fn();
    const onCreate = vi.fn();
    wrap(<SequenceEmptyState onClear={onClear} onCreate={onCreate} />);

    await userEvent.click(screen.getByRole("button", { name: t("states.emptySequences.clear") }));
    await userEvent.click(screen.getByRole("button", { name: t("states.emptySequences.create") }));

    expect(onClear).toHaveBeenCalledTimes(1);
    expect(onCreate).toHaveBeenCalledTimes(1);
  });
});

describe("SequenceList states", () => {
  const props = {
    sequences: [],
    hasMore: false,
    isLoading: false,
    loadMore: vi.fn(),
    onSequenceSelect: vi.fn(),
    onClearSearch: vi.fn(),
  };

  it("passes Retry through to the list's reload", async () => {
    const onRetry = vi.fn();
    wrap(<SequenceList {...props} isError onRetry={onRetry} />);

    await userEvent.click(screen.getByRole("button", { name: t("states.sequenceError.retry") }));
    expect(onRetry).toHaveBeenCalled();
  });

  it("offers New Sequence in the empty state when the list can create", async () => {
    const onCreate = vi.fn();
    wrap(<SequenceList {...props} isError={false} onRetry={vi.fn()} onCreate={onCreate} />);

    await userEvent.click(screen.getByRole("button", { name: t("states.emptySequences.create") }));
    expect(onCreate).toHaveBeenCalled();
  });
});
