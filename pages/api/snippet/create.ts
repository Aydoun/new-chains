import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { requireApiSession } from "@/lib/api/auth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST")
    return res.status(405).json({ message: "Method not allowed" });

  const sessionResult = await requireApiSession(req, res);
  if (!sessionResult) return;

  const { frameId, originSequenceId } = req.body;
  const parsedFrameId = Number(frameId);
  const parsedSequenceId = Number(originSequenceId);

  if (Number.isNaN(parsedFrameId) || Number.isNaN(parsedSequenceId)) {
    return res
      .status(400)
      .json({ message: "frameId and originSequenceId are required" });
  }

  try {
    const sequence = await prisma.sequence.findFirst({
      where: {
        id: parsedSequenceId,
        isDeleted: false,
        FrameOrder: { has: parsedFrameId },
      },
      select: {
        id: true,
        title: true,
      },
    });

    if (!sequence) {
      return res.status(404).json({
        message: "Sequence not found for provided frame",
      });
    }

    const frame = await prisma.frame.findFirst({
      where: { id: parsedFrameId },
    });

    console.log({ frame });

    if (!frame) {
      return res.status(404).json({ message: "Frame not found" });
    }

    const createdSnippet = await prisma.snippet.create({
      data: {
        frameId: parsedFrameId,
        originSequenceId: parsedSequenceId,
        createdById: sessionResult.userId,
      },
      include: {
        frame: true,
        // sequence: {
        //   select: {
        //     id: true,
        //     title: true,
        //   },
        // },
      },
    });

    res.status(201).json(createdSnippet);
  } catch (error) {
    if (error instanceof Error)
      res
        .status(500)
        .json({ error: "Error creating snippet", details: error.message });
  }
}
