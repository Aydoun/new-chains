import { db, expect, test } from "../support/fixtures";

const DAY = 24 * 60 * 60 * 1000;

test.describe("POST /api/sequence/create", () => {
  test("creates the sequence and its frames in one go", async ({
    request,
    data,
    users,
  }) => {
    const payload = data.sequencePayload({
      visibility: "PRIVATE",
      frames: data.frames(4),
    });

    // Surrounding whitespace is trimmed before saving.
    const response = await request.post("/api/sequence/create", {
      data: {
        ...payload,
        title: `  ${payload.title}  `,
        frames: payload.frames.map((frame) => ({
          ...frame,
          content: ` ${frame.content}\n`,
        })),
      },
    });
    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body).toMatchObject({
      title: payload.title,
      description: payload.description,
      visibility: "PRIVATE",
      userId: users.me.id,
      isDeleted: false,
    });

    const stored = await db.findSequence(body.id);
    expect(stored?.FrameOrder).toEqual(body.FrameOrder);
    expect(
      stored!.frames.map(({ content, description }) => ({ content, description })),
    ).toEqual(payload.frames);
  });

  test("defaults to a public sequence with an empty description", async ({
    request,
    data,
  }) => {
    const response = await request.post("/api/sequence/create", {
      data: { title: data.sequenceTitle(), frames: [{ content: data.frame().content }] },
    });

    expect(response.status()).toBe(201);
    const stored = await db.findSequence((await response.json()).id);
    expect(stored).toMatchObject({ visibility: "PUBLIC", description: "" });
    expect(stored!.frames[0].description).toBe("");
  });

  const invalidPayloads: Array<{
    name: string;
    build: (data: import("../support/fixtures").DataFactory) => Record<string, unknown>;
  }> = [
    { name: "a missing title", build: (d) => ({ frames: d.frames(1) }) },
    { name: "a blank title", build: (d) => ({ title: "   ", frames: d.frames(1) }) },
    {
      name: "a title over 120 characters",
      build: (d) => ({ title: d.text(121), frames: d.frames(1) }),
    },
    {
      name: "a description over 500 characters",
      build: (d) => ({ ...d.sequencePayload(), description: d.text(501) }),
    },
    { name: "no frames", build: (d) => ({ title: d.sequenceTitle(), frames: [] }) },
    {
      name: "more than 50 frames",
      build: (d) => ({ title: d.sequenceTitle(), frames: d.frames(51) }),
    },
    {
      name: "a blank frame",
      build: (d) => ({ title: d.sequenceTitle(), frames: [{ content: "  " }] }),
    },
    {
      name: "a frame over 1000 characters",
      build: (d) => ({ title: d.sequenceTitle(), frames: [{ content: d.text(1001) }] }),
    },
    {
      name: "an unknown visibility",
      build: (d) => ({ ...d.sequencePayload(), visibility: "SECRET" }),
    },
    {
      name: "an unexpected field",
      build: (d) => ({ ...d.sequencePayload(), userId: 1 }),
    },
  ];

  for (const { name, build } of invalidPayloads) {
    test(`rejects ${name} and stores nothing`, async ({ request, data, users }) => {
      const payload = build(data);

      const response = await request.post("/api/sequence/create", { data: payload });

      expect(response.status()).toBe(400);
      const body = await response.json();
      expect(body.message).toBe("Invalid request body");
      expect(body.issues.length).toBeGreaterThan(0);
      if (typeof payload.title === "string" && payload.title.trim()) {
        expect(await db.findSequenceByTitle(users.me.id, payload.title)).toBeNull();
      }
    });
  }
});

