import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET")
    return res.status(405).json({ message: "Method not allowed" });

  const { id } = req.query;
  const sequenceId = parseInt(id as string, 10);

  try {
    if (Number.isNaN(sequenceId)) {
      return res.status(400).json({ message: "Sequence id is required" });
    }

    let viewerId: number | null = null;
    try {
      const viewerSession = await getServerSession(req, res, authOptions);
      viewerId = viewerSession?.user?.id
        ? parseInt(viewerSession.user.id, 10)
        : null;
    } catch {
      viewerId = null;
    }

    const sequence = await prisma.sequence.findFirst({
      where: id ? { id: sequenceId, isDeleted: false } : { isDeleted: false },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            avatarUrl: true,
          },
        },
      },
    });
    if (!sequence)
      return res.status(404).json({ message: "Sequence not found" });

    const followerRecords = await prisma.sequenceFollower.findMany({
      where: { sequenceId },
      include: {
        user: {
          select: { id: true, username: true, avatarUrl: true },
        },
      },
    });
    const followers = followerRecords.map((record) => ({
      id: record.user.id,
      username: record.user.username,
      avatarUrl: record.user.avatarUrl,
      muted: record.muted,
    }));
    const viewerFollower = followerRecords.find(
      (record) => record.userId === viewerId
    );

    const frames = await prisma.frame.findMany({
      where: { id: { in: sequence.FrameOrder } },
    });

    res.status(200).json({
      ...sequence,
      frames,
      followers,
      followerCount: followers.length,
      viewerState:
        viewerId && !Number.isNaN(viewerId)
          ? {
              isFollower: Boolean(viewerFollower),
              isMuted: Boolean(viewerFollower?.muted),
            }
          : undefined,
    });
  } catch (error) {
    if (error instanceof Error)
      res
        .status(500)
        .json({ error: "Error fetching sequence", details: error.message });
  }
}
