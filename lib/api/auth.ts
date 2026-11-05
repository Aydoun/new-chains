import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions, isDatabaseUserId } from "@/lib/auth-options";

export const requireApiSession = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const session = await getServerSession(req, res, authOptions);
  const rawId = session?.user?.id;

  if (!session || !isDatabaseUserId(rawId)) {
    res.status(401).json({ message: "Unauthorized" });
    return null;
  }

  return { session, userId: Number(rawId) };
};
