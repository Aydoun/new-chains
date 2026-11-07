import { expect, test } from "@playwright/test";
import { translate } from "@/lib/i18n";

test.describe("signed-out visitor", () => {
  test("sees the login page with Google sign-in", async ({ page }) => {
    await page.goto("/login");

    await expect(
      page.getByRole("heading", { name: translate("auth.welcome") }),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: translate("auth.cta.google") }),
    ).toBeEnabled();
  });

  for (const path of ["/", "/studio", "/profile"]) {
    test(`is sent to login when opening ${path}`, async ({ page }) => {
      await page.goto(path);

      await expect(page).toHaveURL(
        `/login?callbackUrl=${encodeURIComponent(path)}`,
      );
      await expect(
        page.getByRole("button", { name: translate("auth.cta.google") }),
      ).toBeVisible();
    });
  }

  test("can read the legal pages from the login page", async ({ page }) => {
    await page.goto("/login");

    await page
      .getByRole("link", { name: translate("footer.privacyPolicy") })
      .click();
    await expect(page).toHaveURL("/privacy");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

    await page.goto("/login");
    await page.getByRole("link", { name: translate("footer.terms") }).click();
    await expect(page).toHaveURL("/terms");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });
});
