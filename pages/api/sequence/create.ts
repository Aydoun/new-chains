import { withSession } from "@/lib/api/handler";
import { createSequenceBody } from "@/lib/validation";
import { createSequenceWithFrames } from "@/lib/server/sequences";

export default withSession(
  { method: "POST", body: createSequenceBody },
  async ({ res, userId, body }) => {
    const sequence = await createSequenceWithFrames(userId, body);
    res.status(201).json(sequence);
  },
);
