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

  try {
    const snippets = await prisma.snippet.findMany({
      where: { createdById: sessionResult.userId },
      include: {
        frame: true,
        originSequence: {
          select: { id: true, title: true },
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    res.status(200).json(snippets);
  } catch (error) {
    if (error instanceof Error)
      res
        .status(500)
        .json({ error: "Error fetching snippets", details: error.message });
  }
}
