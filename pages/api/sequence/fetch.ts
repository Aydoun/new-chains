import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { requireApiSession } from "@/lib/api/auth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET")
    return res.status(405).json({ message: "Method not allowed" });

  const sessionResult = await requireApiSession(req, res);
  if (!sessionResult) return;

  const { userId: clientId } = sessionResult;
  const { id } = req.query;
  const requestedUserId = id ? parseInt(id as string, 10) : undefined;

  if (id && Number.isNaN(requestedUserId)) {
    return res.status(400).json({ message: "Sequence id is required" });
  }

  try {
    const sequences = await prisma.sequence.findMany({
      where: {
        isDeleted: false,
        ...(requestedUserId
          ? {
              userId: requestedUserId,
              ...(requestedUserId !== clientId
                ? { visibility: "PUBLIC" }
                : {}),
            }
          : {
              visibility: "PUBLIC",
              ...(clientId ? { userId: { not: clientId } } : {}),
            }),
      },
      include: {
        user: {
          select: { id: true, username: true, avatarUrl: true },
        },
      },
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
