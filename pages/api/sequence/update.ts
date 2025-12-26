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
  const { isDeleted, title, description, visibility } = req.body;
  const sequenceId = parseInt(id as string, 10);

  try {
    if (Number.isNaN(sequenceId)) {
      return res.status(400).json({ message: "Sequence id is required" });
    }

    const existingSequence = await prisma.sequence.findUnique({
      where: { id: sequenceId },
      select: { userId: true },
    });

    if (!existingSequence || existingSequence.userId !== sessionResult.userId) {
      return res.status(404).json({ message: "Sequence not found" });
    }

    const allowedVisibility = ["PUBLIC", "PRIVATE", "FRIENDS_ONLY"] as const;
    const shouldUpdateVisibility =
      typeof visibility === "string" &&
      allowedVisibility.includes(visibility.toUpperCase() as any);

    const updatePayload = {
      ...(typeof isDeleted === "boolean" ? { isDeleted } : {}),
      ...(typeof title === "string" ? { title } : {}),
      ...(typeof description === "string" ? { description } : {}),
      ...(shouldUpdateVisibility
        ? { visibility: visibility.toUpperCase() }
        : {}),
    };

    if (Object.keys(updatePayload).length === 0) {
      return res.status(400).json({ message: "No valid fields provided" });
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
