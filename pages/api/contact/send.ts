import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { requireApiSession } from "@/lib/api/auth";
import { CONTACT_MESSAGE_MAX_LENGTH } from "@/lib/constants";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST")
    return res.status(405).json({ message: "Method not allowed" });

  const sessionResult = await requireApiSession(req, res);
  if (!sessionResult) return;

  const { message } = req.body;
  const trimmedMessage =
    typeof message === "string" ? message.trim() : undefined;

  if (!trimmedMessage) {
    return res.status(400).json({ message: "Message is required" });
  }

  if (trimmedMessage.length > CONTACT_MESSAGE_MAX_LENGTH) {
    return res.status(400).json({
      message: `Message must be ${CONTACT_MESSAGE_MAX_LENGTH} characters or fewer`,
    });
  }

  try {
    const contact = await prisma.contact.create({
      data: {
        userId: sessionResult.userId,
        message: trimmedMessage,
      },
    });

    return res.status(201).json(contact);
  } catch (error) {
    console.error("Error creating contact", error);
    return res.status(500).json({ error: "Error creating contact" });
  }
}
