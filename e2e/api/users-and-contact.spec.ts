import { db, expect, test } from "../support/fixtures";

test.describe("users API", () => {
  test("a user sees their own email", async ({ request, users }) => {
    const response = await request.get(`/api/user/${users.me.id}`);

    expect(response.status()).toBe(200);
    expect(await response.json()).toMatchObject({
      id: users.me.id,
      username: users.me.username,
      email: users.me.email,
    });
  });

  test("other users' emails stay private", async ({ request, users }) => {
    const body = await (await request.get(`/api/user/${users.author.id}`)).json();

    expect(body).toMatchObject({ id: users.author.id, username: users.author.username });
    expect(body).not.toHaveProperty("email");
  });

  test("an unknown user is a 404", async ({ request }) => {
    expect((await request.get("/api/user/2147483647")).status()).toBe(404);
  });

  test("updates the user's own bio, trimmed", async ({ data, apiAs }) => {
    const user = await data.createUser();
    const api = await apiAs(user);
    const bio = data.bio();

    const response = await api.put(`/api/user/update?id=${user.id}`, {
      data: { bio: `  ${bio}  ` },
    });

    expect(response.status()).toBe(200);
    expect((await response.json()).bio).toBe(bio);
    expect((await db.findUser(user.id))?.bio).toBe(bio);
  });

  test("refuses a bio over 240 characters", async ({ data, apiAs }) => {
    const user = await data.createUser();
    const api = await apiAs(user);

    const response = await api.put(`/api/user/update?id=${user.id}`, {
      data: { bio: data.text(241) },
    });

    expect(response.status()).toBe(400);
    expect((await db.findUser(user.id))?.bio).toBeNull();
  });

  test("can't change someone else's bio", async ({ request, data }) => {
    const target = await data.createUser();

    const response = await request.put(`/api/user/update?id=${target.id}`, {
      data: { bio: data.bio() },
    });

    expect(response.status()).toBe(403);
    expect((await db.findUser(target.id))?.bio).toBeNull();
  });
});

test.describe("contact API", () => {
  test("stores the message, trimmed", async ({ request, data, users }) => {
    const message = data.contactMessage();

    const response = await request.post("/api/contact/send", {
      data: { message: `\n ${message} ` },
    });

    expect(response.status()).toBe(201);
    expect(await response.json()).toMatchObject({ userId: users.me.id, message });
    expect(await db.findContacts(users.me.id, message)).toHaveLength(1);
  });

  for (const [name, message] of [
    ["an empty message", ""],
    ["a blank message", "   "],
  ] as const) {
    test(`refuses ${name}`, async ({ request }) => {
      const response = await request.post("/api/contact/send", { data: { message } });
      expect(response.status()).toBe(400);
    });
  }

  test("refuses a message over 240 characters", async ({ request, data, users }) => {
    const message = data.text(241);

    const response = await request.post("/api/contact/send", { data: { message } });

    expect(response.status()).toBe(400);
    expect(await db.findContacts(users.me.id, message)).toEqual([]);
  });
});
