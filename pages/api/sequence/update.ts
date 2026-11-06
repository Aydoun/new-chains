import { withSession } from "@/lib/api/handler";
import { idQuery, updateSequenceBody } from "@/lib/validation";
import { updateSequence } from "@/lib/server/sequences";

export default withSession(
  { method: "PUT", query: idQuery, body: updateSequenceBody },
  async ({ res, userId, query, body }) => {
    const sequence = await updateSequence(query.id, userId, body);
    res.status(200).json(sequence);
  },
);
