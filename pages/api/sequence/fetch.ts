import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { requireApiSession } from "@/lib/api/auth";
import { resolveTimeFilterDate } from "@/lib/time-filter";
import { DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE } from "@/lib/constants";
import { parseStatusFilters } from "@/lib/sequence-status";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET")
    return res.status(405).json({ message: "Method not allowed" });

  const sessionResult = await requireApiSession(req, res);
  if (!sessionResult) return;

  const { userId: clientId } = sessionResult;
  const pageQuery = req.query.page;
  const limitQuery = req.query.limit;

  const page =
    typeof pageQuery === "string" && !Number.isNaN(Number.parseInt(pageQuery))
      ? Math.max(1, Number.parseInt(pageQuery, 10))
      : 1;
  const requestedLimit =
    typeof limitQuery === "string" && !Number.isNaN(Number.parseInt(limitQuery))
      ? Number.parseInt(limitQuery, 10)
      : DEFAULT_PAGE_SIZE;
  const limit = Math.min(Math.max(requestedLimit, 1), MAX_PAGE_SIZE);
  const createdAfter = resolveTimeFilterDate(req.query.timeFilter);
  const searchTerm =
    typeof req.query.search === "string" ? req.query.search.trim() : "";
  const statusFilters = parseStatusFilters(req.query.statuses);

  try {
    const sequences = await prisma.sequence.findMany({
      where: {
        ...(clientId ? { userId: { not: clientId } } : {}),
        isDeleted: false,
        visibility: "PUBLIC",
        ...(statusFilters.length ? { status: { in: statusFilters } } : {}),
        ...(createdAfter ? { createdAt: { gte: createdAfter } } : {}),
        ...(searchTerm
          ? {
              OR: [
                {
                  title: {
                    contains: searchTerm,
                    mode: "insensitive",
                  },
                },
                {
                  description: {
                    contains: searchTerm,
                    mode: "insensitive",
                  },
                },
              ],
            }
          : {}),
      },
      skip: (page - 1) * limit,
      take: limit + 1,
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      include: {
        user: { select: { id: true, username: true } },
      },
    });

    const hasMore = sequences.length > limit;
    const pageSequences = hasMore ? sequences.slice(0, limit) : sequences;

    const firstFrameIds = pageSequences
      .map((sequence) => sequence.FrameOrder?.[0])
      .filter(Boolean);

    const frames =
      firstFrameIds.length > 0
        ? await prisma.frame.findMany({ where: { id: { in: firstFrameIds } } })
        : [];

    const framesById = new Map(frames.map((f) => [f.id, f]));

    const items = pageSequences.map((sequence) => ({
      ...sequence,
      firstFrame: !!sequence.FrameOrder?.[0]
        ? framesById.get(sequence.FrameOrder[0]) ?? null
        : null,
    }));

    return res.status(200).json({
      items,
      page,
      pageSize: limit,
      hasMore,
      nextPage: hasMore ? page + 1 : null,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error fetching sequence" });
  }
}
