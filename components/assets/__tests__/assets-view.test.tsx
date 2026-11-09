import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Theme } from "@radix-ui/themes";
import { AssetsView } from "../assets-view";
import { translate as t } from "@/lib/i18n";
import { STUDIO_CREATE_PATH } from "@/lib/constants";

const props = {
  assets: [],
  hasMore: false,
  isLoading: false,
  isError: false,
  loadMore: vi.fn(),
  onRetry: vi.fn(),
};

const renderView = (overrides: Partial<typeof props> = {}) =>
  render(
    <Theme>
      <AssetsView {...props} {...overrides} />
    </Theme>,
  );

describe("AssetsView", () => {
  it("has the page title", () => {
    renderView();
    expect(screen.getByRole("heading", { level: 1, name: t("assets.title") })).toBeInTheDocument();
  });

  it("invites creating a sequence when there are no images", () => {
    renderView();

    expect(screen.getByText(t("assets.empty.title"))).toBeInTheDocument();
    expect(screen.getByRole("link", { name: t("assets.empty.cta") })).toHaveAttribute(
      "href",
      STUDIO_CREATE_PATH,
    );
  });

  it("lists a card per image", () => {
    renderView({
      assets: [1, 2].map((id) => ({
        id,
        url: `https://blob.test/${id}.png`,
        width: 100,
        height: 100,
        contentType: "image/png",
        createdAt: new Date().toISOString(),
        sequences: [],
      })) as never,
    });

    expect(screen.getAllByTestId("asset-card")).toHaveLength(2);
    expect(screen.queryByTestId("assets-empty")).not.toBeInTheDocument();
  });

  it("offers a retry when the images fail to load", async () => {
    const onRetry = vi.fn();
    renderView({ isError: true, onRetry });

    await userEvent.click(screen.getByRole("button", { name: t("assets.retry") }));
    expect(onRetry).toHaveBeenCalled();
  });
});
