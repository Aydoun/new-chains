import { expect, test } from "../support/fixtures";
import { t } from "../support/ui";
import { translate } from "@/lib/i18n";

const LOCALE_STORAGE_KEY = "locale-preference";

test.describe("language switching", () => {
  test("defaults to English for an unsupported browser language", async ({
    browser,
  }) => {
    const context = await browser.newContext({ locale: "de-DE" });
    const page = await context.newPage();
    await page.goto("/");

    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(
      page.getByRole("link", { name: t("navigation.studio"), exact: true })
    ).toBeVisible();
    await context.close();
  });

  test.describe("with a French browser", () => {
    test.use({ locale: "fr-FR" });

    test("picks French from the browser language", async ({ page }) => {
      await page.goto("/");

      await expect(page.locator("html")).toHaveAttribute("lang", "fr");
      await expect(
        page.getByRole("link", {
          name: translate("navigation.profile", undefined, "fr"),
          exact: true,
        })
      ).toBeVisible();
    });
  });

  test("sidebar menu switches language immediately and remembers it", async ({
    page,
  }) => {
    await page.goto("/studio");

    await page.getByRole("button", { name: t("auth.menu") }).click();
    await page.getByRole("menuitem", { name: t("menu.language") }).click();
    await page.getByRole("menuitemradio", { name: "Nederlands" }).click();

    const dutchProfile = page.getByRole("link", {
      name: translate("navigation.profile", undefined, "nl"),
      exact: true,
    });
    await expect(dutchProfile).toBeVisible();
    await expect(page.locator("html")).toHaveAttribute("lang", "nl");
    expect(
      await page.evaluate((key) => localStorage.getItem(key), LOCALE_STORAGE_KEY)
    ).toBe("nl");

    await page.reload();
    await expect(dutchProfile).toBeVisible();
  });

  test.describe("on a phone", () => {
    test.use({ viewport: { width: 390, height: 844 } });

    test("hamburger menu switches language", async ({ page }) => {
      await page.goto("/");
      await page.getByRole("button", { name: t("navigation.self") }).click();
      await page.getByRole("menuitem", { name: t("menu.language") }).click();
      await page.getByRole("menuitemradio", { name: "中文" }).click();

      await expect(page.locator("html")).toHaveAttribute("lang", "zh");
      await page
        .getByRole("button", {
          name: translate("navigation.self", undefined, "zh"),
        })
        .click();
      await expect(
        page.getByRole("menuitem", {
          name: translate("auth.logout", undefined, "zh"),
        })
      ).toBeVisible();
    });
  });
});
