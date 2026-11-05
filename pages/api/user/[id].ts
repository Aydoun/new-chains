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

  const { id } = req.query;
  const userId = parseInt(id as string, 10);

  if (Number.isNaN(userId))
    return res.status(400).json({ message: "User id is required" });

  // Users may only read their own record.
  if (userId !== sessionResult.userId)
    return res.status(403).json({ message: "Forbidden" });

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user", error);
    res.status(500).json({ error: "Error fetching user" });
  }
}
