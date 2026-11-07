import path from "node:path";

/** Where the setup project saves the signed-in browser state. */
export const AUTH_FILE = path.resolve(__dirname, "../.auth/user.json");

/** The seeded user every signed-in test acts as. */
export const TEST_USER = {
  email: "e2e-user@linkntell.test",
  username: "E2E Tester",
} as const;
