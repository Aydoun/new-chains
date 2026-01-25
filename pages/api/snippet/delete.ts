import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { requireApiSession } from "@/lib/api/auth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "DELETE")
    return res.status(405).json({ message: "Method not allowed" });

  const sessionResult = await requireApiSession(req, res);
  if (!sessionResult) return;

  const { id } = req.query;
  const snippetId = parseInt(id as string, 10);

  if (Number.isNaN(snippetId))
    return res.status(400).json({ message: "Snippet id is required" });

  try {
    await prisma.snippet.delete({
      where: { id: snippetId },
    });

    res.status(200).json({ message: "Snippet deleted successfully" });
  } catch (error) {
    if (error instanceof Error)
      res
        .status(500)
        .json({ error: "Error deleting snippet", details: error.message });
  }
}
