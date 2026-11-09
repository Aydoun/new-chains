import fs from "node:fs";
import path from "node:path";
import { parse } from "dotenv";
import pg, { Client, Pool, type PoolClient } from "pg";
import { SEEDED_USERS, TEST_EMAIL_DOMAIN } from "./constants";

// Prisma stores `timestamp without time zone` columns in UTC. node-postgres
// would otherwise write JS Dates in the machine's local time (dropping the
// offset) and read them back as local time, so rows inserted here would sort
// hours away from rows the app created (e.g. "in 60 minutes" on CET).
pg.defaults.parseInputDatesAsUTC = true;
pg.types.setTypeParser(pg.types.builtins.TIMESTAMP, (value) =>
  new Date(`${value.replace(" ", "T")}Z`),
);

const ROOT = path.resolve(__dirname, "../..");

// Env files that point at databases the tests must never touch.
const PROTECTED_ENV_FILES = [
  ".env",
  ".env.local",
  ".env.development",
  ".env.development.local",
  ".env.production",
  ".env.production.local",
];

function databaseHost(url: string | undefined) {
  if (!url) return null;
  try {
    return new URL(url.replace(/^['"]|['"]$/g, "")).hostname;
  } catch {
    return null;
  }
}

/**
 * Throws unless DATABASE_URL points at a database used only for tests: one
 * that no other env file in the project uses.
 */
export function assertDedicatedTestDatabase() {
  const testHost = databaseHost(process.env.DATABASE_URL);
  if (!testHost) {
    throw new Error(
      "E2E: DATABASE_URL is not set. Put the Neon test database URL in .env.test.",
    );
  }

  for (const file of PROTECTED_ENV_FILES) {
    const fullPath = path.join(ROOT, file);
    if (!fs.existsSync(fullPath)) continue;
    const env = parse(fs.readFileSync(fullPath));
    const hosts = [env.DATABASE_URL, env.POSTGRES_PRISMA_URL, env.POSTGRES_URL]
      .map(databaseHost)
      .filter(Boolean);
    if (hosts.includes(testHost)) {
      throw new Error(
        `E2E: .env.test uses the same database as ${file} (${testHost}). ` +
          "Point it at a dedicated Neon test branch before running end-to-end tests.",
      );
    }
  }
}

// ---------------------------------------------------------------------------
// Connection
// ---------------------------------------------------------------------------

let pool: Pool | null = null;

/** One small pool per Playwright worker. */
function getPool() {
  pool ??= new Pool({
    connectionString: process.env.DATABASE_URL,
    connectionTimeoutMillis: 15_000,
    max: 3,
  });
  return pool;
}

export async function closePool() {
  await pool?.end();
  pool = null;
}

async function query<T extends object>(sql: string, params: unknown[] = []) {
  const { rows } = await getPool().query<T>(sql, params);
  return rows;
}

async function transaction<T>(fn: (client: PoolClient) => Promise<T>) {
  const client = await getPool().connect();
  try {
    await client.query("BEGIN");
    const result = await fn(client);
    await client.query("COMMIT");
    return result;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Takes a lock shared by every Playwright worker and returns its release.
 * It's a transaction-level advisory lock on its own connection: those work
 * through Neon's pooler, and are released if the test process dies.
 */
export async function acquireLock(name: string) {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    connectionTimeoutMillis: 15_000,
  });
  await client.connect();
  await client.query("BEGIN");
  await client.query("SELECT pg_advisory_xact_lock(hashtext($1))", [
    `e2e:${name}`,
  ]);
  return async () => {
    try {
      await client.query("COMMIT");
    } finally {
      await client.end();
    }
  };
}

// ---------------------------------------------------------------------------
// Seeding (run once, from the setup project)
// ---------------------------------------------------------------------------

/**
 * Creates the seeded users if needed, wipes everything they created in
 * earlier runs, and returns their ids by email.
 */
export async function resetSeededUsers() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    connectionTimeoutMillis: 15_000,
  });
  await client.connect();
  try {
    await client.query("BEGIN");

    // Every user on the reserved test domain. Only the seeded users are
    // kept; any other one (e.g. left by older versions of this suite) goes.
    const { rows: testUsers } = await client.query<{ id: number }>(
      `SELECT id FROM "User" WHERE email LIKE $1`,
      [`%@${TEST_EMAIL_DOMAIN}`],
    );
    const userIds = testUsers.map((user) => user.id);

    // Comments by the test users, and any comment on their sequences, go
    // first: they reference sequences and users.
    await client.query(
      `DELETE FROM "Comment"
       WHERE "authorId" = ANY($1)
          OR "sequenceId" IN (SELECT id FROM "Sequence" WHERE "userId" = ANY($1))`,
      [userIds],
    );
    await client.query(
      `DELETE FROM "Snippet"
       WHERE "createdById" = ANY($1)
          OR "originSequenceId" IN (SELECT id FROM "Sequence" WHERE "userId" = ANY($1))`,
      [userIds],
    );
    await client.query(`DELETE FROM "Sequence" WHERE "userId" = ANY($1)`, [
      userIds,
    ]);
    await client.query(
      `DELETE FROM "Frame" f
       WHERE f."createdById" = ANY($1)
         AND NOT EXISTS (SELECT 1 FROM "Snippet" s WHERE s."frameId" = f.id)`,
      [userIds],
    );
    await client.query(
      `DELETE FROM "Asset" a
       WHERE a."uploadedById" = ANY($1)
         AND NOT EXISTS (SELECT 1 FROM "Frame" f WHERE f."assetId" = a.id)`,
      [userIds],
    );
    await client.query(`DELETE FROM "Contact" WHERE "userId" = ANY($1)`, [
      userIds,
    ]);
    await client.query(
      `DELETE FROM "User" WHERE id = ANY($1) AND email <> ALL($2)`,
      [userIds, SEEDED_USERS.map((user) => user.email)],
    );

    const ids: Record<string, number> = {};
    for (const user of SEEDED_USERS) {
      const { rows } = await client.query<{ id: number }>(
        `INSERT INTO "User" (email, username, bio, "updatedAt")
         VALUES ($1, $2, NULL, NOW())
         ON CONFLICT (email) DO UPDATE SET username = EXCLUDED.username, bio = NULL
         RETURNING id`,
        [user.email, user.username],
      );
      ids[user.email] = rows[0].id;
    }

    await client.query("COMMIT");
    return ids;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    await client.end();
  }
}

