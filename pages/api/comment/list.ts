import { withSession } from "@/lib/api/handler";
import { listCommentsQuery } from "@/lib/validation";
import { listComments } from "@/lib/server/comments";

export default withSession(
  { method: "GET", query: listCommentsQuery },
  async ({ res, userId, query }) => {
    res.status(200).json(await listComments(userId, query));
  },
);
