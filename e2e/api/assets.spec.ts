import { db, expect, test } from "../support/fixtures";
import { makePng } from "@/__tests__/helpers/png";

const upload = (
  request: import("@playwright/test").APIRequestContext,
  body: Buffer,
  contentType = "image/png",
) =>
  request.post("/api/asset/upload", {
    data: body,
    headers: { "Content-Type": contentType },
  });

test.describe("POST /api/asset/upload", () => {
  test("stores a valid image, records the uploader and serves it back", async ({
    request,
    users,
  }) => {
    const response = await upload(request, makePng(1080, 1350));

    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body).toMatchObject({ width: 1080, height: 1350, contentType: "image/png" });

    const stored = await db.findAsset(body.id);
    expect(stored).toMatchObject({ uploadedById: users.me.id, width: 1080, height: 1350 });
    expect(stored!.pathname).toMatch(new RegExp(`^assets/${users.me.id}/.+\\.png$`));

    const file = await request.get(body.url);
    expect(file.status()).toBe(200);
    expect(file.headers()["content-type"]).toBe("image/png");
  });

  test("rejects an image outside the 9:16 to 1.91:1 range", async ({ request }) => {
    const response = await upload(request, makePng(1200, 400));

    expect(response.status()).toBe(400);
    expect((await response.json()).code).toBe("ratio");
  });

  test("rejects a file that isn't an image, whatever it claims to be", async ({
    request,
  }) => {
    const response = await upload(request, Buffer.from("<svg></svg>"), "image/png");

    expect(response.status()).toBe(400);
    expect((await response.json()).code).toBe("type");
  });
});

test.describe("POST /api/sequence/create with images", () => {
  test("an uploaded image makes an IMAGE frame", async ({ request, data, users }) => {
    const asset = await (await upload(request, makePng(1080, 1080))).json();
    const response = await request.post("/api/sequence/create", {
      data: {
        title: data.sequenceTitle(),
        frames: [{ content: "Look", assetId: asset.id }, { content: "Text" }],
      },
    });

    expect(response.status()).toBe(201);
    const stored = await db.findSequence((await response.json()).id);
    const [imageFrame, textFrame] = await Promise.all(
      stored!.frames.map((frame) => db.findFrameMedia(frame.id)),
    );
    expect(imageFrame).toMatchObject({
      type: "IMAGE",
      asset: { id: asset.id, uploadedById: users.me.id },
    });
    expect(textFrame).toEqual({ type: "PHRASE", asset: null });
  });

  test("refuses someone else's image", async ({ request, data, users }) => {
    const foreign = await db.insertAsset(users.author.id);
    const title = data.sequenceTitle();
    const response = await request.post("/api/sequence/create", {
      data: { title, frames: [{ content: "Mine?", assetId: foreign.id }] },
    });

    expect(response.status()).toBe(400);
    expect(await db.findSequenceByTitle(users.me.id, title)).toBeFalsy();
  });
});
