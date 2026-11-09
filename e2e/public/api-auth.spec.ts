import { expect, test } from "@playwright/test";

// No session cookie in this project: every API route must refuse.
const routes = [
  { method: "GET", url: "/api/sequence/fetch" },
  { method: "GET", url: "/api/sequence/studio" },
  { method: "GET", url: "/api/sequence/1" },
  { method: "POST", url: "/api/sequence/create" },
  { method: "PUT", url: "/api/sequence/update?id=1" },
  { method: "DELETE", url: "/api/sequence/delete?id=1" },
  { method: "GET", url: "/api/snippet/list" },
  { method: "POST", url: "/api/snippet/create" },
  { method: "DELETE", url: "/api/snippet/delete?id=1" },
  { method: "GET", url: "/api/user/1" },
  { method: "PUT", url: "/api/user/update?id=1" },
  { method: "POST", url: "/api/contact/send" },
  { method: "POST", url: "/api/asset/upload" },
] as const;

test.describe("API without a session", () => {
  for (const { method, url } of routes) {
    test(`${method} ${url} answers 401`, async ({ request }) => {
      const response = await request.fetch(url, { method, data: {} });

      expect(response.status()).toBe(401);
      expect(await response.json()).toEqual({ message: "Unauthorized" });
    });
  }

  test("a forged session cookie is rejected", async ({ request }) => {
    const response = await request.get("/api/sequence/fetch", {
      headers: { cookie: "next-auth.session-token=not-a-real-token" },
    });

    expect(response.status()).toBe(401);
  });
});
