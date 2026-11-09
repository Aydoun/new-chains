import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Theme } from "@radix-ui/themes";
import { AssetCard } from "../asset-card";
import { translate as t } from "@/lib/i18n";
import type { LibraryAsset } from "@/app/types";

const asset = (sequences: LibraryAsset["sequences"]): LibraryAsset => ({
  id: 1,
  url: "https://blob.test/assets/7/1.png",
  width: 1080,
  height: 1350,
  contentType: "image/png",
  createdAt: new Date(Date.now() - 2 * 60 * 60_000).toISOString(),
  sequences,
});

const renderCard = (sequences: LibraryAsset["sequences"]) =>
  render(
    <Theme>
      <AssetCard asset={asset(sequences)} />
    </Theme>,
  );

describe("AssetCard", () => {
  it("shows the image and when it was uploaded", () => {
    renderCard([]);

    expect(screen.getByRole("img")).toHaveAttribute("src", "https://blob.test/assets/7/1.png");
    expect(screen.getByText(t("assets.uploaded", { time: "2 hours ago" }))).toBeInTheDocument();
  });

  it("links to the sequence the image is used in", () => {
    renderCard([{ id: 42, title: "Morning routine" }]);

    const list = screen.getByRole("list", { name: t("assets.usedIn") });
    expect(within(list).getByRole("link", { name: "Morning routine" })).toHaveAttribute(
      "href",
      "/?sequence=42",
    );
    expect(screen.getByRole("img")).toHaveAccessibleName("Morning routine");
    expect(screen.queryByText(t("assets.notUsed"))).not.toBeInTheDocument();
  });

  it("collapses extra sequences behind +N more, and expands them", async () => {
    renderCard([
      { id: 1, title: "First" },
      { id: 2, title: "Second" },
      { id: 3, title: "Third" },
    ]);

    expect(screen.getAllByRole("link")).toHaveLength(1);
    const toggle = screen.getByRole("button", { name: t("assets.more", { count: 2 }) });
    expect(toggle).toHaveAttribute("aria-expanded", "false");

    await userEvent.click(toggle);

    expect(screen.getAllByRole("link").map((link) => link.textContent)).toEqual([
      "First",
      "Second",
      "Third",
    ]);
    await userEvent.click(screen.getByRole("button", { name: t("assets.showLess") }));
    expect(screen.getAllByRole("link")).toHaveLength(1);
  });

  it("says so when the image isn't used in any sequence", () => {
    renderCard([]);

    expect(screen.getByText(t("assets.notUsed"))).toBeInTheDocument();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
    expect(screen.getByRole("img")).toHaveAccessibleName(t("assets.imageAlt"));
  });
});
