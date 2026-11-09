import { withSession } from "@/lib/api/handler";
import { listAssetsQuery } from "@/lib/validation";
import { listUserAssets } from "@/lib/server/assets";

export default withSession(
  { method: "GET", query: listAssetsQuery },
  async ({ res, userId, query }) => {
    res.status(200).json(await listUserAssets(userId, query));
  },
);
