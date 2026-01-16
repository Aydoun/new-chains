import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { requireApiSession } from "@/lib/api/auth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET")
    return res.status(405).json({ message: "Method not allowed" });

  const sessionResult = await requireApiSession(req, res);
  if (!sessionResult) return;

  const { sequenceId } = req.query;
  const parsedId = sequenceId ? parseInt(sequenceId as string, 10) : null;

  if (sequenceId && Number.isNaN(parsedId)) {
    return res.status(400).json({ message: "sequenceId must be numeric" });
  }

  const notifications = await prisma.sequenceNotification.findMany({
    where: {
      recipientId: sessionResult.userId,
      ...(parsedId ? { sequenceId: parsedId } : {}),
    },
    include: {
      sequence: {
        select: {
          id: true,
          title: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  res.status(200).json(notifications);
}
