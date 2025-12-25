import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { requireApiSession } from "@/lib/api/auth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "PUT")
    return res.status(405).json({ message: "Method not allowed" });

  const sessionResult = await requireApiSession(req, res);
  if (!sessionResult) return;

  const { id } = req.query;
  const { isDeleted } = req.body;

  try {
    const sequenceId = parseInt(id as string, 10);
    if (Number.isNaN(sequenceId)) {
      return res.status(400).json({ message: "Sequence id is required" });
    }

    const existingSequence = await prisma.sequence.findUnique({
      where: { id: sequenceId },
    });

    if (
      !existingSequence ||
      existingSequence.userId !== sessionResult.userId
    ) {
      return res.status(404).json({ message: "Sequence not found" });
    }

    const updatedSequence = await prisma.sequence.update({
      where: { id: sequenceId },
      data: { isDeleted },
    });
    res.status(200).json(updatedSequence);
  } catch (error) {
    if (error instanceof Error)
      res
        .status(500)
        .json({ error: "Error updating sequence", details: error.message });
  }
}
