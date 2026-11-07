import { db, expect, test } from "../support/fixtures";
import {
  chooseTimeFilter,
  emptyState,
  search,
  sequenceCard,
  sequenceViewer,
  t,
} from "../support/ui";

test.describe("studio", () => {
  test("greets the signed-in user", async ({ page, users }) => {
    await page.goto("/studio");

    await expect(
      page.getByText(t("studio.greetings", { name: users.me.username })),
    ).toBeVisible();
  });

  test("shows the empty state to a user with no sequences", async ({
    page,
    data,
    signInAs,
  }) => {
    const user = await data.createUser();
    await signInAs(user);

    await page.goto("/studio");

    await expect(
      page.getByText(t("studio.greetings", { name: user.username })),
    ).toBeVisible();
    await expect(emptyState(page)).toBeVisible();
  });

  test("creates a multi-frame sequence and stores it in order", async ({
    page,
    data,
    users,
  }) => {
    const title = data.sequenceTitle();
    const description = data.sequenceDescription();
    const frames = data.frames(3);

    await page.goto("/studio");
    await page.getByRole("button", { name: t("sequence.cta.label") }).click();
    const dialog = page.getByRole("dialog");

    // Step 1: name and description.
    await dialog
      .getByRole("textbox", { name: t("sequence.draft.title") })
      .fill(title);
    await dialog
      .getByRole("textbox", { name: t("sequence.draft.description") })
      .fill(description);
    await dialog
      .getByRole("button", { name: t("common.next"), exact: true })
      .click();

    // Step 2: one frame at a time, "Add Frame" moves on to a new one.
    for (const [index, frame] of frames.entries()) {
      if (index > 0) {
        await dialog
          .getByRole("button", { name: t("sequence.draft.appendFrame") })
          .click();
      }
      await dialog
        .getByRole("textbox", {
          name: t("sequence.draft.frameContent-label", { index: index + 1 }),
        })
        .fill(frame.content);
      await dialog
        .getByRole("textbox", {
          name: t("sequence.draft.frameDescription-label", { index: index + 1 }),
        })
        .fill(frame.description!);
    }
    await expect(
      dialog.getByText(t("carousel.progress", { current: 3, total: 3 })),
    ).toBeVisible();

    await dialog
      .getByRole("button", { name: t("sequence.cta.publish") })
      .click();
    await expect(page.getByRole("status")).toHaveText(
      t("sequence.cta.creation-message"),
    );
    await expect(dialog).toBeHidden();

    // The database holds exactly what was typed, frames in order.
    const stored = await db.findSequenceByTitle(users.me.id, title);
    expect(stored).toMatchObject({
      title,
      description,
      visibility: "PUBLIC",
      isDeleted: false,
    });
    expect(
      stored!.frames.map(({ content, description }) => ({ content, description })),
    ).toEqual(frames);
    expect(stored!.frames.every((frame) => frame.createdById === users.me.id)).toBe(
      true,
    );

    // And the studio lists it. Search for it: parallel tests add sequences
    // for the same user, so it may not be on the first page.
    await page.reload();
    await search(page, title);
    await expect(sequenceCard(page, title)).toBeVisible();
  });

  test("won't move on or publish without the required fields", async ({
    page,
    data,
  }) => {
    await page.goto("/studio");
    await page.getByRole("button", { name: t("sequence.cta.label") }).click();
    const dialog = page.getByRole("dialog");
    const next = dialog.getByRole("button", { name: t("common.next"), exact: true });
    const title = dialog.getByRole("textbox", { name: t("sequence.draft.title") });

    await expect(next).toBeDisabled();
    await title.fill("   ");
    await expect(next).toBeDisabled();

    await title.fill(data.sequenceTitle());
    await next.click();

    // An empty frame can't be followed by another one, nor published.
    await dialog
      .getByRole("button", { name: t("sequence.draft.appendFrame") })
      .click();
    await expect(dialog.getByText(t("common.required"))).toBeVisible();
    await expect(
      dialog.getByRole("button", { name: t("sequence.cta.publish") }),
    ).toBeDisabled();

    // Closing discards the draft.
    await dialog.getByRole("button", { name: t("common.close") }).click();
    await expect(dialog).toBeHidden();
  });

  test("creates a sequence from a template", async ({ page, data, users }) => {
    const title = `${t("templates.template1.title")} ${data.token()}`;
    const templateSteps = [1, 2, 3].map((step) => ({
      content: t(`templates.template1.steps.${step}.content`),
      description: t(`templates.template1.steps.${step}.description`),
    }));

    await page.goto("/studio");
    await page
      .getByRole("button", { name: t("studio.template-create") })
      .click();
    const picker = page.getByRole("dialog");
    await expect(
      picker.getByRole("heading", { name: t("templates.start") }),
    ).toBeVisible();
    await picker
      .getByRole("button", { name: t("templates.cta") })
      .first()
      .click();

    // The form opens on the frames step, pre-filled from the template.
    const form = page.getByRole("dialog");
    await expect(
      form.getByRole("textbox", {
        name: t("sequence.draft.frameContent-label", { index: 1 }),
      }),
    ).toHaveValue(templateSteps[0].content);

    // Go back to step 1 to make the title unique to this run.
    await form.getByRole("button", { name: t("carousel.previous") }).click();
    await form
      .getByRole("textbox", { name: t("sequence.draft.title") })
      .fill(title);
    await form
      .getByRole("button", { name: t("common.next"), exact: true })
      .click();
    await form.getByRole("button", { name: t("sequence.cta.publish") }).click();
    await expect(page.getByRole("status")).toHaveText(
      t("sequence.cta.creation-message"),
    );

    const stored = await db.findSequenceByTitle(users.me.id, title);
    expect(
      stored!.frames.map(({ content, description }) => ({ content, description })),
    ).toEqual(templateSteps);
  });

  test("lists the user's private sequences too", async ({ page, data }) => {
    const sequence = await data.createSequence("me", { visibility: "PRIVATE" });

    await page.goto("/studio");
    await search(page, sequence.title);

    await expect(sequenceCard(page, sequence.title)).toBeVisible();
  });

  test("searches the user's sequences", async ({ page, data }) => {
    // Both share one marker; each also has its own.
    const shared = data.token();
    const matchToken = data.token();
    const match = await data.createSequence("me", {
      title: data.sequenceTitle(`${shared} ${matchToken}`),
    });
    const other = await data.createSequence("me", {
      title: data.sequenceTitle(`${shared} ${data.token()}`),
    });

    await page.goto("/studio");
    await search(page, shared);
    await expect(sequenceCard(page, match.title)).toBeVisible();
    await expect(sequenceCard(page, other.title)).toBeVisible();

    // Search is case-insensitive.
    await search(page, matchToken.toUpperCase());
    await expect(sequenceCard(page, match.title)).toBeVisible();
    await expect(sequenceCard(page, other.title)).toHaveCount(0);
  });

  test("filters by creation time", async ({ page, data }) => {
    const token = data.token();
    const old = await data.createSequence("me", {
      title: data.sequenceTitle(token),
      createdAt: new Date(Date.now() - 62 * 24 * 60 * 60 * 1000),
    });

    await page.goto("/studio");
    await search(page, token);
    await expect(sequenceCard(page, old.title)).toBeVisible();

    await chooseTimeFilter(page, "this-month");
    await expect(emptyState(page)).toBeVisible();
    await expect(sequenceCard(page, old.title)).toHaveCount(0);

    await chooseTimeFilter(page, null);
    await expect(sequenceCard(page, old.title)).toBeVisible();
  });

  test("opens a sequence and steps through its frames", async ({ page, data }) => {
    const frames = data.frames(3);
    const sequence = await data.createSequence("me", { frames });

    await page.goto("/studio");
    await search(page, sequence.title);
    await sequenceCard(page, sequence.title).getByText(sequence.title).click();

    const viewer = sequenceViewer(page);
    await expect(
      viewer.getByRole("heading", { name: sequence.title }),
    ).toBeVisible();
    await expect(viewer.getByText(frames[0].content)).toBeVisible();

    await viewer.getByRole("button", { name: t("carousel.next") }).click();
    await expect(viewer.getByText(frames[1].content)).toBeVisible();
    await expect(
      viewer.getByText(t("carousel.progress", { current: 2, total: 3 })),
    ).toBeVisible();

    // Arrow keys work too.
    await page.keyboard.press("ArrowRight");
    await expect(viewer.getByText(frames[2].content)).toBeVisible();
    await page.keyboard.press("ArrowLeft");
    await expect(viewer.getByText(frames[1].content)).toBeVisible();

    await viewer.getByRole("button", { name: t("common.close") }).click();
    await expect(viewer).toBeHidden();
  });

  test("copies a share link that opens the sequence", async ({
    page,
    context,
    data,
    baseURL,
  }) => {
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    const sequence = await data.createSequence("me");

    await page.goto("/studio");
    await search(page, sequence.title);
    const card = sequenceCard(page, sequence.title);
    await card.getByRole("button", { name: t("sequence.actions.share") }).click();
    await expect(card.getByText(t("sequence.cta.url-copied"))).toBeVisible();

    const link = await page.evaluate(() => navigator.clipboard.readText());
    expect(link).toBe(`${baseURL}/?sequence=${sequence.id}`);

    await page.goto(link);
    await expect(
      sequenceViewer(page).getByRole("heading", { name: sequence.title }),
    ).toBeVisible();
  });

  test("deletes a sequence (soft delete)", async ({ page, data }) => {
    const sequence = await data.createSequence("me");

    await page.goto("/studio");
    await search(page, sequence.title);
    const card = sequenceCard(page, sequence.title);
    await card
      .getByRole("button", { name: t("sequence.actions.delete") })
      .click();
    await expect(card).toBeHidden();

    // Kept in the database, flagged as deleted.
    await expect
      .poll(async () => (await db.findSequence(sequence.id))?.isDeleted)
      .toBe(true);

    await page.reload();
    await search(page, sequence.title);
    await expect(emptyState(page)).toBeVisible();
  });
});
