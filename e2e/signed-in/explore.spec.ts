import { expect, test } from "../support/fixtures";
import { search, sequenceCard, sequenceViewer, t } from "../support/ui";

test.describe("a user's explore page", () => {
  test("shows that user's public sequences only", async ({ page, data, users }) => {
    const token = data.token();
    const title = () => data.sequenceTitle(`${token} ${data.token()}`);
    const visible = await data.createSequence("author", { title: title() });
    const hidden = await data.createSequence("author", {
      title: title(),
      visibility: "PRIVATE",
    });
    const someoneElse = await data.createSequence("me", { title: title() });

    await page.goto(`/explore/${users.author.id}`);
    await expect(
      page.getByText(t("studio.explorerWelcome", { name: users.author.username })),
    ).toBeVisible();
    await search(page, token);

    const card = sequenceCard(page, visible.title);
    await expect(card).toBeVisible();
    await expect(sequenceCard(page, hidden.title)).toHaveCount(0);
    await expect(sequenceCard(page, someoneElse.title)).toHaveCount(0);

    // The page is about one author, so cards don't repeat the name.
    await expect(
      card.getByRole("link", { name: users.author.username }),
    ).toHaveCount(0);

    await card.getByText(visible.title).click();
    await expect(
      sequenceViewer(page).getByRole("heading", { name: visible.title }),
    ).toBeVisible();
  });
});
