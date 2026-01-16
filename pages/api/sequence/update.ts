import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { requireApiSession } from "@/lib/api/auth";

type NotificationPayload = {
  changeType?: "steps" | "note" | "milestone";
  noteSummary?: string;
  milestoneLabel?: string;
};

const buildNotificationMessage = (
  type: NotificationPayload["changeType"],
  sequenceTitle: string,
  payload: NotificationPayload
) => {
  if (type === "steps") {
    return `Steps updated in "${sequenceTitle}".`;
  }

  if (type === "note") {
    return `New note added to "${sequenceTitle}"${payload.noteSummary ? `: ${payload.noteSummary}` : "."}`;
  }

  if (type === "milestone") {
    return `Milestone reached in "${sequenceTitle}"${payload.milestoneLabel ? `: ${payload.milestoneLabel}` : "."}`;
  }

  return null;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "PUT")
    return res.status(405).json({ message: "Method not allowed" });

  const sessionResult = await requireApiSession(req, res);
  if (!sessionResult) return;

  const { id } = req.query;
  const { isDeleted, title, description, changeType, noteSummary, milestoneLabel } =
    req.body as NotificationPayload & {
      isDeleted?: boolean;
      title?: string;
      description?: string;
    };

  const sequenceId = parseInt(id as string, 10);

  if (Number.isNaN(sequenceId)) {
    return res.status(400).json({ message: "Sequence id is required" });
  }

  try {
    const existingSequence = await prisma.sequence.findUnique({
      where: { id: sequenceId },
    });

    if (!existingSequence || existingSequence.isDeleted) {
      return res.status(404).json({ message: "Sequence not found" });
    }

    if (existingSequence.userId !== sessionResult.userId) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const updatedSequence = await prisma.sequence.update({
      where: { id: sequenceId },
      data: {
        ...(typeof isDeleted === "boolean" ? { isDeleted } : {}),
        ...(title ? { title } : {}),
        ...(description !== undefined ? { description } : {}),
      },
    });

    if (changeType) {
      const notificationMessage = buildNotificationMessage(
        changeType,
        updatedSequence.title,
        { changeType, noteSummary, milestoneLabel }
      );

      if (notificationMessage) {
        const followers = await prisma.sequenceFollower.findMany({
          where: {
            sequenceId,
            muted: false,
            userId: { not: sessionResult.userId },
          },
        });

        if (followers.length > 0) {
          const notificationType =
            changeType === "steps"
              ? "STEPS_UPDATED"
              : changeType === "note"
                ? "NOTE_ADDED"
                : "MILESTONE_MARKED";

          await prisma.sequenceNotification.createMany({
            data: followers.map((follower) => ({
              sequenceId,
              recipientId: follower.userId,
              type: notificationType,
              message: notificationMessage,
            })),
          });
        }
      }
    }

    res.status(200).json(updatedSequence);
  } catch (error) {
    if (error instanceof Error)
      res
        .status(500)
        .json({ error: "Error updating sequence", details: error.message });
  }
}
