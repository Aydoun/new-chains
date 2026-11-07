import { db, expect, test } from "../support/fixtures";
import { t } from "../support/ui";

test.describe("contact", () => {
  test("sends a message and stores it", async ({ page, data, users }) => {
    const message = data.contactMessage();

    await page.goto("/contact");
    await expect(
      page.getByRole("heading", { name: t("contact.welcomeMessage") }),
    ).toBeVisible();

    const field = page.getByRole("textbox", {
      name: t("contact.form.messageLabel"),
    });
    await field.fill(`  ${message}\n`);

    const sent = page.waitForResponse("**/api/contact/send");
    await page.getByRole("button", { name: t("common.send") }).click();
    expect((await sent).status()).toBe(201);

    await expect(field).toHaveValue("");
    expect(await db.findContacts(users.me.id, message)).toHaveLength(1);
  });

  test("doesn't send an empty message", async ({ page }) => {
    let requests = 0;
    page.on("request", (request) => {
      if (request.url().includes("/api/contact/send")) requests += 1;
    });

    await page.goto("/contact");
    await page
      .getByRole("textbox", { name: t("contact.form.messageLabel") })
      .fill("   ");
    await page.getByRole("button", { name: t("common.send") }).click();

    // Give a stray request time to show up before checking.
    await page.waitForTimeout(500);
    expect(requests).toBe(0);
  });

  test("copies the contact email", async ({ page, context }) => {
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    const email = t("contact.email-value");

    await page.goto("/contact");
    await page.getByRole("button", { name: t("contact.copy", { value: email }) }).click();

    await expect
      .poll(() => page.evaluate(() => navigator.clipboard.readText()))
      .toBe(email);
  });
});
