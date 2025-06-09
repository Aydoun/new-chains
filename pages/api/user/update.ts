import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'PUT') return res.status(405).json({ message: 'Method not allowed' });
  
    const { id } = req.query;
    const { username, email, avatarUrl, role } = req.body;
  
    try {
      const updatedUser = await prisma.user.update({
        where: { id: parseInt(id as string, 10) },
        data: { username, email, avatarUrl, role },
      });
      res.status(200).json(updatedUser);
    } catch (error) {
      if (error instanceof Error)
        res.status(500).json({ error: 'Error updating user', details: error.message });
    }
  }