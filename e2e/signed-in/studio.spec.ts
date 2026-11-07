import { expect, test } from "@playwright/test";
import { TEST_USER } from "../support/constants";

test.describe("studio", () => {
  test("greets the signed-in user", async ({ page }) => {
    await page.goto("/studio");

    await expect(page.getByText(`Hello ${TEST_USER.username}`)).toBeVisible();
  });

  test("signed-in user is redirected away from login", async ({ page }) => {
    await page.goto("/login");

    await expect(page).toHaveURL("/");
  });

  test("creates a sequence, then deletes it", async ({ page }) => {
    // Unique per run so parallel or repeated runs never collide.
    const title = `E2E sequence ${Date.now()}`;

    await page.goto("/studio");
    await page.getByRole("button", { name: "New Sequence" }).click();

    // Step 1: name and description.
    await page.getByPlaceholder("e.g., The 10 minutes morning routine").fill(title);
    await page
      .getByPlaceholder("Briefly explain what this sequence is about")
      .fill("Created by Playwright");
    await page.getByRole("button", { name: "Next", exact: true }).click();

    // Step 2: frames.
    await page
      .getByPlaceholder("What's the message to convey?")
      .first()
      .fill("First frame");
    await page.getByRole("button", { name: "Publish", exact: true }).click();

    await expect(page.getByRole("status")).toHaveText(
      "Sequence created successfully.",
    );

    // It's stored, not just shown: it survives a reload.
    await page.reload();
    const card = page
      .locator("div.group")
      .filter({ has: page.getByText(title, { exact: true }) });
    await expect(card).toBeVisible();

    await card.getByRole("button", { name: "Delete sequence" }).click();
    await expect(card).toBeHidden();

    await page.reload();
    await expect(page.getByText(`Hello ${TEST_USER.username}`)).toBeVisible();
    await expect(page.getByText(title, { exact: true })).toHaveCount(0);
  });
});