// ---------------------------------------------------------------------------
// Reads and writes used by tests
// ---------------------------------------------------------------------------

export type Visibility = "PUBLIC" | "PRIVATE" | "FRIENDS_ONLY";

export type UserRow = {
  id: number;
  email: string;
  username: string;
  bio: string | null;
};

export type FrameRow = {
  id: number;
  content: string;
  description: string | null;
  createdById: number | null;
};

export type SequenceRow = {
  id: number;
  title: string;
  description: string;
  userId: number;
  visibility: Visibility;
  isDeleted: boolean;
  FrameOrder: number[];
  createdAt: Date;
};

export type SequenceWithFrames = SequenceRow & { frames: FrameRow[] };

export type FrameInput = { content: string; description?: string };

export type SequenceInput = {
  userId: number;
  title: string;
  description?: string;
  visibility?: Visibility;
  frames: FrameInput[];
  /** Backdate the sequence, e.g. to test the time filters. */
  createdAt?: Date;
};

export async function findUserByEmail(email: string) {
  const [user] = await query<UserRow>(
    `SELECT id, email, username, bio FROM "User" WHERE email = $1`,
    [email],
  );
  if (!user) throw new Error(`E2E: seeded user ${email} not found`);
  return user;
}

export async function findUser(id: number) {
  const [user] = await query<UserRow>(
    `SELECT id, email, username, bio FROM "User" WHERE id = $1`,
    [id],
  );
  return user ?? null;
}

/** Inserts frames and a sequence directly, the way the API would. */
export function insertSequence(input: SequenceInput) {
  return transaction(async (client) => {
    const frameIds: number[] = [];
    for (const frame of input.frames) {
      const { rows } = await client.query<{ id: number }>(
        `INSERT INTO "Frame" (content, description, "createdById", "updatedAt")
         VALUES ($1, $2, $3, NOW()) RETURNING id`,
        [frame.content, frame.description ?? "", input.userId],
      );
      frameIds.push(rows[0].id);
    }

    const { rows } = await client.query<SequenceRow>(
      `INSERT INTO "Sequence"
         (title, description, "userId", "FrameOrder", visibility, "createdAt", "updatedAt")
       VALUES ($1, $2, $3, $4, $5::"Visibility", $6, NOW())
       RETURNING id, title, description, "userId", visibility, "isDeleted", "FrameOrder", "createdAt"`,
      [
        input.title,
        input.description ?? "",
        input.userId,
        frameIds,
        input.visibility ?? "PUBLIC",
        input.createdAt ?? new Date(),
      ],
    );
    return rows[0];
  });
}

async function withFrames(sequence: SequenceRow | undefined) {
  if (!sequence) return null;
  const frames = await query<FrameRow>(
    `SELECT id, content, description, "createdById" FROM "Frame" WHERE id = ANY($1)`,
    [sequence.FrameOrder],
  );
  const byId = new Map(frames.map((frame) => [frame.id, frame]));
  return {
    ...sequence,
    frames: sequence.FrameOrder.map((id) => byId.get(id)).filter(
      (frame): frame is FrameRow => Boolean(frame),
    ),
  } satisfies SequenceWithFrames;
}

