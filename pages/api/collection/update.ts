import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'PUT') return res.status(405).json({ message: 'Method not allowed' });
  
    const { id } = req.query;
    const { isDeleted, visibility, popularity } = req.body;
  
    try {
      const updatedCollection = await prisma.collection.update({
        where: { id: parseInt(id as string, 10) },
        data: { isDeleted, visibility, popularity },
      });
      res.status(200).json(updatedCollection);
    } catch (error) {
      if (error instanceof Error)
        res.status(500).json({ error: 'Error updating collection', details: error.message });
    }
  }