import { createHash } from "node:crypto";
import {
  test as base,
  expect,
  type APIRequestContext,
  type BrowserContext,
} from "@playwright/test";
import { Faker, base as baseLocale, en } from "@faker-js/faker";
import { AUTHOR, TEST_EMAIL_DOMAIN, TEST_USER } from "./constants";
import { sessionCookie } from "./session";
import * as db from "./test-db";

type Owner = "me" | "author" | db.UserRow;

export type DataFactory = ReturnType<typeof createDataFactory>;

type TestFixtures = {
  /** Faker seeded per test; the seed is attached to the test report. */
  fake: Faker;
  /** Random payloads and database records for this test. */
  data: DataFactory;
  /** Signs this test's browser context in as another user. */
  signInAs: (user: db.UserRow) => Promise<void>;
  /** An API client signed in as the given user. */
  apiAs: (user: db.UserRow) => Promise<APIRequestContext>;
};

type WorkerFixtures = {
  /** The two seeded users: `me` (signed in by default) and `author`. */
  users: { me: db.UserRow; author: db.UserRow };
};

/**
 * Same E2E_SEED + same test ⇒ same data, so a failure can be replayed with
 * `E2E_SEED=<seed> yarn test:e2e`. Each test (and each repeat of it) gets
 * its own seed, so tests running in parallel never generate the same values.
 */
function seedFor(testId: string, repeatEachIndex: number, retry: number) {
  const base = Number(process.env.E2E_SEED ?? 0);
  const digest = createHash("sha256")
    .update(`${base}:${testId}:${repeatEachIndex}:${retry}`)
    .digest();
  return digest.readUInt32BE(0);
}

function createDataFactory(fake: Faker, users: WorkerFixtures["users"]) {
  const ownerId = (owner: Owner) =>
    owner === "me"
      ? users.me.id
      : owner === "author"
        ? users.author.id
        : owner.id;

  /** A short random marker: search for it to find this test's records. */
  const token = () => fake.string.alphanumeric({ length: 10, casing: "lower" });

  const sequenceTitle = (marker: string = token()) =>
    `${fake.word.adjective()} ${fake.word.noun()} ${marker}`;

  const sequenceDescription = () => fake.lorem.sentence({ min: 6, max: 14 });

  const frame = (): Required<db.FrameInput> => ({
    content: fake.lorem.sentence({ min: 3, max: 8 }),
    description: fake.lorem.words({ min: 2, max: 5 }),
  });

  const frames = (count: number = fake.number.int({ min: 2, max: 4 })) =>
    Array.from({ length: count }, () => frame());

  return {
    token,
    sequenceTitle,
    sequenceDescription,
    frame,
    frames,

    /** A valid body for POST /api/sequence/create. */
    sequencePayload: (
      overrides: Partial<{
        title: string;
        description: string;
        visibility: db.Visibility;
        frames: db.FrameInput[];
      }> = {},
    ) => ({
      title: sequenceTitle(),
      description: sequenceDescription(),
      frames: frames() as db.FrameInput[],
      ...overrides,
    }),

    /** Inserts a sequence straight into the test database. */
    createSequence: (
      owner: Owner,
      overrides: Partial<Omit<db.SequenceInput, "userId">> = {},
    ) =>
      db.insertSequence({
        userId: ownerId(owner),
        title: sequenceTitle(),
        description: sequenceDescription(),
        frames: frames(),
        ...overrides,
      }),

    /** A user nobody else uses, for tests that change user-level state. */
    createUser: () =>
      db.insertUser({
        email: `e2e-${token()}@${TEST_EMAIL_DOMAIN}`,
        username: fake.person.fullName(),
      }),

    bio: () => fake.person.bio(),

    contactMessage: () =>
      fake.lorem.sentences({ min: 1, max: 3 }).slice(0, 240).trim(),

    /** A string of exactly `length` letters. */
    text: (length: number) => fake.string.alpha({ length }),
  };
}

async function addSession(
  context: BrowserContext,
  user: db.UserRow,
  baseURL: string,
) {
  await context.clearCookies();
  await context.addCookies([await sessionCookie(user, baseURL)]);
}

export const test = base.extend<TestFixtures, WorkerFixtures>({
  users: [
    async ({}, use) => {
      const me = await db.findUserByEmail(TEST_USER.email);
      const author = await db.findUserByEmail(AUTHOR.email);
      await use({ me, author });
      await db.closePool();
    },
    { scope: "worker" },
  ],

  fake: async ({}, use, testInfo) => {
    const seed = seedFor(testInfo.testId, testInfo.repeatEachIndex, testInfo.retry);
    testInfo.annotations.push({
      type: "faker-seed",
      description: `E2E_SEED=${process.env.E2E_SEED} (test seed ${seed})`,
    });
    const fake = new Faker({ locale: [en, baseLocale] });
    fake.seed(seed);
    await use(fake);
  },

  data: async ({ fake, users }, use) => {
    await use(createDataFactory(fake, users));
  },

  signInAs: async ({ context, baseURL }, use) => {
    await use((user) => addSession(context, user, baseURL!));
  },

  apiAs: async ({ playwright, baseURL }, use) => {
    const contexts: APIRequestContext[] = [];
    await use(async (user) => {
      const context = await playwright.request.newContext({
        baseURL,
        storageState: {
          cookies: [await sessionCookie(user, baseURL!)],
          origins: [],
        },
      });
      contexts.push(context);
      return context;
    });
    await Promise.all(contexts.map((context) => context.dispose()));
  },
});

export { expect, db };
export type { UserRow } from "./test-db";
