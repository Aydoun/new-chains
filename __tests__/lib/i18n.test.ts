import { describe, expect, it } from "vitest";
import { detectLocale, translate } from "@/lib/i18n";

describe("detectLocale", () => {
  it("matches on the primary language subtag", () => {
    expect(detectLocale(["fr-BE"])).toBe("fr");
    expect(detectLocale(["nl-NL", "en"])).toBe("nl");
    expect(detectLocale(["zh-CN"])).toBe("zh");
  });

  it("uses the first supported language in preference order", () => {
    expect(detectLocale(["de-DE", "es", "nl", "fr"])).toBe("nl");
  });

  it("falls back to English when nothing is supported", () => {
    expect(detectLocale(["de-DE", "ja"])).toBe("en");
    expect(detectLocale([])).toBe("en");
  });
});

describe("translate", () => {
  it("translates and interpolates in the requested locale", () => {
    expect(translate("studio.greetings", { name: "Ana" }, "fr")).toBe(
      "Bonjour Ana"
    );
    expect(translate("menu.language", undefined, "zh")).toBe("语言");
  });

  it("returns the key for unknown keys", () => {
    expect(translate("does.not.exist", undefined, "nl")).toBe(
      "does.not.exist"
    );
  });
});