const SEQUENCE_COLUMNS = `id, title, description, "userId", visibility, "isDeleted", "FrameOrder", "createdAt"`;

/** A sequence with its frames in display order, deleted or not. */
export async function findSequence(id: number) {
  const [sequence] = await query<SequenceRow>(
    `SELECT ${SEQUENCE_COLUMNS} FROM "Sequence" WHERE id = $1`,
    [id],
  );
  return withFrames(sequence);
}

/** The newest sequence with this exact title, deleted or not. */
export async function findSequenceByTitle(userId: number, title: string) {
  const [sequence] = await query<SequenceRow>(
    `SELECT ${SEQUENCE_COLUMNS} FROM "Sequence"
     WHERE "userId" = $1 AND title = $2
     ORDER BY id DESC LIMIT 1`,
    [userId, title],
  );
  return withFrames(sequence);
}

export type SnippetRow = {
  id: number;
  frameId: number;
  originSequenceId: number;
  createdById: number;
};

export function findSnippets(where: { userId: number; frameId?: number }) {
  return query<SnippetRow>(
    `SELECT id, "frameId", "originSequenceId", "createdById" FROM "Snippet"
     WHERE "createdById" = $1 AND ($2::int IS NULL OR "frameId" = $2)
     ORDER BY id`,
    [where.userId, where.frameId ?? null],
  );
}

export async function insertSnippet(input: {
  userId: number;
  frameId: number;
  originSequenceId: number;
}) {
  const [snippet] = await query<SnippetRow>(
    `INSERT INTO "Snippet" ("frameId", "originSequenceId", "createdById", "updatedAt")
     VALUES ($1, $2, $3, NOW())
     RETURNING id, "frameId", "originSequenceId", "createdById"`,
    [input.frameId, input.originSequenceId, input.userId],
  );
  return snippet;
}

export function findContacts(userId: number, message: string) {
  return query<{ id: number; message: string; userId: number }>(
    `SELECT id, message, "userId" FROM "Contact" WHERE "userId" = $1 AND message = $2`,
    [userId, message],
  );
}

// ---------------------------------------------------------------------------
// Assets (uploaded images)
// ---------------------------------------------------------------------------

export type AssetRow = {
  id: number;
  url: string;
  pathname: string;
  contentType: string;
  width: number;
  height: number;
  uploadedById: number;
};

const ASSET_COLUMNS = `id, url, pathname, "contentType", width, height, "uploadedById"`;

export async function findAsset(id: number) {
  const [asset] = await query<AssetRow>(
    `SELECT ${ASSET_COLUMNS} FROM "Asset" WHERE id = $1`,
    [id],
  );
  return asset ?? null;
}

/** A frame's media type and, for IMAGE frames, its asset. */
export async function findFrameMedia(frameId: number) {
  const [frame] = await query<{ type: string; assetId: number | null }>(
    `SELECT type, "assetId" FROM "Frame" WHERE id = $1`,
    [frameId],
  );
  if (!frame) return null;
  return {
    type: frame.type,
    asset: frame.assetId ? await findAsset(frame.assetId) : null,
  };
}

/** Records an asset row directly (no file), e.g. one owned by another user. */
export async function insertAsset(uploadedById: number) {
  const pathname = `assets/${uploadedById}/e2e-${Date.now()}-${Math.random()}.png`;
  const [asset] = await query<AssetRow>(
    `INSERT INTO "Asset" (url, pathname, "contentType", size, width, height, "uploadedById")
     VALUES ($1, $2, 'image/png', 1000, 1080, 1080, $3)
     RETURNING ${ASSET_COLUMNS}`,
    [`/api/asset/file/${pathname}`, pathname, uploadedById],
  );
  return asset;
}

// ---------------------------------------------------------------------------
// Comments
// ---------------------------------------------------------------------------

export type CommentRow = {
  id: number;
  content: string;
  sequenceId: number;
  authorId: number;
  isDeleted: boolean;
  createdAt: Date;
};

const COMMENT_COLUMNS = `id, content, "sequenceId", "authorId", "isDeleted", "createdAt"`;

export async function findComment(id: number) {
  const [comment] = await query<CommentRow>(
    `SELECT ${COMMENT_COLUMNS} FROM "Comment" WHERE id = $1`,
    [id],
  );
  return comment ?? null;
}

/** Inserts comments directly; `createdAt` defaults to now. */
export async function insertComment(input: {
  sequenceId: number;
  authorId: number;
  content: string;
  createdAt?: Date;
}) {
  const [comment] = await query<CommentRow>(
    `INSERT INTO "Comment" (content, "sequenceId", "authorId", "createdAt", "updatedAt")
     VALUES ($1, $2, $3, $4, NOW())
     RETURNING ${COMMENT_COLUMNS}`,
    [input.content, input.sequenceId, input.authorId, input.createdAt ?? new Date()],
  );
  return comment;
}
