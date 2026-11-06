import { withSession } from "@/lib/api/handler";
import { createSnippetBody } from "@/lib/validation";
import { createSnippet } from "@/lib/server/snippets";

export default withSession(
  { method: "POST", body: createSnippetBody },
  async ({ res, userId, body }) => {
    const snippet = await createSnippet(userId, body.frameId, body.originSequenceId);
    res.status(201).json(snippet);
  },
);
