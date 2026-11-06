import { withSession } from "@/lib/api/handler";
import { listSequencesQuery } from "@/lib/validation";
import { listFeed } from "@/lib/server/sequences";

/** Home feed: public sequences from other users. */
export default withSession(
  { method: "GET", query: listSequencesQuery },
  async ({ res, userId, query }) => {
    res.status(200).json(await listFeed(userId, query));
  },
);
