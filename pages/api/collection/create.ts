import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

  const {
    title,
    description = null,
    tags = [],
    userId,
    mediaOrder = [],
    engine = 'CHESS',
    visibility = 'PUBLIC',
  } = req.body;

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new Error('User not found');
  }

  try {
    const newCollection = await prisma.collection.create({
        data: {
          title,
          description,
          tags,
          userId,
          mediaOrder,
          engine,
          visibility,
        },
      });
    
    res.status(201).json(newCollection);
  } catch (error) {
    if (error instanceof Error)
      res.status(500).json({ error: 'Error creating a collection', details: error.message });
  }
}