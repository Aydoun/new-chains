import { db, expect, test } from "../support/fixtures";
import { sequenceViewer, t } from "../support/ui";

const snippetCard = (page: import("@playwright/test").Page, content: string) =>
  page.getByTestId("snippet-card").filter({ hasText: content });

async function openFavorites(page: import("@playwright/test").Page) {
  await page.goto("/studio");
  const favorites = page.getByRole("button", { name: t("common.favorites") });
  await favorites.click();
  await expect(favorites).toHaveAttribute("aria-pressed", "true");
}

test.describe("snippets (saved frames)", () => {
  test("saves a frame from someone else's sequence", async ({
    page,
    data,
    users,
  }) => {
    const frames = data.frames(3);
    const sequence = await data.createSequence("author", { frames });

    await page.goto(`/?sequence=${sequence.id}`);
    const viewer = sequenceViewer(page);
    await expect(viewer.getByText(frames[0].content)).toBeVisible();

    // Move to the second frame and save it.
    await viewer.getByRole("button", { name: t("carousel.next") }).click();
    await expect(viewer.getByText(frames[1].content)).toBeVisible();
    const save = viewer.getByRole("button", { name: t("snippets.saveAction") });
    await expect(save).toHaveAttribute("aria-pressed", "false");
    await save.click();
    await expect(save).toHaveAttribute("aria-pressed", "true");

    // Stored against the right frame, sequence and user.
    const savedFrameId = sequence.FrameOrder[1];
    await expect
      .poll(() => db.findSnippets({ userId: users.me.id, frameId: savedFrameId }))
      .toEqual([
        expect.objectContaining({
          frameId: savedFrameId,
          originSequenceId: sequence.id,
          createdById: users.me.id,
        }),
      ]);

    // Still marked as saved when the sequence is opened again.
    await page.reload();
    await viewer.getByRole("button", { name: t("carousel.next") }).click();
    await expect(viewer.getByText(frames[1].content)).toBeVisible();
    await expect(
      viewer.getByRole("button", { name: t("snippets.saveAction") }),
    ).toHaveAttribute("aria-pressed", "true");
  });

  test("lists saved frames under Favorites in the studio", async ({
    page,
    data,
    users,
  }) => {
    const frames = data.frames(2);
    const sequence = await data.createSequence("author", { frames });
    await db.insertSnippet({
      userId: users.me.id,
      frameId: sequence.FrameOrder[0],
      originSequenceId: sequence.id,
    });

    await openFavorites(page);

    const card = snippetCard(page, frames[0].content);
    await expect(card).toBeVisible();
    await expect(card.getByText(frames[0].description!)).toBeVisible();
    await expect(snippetCard(page, frames[1].content)).toHaveCount(0);
  });

  test("opens the original sequence from a saved frame", async ({
    page,
    data,
    users,
  }) => {
    const frames = data.frames(2);
    const sequence = await data.createSequence("author", { frames });
    await db.insertSnippet({
      userId: users.me.id,
      frameId: sequence.FrameOrder[0],
      originSequenceId: sequence.id,
    });

    await openFavorites(page);
    await snippetCard(page, frames[0].content)
      .getByRole("button", { name: t("snippets.menu.label") })
      .click();
    await page.getByRole("menuitem", { name: t("snippets.menu.view") }).click();

    await expect(
      sequenceViewer(page).getByRole("heading", { name: sequence.title }),
    ).toBeVisible();
  });

  test("removes a saved frame", async ({ page, data, users }) => {
    const sequence = await data.createSequence("author");
    const frameId = sequence.FrameOrder[0];
    await db.insertSnippet({
      userId: users.me.id,
      frameId,
      originSequenceId: sequence.id,
    });
    const [frame] = (await db.findSequence(sequence.id))!.frames;

    await openFavorites(page);
    const card = snippetCard(page, frame.content);
    await card.getByRole("button", { name: t("snippets.menu.label") }).click();
    await page.getByRole("menuitem", { name: t("snippets.menu.delete") }).click();

    await expect(card).toBeHidden();
    await expect
      .poll(() => db.findSnippets({ userId: users.me.id, frameId }))
      .toEqual([]);
    // The frame itself is untouched: it still belongs to its sequence.
    expect((await db.findSequence(sequence.id))!.frames).toHaveLength(
      sequence.FrameOrder.length,
    );
  });
});