test.describe("GET /api/sequence/:id", () => {
  test("returns the frames in order and which ones the viewer saved", async ({
    request,
    data,
    users,
  }) => {
    const sequence = await data.createSequence("author", { frames: data.frames(3) });
    await db.insertSnippet({
      userId: users.me.id,
      frameId: sequence.FrameOrder[2],
      originSequenceId: sequence.id,
    });

    const response = await request.get(`/api/sequence/${sequence.id}`);

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.frames.map((frame: { id: number }) => frame.id)).toEqual(
      sequence.FrameOrder,
    );
    expect(body.likedFrames).toEqual([sequence.FrameOrder[2]]);
  });

  test("hides someone else's private sequence", async ({ request, data }) => {
    const sequence = await data.createSequence("author", { visibility: "PRIVATE" });

    const response = await request.get(`/api/sequence/${sequence.id}`);

    expect(response.status()).toBe(404);
  });

  test("shows the owner their own private sequence", async ({ request, data }) => {
    const sequence = await data.createSequence("me", { visibility: "PRIVATE" });

    const response = await request.get(`/api/sequence/${sequence.id}`);

    expect(response.status()).toBe(200);
  });

  test("rejects an id that isn't a positive integer", async ({ request }) => {
    for (const id of ["abc", "0", "-3", "1.5", "99999999999"]) {
      const response = await request.get(`/api/sequence/${id}`);
      expect(response.status(), `id ${id}`).toBe(400);
    }
  });
});

test.describe("PUT /api/sequence/update", () => {
  test("updates the owner's sequence", async ({ request, data }) => {
    const sequence = await data.createSequence("me");
    const changes = {
      title: data.sequenceTitle(),
      description: data.sequenceDescription(),
      visibility: "PRIVATE",
    };

    const response = await request.put(`/api/sequence/update?id=${sequence.id}`, {
      data: changes,
    });

    expect(response.status()).toBe(200);
    expect(await db.findSequence(sequence.id)).toMatchObject(changes);
  });

  test("refuses an empty update", async ({ request, data }) => {
    const sequence = await data.createSequence("me");

    const response = await request.put(`/api/sequence/update?id=${sequence.id}`, {
      data: {},
    });

    expect(response.status()).toBe(400);
  });

  test("can't touch someone else's sequence", async ({ request, data }) => {
    const sequence = await data.createSequence("author");

    const response = await request.put(`/api/sequence/update?id=${sequence.id}`, {
      data: { title: data.sequenceTitle() },
    });

    // Reported as missing, so ids can't be probed.
    expect(response.status()).toBe(404);
    expect((await db.findSequence(sequence.id))?.title).toBe(sequence.title);
  });
});

test.describe("DELETE /api/sequence/delete", () => {
  test("soft-deletes the owner's sequence", async ({ request, data }) => {
    const sequence = await data.createSequence("me");

    const response = await request.delete(`/api/sequence/delete?id=${sequence.id}`);

    expect(response.status()).toBe(200);
    const stored = await db.findSequence(sequence.id);
    expect(stored?.isDeleted).toBe(true);
    expect(stored?.frames).toHaveLength(sequence.FrameOrder.length);

    // Gone from every read, and can't be deleted twice.
    expect((await request.get(`/api/sequence/${sequence.id}`)).status()).toBe(404);
    const studio = await request.get(
      `/api/sequence/studio?search=${encodeURIComponent(sequence.title)}`,
    );
    expect((await studio.json()).items).toEqual([]);
    expect(
      (await request.delete(`/api/sequence/delete?id=${sequence.id}`)).status(),
    ).toBe(404);
  });

  test("can't delete someone else's sequence", async ({ request, data }) => {
    const sequence = await data.createSequence("author");

    const response = await request.delete(`/api/sequence/delete?id=${sequence.id}`);

    expect(response.status()).toBe(404);
    expect((await db.findSequence(sequence.id))?.isDeleted).toBe(false);
  });

  test("only accepts DELETE", async ({ request, data }) => {
    const sequence = await data.createSequence("me");

    const response = await request.get(`/api/sequence/delete?id=${sequence.id}`);

    expect(response.status()).toBe(405);
    expect(response.headers().allow).toBe("DELETE");
  });
});

