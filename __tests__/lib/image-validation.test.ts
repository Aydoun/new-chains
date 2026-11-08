import { describe, expect, it } from "vitest";
import { IMAGE_RULES, validateImage } from "@/lib/image-validation";

const meta = (width: number, height: number, overrides = {}) => ({
  contentType: "image/jpeg",
  size: 500_000,
  width,
  height,
  ...overrides,
});

describe("validateImage", () => {
  it.each([
    ["9:16 story / reel", 1080, 1920],
    ["4:5 portrait post", 1080, 1350],
    ["1:1 square post", 1080, 1080],
    ["1.91:1 landscape post", 1080, 566],
  ])("accepts %s", (_, width, height) => {
    expect(validateImage(meta(width, height))).toBeNull();
  });

  it("rejects proportions outside 9:16 to 1.91:1", () => {
    expect(validateImage(meta(1080, 2400))).toBe("ratio"); // 9:20
    expect(validateImage(meta(1200, 400))).toBe("ratio"); // 3:1
  });

  it("rejects other file types", () => {
    expect(validateImage(meta(1080, 1080, { contentType: "image/gif" }))).toBe(
      "type",
    );
  });

  it("rejects files over the size limit", () => {
    expect(
      validateImage(meta(1080, 1080, { size: IMAGE_RULES.maxBytes + 1 })),
    ).toBe("tooLarge");
  });

  it("rejects images too small or too big", () => {
    expect(validateImage(meta(300, 300))).toBe("tooSmall");
    expect(validateImage(meta(5000, 5000))).toBe("tooBig");
  });
});
