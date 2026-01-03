type FrameItem = {
  key: string;
  content: string;
  description: string;
};

type SequenceItem = {
  key: string;
  title: string;
  description: string;
};

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

const FIXTURE_FILE =
  process.env.FIXTURE_FILE ||
  path.join(process.cwd(), "lib", "fixture.content-platform.ts");

const ENDPOINTS = {
  bulkCreateFrames: "/api/frame/bulk-create",
  createSequence: "/api/sequence/create",
};

// Uniform random userId pool
const USER_ID_POOL = [1, 4];

// ----------------------------
// Utilities
// ----------------------------
function pickUniform(arr: number[]) {
  return arr[nodeCrypto.randomInt(0, arr.length)];
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

function normalizeBulkFramePayload(frames: FrameItem[]) {
  return frames.map((f) => ({
    content: f.content,
    description: f.description,
  }));
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

// ----------------------------
// Main
// ----------------------------
async function main() {
  console.log("Seeding starts:");

  const fixture = loadFixture(FIXTURE_FILE);

  const sequences: SequenceItem[] = fixture?.sequences ?? [];
  const frames: FrameItem[] = fixture?.frames ?? [];

  if (!sequences.length) throw new Error("Fixture has no sequences");
  if (!frames.length) throw new Error("Fixture has no frames");

  for (let i = 0; i < sequences.length; i++) {
    const s = sequences[i];
    const sequenceKey = s.key;
    const userId = pickUniform(USER_ID_POOL);

    const correspondingFrames = frames.filter((f) => f.key === sequenceKey);

    try {
      // 1) create frames first (bulk)
      const bulkPayload = {
        frames: normalizeBulkFramePayload(correspondingFrames),
      };

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

      await httpJson("POST", ENDPOINTS.createSequence, seqPayload);
    } catch (err: any) {
      console.log("error: ", err);
    }
  }

  console.log("Done!");
}

main().catch((e: any) => {
  console.error("Fatal:", e?.message || e);
  process.exit(1);
});
