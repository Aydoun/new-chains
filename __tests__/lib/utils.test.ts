import { cn, getStorageItem } from "@/lib/utils";

describe("lib/utils", () => {
  describe("cn", () => {
    it("merges class names and resolves tailwind conflicts", () => {
      expect(cn("px-2", "px-4", { hidden: false, block: true })).toBe(
        "px-4 block"
      );
    });
  });

  describe("getStorageItem", () => {
    it("returns null on server", () => {
      const originalWindow = (globalThis as { window?: Window }).window;
      // @ts-expect-error simulate server
      delete (globalThis as { window?: Window }).window;
      expect(getStorageItem("key")).toBeNull();
      if (originalWindow) {
        (globalThis as { window?: Window }).window = originalWindow;
      }
    });

    it("reads from localStorage in the browser", () => {
      localStorage.setItem("theme", "light");
      expect(getStorageItem("theme")).toBe("light");
    });
  });
});
