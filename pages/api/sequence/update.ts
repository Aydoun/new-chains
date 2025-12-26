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
  // description, visibility
  const { isDeleted, title } = req.body;

  try {
    const updatedSequence = await prisma.sequence.update({
      where: { id: parseInt(id as string, 10) },
      data: { isDeleted, ...(title ? { title } : {}) },
    });
    res.status(200).json(updatedSequence);
  } catch (error) {
    if (error instanceof Error)
      res
        .status(500)
        .json({ error: "Error updating sequence", details: error.message });
  }
}
