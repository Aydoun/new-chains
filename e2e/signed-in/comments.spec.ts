import { db, expect, test } from "../support/fixtures";
import { search, sequenceCard, sequenceViewer, t } from "../support/ui";

test.describe("sequence comments", () => {
  test("posts a comment, shows it on top and updates the card's count", async ({
    page,
    data,
    users,
    fake,
  }) => {
    const sequence = await data.createSequence("author");
    await db.insertComment({
      sequenceId: sequence.id,
      authorId: users.author.id,
      content: "First!",
      createdAt: new Date(Date.now() - 5 * 60_000),
    });
    const content = fake.lorem.sentence();

    await page.goto("/");
    await search(page, sequence.title);
    const card = sequenceCard(page, sequence.title);
    await expect(card.getByTestId("comment-count")).toHaveText("1");
    await card.click();

    const viewer = sequenceViewer(page);
    await expect(viewer.getByText("First!")).toBeVisible();
    await viewer.getByRole("textbox", { name: t("comments.label") }).fill(content);
    await viewer.getByRole("button", { name: t("comments.post") }).click();

    const comments = viewer.getByTestId("comment");
    await expect(comments.first()).toContainText(content);
    await expect(comments.first()).toContainText(users.me.username);
    await expect(comments).toHaveCount(2);
    await expect(viewer.getByTestId("comment-total")).toHaveText("2");
    await expect(viewer.getByRole("textbox", { name: t("comments.label") })).toHaveValue("");

    await page.keyboard.press("Escape");
    await expect(card.getByTestId("comment-count")).toHaveText("2");
  });

  test("loads older comments with the button", async ({ page, data, users }) => {
    const sequence = await data.createSequence("author");
    const base = Date.now() - 60 * 60_000;
    for (let i = 1; i <= 12; i++) {
      await db.insertComment({
        sequenceId: sequence.id,
        authorId: users.author.id,
        content: `Comment number ${i}`,
        createdAt: new Date(base + i * 60_000),
      });
    }

    await page.goto(`/?sequence=${sequence.id}`);
    const viewer = sequenceViewer(page);
    const comments = viewer.getByTestId("comment");

    await expect(comments).toHaveCount(10);
    await expect(comments.first()).toContainText("Comment number 12");

    await viewer.getByRole("button", { name: t("comments.loadMore") }).click();

    await expect(comments).toHaveCount(12);
    await expect(comments.last()).toContainText("Comment number 1");
    await expect(viewer.getByRole("button", { name: t("comments.loadMore") })).toHaveCount(0);
  });

  test("deletes your own comment, and can't delete others'", async ({
    page,
    data,
    users,
  }) => {
    const sequence = await data.createSequence("author");
    await db.insertComment({
      sequenceId: sequence.id,
      authorId: users.author.id,
      content: "The author's comment",
      createdAt: new Date(Date.now() - 60_000),
    });
    const mine = await db.insertComment({
      sequenceId: sequence.id,
      authorId: users.me.id,
      content: "My comment",
    });

    await page.goto(`/?sequence=${sequence.id}`);
    const viewer = sequenceViewer(page);
    const myComment = viewer.getByTestId("comment").filter({ hasText: "My comment" });
    const theirs = viewer.getByTestId("comment").filter({ hasText: "The author's comment" });

    await expect(theirs.getByRole("button", { name: t("comments.delete") })).toHaveCount(0);

    await myComment.getByRole("button", { name: t("comments.delete") }).click();
    await myComment.getByRole("button", { name: t("comments.delete") }).click();

    await expect(myComment).toHaveCount(0);
    await expect(viewer.getByTestId("comment-total")).toHaveText("1");
    expect(await db.findComment(mine.id)).toMatchObject({ isDeleted: true });
  });

  test("shows initials when the author has no picture", async ({ page, data, users }) => {
    const sequence = await data.createSequence("author");
    await db.insertComment({
      sequenceId: sequence.id,
      authorId: users.author.id,
      content: "No picture here",
    });

    await page.goto(`/?sequence=${sequence.id}`);
    const comment = sequenceViewer(page).getByTestId("comment").first();

    // The seeded author is "E2E Author" and has no avatar.
    await expect(comment.getByTestId("avatar-initials")).toHaveText("EA");
  });
});
