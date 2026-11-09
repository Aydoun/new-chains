import {
  FRAME_LINK_MAX_LENGTH,
  parseFrameLink,
  safeFrameLink,
} from "@/lib/frame-link";

describe("parseFrameLink", () => {
  it.each([
    ["https://example.com/page?x=1#top", "https://example.com/page?x=1#top", "example.com"],
    ["example.com/page", "https://example.com/page", "example.com"],
    ["  HTTP://Example.COM/A  ", "http://example.com/A", "example.com"],
    ["https://www.youtube.com/watch?v=x", "https://www.youtube.com/watch?v=x", "youtube.com"],
    ["example.com:8080/x", "https://example.com:8080/x", "example.com"],
  ])("accepts %j", (input, url, host) => {
    expect(parseFrameLink(input)).toEqual({ ok: true, url, host });
  });

  it.each([
    ["javascript:alert(1)", "protocol"],
    ["JaVaScRiPt:alert(document.cookie)", "protocol"],
    ["data:text/html,<script>alert(1)</script>", "protocol"],
    ["vbscript:msgbox(1)", "protocol"],
    ["file:///etc/passwd", "protocol"],
    ["mailto:someone@example.com", "protocol"],
    ["ftp://example.com/file", "protocol"],
    ["https://user:secret@example.com", "credentials"],
    ["https://yourbank.com@evil.test/login", "credentials"],
    ["http://localhost:3000", "host"],
    ["http://app.localhost", "host"],
    ["http://127.0.0.1/admin", "host"],
    ["http://2130706433/", "host"],
    ["http://0x7f.1/", "host"],
    ["http://[::1]/", "host"],
    ["http://192.168.1.1/", "host"],
    ["http://8.8.8.8/", "host"],
    ["http://intranet/", "host"],
    ["http://printer.local/", "host"],
    ["http://db.internal/", "host"],
    ["", "invalid"],
    ["   ", "invalid"],
    ["https://exa mple.com", "invalid"],
    ["https://", "invalid"],
  ])("refuses %j (%s)", (input, error) => {
    expect(parseFrameLink(input)).toEqual({ ok: false, error });
  });

  it("refuses links over the length limit", () => {
    const long = `https://example.com/${"a".repeat(FRAME_LINK_MAX_LENGTH)}`;
    expect(parseFrameLink(long)).toEqual({ ok: false, error: "tooLong" });
  });

  it("shows look-alike international domains in punycode", () => {
    // The first letter is a Cyrillic "а".
    expect(parseFrameLink("https://аpple.com")).toMatchObject({
      ok: true,
      host: "xn--pple-43d.com",
    });
  });
});

describe("safeFrameLink", () => {
  it("returns the link and host for a safe stored value", () => {
    expect(safeFrameLink("https://example.com/a")).toEqual({
      url: "https://example.com/a",
      host: "example.com",
    });
  });

  it("returns null for nothing, or for a value that isn't a safe link", () => {
    expect(safeFrameLink(null)).toBeNull();
    expect(safeFrameLink("")).toBeNull();
    expect(safeFrameLink("javascript:alert(1)")).toBeNull();
  });
});
