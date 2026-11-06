import prisma from "@/lib/prisma";
import { withSession } from "@/lib/api/handler";
import { contactBody } from "@/lib/validation";

export default withSession(
  { method: "POST", body: contactBody },
  async ({ res, userId, body }) => {
    const contact = await prisma.contact.create({
      data: { userId, message: body.message },
    });
    res.status(201).json(contact);
  },
);
