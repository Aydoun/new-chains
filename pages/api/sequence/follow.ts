import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { requireApiSession } from "@/lib/api/auth";

type FollowAction = "follow" | "unfollow";

const isValidAction = (action: unknown): action is FollowAction =>
  action === "follow" || action === "unfollow";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST")
    return res.status(405).json({ message: "Method not allowed" });

  const sessionResult = await requireApiSession(req, res);
  if (!sessionResult) return;

  const { sequenceId, action } = req.body;
  const parsedId = parseInt(sequenceId, 10);

  if (Number.isNaN(parsedId) || !isValidAction(action)) {
    return res
      .status(400)
      .json({ message: "sequenceId and valid action are required" });
  }

  const sequence = await prisma.sequence.findFirst({
    where: { id: parsedId, isDeleted: false },
  });

  if (!sequence) {
    return res.status(404).json({ message: "Sequence not found" });
  }

  if (action === "follow") {
    await prisma.sequenceFollower.upsert({
      where: { sequenceId_userId: { sequenceId: parsedId, userId: sessionResult.userId } },
      update: { muted: false },
      create: { sequenceId: parsedId, userId: sessionResult.userId, muted: false },
    });
  } else {
    await prisma.sequenceFollower.deleteMany({
      where: { sequenceId: parsedId, userId: sessionResult.userId },
    });
  }

  const followerRecord = await prisma.sequenceFollower.findUnique({
    where: { sequenceId_userId: { sequenceId: parsedId, userId: sessionResult.userId } },
  });
  const followerCount = await prisma.sequenceFollower.count({
    where: { sequenceId: parsedId },
  });

  res.status(200).json({
    followerCount,
    isFollower: Boolean(followerRecord),
    isMuted: Boolean(followerRecord?.muted),
  });
}
