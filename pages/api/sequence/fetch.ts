import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { requireApiSession } from "@/lib/api/auth";
import shuffle from "lodash.shuffle";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET")
    return res.status(405).json({ message: "Method not allowed" });

  const sessionResult = await requireApiSession(req, res);
  if (!sessionResult) return;

  const { userId: clientId } = sessionResult;

  try {
    const sequences = await prisma.sequence.findMany({
      where: {
        ...(clientId ? { userId: { not: clientId } } : {}),
        isDeleted: false,
        visibility: "PUBLIC",
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    if (!Array.isArray(sequences) || sequences.length === 0)
      return res.status(404).json({ message: "Sequences not found" });

    const shuffledSequences = shuffle(sequences);

    res.status(200).json(shuffledSequences);
  } catch (error) {
    if (error instanceof Error)
      res
        .status(500)
        .json({ error: "Error fetching sequence", details: error.message });
  }
}
