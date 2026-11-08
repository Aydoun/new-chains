import { withSession } from "@/lib/api/handler";
import {
  createImageAsset,
  ImageRejectedError,
  MAX_UPLOAD_BYTES,
  readBody,
} from "@/lib/server/assets";

// The image arrives as the raw request body (Content-Type: image/*).
export const config = { api: { bodyParser: false } };

export default withSession({ method: "POST" }, async ({ req, res, userId }) => {
  try {
    const body = await readBody(req, MAX_UPLOAD_BYTES);
    const asset = await createImageAsset(userId, body);
    res.status(201).json(asset);
  } catch (error) {
    if (error instanceof ImageRejectedError) {
      // `code` lets the client show a translated message.
      res.status(error.status).json({ message: error.message, code: error.code });
      return;
    }
    throw error;
  }
});
