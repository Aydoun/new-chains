import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { requireApiSession } from "@/lib/api/auth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "DELETE")
    return res.status(405).json({ message: "Method not allowed" });

  const sessionResult = await requireApiSession(req, res);
  if (!sessionResult) return;

  const { id } = req.query;
  const sequenceId = parseInt(id as string, 10);

  if (Number.isNaN(sequenceId))
    return res.status(400).json({ message: "Sequence id is required" });

  try {
    const existingSequence = await prisma.sequence.findUnique({
      where: { id: sequenceId },
    });

    if (
      !existingSequence ||
      existingSequence.isDeleted ||
      existingSequence.userId !== sessionResult.userId
    ) {
      return res.status(404).json({ message: "Sequence not found" });
    }

    await prisma.sequence.update({
      where: { id: sequenceId },
      data: { isDeleted: true },
    });

    res.status(200).json({ message: "Sequence deleted successfully" });
  } catch (error) {
    if (error instanceof Error)
      res
        .status(500)
        .json({ error: "Error deleting sequence", details: error.message });
  }
}
