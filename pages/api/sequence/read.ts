import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET")
    return res.status(405).json({ message: "Method not allowed" });

  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ message: "Missing sequence id" });
  }

  const sequenceId = parseInt(id as string, 10);

  if (Number.isNaN(sequenceId)) {
    return res.status(400).json({ message: "Sequence id must be a number" });
  }

  try {
    const collection = await prisma.collection.findUnique({
      where: { id: sequenceId },
    });

    if (!collection)
      return res.status(404).json({ message: "Sequence not found" });

    const frames = await prisma.frame.findMany({
      where: { id: { in: collection.FrameOrder } },
    });

    const orderedFrames = collection.FrameOrder.map((frameId) =>
      frames.find((frame) => frame.id === frameId)
    ).filter((frame): frame is (typeof frames)[number] => Boolean(frame));

    res.status(200).json({ ...collection, frames: orderedFrames });
  } catch (error) {
    if (error instanceof Error)
      res
        .status(500)
        .json({ error: "Error fetching sequence", details: error.message });
  }
}
