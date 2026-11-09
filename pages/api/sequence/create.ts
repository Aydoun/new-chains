import { ApiError, withSession } from "@/lib/api/handler";
import { createSequenceBody } from "@/lib/validation";
import { createSequenceWithFrames } from "@/lib/server/sequences";
import { findForeignAssetIds } from "@/lib/server/assets";

export default withSession(
  { method: "POST", body: createSequenceBody },
  async ({ res, userId, body }) => {
    // Frames may only show images their author uploaded.
    const assetIds = body.frames.flatMap((frame) =>
      frame.assetId ? [frame.assetId] : [],
    );
    if ((await findForeignAssetIds(userId, assetIds)).length > 0)
      throw new ApiError(400, "Unknown image");

    const sequence = await createSequenceWithFrames(userId, body);
    res.status(201).json(sequence);
  },
);
