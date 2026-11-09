import { expect, test } from "../support/fixtures";
import { makePng } from "@/__tests__/helpers/png";
import { sequenceViewer, sidebarLink, t } from "../support/ui";

const upload = (request: import("@playwright/test").APIRequestContext) =>
  request
    .post("/api/asset/upload", {
      data: makePng(1080, 1350),
      headers: { "Content-Type": "image/png" },
    })
    .then((response) => response.json());

test.describe("assets folder", () => {
  test("is in the sidebar, after a divider", async ({ page }) => {
    await page.goto("/");

    const link = page.getByRole("link", { name: t("navigation.assets"), exact: true });
    await expect(link).toBeVisible();
    // The divider sits right above the Assets folder item.
    await expect(
      page.getByRole("separator").locator("xpath=following-sibling::li[1]"),
    ).toContainText(t("navigation.assets"));

    await link.click();
    await expect(page).toHaveURL("/assets");
    await expect(
      page.getByRole("heading", { level: 1, name: t("assets.title") }),
    ).toBeVisible();
    await expect(sidebarLink(page, "contact")).toBeVisible();
  });

  test("shows an uploaded image with its upload time and a link to its sequence", async ({
    page,
    request,
    data,
  }) => {
    const asset = await upload(request);
    const title = data.sequenceTitle();
    await request.post("/api/sequence/create", {
      data: { title, frames: [{ content: "Look at this", assetId: asset.id }] },
    });

    await page.goto("/assets");
    const card = page
      .getByTestId("asset-card")
      .filter({ has: page.getByRole("link", { name: title }) });

    await expect(card.getByRole("img")).toHaveAttribute("src", asset.url);
    await expect(card).toContainText(t("assets.uploaded", { time: "" }).trim());
    await expect(card.locator("time")).toHaveAttribute("datetime", /.+/);

    await card.getByRole("link", { name: title }).click();
    await expect(page).toHaveURL(/\/\?sequence=\d+$/);
    await expect(sequenceViewer(page).getByRole("heading", { name: title })).toBeVisible();
  });

  test("marks an image that isn't used in any sequence", async ({ page, request }) => {
    const asset = await upload(request);

    await page.goto("/assets");
    const card = page
      .getByTestId("asset-card")
      .filter({ has: page.locator(`img[src="${asset.url}"]`) });

    await expect(card).toContainText(t("assets.notUsed"));
    await expect(card.getByRole("link")).toHaveCount(0);
  });
});
