import { db, expect, test } from "../support/fixtures";

test.describe("snippets API", () => {
  test("saves a frame from a visible sequence and lists it", async ({
    request,
    data,
    users,
  }) => {
    const sequence = await data.createSequence("author", { frames: data.frames(2) });
    const frameId = sequence.FrameOrder[1];

    const created = await request.post("/api/snippet/create", {
      data: { frameId, originSequenceId: sequence.id },
    });

    expect(created.status()).toBe(201);
    const snippet = await created.json();
    expect(snippet).toMatchObject({
      frameId,
      originSequenceId: sequence.id,
      createdById: users.me.id,
      originSequence: { id: sequence.id, title: sequence.title },
    });
    expect(await db.findSnippets({ userId: users.me.id, frameId })).toHaveLength(1);

    const list = await (await request.get("/api/snippet/list")).json();
    expect(list).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: snippet.id, frame: expect.objectContaining({ id: frameId }) }),
      ]),
    );
  });

  test("refuses a frame that isn't part of the sequence", async ({
    request,
    data,
    users,
  }) => {
    const sequence = await data.createSequence("author");
    const unrelated = await data.createSequence("author");
    const frameId = unrelated.FrameOrder[0];

    const response = await request.post("/api/snippet/create", {
      data: { frameId, originSequenceId: sequence.id },
    });

    expect(response.status()).toBe(404);
    expect(await db.findSnippets({ userId: users.me.id, frameId })).toEqual([]);
  });

  test("refuses frames from someone else's private or deleted sequence", async ({
    request,
    data,
    users,
  }) => {
    const hidden = await data.createSequence("author", { visibility: "PRIVATE" });
    const deleted = await data.createSequence("me");
    await request.delete(`/api/sequence/delete?id=${deleted.id}`);

    for (const sequence of [hidden, deleted]) {
      const frameId = sequence.FrameOrder[0];
      const response = await request.post("/api/snippet/create", {
        data: { frameId, originSequenceId: sequence.id },
      });
      expect(response.status()).toBe(404);
      expect(await db.findSnippets({ userId: users.me.id, frameId })).toEqual([]);
    }
  });

  test("rejects malformed ids", async ({ request }) => {
    const response = await request.post("/api/snippet/create", {
      data: { frameId: "abc", originSequenceId: -1 },
    });

    expect(response.status()).toBe(400);
  });

  test("deletes the user's own snippet", async ({ request, data, users }) => {
    const sequence = await data.createSequence("author");
    const frameId = sequence.FrameOrder[0];
    const snippet = await db.insertSnippet({
      userId: users.me.id,
      frameId,
      originSequenceId: sequence.id,
    });

    const response = await request.delete(`/api/snippet/delete?id=${snippet.id}`);

    expect(response.status()).toBe(200);
    expect(await db.findSnippets({ userId: users.me.id, frameId })).toEqual([]);
    expect(
      (await request.delete(`/api/snippet/delete?id=${snippet.id}`)).status(),
    ).toBe(404);
  });

  test("can't delete someone else's snippet", async ({ request, data, users }) => {
    const sequence = await data.createSequence("me");
    const frameId = sequence.FrameOrder[0];
    const theirs = await db.insertSnippet({
      userId: users.author.id,
      frameId,
      originSequenceId: sequence.id,
    });

    const response = await request.delete(`/api/snippet/delete?id=${theirs.id}`);

    expect(response.status()).toBe(404);
    expect(await db.findSnippets({ userId: users.author.id, frameId })).toHaveLength(1);
  });
});
