import { expect, test } from "@playwright/test";

test.describe("signed-out visitor", () => {
  test("sees the login page with Google sign-in", async ({ page }) => {
    await page.goto("/login");

    await expect(
      page.getByRole("heading", { name: "Welcome back" }),
    ).toBeVisible();
    await expect(page.getByTestId("google-sign-in")).toBeEnabled();
  });

  for (const path of ["/", "/studio", "/profile"]) {
    test(`is sent to login when opening ${path}`, async ({ page }) => {
      await page.goto(path);

      await expect(page).toHaveURL(
        `/login?callbackUrl=${encodeURIComponent(path)}`,
      );
      await expect(page.getByTestId("google-sign-in")).toBeVisible();
    });
  }

  test("can read the legal pages from the login page", async ({ page }) => {
    await page.goto("/login");

    await page.getByRole("link", { name: "Privacy Policy" }).click();
    await expect(page).toHaveURL("/privacy");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

    await page.goto("/login");
    await page.getByRole("link", { name: "Terms Of Service" }).click();
    await expect(page).toHaveURL("/terms");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });
});
