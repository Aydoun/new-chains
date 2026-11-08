import { db, expect, test } from "../support/fixtures";
import {
  chooseTimeFilter,
  emptyState,
  search,
  searchBox,
  sequenceCard,
  sequenceViewer,
  sidebarLink,
  t,
} from "../support/ui";

test.describe("home feed", () => {
  test("lists other people's public sequences only", async ({
    page,
    data,
    users,
  }) => {
    // One marker for all three, so a single search finds them.
    const token = data.token();
    const title = () => data.sequenceTitle(`${token} ${data.token()}`);
    const authorPublic = await data.createSequence("author", { title: title() });
    const authorPrivate = await data.createSequence("author", {
      title: title(),
      visibility: "PRIVATE",
    });
    const mine = await data.createSequence("me", { title: title() });

    await page.goto("/");
    await expect(
      page.getByTestId("homepage-title"),
    ).toContainText(t("navigation.explore"));
    await search(page, token);

    await expect(sequenceCard(page, authorPublic.title)).toBeVisible();
    await expect(sequenceCard(page, authorPrivate.title)).toHaveCount(0);
    await expect(sequenceCard(page, mine.title)).toHaveCount(0);

    // Someone else's card shows its author and no owner actions.
    const card = sequenceCard(page, authorPublic.title);
    await expect(card.getByRole("link", { name: users.author.username })).toBeVisible();
    await expect(
      card.getByRole("button", { name: t("sequence.actions.delete") }),
    ).toHaveCount(0);
  });

  test("shows the empty state for a search with no results, and clears it", async ({
    page,
    data,
  }) => {
    await page.goto("/");
    await search(page, `no-match-${data.token()}`);

    await expect(emptyState(page)).toBeVisible();
    await page
      .getByRole("button", { name: t("states.emptySequences.clear") })
      .click();
    await expect(searchBox(page)).toHaveValue("");
    await expect(emptyState(page)).toBeHidden();
  });

  test("filters by creation time", async ({ page, data }) => {
    const token = data.token();
    const recent = await data.createSequence("author", {
      title: data.sequenceTitle(`${token} ${data.token()}`),
    });
    const old = await data.createSequence("author", {
      title: data.sequenceTitle(`${token} ${data.token()}`),
      createdAt: new Date(Date.now() - 62 * 24 * 60 * 60 * 1000),
    });

    await page.goto("/");
    await search(page, token);
    await expect(sequenceCard(page, old.title)).toBeVisible();

    await chooseTimeFilter(page, "last-hour");
    await expect(sequenceCard(page, recent.title)).toBeVisible();
    await expect(sequenceCard(page, old.title)).toHaveCount(0);
    await expect(
      page.getByRole("button", { name: t("common.filter") }),
    ).toContainText(t("filter.last-hour"));

    await chooseTimeFilter(page, null);
    await expect(sequenceCard(page, old.title)).toBeVisible();
  });

  test("opens a shared link straight into the sequence", async ({ page, data }) => {
    const frames = data.frames(2);
    const sequence = await data.createSequence("author", { frames });

    await page.goto(`/?sequence=${sequence.id}`);

    const viewer = sequenceViewer(page);
    await expect(viewer.getByRole("heading", { name: sequence.title })).toBeVisible();
    await expect(viewer.getByText(frames[0].content)).toBeVisible();
    await expect(viewer.getByText(frames[0].description!)).toBeVisible();
  });

  test("doesn't open someone else's private sequence from a link", async ({
    page,
    data,
  }) => {
    const sequence = await data.createSequence("author", { visibility: "PRIVATE" });

    const response = page.waitForResponse(`**/api/sequence/${sequence.id}`);
    await page.goto(`/?sequence=${sequence.id}`);

    expect((await response).status()).toBe(404);
    await expect(sequenceViewer(page).getByText(sequence.title)).toHaveCount(0);
  });

  test("goes to the author's page from a card", async ({ page, data, users }) => {
    const sequence = await data.createSequence("author");

    await page.goto("/");
    await search(page, sequence.title);
    await sequenceCard(page, sequence.title)
      .getByRole("link", { name: users.author.username })
      .click();

    await expect(page).toHaveURL(`/explore/${users.author.id}`);
  });

  test("create button opens the form in the studio, then lists the new sequence", async ({
    page,
    data,
    users,
  }) => {
    const title = data.sequenceTitle();
    const frame = data.frame();

    await page.goto("/");
    await expect(sidebarLink(page, "home")).toHaveAttribute("data-active", "true");
    await page
      .getByRole("button", { name: t("sequence.cta.label") })
      .first()
      .click();

    // Redirected to the studio (the one-shot param is dropped), with the
    // sidebar following along and the form already open.
    await expect(page).toHaveURL("/studio");
    await expect(sidebarLink(page, "studio")).toHaveAttribute("data-active", "true");
    await expect(sidebarLink(page, "home")).toHaveAttribute("data-active", "false");
    const dialog = page.getByRole("dialog");
    await dialog.getByRole("textbox", { name: t("sequence.draft.title") }).fill(title);
    await dialog.getByRole("button", { name: t("common.next"), exact: true }).click();
    await dialog
      .getByRole("textbox", {
        name: t("sequence.draft.frameContent-label", { index: 1 }),
      })
      .fill(frame.content);
    await dialog.getByRole("button", { name: t("sequence.cta.publish") }).click();

    // No confirmation banner: the new sequence simply shows up in the list,
    // without reloading or searching.
    await expect(dialog).toBeHidden();
    await expect(sequenceCard(page, title)).toBeVisible();
    await expect(page.getByRole("status")).toHaveCount(0);
    await expect
      .poll(async () => (await db.findSequenceByTitle(users.me.id, title))?.frames)
      .toEqual([expect.objectContaining({ content: frame.content })]);

    // Reloading the studio doesn't reopen the form.
    await page.reload();
    await expect(sequenceCard(page, title)).toBeVisible();
    await expect(dialog).toBeHidden();
  });

  test("empty state's create button also opens the form in the studio", async ({
    page,
    data,
  }) => {
    await page.goto("/");
    await search(page, `no-match-${data.token()}`);
    await expect(emptyState(page)).toBeVisible();

    // The header button has the same label; the empty state's comes last.
    await page
      .getByRole("button", { name: t("states.emptySequences.create") })
      .last()
      .click();

    await expect(page).toHaveURL("/studio");
    await expect(
      page
        .getByRole("dialog")
        .getByRole("textbox", { name: t("sequence.draft.title") }),
    ).toBeVisible();
  });

  test("onboarding checklist tracks progress and stays dismissed", async ({
    page,
  }) => {
    await page.goto("/");
    const checklist = page
      .locator("section")
      .filter({ hasText: t("onboarding.subtitle") });
    await expect(checklist).toBeVisible();
    await expect(
      checklist.getByText(t("onboarding.progress", { completed: 0, total: 3 })),
    ).toBeVisible();

    const createItem = checklist.getByRole("button", {
      name: t("onboarding.actions.markItem", {
        item: t("onboarding.items.create.title"),
      }),
    });
    await createItem.click();
    await expect(createItem).toHaveAttribute("aria-pressed", "true");
    await expect(
      checklist.getByText(t("onboarding.progress", { completed: 1, total: 3 })),
    ).toBeVisible();

    await checklist
      .getByRole("button", { name: t("onboarding.actions.skip") })
      .first()
      .click();
    await expect(checklist).toBeHidden();

    // Remembered in this browser.
    await page.reload();
    await expect(page.getByTestId("homepage-title")).toBeVisible();
    await expect(checklist).toBeHidden();
  });
});
