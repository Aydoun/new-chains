import { withSession } from "@/lib/api/handler";
import { createCommentBody } from "@/lib/validation";
import { createComment } from "@/lib/server/comments";

export default withSession(
  { method: "POST", body: createCommentBody },
  async ({ res, userId, body }) => {
    const comment = await createComment(userId, body.sequenceId, body.content);
    res.status(201).json(comment);
  },
);
