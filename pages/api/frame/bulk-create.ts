import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

type FrameInput = {
  type: string;
  url: string;
  description?: string | null;
  reportedCount?: number;
  likes?: number;
  views?: number;
};

const buildFrameData = (frame: FrameInput) => ({
  type: frame.type,
  url: frame.url,
  description: frame.description ?? null,
  reportedCount: frame.reportedCount ?? 0,
  likes: frame.likes ?? 0,
  views: frame.views ?? 0,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });

  const { frames } = req.body as { frames?: FrameInput[] };

  if (!frames || !Array.isArray(frames) || frames.length === 0) {
    return res.status(400).json({ message: "frames payload must be a non-empty array" });
  }

  try {
    const createdFrames = await prisma.$transaction(
      frames.map((frame) => prisma.frame.create({ data: buildFrameData(frame) }))
    );

    const ids = createdFrames.map((frame) => frame.id);
    res.status(201).json({ ids, frames: createdFrames });
  } catch (error) {
    if (error instanceof Error)
      res.status(500).json({ error: "Error creating frames", details: error.message });
  }
}
