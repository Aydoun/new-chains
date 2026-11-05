import prisma from "@/lib/prisma";
import { notFound } from "@/lib/api/handler";

/** Fields anyone signed in may see about a user. */
const publicUserSelect = {
  id: true,
  username: true,
  avatarUrl: true,
  bio: true,
  createdAt: true,
} as const;

/** Extra fields only the user themself may see. */
const selfUserSelect = { ...publicUserSelect, email: true } as const;

export async function getUserProfile(id: number, viewerId: number) {
  const user = await prisma.user.findUnique({
    where: { id },
    select: id === viewerId ? selfUserSelect : publicUserSelect,
  });
  if (!user) throw notFound("User");
  return user;
}

export function updateBio(userId: number, bio: string) {
  // A missing user raises Prisma's P2025, which withSession maps to 404.
  return prisma.user.update({
    where: { id: userId },
    data: { bio },
    select: selfUserSelect,
  });
}
