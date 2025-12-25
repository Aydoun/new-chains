import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { requireApiSession } from "@/lib/api/auth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET")
    return res.status(405).json({ message: "Method not allowed" });

  const _sessionResult = await requireApiSession(req, res);
  if (!_sessionResult) return;

  const { userId } = _sessionResult;

  try {
    const sequences = await prisma.sequence.findMany({
      where: { userId, isDeleted: false, visibility: "PUBLIC" },
    });
    if (!Array.isArray(sequences))
      return res.status(404).json({ message: "Sequences not found" });

    res.status(200).json(sequences);
  } catch (error) {
    if (error instanceof Error)
      res
        .status(500)
        .json({ error: "Error fetching sequence", details: error.message });
  }
}
