import handler from "../hello";
import { testApiHandler } from "next-test-api-route-handler";

describe("GET /api/hello", () => {
  it("returns hello world", async () => {
    await testApiHandler({
      pagesHandler: handler,
      test: async ({ fetch }) => {
        const res = await fetch({ method: "GET" });

        expect(res.status).toBe(200);
        expect(await res.text()).toBe("hello world");
      },
    });
  });
});
