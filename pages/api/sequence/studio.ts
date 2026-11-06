import { withSession } from "@/lib/api/handler";
import { listSequencesQuery } from "@/lib/validation";
import { listUserSequences } from "@/lib/server/sequences";

/** One user's sequences (`?userId=`, default: the signed-in user). */
export default withSession(
  { method: "GET", query: listSequencesQuery },
  async ({ res, userId, query }) => {
    res.status(200).json(await listUserSequences(userId, query));
  },
);
