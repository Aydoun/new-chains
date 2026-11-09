import { db, expect, test } from "../support/fixtures";

test.describe("frame links API", () => {
  test("stores a frame's link normalised and returns it", async ({ request, data, users }) => {
    const title = data.sequenceTitle();
    const created = await request.post("/api/sequence/create", {
      data: {
        title,
        frames: [{ content: "Read this", linkUrl: "  Example.com/Guide  " }, { content: "Plain" }],
      },
    });

    expect(created.status()).toBe(201);
    const stored = await db.findSequenceByTitle(users.me.id, title);
    const [linked, plain] = stored!.frames;
    expect(await db.findFrameLink(linked.id)).toBe("https://example.com/Guide");
    expect(await db.findFrameLink(plain.id)).toBeNull();

    const read = await (await request.get(`/api/sequence/${stored!.id}`)).json();
    expect(read.frames.map((frame: { linkUrl: string | null }) => frame.linkUrl)).toEqual([
      "https://example.com/Guide",
      null,
    ]);
  });

  for (const [linkUrl, message] of [
    ["javascript:alert(document.cookie)", "link:protocol"],
    ["data:text/html,<script>alert(1)</script>", "link:protocol"],
    ["https://bank.example@evil.test", "link:credentials"],
    ["http://127.0.0.1:3000/admin", "link:host"],
  ]) {
    test(`refuses ${linkUrl} and creates nothing`, async ({ request, data, users }) => {
      const title = data.sequenceTitle();
      const response = await request.post("/api/sequence/create", {
        data: { title, frames: [{ content: "Click me", linkUrl }] },
      });

      expect(response.status()).toBe(400);
      expect((await response.json()).issues).toEqual([{ path: "frames.0.linkUrl", message }]);
      expect(await db.findSequenceByTitle(users.me.id, title)).toBeFalsy();
    });
  }
});
