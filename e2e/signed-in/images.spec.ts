import type { Page } from "@playwright/test";
import { db, expect, test } from "../support/fixtures";
import { sequenceCard, sequenceViewer, t } from "../support/ui";
import { makePng } from "@/__tests__/helpers/png";
import { imageErrorParams } from "@/lib/image-validation";

const png = (name: string, width: number, height: number) => ({
  name,
  mimeType: "image/png",
  buffer: makePng(width, height),
});

/** Opens the form from the studio and moves to the frames step. */
async function startSequence(page: Page, title: string) {
  await page.goto("/studio");
  await page.getByRole("button", { name: t("sequence.cta.label") }).click();
  const dialog = page.getByRole("dialog");
  await dialog.getByRole("textbox", { name: t("sequence.draft.title") }).fill(title);
  await dialog.getByRole("button", { name: t("common.next"), exact: true }).click();
  return dialog;
}

test.describe("frame images", () => {
  test("uploads a picture for a frame and shows it when viewing the sequence", async ({
    page,
    data,
    users,
  }) => {
    const title = data.sequenceTitle();
    const caption = data.frame().content;
    const dialog = await startSequence(page, title);

    await dialog
      .getByRole("textbox", {
        name: t("sequence.draft.frameContent-label", { index: 1 }),
      })
      .fill(caption);
    await dialog
      .getByLabel(t("images.add"))
      .setInputFiles(png("portrait.png", 1080, 1350));
    await expect(
      dialog.getByRole("img", { name: t("images.preview", { index: 1 }) }),
    ).toBeVisible();

    await dialog.getByRole("button", { name: t("sequence.cta.publish") }).click();
    await expect(dialog).toBeHidden();

    // Stored as an IMAGE frame whose asset records the uploader.
    const stored = await db.findSequenceByTitle(users.me.id, title);
    const media = await db.findFrameMedia(stored!.frames[0].id);
    expect(media).toMatchObject({
      type: "IMAGE",
      asset: { uploadedById: users.me.id, width: 1080, height: 1350 },
    });
    expect(media!.asset!.pathname).toMatch(`assets/${users.me.id}/`);

    // The studio card previews the picture, with the text over it.
    const cardImage = sequenceCard(page, title)
      .getByTestId("card-image-frame")
      .getByRole("img", { name: caption });
    await expect(cardImage).toBeVisible();
    await expect
      .poll(() => cardImage.evaluate((img: HTMLImageElement) => img.naturalWidth))
      .toBe(1080);

    // The viewer draws it as a picture with the text as its caption.
    await sequenceCard(page, title).getByText(title).click();
    const viewer = sequenceViewer(page);
    const frame = viewer.getByTestId("image-frame");
    await expect(frame).toBeVisible();
    const image = frame.getByRole("img", { name: caption });
    await expect(image).toBeVisible();
    await expect
      .poll(() => image.evaluate((img: HTMLImageElement) => img.naturalWidth))
      .toBe(1080);
    await expect(frame.getByText(caption)).toBeVisible();
  });

  test("rejects a picture with the wrong proportions before uploading", async ({
    page,
    data,
  }) => {
    const dialog = await startSequence(page, data.sequenceTitle());
    let uploads = 0;
    page.on("request", (request) => {
      if (request.url().includes("/api/asset/upload")) uploads += 1;
    });

    await dialog
      .getByLabel(t("images.add"))
      .setInputFiles(png("banner.png", 1200, 400));

    await expect(dialog.getByRole("alert")).toHaveText(
      t("images.errors.ratio", imageErrorParams),
    );
    await expect(
      dialog.getByRole("img", { name: t("images.preview", { index: 1 }) }),
    ).toHaveCount(0);
    expect(uploads).toBe(0);
  });

  test("text frames still show as text", async ({ page, data }) => {
    const frames = data.frames(1);
    const sequence = await data.createSequence("me", { frames });

    await page.goto("/studio");
    await page.getByRole("textbox", { name: t("common.search") }).fill(sequence.title);
    await sequenceCard(page, sequence.title).getByText(sequence.title).click();

    const viewer = sequenceViewer(page);
    await expect(viewer.getByText(frames[0].content)).toBeVisible();
    await expect(viewer.getByTestId("image-frame")).toHaveCount(0);
  });
});
