import { expect, test } from "../support/fixtures";
import { t } from "../support/ui";

test.describe("navigation and session", () => {
  test("signed-in user is redirected away from login", async ({ page }) => {
    await page.goto("/login");

    await expect(page).toHaveURL("/");
  });

  test("sidebar links reach every page", async ({ page }) => {
    await page.goto("/");

    const destinations = [
      { name: t("navigation.studio"), url: "/studio" },
      { name: t("navigation.profile"), url: "/profile" },
      { name: t("navigation.contact"), url: "/contact" },
      { name: t("navigation.assets"), url: "/assets" },
      { name: t("navigation.home"), url: "/" },
    ];
    for (const { name, url } of destinations) {
      await page.getByRole("link", { name, exact: true }).click();
      await expect(page).toHaveURL(url);
    }
  });

  test("switches between light and dark themes", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("button", { name: t("auth.menu") }).click();
    await page.getByRole("menuitemradio", { name: t("menu.dark") }).click();
    await expect(page.locator("html")).toHaveClass(/dark/);

    await page.getByRole("button", { name: t("auth.menu") }).click();
    await page.getByRole("menuitemradio", { name: t("menu.light") }).click();
    await expect(page.locator("html")).not.toHaveClass(/dark/);
  });

  test("logs out", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("button", { name: t("auth.menu") }).click();
    await page.getByRole("menuitem", { name: t("auth.logout") }).click();

    await expect(page).toHaveURL(/\/login/);
    await page.goto("/studio");
    await expect(page).toHaveURL(/\/login\?callbackUrl=%2Fstudio/);
  });
});
