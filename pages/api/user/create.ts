import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

  const { username, email, passwordHash, avatarUrl, role } = req.body;

  try {
    const user = await prisma.user.create({
      data: { username, email, passwordHash, avatarUrl, role },
    });
    res.status(201).json(user);
  } catch (error) {
    if (error instanceof Error)
      res.status(500).json({ error: 'Error creating user', details: error.message });
  }
}