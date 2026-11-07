import { describe, expect, it } from "vitest";
import { detectLocale, translate } from "@/lib/i18n";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { findLocaleIssues } from "@/scripts/check-locales.mjs";

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

describe("locale files", () => {
  it("are all in sync with en.json", () => {
    expect(findLocaleIssues()).toEqual([]);
  });

  it("reports missing keys, wrong placeholders, empty and extra values", () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "locales-"));
    const write = (locale: string, data: object) =>
      fs.writeFileSync(path.join(dir, `${locale}.json`), JSON.stringify(data));

    write("en", { a: "Hi {name}", b: "Bye", c: ["x"] });
    write("xx", { a: "Salut {nom}", c: "x", d: "" });

    expect(findLocaleIssues(dir)).toEqual([
      'xx: "a" has placeholders {nom}, expected {name}',
      'xx: missing "b"',
      'xx: "c" is a string, expected a list',
      'xx: "d" is not in en.json',
    ]);
    fs.rmSync(dir, { recursive: true });
  });
});
