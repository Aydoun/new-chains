import followHandler from "@/pages/api/sequence/follow";
import muteHandler from "@/pages/api/sequence/mute";
import notificationsHandler from "@/pages/api/sequence/notifications";
import type { NextApiRequest, NextApiResponse } from "next";
import { vi } from "vitest";

const prismaMocks = vi.hoisted(() => ({
  findSequence: vi.fn(),
  upsertFollower: vi.fn(),
  deleteFollower: vi.fn(),
  findFollower: vi.fn(),
  countFollowers: vi.fn(),
  findNotifications: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  default: {
    sequence: {
      findFirst: prismaMocks.findSequence,
    },
    sequenceFollower: {
      upsert: prismaMocks.upsertFollower,
      deleteMany: prismaMocks.deleteFollower,
      findUnique: prismaMocks.findFollower,
      count: prismaMocks.countFollowers,
    },
    sequenceNotification: {
      findMany: prismaMocks.findNotifications,
    },
  },
}));

const sessionMock = vi.hoisted(() =>
  vi.fn(async () => ({
    session: {},
    userId: 42,
  }))
);

vi.mock("@/lib/api/auth", () => ({
  requireApiSession: (...args: unknown[]) => sessionMock(...args),
}));

const createMockResponse = () => {
  const store: { status?: number; body?: unknown } = {};
  const res = {
    status(code: number) {
      store.status = code;
      return res as NextApiResponse;
    },
    json(data: unknown) {
      store.body = data;
      return res as NextApiResponse;
    },
  } as unknown as NextApiResponse;

  return { res, store };
};

describe("sequence follow and notification endpoints", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sessionMock.mockResolvedValue({ session: {}, userId: 42 });
  });

  it("follows a sequence and returns follower state", async () => {
    prismaMocks.findSequence.mockResolvedValueOnce({ id: 9, isDeleted: false });
    prismaMocks.findFollower.mockResolvedValueOnce({ muted: false });
    prismaMocks.countFollowers.mockResolvedValueOnce(1);

    const req = {
      method: "POST",
      body: { sequenceId: "9", action: "follow" },
    } as unknown as NextApiRequest;
    const { res, store } = createMockResponse();

    await followHandler(req, res);

    expect(store.status).toBe(200);
    expect(prismaMocks.upsertFollower).toHaveBeenCalledWith({
      where: { sequenceId_userId: { sequenceId: 9, userId: 42 } },
      update: { muted: false },
      create: { sequenceId: 9, userId: 42, muted: false },
    });
    expect(store.body).toMatchObject({
      followerCount: 1,
      isFollower: true,
      isMuted: false,
    });
  });

  it("unfollows a sequence", async () => {
    prismaMocks.findSequence.mockResolvedValueOnce({ id: 10, isDeleted: false });
    prismaMocks.findFollower.mockResolvedValueOnce(null);
    prismaMocks.countFollowers.mockResolvedValueOnce(0);

    const req = {
      method: "POST",
      body: { sequenceId: "10", action: "unfollow" },
    } as unknown as NextApiRequest;
    const { res, store } = createMockResponse();

    await followHandler(req, res);

    expect(store.status).toBe(200);
    expect(prismaMocks.deleteFollower).toHaveBeenCalledWith({
      where: { sequenceId: 10, userId: 42 },
    });
    expect(store.body).toMatchObject({
      followerCount: 0,
      isFollower: false,
      isMuted: false,
    });
  });

  it("mutes a followed sequence", async () => {
    prismaMocks.findSequence.mockResolvedValueOnce({ id: 11, isDeleted: false });
    prismaMocks.countFollowers.mockResolvedValueOnce(2);
    prismaMocks.upsertFollower.mockResolvedValueOnce({ muted: true });

    const req = {
      method: "POST",
      body: { sequenceId: "11", muted: true },
    } as unknown as NextApiRequest;
    const { res, store } = createMockResponse();

    await muteHandler(req, res);

    expect(store.status).toBe(200);
    expect(store.body).toMatchObject({
      followerCount: 2,
      isFollower: true,
      isMuted: true,
    });
    expect(prismaMocks.upsertFollower).toHaveBeenCalledWith({
      where: { sequenceId_userId: { sequenceId: 11, userId: 42 } },
      update: { muted: true },
      create: { sequenceId: 11, userId: 42, muted: true },
    });
  });

  it("returns notifications for the viewer", async () => {
    const fakeNotifications = [
      {
        id: 1,
        sequenceId: 11,
        message: "Steps updated",
        type: "STEPS_UPDATED",
        read: false,
        createdAt: "2024-05-05T00:00:00.000Z",
        sequence: { id: 11, title: "Daily flow" },
      },
    ];
    prismaMocks.findNotifications.mockResolvedValueOnce(fakeNotifications);

    const req = {
      method: "GET",
      query: { sequenceId: "11" },
    } as unknown as NextApiRequest;
    const { res, store } = createMockResponse();

    await notificationsHandler(req, res);

    expect(store.status).toBe(200);
    expect(store.body).toEqual(fakeNotifications);
    expect(prismaMocks.findNotifications).toHaveBeenCalledWith({
      where: { recipientId: 42, sequenceId: 11 },
      include: { sequence: { select: { id: true, title: true } } },
      orderBy: { createdAt: "desc" },
      take: 50,
    });
  });
});
