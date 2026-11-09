import { db, expect, test } from "../support/fixtures";

test.describe("comments API", () => {
  test("posts a comment on a visible sequence and lists it first", async ({
    request,
    data,
    users,
    fake,
  }) => {
    const sequence = await data.createSequence("author");
    await db.insertComment({
      sequenceId: sequence.id,
      authorId: users.author.id,
      content: "Older comment",
      createdAt: new Date(Date.now() - 60_000),
    });
    const content = fake.lorem.sentence();

    const created = await request.post("/api/comment/create", {
      data: { sequenceId: sequence.id, content: `  ${content}  ` },
    });

    expect(created.status()).toBe(201);
    const comment = await created.json();
    expect(comment).toMatchObject({
      content,
      sequenceId: sequence.id,
      authorId: users.me.id,
      author: { id: users.me.id, username: users.me.username },
    });
    expect(await db.findComment(comment.id)).toMatchObject({
      content,
      authorId: users.me.id,
      isDeleted: false,
    });

    const list = await (
      await request.get(`/api/comment/list?sequenceId=${sequence.id}`)
    ).json();
    expect(list.total).toBe(2);
    expect(list.items.map((c: { content: string }) => c.content)).toEqual([
      content,
      "Older comment",
    ]);
  });

  test("stores emojis and counts them as one character", async ({ request, data }) => {
    const sequence = await data.createSequence("author");
    const content = "🎉".repeat(1000);

    const created = await request.post("/api/comment/create", {
      data: { sequenceId: sequence.id, content },
    });

    expect(created.status()).toBe(201);
    expect((await db.findComment((await created.json()).id))?.content).toBe(content);
  });

  test("pages through comments without repeats when new ones arrive", async ({
    request,
    data,
    users,
  }) => {
    const sequence = await data.createSequence("author");
    const base = Date.now() - 60 * 60_000;
    for (let i = 1; i <= 5; i++) {
      await db.insertComment({
        sequenceId: sequence.id,
        authorId: users.author.id,
        content: `Comment ${i}`,
        createdAt: new Date(base + i * 60_000),
      });
    }
    const list = (cursor?: number) =>
      request
        .get(
          `/api/comment/list?sequenceId=${sequence.id}&limit=2${cursor ? `&cursor=${cursor}` : ""}`,
        )
        .then((response) => response.json());

    const first = await list();
    expect(first.items.map((c: { content: string }) => c.content)).toEqual([
      "Comment 5",
      "Comment 4",
    ]);
    expect(first.hasMore).toBe(true);

    // A comment posted between pages must not shift the next page.
    await request.post("/api/comment/create", {
      data: { sequenceId: sequence.id, content: "Newest" },
    });

    const second = await list(first.nextCursor);
    expect(second.items.map((c: { content: string }) => c.content)).toEqual([
      "Comment 3",
      "Comment 2",
    ]);
    const third = await list(second.nextCursor);
    expect(third.items.map((c: { content: string }) => c.content)).toEqual(["Comment 1"]);
    expect(third).toMatchObject({ hasMore: false, nextCursor: null, total: 6 });
  });

  test("hides comments on someone else's private sequence", async ({ request, data }) => {
    const sequence = await data.createSequence("author", { visibility: "PRIVATE" });

    const list = await request.get(`/api/comment/list?sequenceId=${sequence.id}`);
    const created = await request.post("/api/comment/create", {
      data: { sequenceId: sequence.id, content: "Hello" },
    });

    expect(list.status()).toBe(404);
    expect(created.status()).toBe(404);
  });

  test("rejects empty comments", async ({ request, data }) => {
    const sequence = await data.createSequence("author");
    const response = await request.post("/api/comment/create", {
      data: { sequenceId: sequence.id, content: "   " },
    });
    expect(response.status()).toBe(400);
  });

  test("the author can delete their comment, and it leaves the list", async ({
    request,
    data,
  }) => {
    const sequence = await data.createSequence("author");
    const comment = await (
      await request.post("/api/comment/create", {
        data: { sequenceId: sequence.id, content: "Mine" },
      })
    ).json();

    const deleted = await request.delete(`/api/comment/delete?id=${comment.id}`);

    expect(deleted.status()).toBe(200);
    expect(await db.findComment(comment.id)).toMatchObject({ isDeleted: true });
    const list = await (
      await request.get(`/api/comment/list?sequenceId=${sequence.id}`)
    ).json();
    expect(list).toMatchObject({ items: [], total: 0 });
  });

  test("the sequence owner can delete anyone's comment on it", async ({
    request,
    data,
    users,
  }) => {
    const sequence = await data.createSequence("me");
    const comment = await db.insertComment({
      sequenceId: sequence.id,
      authorId: users.author.id,
      content: "On your sequence",
    });

    const deleted = await request.delete(`/api/comment/delete?id=${comment.id}`);

    expect(deleted.status()).toBe(200);
    expect(await db.findComment(comment.id)).toMatchObject({ isDeleted: true });
  });

  test("nobody else can delete a comment", async ({ request, data, users }) => {
    const sequence = await data.createSequence("author");
    const comment = await db.insertComment({
      sequenceId: sequence.id,
      authorId: users.author.id,
      content: "Not yours",
    });

    const deleted = await request.delete(`/api/comment/delete?id=${comment.id}`);

    expect(deleted.status()).toBe(404);
    expect(await db.findComment(comment.id)).toMatchObject({ isDeleted: false });
  });

  test("sequence lists and the sequence itself carry the comment count", async ({
    request,
    data,
    users,
  }) => {
    const sequence = await data.createSequence("author");
    await db.insertComment({ sequenceId: sequence.id, authorId: users.author.id, content: "One" });
    const removed = await db.insertComment({
      sequenceId: sequence.id,
      authorId: users.me.id,
      content: "Two",
    });
    await request.delete(`/api/comment/delete?id=${removed.id}`);

    const single = await (await request.get(`/api/sequence/${sequence.id}`)).json();
    const feed = await (
      await request.get(`/api/sequence/fetch?search=${encodeURIComponent(sequence.title)}`)
    ).json();

    expect(single.commentCount).toBe(1);
    expect(feed.items.find((s: { id: number }) => s.id === sequence.id)?.commentCount).toBe(1);
  });
});
