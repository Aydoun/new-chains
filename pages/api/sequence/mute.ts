import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { requireApiSession } from "@/lib/api/auth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST")
    return res.status(405).json({ message: "Method not allowed" });

  const sessionResult = await requireApiSession(req, res);
  if (!sessionResult) return;

  const { sequenceId, muted } = req.body;
  const parsedId = parseInt(sequenceId, 10);

  if (Number.isNaN(parsedId) || typeof muted !== "boolean") {
    return res
      .status(400)
      .json({ message: "sequenceId and muted flag are required" });
  }

  const sequence = await prisma.sequence.findFirst({
    where: { id: parsedId, isDeleted: false },
  });

  if (!sequence) {
    return res.status(404).json({ message: "Sequence not found" });
  }

  const follower = await prisma.sequenceFollower.upsert({
    where: { sequenceId_userId: { sequenceId: parsedId, userId: sessionResult.userId } },
    update: { muted },
    create: { sequenceId: parsedId, userId: sessionResult.userId, muted },
  });

  const followerCount = await prisma.sequenceFollower.count({
    where: { sequenceId: parsedId },
  });

  res.status(200).json({
    followerCount,
    isFollower: true,
    isMuted: follower.muted,
  });
}
