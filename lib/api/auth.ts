import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";

export const requireApiSession = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const session = await getServerSession(req, res, authOptions);
  const userId = session?.user?.id ? parseInt(session.user.id, 10) : null;

  if (!session || !userId || Number.isNaN(userId)) {
    res.status(401).json({ message: "Unauthorized" });
    return null;
  }

  return { session, userId };
};
