import { expect, test } from "@playwright/test";
import { translate } from "@/lib/i18n";
import { TEST_USER } from "../support/constants";

const greeting = translate("studio.greetings", { name: TEST_USER.username });

test.describe("studio", () => {
  test("greets the signed-in user", async ({ page }) => {
    await page.goto("/studio");

    await expect(page.getByText(greeting)).toBeVisible();
  });

  test("signed-in user is redirected away from login", async ({ page }) => {
    await page.goto("/login");

    await expect(page).toHaveURL("/");
  });

  test("creates a sequence, then deletes it", async ({ page }) => {
    // Unique per run so parallel or repeated runs never collide.
    const title = `E2E sequence ${Date.now()}`;

    await page.goto("/studio");
    await page
      .getByRole("button", { name: translate("sequence.cta.label") })
      .click();

    // Step 1: name and description.
    const dialog = page.getByRole("dialog");
    await dialog
      .getByRole("textbox", { name: translate("sequence.draft.title") })
      .fill(title);
    await dialog
      .getByRole("textbox", { name: translate("sequence.draft.description") })
      .fill("Created by Playwright");
    await dialog
      .getByRole("button", { name: translate("common.next"), exact: true })
      .click();

    // Step 2: frames.
    await dialog
      .getByRole("textbox", {
        name: translate("sequence.draft.frameContent-label", { index: 1 }),
      })
      .fill("First frame");
    await dialog
      .getByRole("button", { name: translate("sequence.cta.publish") })
      .click();

    await expect(page.getByRole("status")).toHaveText(
      translate("sequence.cta.creation-message"),
    );

    // It's stored, not just shown: it survives a reload.
    await page.reload();
    const card = page
      .getByTestId("sequence-card")
      .filter({ hasText: title });
    await expect(card).toBeVisible();

    await card
      .getByRole("button", { name: translate("sequence.actions.delete") })
      .click();
    await expect(card).toBeHidden();

    await page.reload();
    await expect(page.getByText(greeting)).toBeVisible();
    await expect(
      page.getByTestId("sequence-card").filter({ hasText: title }),
    ).toHaveCount(0);
  });
});
