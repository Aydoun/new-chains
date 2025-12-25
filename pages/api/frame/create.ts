import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { requireApiSession } from "@/lib/api/auth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST")
    return res.status(405).json({ message: "Method not allowed" });

  const _sessionResult = await requireApiSession(req, res);
  if (!_sessionResult) return;

  const { content, description = "" } = req.body;

  if (!content) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const newFrame = await prisma.frame.create({
      data: {
        description,
        content,
      },
    });

    res.status(201).json(newFrame);
  } catch (error) {
    if (error instanceof Error)
      res
        .status(500)
        .json({ error: "Error creating frame", details: error.message });
  }
}
