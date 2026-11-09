import { db, expect, test } from "../support/fixtures";
import { sequenceViewer, t } from "../support/ui";

/** Answers for the external site, so tests never leave the machine. */
const EXTERNAL = "https://docs.example.com";

test.describe("frame links", () => {
  test.beforeEach(async ({ context }) => {
    await context.route(`${EXTERNAL}/**`, (route) =>
      route.fulfill({ contentType: "text/html", body: "<title>External page</title>" }),
    );
  });

  test("adds a link while building a frame and opens it in a new tab", async ({
    page,
    data,
    users,
  }) => {
    const title = data.sequenceTitle();

    await page.goto("/studio");
    await page.getByRole("button", { name: t("sequence.cta.label") }).click();
    const dialog = page.getByRole("dialog");
    await dialog.getByRole("textbox", { name: t("sequence.draft.title") }).fill(title);
    await dialog.getByRole("button", { name: t("common.next"), exact: true }).click();

    await dialog
      .getByRole("textbox", { name: t("sequence.draft.frameContent-label", { index: 1 }) })
      .fill("Read the setup guide");
    await dialog.getByRole("button", { name: t("frame.link.add") }).click();
    const linkInput = dialog.getByRole("textbox", { name: t("frame.link.label", { index: 1 }) });

    // A dangerous link is explained and blocks publishing.
    await linkInput.fill("javascript:alert(1)");
    await expect(dialog.getByRole("alert")).toHaveText(t("frame.link.errors.protocol"));
    await expect(dialog.getByRole("button", { name: t("sequence.cta.publish") })).toBeDisabled();

    await linkInput.fill("docs.example.com/setup");
    await expect(dialog.getByRole("alert")).toHaveCount(0);
    await dialog.getByRole("button", { name: t("sequence.cta.publish") }).click();
    await expect(dialog).toBeHidden();

    const stored = await db.findSequenceByTitle(users.me.id, title);
    expect(await db.findFrameLink(stored!.frames[0].id)).toBe(`${EXTERNAL}/setup`);

    // In the viewer: the frame is a link, marked with its host.
    await page.goto(`/?sequence=${stored!.id}`);
    const link = sequenceViewer(page).getByTestId("frame-link");
    await expect(link).toContainText("Read the setup guide");
    await expect(link).toContainText("docs.example.com");
    await expect(link).toHaveAttribute("target", "_blank");
    await expect(link).toHaveAttribute("rel", /noopener/);
    await expect(link).toHaveAttribute("rel", /noreferrer/);

    const [popup] = await Promise.all([page.waitForEvent("popup"), link.click()]);
    await expect(popup).toHaveURL(`${EXTERNAL}/setup`);
    // noopener: the new tab has no handle back to this one.
    expect(await popup.evaluate(() => window.opener)).toBeNull();
    // The app's tab stayed where it was.
    await expect(page).toHaveURL(`/?sequence=${stored!.id}`);
  });

  test("frames without a link aren't links", async ({ page, data }) => {
    const sequence = await data.createSequence("author", { frames: data.frames(1) });

    await page.goto(`/?sequence=${sequence.id}`);

    await expect(sequenceViewer(page).getByText(sequence.title)).toBeVisible();
    await expect(sequenceViewer(page).getByTestId("frame-link")).toHaveCount(0);
  });

  test("an unsafe link that reached the database is never rendered", async ({ page, data }) => {
    const frames = data.frames(1);
    const sequence = await data.createSequence("author", { frames });
    await db.setFrameLink(sequence.FrameOrder[0], "javascript:alert(document.cookie)");

    await page.goto(`/?sequence=${sequence.id}`);
    const viewer = sequenceViewer(page);

    await expect(viewer.getByText(frames[0].content)).toBeVisible();
    await expect(viewer.getByTestId("frame-link")).toHaveCount(0);
    await expect(viewer.locator('a[href^="javascript:"]')).toHaveCount(0);
  });
});
