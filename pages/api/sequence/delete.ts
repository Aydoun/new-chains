import { withSession } from "@/lib/api/handler";
import { idQuery } from "@/lib/validation";
import { softDeleteSequence } from "@/lib/server/sequences";

export default withSession(
  { method: "DELETE", query: idQuery },
  async ({ res, userId, query }) => {
    await softDeleteSequence(query.id, userId);
    res.status(200).json({ message: "Sequence deleted successfully" });
  },
);
