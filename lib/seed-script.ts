/* eslint-disable @typescript-eslint/no-var-requires */
/**
 * CommonJS-only seed script (no ESM, no import keywords)
 *
 * Install:
 *   npm i undici dotenv
 *
 * .env:
 *   BASE_URL=http://localhost:3000
 *   SESSION_TOKEN=PASTE_NEXT_AUTH_SESSION_TOKEN
 *
 * Run (recommended):
 *   npx ts-node --compiler-options "{\"module\":\"CommonJS\"}" lib/seed-script.ts
 */

require("dotenv/config");

const { request } = require("undici");
const nodeCrypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");

// ----------------------------
// Config
// ----------------------------
const BASE_URL = "http://localhost:3000";
const SESSION_TOKEN = process.env.SESSION_TOKEN;

if (!SESSION_TOKEN) {
  console.error("Missing SESSION_TOKEN in .env");
  process.exit(1);
}

// If you’re truly CommonJS-only, do NOT set "type":"module" in package.json.
// And prefer fixture as .js/.cjs so require() works.
const FIXTURE_FILE =
  process.env.FIXTURE_FILE ||
  path.join(process.cwd(), "lib", "fixture.content-platform.ts");

// Endpoints (adjust to your API)
const ENDPOINTS = {
  bulkCreateFrames: "/api/frame/bulk-create",
  createSequence: "/api/sequence/create",
};

// Uniform random userId pool
const USER_ID_POOL = [1, 2, 12, 13, 35, 36, 38];

// ----------------------------
// Utilities
// ----------------------------
function pickUniform(arr: number[]) {
  return arr[nodeCrypto.randomInt(0, arr.length)];
}

function uniq<T>(arr: T[]) {
  return Array.from(new Set(arr));
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function httpJson(method: string, urlPath: string, bodyObj?: any) {
  const url = new URL(urlPath, BASE_URL).toString();

  const { statusCode, body } = await request(url, {
    method,
    headers: {
      "content-type": "application/json",
      // Send both; server will read whichever it expects
      cookie: `next-auth.session-token=${SESSION_TOKEN}; __Secure-next-auth.session-token=${SESSION_TOKEN}`,
    },
    body: bodyObj ? JSON.stringify(bodyObj) : undefined,
  });

  const text = await body.text();

  let json: any = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = null;
  }

  if (statusCode < 200 || statusCode >= 300) {
    const err: any = new Error(
      `HTTP ${statusCode} ${method} ${urlPath}\n${text || ""}`.trim()
    );
    err.statusCode = statusCode;
    err.responseText = text;
    err.responseJson = json;
    throw err;
  }

  return json;
}

async function withRetry<T>(
  fn: () => Promise<T>,
  opts?: { retries?: number; baseDelayMs?: number }
): Promise<T> {
  const retries = opts?.retries ?? 4;
  const baseDelayMs = opts?.baseDelayMs ?? 300;

  let lastErr: any;
  for (let i = 0; i <= retries; i++) {
    try {
      return await fn();
    } catch (err: any) {
      lastErr = err;
      const sc = err?.statusCode;

      const retryable =
        !sc || sc === 429 || (sc >= 500 && sc <= 599) || sc === 408;

      if (!retryable || i === retries) break;

      const delay = baseDelayMs * Math.pow(2, i);
      console.warn(`Retrying after error (attempt ${i + 1}/${retries + 1})...`);
      console.warn(String(err.message).slice(0, 400));
      await sleep(delay);
    }
  }

  throw lastErr;
}

function normalizeBulkFramePayload(frames: any[]) {
  return frames.map((f) => ({
    content: f.content,
    description: f.description ?? null,
    type: f.type ?? "PHRASE",
  }));
}

function extractIdsFromBulkResponse(resp: any): number[] {
  if (Array.isArray(resp)) return resp;
  if (resp && Array.isArray(resp.ids)) return resp.ids;
  throw new Error(
    `Bulk frames endpoint returned unexpected payload: ${JSON.stringify(
      resp
    ).slice(0, 300)}`
  );
}

// ----------------------------
// Fixture Loading (CommonJS require)
// ----------------------------
function loadFixture(filePath: string) {
  if (!fs.existsSync(filePath)) {
    throw new Error(
      `Fixture not found: ${filePath}\nTip: set FIXTURE_FILE env var or place fixture at lib/fixture.content-platform.cjs`
    );
  }
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const fixture = require(filePath);
  return fixture && fixture.default ? fixture.default : fixture;
}

function buildFrameMap(frames: any[]) {
  const map = new Map<string, any>();
  for (const f of frames) {
    if (!f.key) throw new Error("Frame missing key");
    if (map.has(f.key)) throw new Error(`Duplicate frame key: ${f.key}`);
    map.set(f.key, f);
  }
  return map;
}

// ----------------------------
// Main
// ----------------------------
async function main() {
  console.log("Seeding starts:");

  const fixture = loadFixture(FIXTURE_FILE);

  const sequences = fixture?.sequences ?? [];
  const frames = fixture?.frames ?? [];

  if (!sequences.length) throw new Error("Fixture has no sequences");
  if (!frames.length) throw new Error("Fixture has no frames");

  const frameMap = buildFrameMap(frames);

  // Validate references
  for (const s of sequences) {
    const missing = (s.frameOrder ?? []).filter(
      (k: string) => !frameMap.has(k)
    );
    if (missing.length) {
      throw new Error(
        `Sequence ${s.key || s.title} references missing frames: ${missing.join(
          ", "
        )}`
      );
    }
  }

  for (let i = 0; i < sequences.length; i++) {
    const s = sequences[i];
    const userId = pickUniform(USER_ID_POOL);

    try {
      // 1) create frames first (bulk)
      const bulkPayload = { frames: normalizeBulkFramePayload(fixture.frames) };

      const resp = await httpJson(
        "POST",
        ENDPOINTS.bulkCreateFrames,
        bulkPayload
      );

      const seqPayload = {
        title: s.title,
        description: s.description,
        userId,
        frameOrder: resp.ids,
      };

      const createdSequence = await httpJson(
        "POST",
        ENDPOINTS.createSequence,
        seqPayload
      );

      console.log("Done: ", createdSequence);
    } catch (err: any) {
      console.log("error: ", err);
    }
  }
}

main().catch((e: any) => {
  console.error("Fatal:", e?.message || e);
  process.exit(1);
});
