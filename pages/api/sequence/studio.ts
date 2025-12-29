import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { requireApiSession } from "@/lib/api/auth";

const DEFAULT_PAGE_SIZE = 12;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET")
    return res.status(405).json({ message: "Method not allowed" });

  const sessionResult = await requireApiSession(req, res);
  if (!sessionResult) return;

  const { userId: clientId } = sessionResult;
  const parseNumberParam = (value: string | string[] | undefined, fallback: number) => {
    const candidate = Array.isArray(value) ? value[0] : value;
    const parsed = Number(candidate ?? fallback);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
  };
  const parsedPage = parseNumberParam(req.query.page, 1);
  const parsedLimit = parseNumberParam(req.query.limit, DEFAULT_PAGE_SIZE);
  const page = Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1;
  const limit =
    Number.isFinite(parsedLimit) && parsedLimit > 0
      ? parsedLimit
      : DEFAULT_PAGE_SIZE;
  const skip = (page - 1) * limit;

  try {
    const where = {
      userId: clientId,
      isDeleted: false,
      visibility: "PUBLIC",
    };
    const [totalCount, sequences] = await Promise.all([
      prisma.sequence.count({ where }),
      prisma.sequence.findMany({
        where,
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              username: true,
              avatarUrl: true,
            },
          },
        },
      }),
    ]);

    const firstFrameIds = sequences
      .map((sequence) => sequence.FrameOrder?.[0])
      .filter(Boolean);

    const frames = firstFrameIds.length
      ? await prisma.frame.findMany({ where: { id: { in: firstFrameIds } } })
      : [];

    const framesById = new Map(frames.map((frame) => [frame.id, frame]));

    const sequencesWithFirstFrame = sequences.map((sequence) => ({
      ...sequence,
      firstFrame:
        typeof sequence.FrameOrder?.[0] === "number"
          ? framesById.get(sequence.FrameOrder[0]) ?? null
          : null,
    }));

    const totalPages = limit > 0 ? Math.ceil(totalCount / limit) : 0;
    const hasMore = page < totalPages;

    res.status(200).json({
      items: sequencesWithFirstFrame,
      page,
      totalPages,
      hasMore,
    });
  } catch (error) {
    if (error instanceof Error)
      res
        .status(500)
        .json({ error: "Error fetching sequence", details: error.message });
  }
}
