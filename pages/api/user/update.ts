import { ApiError, withSession } from "@/lib/api/handler";
import { idQuery, updateUserBody } from "@/lib/validation";
import { updateBio } from "@/lib/server/users";

export default withSession(
  { method: "PUT", query: idQuery, body: updateUserBody },
  async ({ res, userId, query, body }) => {
    if (query.id !== userId) throw new ApiError(403, "Forbidden");
    res.status(200).json(await updateBio(userId, body.bio));
  },
);
