import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET")
    return res.status(405).json({ message: "Method not allowed" });

  const { id } = req.query;
  try {
    const collection = await prisma.collection.findMany({
      where: id ? { userId: parseInt(id as string, 10) } : undefined,
    });

    if (!Array.isArray(collection) || collection.length === 0)
      return res.status(404).json({ message: "Collection not found" });

    res.status(200).json(collection);
  } catch (error) {
    if (error instanceof Error)
      res
        .status(500)
        .json({ error: "Error fetching collection", details: error.message });
  }
}
