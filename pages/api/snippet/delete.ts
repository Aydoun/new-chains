import { withSession } from "@/lib/api/handler";
import { idQuery } from "@/lib/validation";
import { deleteSnippet } from "@/lib/server/snippets";

export default withSession(
  { method: "DELETE", query: idQuery },
  async ({ res, userId, query }) => {
    await deleteSnippet(userId, query.id);
    res.status(200).json({ message: "Snippet deleted successfully" });
  },
);
