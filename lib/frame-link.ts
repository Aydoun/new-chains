/**
 * Frame links: rules shared by the form (instant feedback), the API (the
 * real check) and the viewer (re-checked before anything becomes an href).
 *
 * What can go wrong with a user-supplied link, and what stops it:
 * - Script or local-file URLs (`javascript:`, `data:`, `vbscript:`,
 *   `file:`…) run code or read files when clicked → only http and https.
 * - Credentials in the URL (`https://user:pass@host`) are used to disguise
 *   the real host (`https://yourbank.com@evil.test`) → refused.
 * - Links into the viewer's own machine or network (`localhost`, IP
 *   addresses, `.local`, single-word intranet names) can trigger requests to
 *   routers and dev servers → refused; a link must name a public domain.
 * - Look-alike domains (Cyrillic "а" in "аpple.com") → links are stored as
 *   the URL parser normalises them (punycode, `xn--…`), which is what the
 *   browser shows on hover.
 * - The opened page taking over this tab via `window.opener`, and the
 *   address of the sequence leaking → links open with
 *   `rel="noopener noreferrer"`; `nofollow ugc` marks them as user content.
 * - Oversized values → capped at FRAME_LINK_MAX_LENGTH.
 */

export const FRAME_LINK_MAX_LENGTH = 2048;

/** Matches `frame.link.errors.*` in the locale files. */
export type FrameLinkError = "invalid" | "protocol" | "credentials" | "host" | "tooLong";

export type FrameLinkResult =
  | { ok: true; url: string; host: string }
  | { ok: false; error: FrameLinkError };

/** Rel for every frame link that opens in a new tab. */
export const FRAME_LINK_REL = "noopener noreferrer nofollow ugc";

const ALLOWED_PROTOCOLS = new Set(["http:", "https:"]);

/** Names that only resolve inside the viewer's own machine or network. */
const PRIVATE_SUFFIXES = [".localhost", ".local", ".internal", ".home.arpa", ".lan"];

/** An explicit scheme: `name:` with no dot before the colon (so not `example.com:8080`). */
const SCHEME = /^[a-z][a-z0-9+.-]*:/i;

function hasScheme(value: string) {
  const match = value.match(SCHEME);
  return Boolean(match) && !match![0].includes(".");
}

const isIpLiteral = (hostname: string) =>
  hostname.startsWith("[") || /^\d{1,3}(\.\d{1,3}){3}$/.test(hostname);

/**
 * Checks and normalises a link typed by a user. A bare domain
 * ("example.com/page") gets `https://`.
 */
export function parseFrameLink(raw: string): FrameLinkResult {
  const value = raw.trim();
  if (!value || /\s/.test(value)) return { ok: false, error: "invalid" };
  if (value.length > FRAME_LINK_MAX_LENGTH) return { ok: false, error: "tooLong" };

  let url: URL;
  try {
    url = new URL(hasScheme(value) ? value : `https://${value}`);
  } catch {
    return { ok: false, error: "invalid" };
  }

  if (!ALLOWED_PROTOCOLS.has(url.protocol)) return { ok: false, error: "protocol" };
  if (url.username || url.password) return { ok: false, error: "credentials" };

  // `hostname` is already normalised: lower case, punycode, and odd IPv4
  // spellings such as `2130706433` turned into `127.0.0.1`.
  const hostname = url.hostname.replace(/\.$/, "");
  if (
    !hostname.includes(".") ||
    isIpLiteral(hostname) ||
    hostname === "localhost" ||
    PRIVATE_SUFFIXES.some((suffix) => hostname.endsWith(suffix))
  ) {
    return { ok: false, error: "host" };
  }

  if (url.href.length > FRAME_LINK_MAX_LENGTH) return { ok: false, error: "tooLong" };

  return { ok: true, url: url.href, host: hostname.replace(/^www\./, "") };
}

/**
 * For rendering: the link and the host to show, or null when the stored
 * value isn't a safe link (it never becomes an href then).
 */
export function safeFrameLink(stored: string | null | undefined) {
  if (!stored) return null;
  const result = parseFrameLink(stored);
  return result.ok ? { url: result.url, host: result.host } : null;
}
