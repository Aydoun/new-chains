import type { Page } from "@playwright/test";
import { expect, test } from "../support/fixtures";
import { makePng } from "@/__tests__/helpers/png";
import { emptyState, search, sequenceViewer, t } from "../support/ui";

/** Makes the list endpoints fail until the returned `heal()` is called. */
async function failSequenceLists(page: Page) {
  let failing = true;
  await page.route(/\/api\/sequence\/(fetch|studio)/, (route) =>
    failing
      ? route.fulfill({ status: 500, json: { message: "Internal server error" } })
      : route.continue(),
  );
  return { heal: () => (failing = false) };
}

/** The error card's "Home" link (the sidebar has a Home link too). */
const errorHomeLink = (page: Page) =>
  page.getByRole("main").getByRole("link", { name: t("states.sequenceError.dashboard") });

const errorTitle = (page: Page) =>
  page.getByRole("heading", { name: t("states.sequenceError.title") });

test.describe("error and empty states", () => {
  test("Retry reloads the home feed after an error", async ({ page }) => {
    const api = await failSequenceLists(page);

    await page.goto("/");
    await expect(errorTitle(page)).toBeVisible();
    // Already home: no "Home" button that would go nowhere.
    await expect(errorHomeLink(page)).toHaveCount(0);

    api.heal();
    await page.getByRole("button", { name: t("states.sequenceError.retry") }).click();

    await expect(errorTitle(page)).toBeHidden();
  });

  test("Retry and Home work from the studio's error state", async ({ page }) => {
    const api = await failSequenceLists(page);

    await page.goto("/studio");
    await expect(errorTitle(page)).toBeVisible();

    api.heal();
    await page.getByRole("button", { name: t("states.sequenceError.retry") }).click();
    await expect(errorTitle(page)).toBeHidden();

    await page.unrouteAll();
    await failSequenceLists(page);
    await page.reload();
    await errorHomeLink(page).click();
    await expect(page).toHaveURL("/");
  });

  test("the studio's empty state opens the new sequence form", async ({ page, data }) => {
    await page.goto("/studio");
    await search(page, `no-match-${data.token()}`);
    await expect(emptyState(page)).toBeVisible();

    await page
      .getByRole("button", { name: t("states.emptySequences.create") })
      .last()
      .click();

    await expect(
      page.getByRole("dialog").getByRole("textbox", { name: t("sequence.draft.title") }),
    ).toBeVisible();
  });
});

test.describe("sequence viewer with an image", () => {
  test("keeps the close button reachable on a short window", async ({ page, request, data }) => {
    const asset = await (
      await request.post("/api/asset/upload", {
        data: makePng(1080, 1920),
        headers: { "Content-Type": "image/png" },
      })
    ).json();
    const sequence = await (
      await request.post("/api/sequence/create", {
        data: {
          title: data.sequenceTitle(),
          frames: [{ content: "Tall picture", assetId: asset.id }, { content: "Next" }],
        },
      })
    ).json();

    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto(`/?sequence=${sequence.id}`);
    const viewer = sequenceViewer(page);
    await expect(viewer.getByTestId("image-frame")).toBeVisible();

    const close = viewer.getByRole("button", { name: t("common.close") });
    await expect(close).toBeInViewport();
    // The picture leaves room for the rest of the frame on screen.
    const image = await viewer.getByRole("img", { name: "Tall picture" }).boundingBox();
    expect(image!.height).toBeLessThanOrEqual(720 * 0.4 + 1);

    await close.click();
    await expect(viewer).toBeHidden();
  });
});
