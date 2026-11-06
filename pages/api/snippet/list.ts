import { withSession } from "@/lib/api/handler";
import { listSnippets } from "@/lib/server/snippets";

export default withSession({ method: "GET" }, async ({ res, userId }) => {
  res.status(200).json(await listSnippets(userId));
});
