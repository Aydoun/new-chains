import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });

  const {
    type,
    url,
    description = null,
    reportedCount = 0,
    likes = 0,
    views = 0,
  } = req.body;

  if (!type || !url) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const newFrame = await prisma.frame.create({
      data: {
        type,
        url,
        description,
        reportedCount,
        likes,
        views,
      },
    });

    res.status(201).json(newFrame);
  } catch (error) {
    if (error instanceof Error)
      res.status(500).json({ error: "Error creating frame", details: error.message });
  }
}
