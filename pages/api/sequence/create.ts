import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST")
    return res.status(405).json({ message: "Method not allowed" });

  const { title, description = "", url = "", userId, frameOrder } = req.body;

  if (!title || !userId || !Array.isArray(frameOrder)) {
    return res.status(400).json({
      message: "Missing required fields title",
    });
  }

  try {
    const newSequence = await prisma.sequence.create({
      data: {
        title,
        description,
        url,
        userId: parseInt(userId as string, 10),
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
