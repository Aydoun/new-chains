import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });

  const {
    title,
    description = null,
    url,
    userId,
    frameOrder = [],
    engine = "CHESS",
    visibility = "PUBLIC",
    popularity = 0,
    views = 0,
  } = req.body;

  if (!title || !url || typeof userId !== "number") {
    return res.status(400).json({
      message: "Missing required fields",
    });
  }

  try {
    const newCollection = await prisma.collection.create({
      data: {
        title,
        description,
        url,
        userId,
        FrameOrder: frameOrder,
        engine,
        visibility,
        popularity,
        views,
      },
    });

    res.status(201).json(newCollection);
  } catch (error) {
    if (error instanceof Error)
      res
        .status(500)
        .json({ error: "Error creating a collection", details: error.message });
  }
}