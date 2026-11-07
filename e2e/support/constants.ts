import path from "node:path";

/** Where the setup project saves the signed-in browser state. */
export const AUTH_FILE = path.resolve(__dirname, "../.auth/user.json");

/** The seeded user every signed-in test acts as. */
export const TEST_USER = {
  email: "e2e-user@linkntell.test",
  username: "E2E Tester",
} as const;

/**
 * A second seeded user who owns the sequences the test user browses: the
 * home feed only lists other people's public sequences.
 */
export const AUTHOR = {
  email: "e2e-author@linkntell.test",
  username: "E2E Author",
} as const;

export const SEEDED_USERS = [TEST_USER, AUTHOR] as const;

/** Every user the tests create lives on this reserved domain. */
export const TEST_EMAIL_DOMAIN = "linkntell.test";
