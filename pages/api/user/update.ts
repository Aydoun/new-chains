import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { requireApiSession } from "@/lib/api/auth";
import { BIO_MAX_LENGTH } from "@/constants";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "PUT")
    return res.status(405).json({ message: "Method not allowed" });

  const sessionResult = await requireApiSession(req, res);
  if (!sessionResult) return;

  const { id } = req.query;
  const { username, email, avatarUrl, role, bio } = req.body;
  const userId = parseInt(id as string, 10);

  if (Number.isNaN(userId)) {
    return res.status(400).json({ message: "Invalid user id" });
  }

  if (userId !== sessionResult.userId) {
    return res.status(403).json({ message: "Forbidden" });
  }

  if (bio !== undefined) {
    if (typeof bio !== "string")
      return res.status(400).json({ message: "Invalid bio" });

    if (bio.length > BIO_MAX_LENGTH) {
      return res.status(400).json({
        message: `Bio must be ${BIO_MAX_LENGTH} characters or fewer`,
      });
    }
  }

  const updateData: Record<string, unknown> = {};

  if (username !== undefined) updateData.username = username;
  if (email !== undefined) updateData.email = email;
  if (avatarUrl !== undefined) updateData.avatarUrl = avatarUrl;
  if (role !== undefined) updateData.role = role;
  if (bio !== undefined) updateData.bio = bio;

  if (Object.keys(updateData).length === 0) {
    return res.status(400).json({ message: "No fields to update" });
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
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
