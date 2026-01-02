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

  const { title, description = "", url = "", userId, frameOrder } = req.body;

  if (!title || !userId || !Array.isArray(frameOrder)) {
    return res.status(400).json({
      message: "Missing required fields: title, userId, frameOrder",
    });
  }

  const parsedUserId = parseInt(userId as string, 10);

  if (Number.isNaN(parsedUserId)) {
    return res.status(400).json({ message: "Invalid user id" });
  }

  if (sessionResult.userId !== parsedUserId) {
    return res.status(403).json({ message: "Forbidden" });
  }

  try {
    const newSequence = await prisma.sequence.create({
      data: {
        title,
        description,
        url,
        userId: parsedUserId,
        FrameOrder: frameOrder,
      },
    });

    res.status(201).json(newSequence);
  } catch (error) {
    if (error instanceof Error)
      res
        .status(500)
        .json({ error: "Error creating a sequence", details: error.message });
  }
}
