import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { requireApiSession } from "@/lib/api/auth";
import { BIO_MAX_LENGTH } from "@/lib/constants";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "PUT")
    return res.status(405).json({ message: "Method not allowed" });

  const sessionResult = await requireApiSession(req, res);
  if (!sessionResult) return;

  const { id } = req.query;
  const { bio } = req.body;
  const userId = parseInt(id as string, 10);

  if (userId !== sessionResult.userId) {
    return res.status(403).json({ message: "Forbidden" });
  }

  if (bio) {
    if (bio.length > BIO_MAX_LENGTH) {
      return res.status(400).json({
        message: `Bio must be ${BIO_MAX_LENGTH} characters or fewer`,
      });
    }
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { bio },
    });
    res.status(200).json(updatedUser);
  } catch (error) {
    if (error instanceof Error) {
      res
        .status(500)
        .json({ error: "Error updating user", details: error.message });
    }
  }
}
