import { withSession } from "@/lib/api/handler";
import { idQuery } from "@/lib/validation";
import { deleteComment } from "@/lib/server/comments";

export default withSession(
  { method: "DELETE", query: idQuery },
  async ({ res, userId, query }) => {
    await deleteComment(userId, query.id);
    res.status(200).json({ message: "Comment deleted" });
  },
);
