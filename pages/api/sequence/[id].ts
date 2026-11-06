import { withSession } from "@/lib/api/handler";
import { idQuery } from "@/lib/validation";
import { getSequenceForViewer } from "@/lib/server/sequences";

export default withSession(
  { method: "GET", query: idQuery },
  async ({ res, userId, query }) => {
    const sequence = await getSequenceForViewer(query.id, userId);
    res.status(200).json(sequence);
  },
);
