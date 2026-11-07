import type { Page } from "@playwright/test";
import { db, expect, test } from "../support/fixtures";
import { t } from "../support/ui";

/**
 * Opens the profile once the user's details have loaded: the page fills the
 * bio box from them, which would overwrite anything typed earlier.
 */
async function openProfile(page: Page, userId: number) {
  const loaded = page.waitForResponse(`**/api/user/${userId}`);
  await page.goto("/profile");
  await loaded;
  const bioField = page.getByRole("textbox", { name: t("profile.bioLabel") });
  await expect(bioField).toHaveValue((await db.findUser(userId))?.bio ?? "");
  return bioField;
}

test.describe("profile", () => {
  test("shows the account details", async ({ page, users }) => {
    await page.goto("/profile");

    await expect(
      page.getByRole("heading", { name: t("profile.header") }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: users.me.username }),
    ).toBeVisible();
    await expect(page.locator('input[type="email"]')).toHaveValue(users.me.email);
    await expect(
      page.getByText(t("profile.connectedMessage", { email: users.me.email })),
    ).toBeVisible();
  });

  test("saves the bio", async ({ page, data, users, exclusive }) => {
    // Other tests change this user's bio too: take turns.
    await exclusive("bio");
    const bio = data.bio();

    const bioField = await openProfile(page, users.me.id);
    await bioField.fill(`  ${bio}  `);
    await expect(page.getByText(`${bio.length + 4}/240`)).toBeVisible();

    const saved = page.waitForResponse(
      (response) =>
        response.url().includes("/api/user/update") &&
        response.request().method() === "PUT",
    );
    await page.getByRole("button", { name: t("common.save") }).click();
    expect((await saved).status()).toBe(200);

    // Stored trimmed.
    expect((await db.findUser(users.me.id))?.bio).toBe(bio);

    await page.reload();
    await expect(
      page.getByRole("textbox", { name: t("profile.bioLabel") }),
    ).toHaveValue(bio);
  });

  test("stops the bio at 240 characters", async ({
    page,
    data,
    users,
    exclusive,
  }) => {
    await exclusive("bio");

    const bioField = await openProfile(page, users.me.id);
    await bioField.fill(data.text(240));
    await expect(page.getByText("240/240")).toBeVisible();

    await bioField.press("End");
    await bioField.pressSequentially("xyz");
    await expect(bioField).toHaveValue(/^[a-zA-Z]{240}$/);
    await expect(page.getByText("240/240")).toBeVisible();
  });
});
