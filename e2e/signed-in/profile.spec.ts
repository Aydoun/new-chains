import type { Page } from "@playwright/test";
import { db, expect, test, type UserRow } from "../support/fixtures";
import { t } from "../support/ui";

/**
 * Opens the profile once the user's details have loaded: the page fills the
 * bio box from them, which would overwrite anything typed earlier.
 */
async function openProfile(page: Page, user: UserRow) {
  const loaded = page.waitForResponse(`**/api/user/${user.id}`);
  await page.goto("/profile");
  await loaded;
  const bioField = page.getByRole("textbox", { name: t("profile.bioLabel") });
  await expect(bioField).toHaveValue(user.bio ?? "");
  return bioField;
}

// Each test signs in as its own fresh user, since they change the bio.
test.describe("profile", () => {
  test("shows the account details", async ({ page, data, signInAs }) => {
    const user = await data.createUser();
    await signInAs(user);

    await page.goto("/profile");

    await expect(
      page.getByRole("heading", { name: t("profile.header") }),
    ).toBeVisible();
    await expect(page.getByRole("heading", { name: user.username })).toBeVisible();
    await expect(page.locator('input[type="email"]')).toHaveValue(user.email);
    await expect(
      page.getByText(t("profile.connectedMessage", { email: user.email })),
    ).toBeVisible();
  });

  test("saves the bio", async ({ page, data, signInAs }) => {
    const user = await data.createUser();
    await signInAs(user);
    const bio = data.bio();

    const bioField = await openProfile(page, user);
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
    expect((await db.findUser(user.id))?.bio).toBe(bio);

    await page.reload();
    await expect(
      page.getByRole("textbox", { name: t("profile.bioLabel") }),
    ).toHaveValue(bio);
  });

  test("stops the bio at 240 characters", async ({ page, data, signInAs }) => {
    const user = await data.createUser();
    await signInAs(user);

    const bioField = await openProfile(page, user);
    await bioField.fill(data.text(240));
    await expect(page.getByText("240/240")).toBeVisible();

    await bioField.press("End");
    await bioField.pressSequentially("xyz");
    await expect(bioField).toHaveValue(/^[a-zA-Z]{240}$/);
    await expect(page.getByText("240/240")).toBeVisible();
  });
});
