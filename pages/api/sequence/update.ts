import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { requireApiSession } from "@/lib/api/auth";
import { normalizeSequenceStatus } from "@/lib/sequence-status";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "PUT")
    return res.status(405).json({ message: "Method not allowed" });

  const sessionResult = await requireApiSession(req, res);
  if (!sessionResult) return;

  const { id } = req.query;
  // description, visibility
  const { isDeleted, title, status } = req.body;
  const sequenceId = parseInt(id as string, 10);

  try {
    if (Number.isNaN(sequenceId)) {
      return res.status(400).json({ message: "Sequence id is required" });
    }

    const sequence = await prisma.sequence.findUnique({
      where: { id: sequenceId },
    });

    if (!sequence || sequence.isDeleted) {
      return res.status(404).json({ message: "Sequence not found" });
    }

    if (sequence.userId !== sessionResult.userId) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const updatePayload: Record<string, unknown> = {};

    if (typeof isDeleted === "boolean") {
      updatePayload.isDeleted = isDeleted;
    }

    if (title) {
      updatePayload.title = title;
    }

    if (status) {
      updatePayload.status = normalizeSequenceStatus(status);
    }

    if (Object.keys(updatePayload).length === 0) {
      return res.status(400).json({ message: "No updates provided" });
    }

    const updatedSequence = await prisma.sequence.update({
      where: { id: sequenceId },
      data: updatePayload,
    });
    res.status(200).json(updatedSequence);
  } catch (error) {
    if (error instanceof Error)
      res
        .status(500)
        .json({ error: "Error updating sequence", details: error.message });
  }
}
