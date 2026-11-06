import { withSession } from "@/lib/api/handler";
import { idQuery } from "@/lib/validation";
import { getUserProfile } from "@/lib/server/users";

/** Public profile of any user; the email is included only for yourself. */
export default withSession(
  { method: "GET", query: idQuery },
  async ({ res, userId, query }) => {
    res.status(200).json(await getUserProfile(query.id, userId));
  },
);
