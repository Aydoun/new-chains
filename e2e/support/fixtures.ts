import { createHash } from "node:crypto";
import { test as base, expect } from "@playwright/test";
import { Faker, base as baseLocale, en } from "@faker-js/faker";
import { AUTHOR, TEST_USER } from "./constants";
import * as db from "./test-db";

type Owner = "me" | "author";

export type DataFactory = ReturnType<typeof createDataFactory>;

type TestFixtures = {
  /** Faker seeded per test; the seed is attached to the test report. */
  fake: Faker;
  /** Random payloads and database records for this test. */
  data: DataFactory;
  /**
   * Waits until no other test, in any worker, holds the named lock, then
   * holds it until this test ends. For tests that change data every test
   * shares, such as the test user's bio.
   */
  exclusive: (name: string) => Promise<void>;
};

type WorkerFixtures = {
  /**
   * The two fixed users. Every test signs in as `me`; `author` only owns
   * sequences for `me` to browse (the feed hides your own sequences).
   */
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
    owner === "me" ? users.me.id : users.author.id;

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

    bio: () => fake.person.bio(),

    contactMessage: () =>
      fake.lorem.sentences({ min: 1, max: 3 }).slice(0, 240).trim(),

    /** A string of exactly `length` letters. */
    text: (length: number) => fake.string.alpha({ length }),
  };
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

  exclusive: async ({}, use) => {
    const releases: Array<() => Promise<void>> = [];
    await use(async (name) => {
      releases.push(await db.acquireLock(name));
    });
    for (const release of releases.reverse()) await release();
  },
});

export { expect, db };
export type { UserRow } from "./test-db";
