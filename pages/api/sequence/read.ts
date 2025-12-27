import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

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

    const sequence = await prisma.sequence.findFirst({
      where: id ? { id: sequenceId, isDeleted: false } : { isDeleted: false },
    });
    if (!sequence)
      return res.status(404).json({ message: "Sequence not found" });

    const frames = await prisma.frame.findMany({
      where: { id: { in: sequence.FrameOrder } },
    });

    res.status(200).json({ ...sequence, frames });
  } catch (error) {
    if (error instanceof Error)
      res
        .status(500)
        .json({ error: "Error fetching sequence", details: error.message });
  }
}
