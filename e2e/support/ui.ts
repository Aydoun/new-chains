import type { Page } from "@playwright/test";
import { translate } from "@/lib/i18n";

/** Shorthand used across specs: the app's own English strings. */
export const t = translate;

export const sequenceCard = (page: Page, title: string) =>
  page.getByTestId("sequence-card").filter({ hasText: title });

/** A sidebar navigation link; its `data-active` marks the current page. */
export const sidebarLink = (
  page: Page,
  item: "home" | "studio" | "profile" | "contact",
) => page.getByRole("link", { name: t(`navigation.${item}`), exact: true });

export const searchBox = (page: Page) =>
  page.getByRole("textbox", { name: t("common.search") });

/** Types into the list's search box (results update after a debounce). */
export async function search(page: Page, text: string) {
  await searchBox(page).fill(text);
}

type TimeFilter = "last-hour" | "today" | "this-week" | "this-month";

/** Picks a time filter, or clears it with `null`. */
export async function chooseTimeFilter(page: Page, filter: TimeFilter | null) {
  await page.getByRole("button", { name: t("common.filter") }).click();
  await page
    .getByRole("menuitemradio", {
      name: filter ? t(`filter.${filter}`) : t("filter.clear"),
    })
    .click();
}

export const emptyState = (page: Page) =>
  page.getByRole("heading", { name: t("states.emptySequences.title") });

/** The dialog that shows one sequence's frames. */
export const sequenceViewer = (page: Page) => page.getByRole("dialog");
