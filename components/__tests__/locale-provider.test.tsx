import { act, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  LOCALE_STORAGE_KEY,
  LocaleProvider,
  useTranslation,
} from "@/components/locale-provider";

function Probe() {
  const { locale, setLocale, t } = useTranslation();

  return (
    <>
      <p data-testid="locale">{locale}</p>
      <p data-testid="text">{t("navigation.profile")}</p>
      <button onClick={() => setLocale("nl")}>switch</button>
    </>
  );
}

function mockBrowserLanguages(languages: string[]) {
  vi.spyOn(window.navigator, "languages", "get").mockReturnValue(languages);
}

describe("LocaleProvider", () => {
  beforeEach(() => window.localStorage.clear());
  afterEach(() => vi.restoreAllMocks());

  it("picks the browser language when it is supported", () => {
    mockBrowserLanguages(["fr-FR", "en"]);
    render(
      <LocaleProvider>
        <Probe />
      </LocaleProvider>
    );

    expect(screen.getByTestId("locale")).toHaveTextContent("fr");
    expect(screen.getByTestId("text")).toHaveTextContent("Profil");
    expect(document.documentElement.lang).toBe("fr");
  });

  it("falls back to English for unsupported browser languages", () => {
    mockBrowserLanguages(["de-DE"]);
    render(
      <LocaleProvider>
        <Probe />
      </LocaleProvider>
    );

    expect(screen.getByTestId("locale")).toHaveTextContent("en");
    expect(screen.getByTestId("text")).toHaveTextContent("Profile");
  });

  it("prefers the stored choice over the browser language", () => {
    mockBrowserLanguages(["fr-FR"]);
    window.localStorage.setItem(LOCALE_STORAGE_KEY, "zh");
    render(
      <LocaleProvider>
        <Probe />
      </LocaleProvider>
    );

    expect(screen.getByTestId("text")).toHaveTextContent("个人资料");
  });

  it("switches immediately and remembers the choice", () => {
    mockBrowserLanguages(["en-US"]);
    render(
      <LocaleProvider>
        <Probe />
      </LocaleProvider>
    );

    act(() => screen.getByRole("button", { name: "switch" }).click());

    expect(screen.getByTestId("text")).toHaveTextContent("Profiel");
    expect(screen.getByTestId("locale")).toHaveTextContent("nl");
    expect(window.localStorage.getItem(LOCALE_STORAGE_KEY)).toBe("nl");
  });

  it("defaults to English without a provider", () => {
    render(<Probe />);

    expect(screen.getByTestId("text")).toHaveTextContent("Profile");
  });
});