test.describe("listing sequences", () => {
  test("the feed shows other people's public sequences, newest first", async ({
    request,
    data,
    users,
  }) => {
    const token = data.token();
    const title = () => data.sequenceTitle(`${token} ${data.token()}`);
    const older = await data.createSequence("author", {
      title: title(),
      createdAt: new Date(Date.now() - 2 * 60 * 1000),
    });
    const newer = await data.createSequence("author", { title: title() });
    await data.createSequence("author", { title: title(), visibility: "PRIVATE" });
    await data.createSequence("me", { title: title() });

    const response = await request.get(`/api/sequence/fetch?search=${token}`);

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.items.map((item: { id: number }) => item.id)).toEqual([
      newer.id,
      older.id,
    ]);
    expect(body.items[0]).toMatchObject({
      user: { username: users.author.username },
      firstFrame: { id: newer.FrameOrder[0] },
    });
  });

  test("paginates", async ({ request, data }) => {
    const token = data.token();
    for (let i = 0; i < 3; i += 1) {
      await data.createSequence("author", {
        title: data.sequenceTitle(`${token} ${data.token()}`),
        createdAt: new Date(Date.now() - i * 1000),
      });
    }

    const first = await (
      await request.get(`/api/sequence/fetch?search=${token}&limit=2`)
    ).json();
    expect(first).toMatchObject({ page: 1, pageSize: 2, hasMore: true, nextPage: 2 });
    expect(first.items).toHaveLength(2);

    const second = await (
      await request.get(`/api/sequence/fetch?search=${token}&limit=2&page=2`)
    ).json();
    expect(second).toMatchObject({ page: 2, hasMore: false, nextPage: null });
    expect(second.items).toHaveLength(1);
  });

  test("filters by creation time", async ({ request, data }) => {
    const token = data.token();
    const title = () => data.sequenceTitle(`${token} ${data.token()}`);
    const recent = await data.createSequence("author", { title: title() });
    const twoHoursAgo = await data.createSequence("author", {
      title: title(),
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    });
    // 62 days ago is always before the 1st of the current month.
    const old = await data.createSequence("author", {
      title: title(),
      createdAt: new Date(Date.now() - 62 * DAY),
    });

    const ids = async (filter?: string) => {
      const query = `search=${token}${filter ? `&timeFilter=${filter}` : ""}`;
      const body = await (await request.get(`/api/sequence/fetch?${query}`)).json();
      return body.items.map((item: { id: number }) => item.id);
    };

    expect(await ids()).toEqual([recent.id, twoHoursAgo.id, old.id]);
    expect(await ids("last-hour")).toEqual([recent.id]);
    const thisMonth = await ids("this-month");
    expect(thisMonth).toContain(recent.id);
    expect(thisMonth).not.toContain(old.id);
  });

  test("rejects invalid list parameters", async ({ request }) => {
    for (const query of ["timeFilter=yesterday", "limit=0", "limit=51", "page=0"]) {
      const response = await request.get(`/api/sequence/fetch?${query}`);
      expect(response.status(), query).toBe(400);
    }
  });

  test("a user's studio list hides their private sequences from others", async ({
    request,
    data,
    users,
  }) => {
    const token = data.token();
    const title = () => data.sequenceTitle(`${token} ${data.token()}`);
    const visible = await data.createSequence("author", { title: title() });
    await data.createSequence("author", { title: title(), visibility: "PRIVATE" });

    const response = await request.get(
      `/api/sequence/studio?userId=${users.author.id}&search=${token}`,
    );

    expect((await response.json()).items.map((item: { id: number }) => item.id)).toEqual([
      visible.id,
    ]);
  });

  test("the user's own studio list includes their private sequences", async ({
    request,
    data,
  }) => {
    const token = data.token();
    const title = () => data.sequenceTitle(`${token} ${data.token()}`);
    const open = await data.createSequence("me", { title: title() });
    const hidden = await data.createSequence("me", {
      title: title(),
      visibility: "PRIVATE",
    });

    const response = await request.get(`/api/sequence/studio?search=${token}`);

    const ids = (await response.json()).items.map((item: { id: number }) => item.id);
    expect(ids).toHaveLength(2);
    expect(ids).toEqual(expect.arrayContaining([open.id, hidden.id]));
  });
});
