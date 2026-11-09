import type { ImageMeta } from "@/lib/image-validation";

/**
 * Type, size and displayed dimensions of a picked file, so it can be
 * checked before uploading. createImageBitmap applies EXIF orientation,
 * like the server does.
 */
export async function readImageMeta(file: File): Promise<ImageMeta> {
  const base = { contentType: file.type, size: file.size };

  if (typeof createImageBitmap === "function") {
    const bitmap = await createImageBitmap(file);
    const meta = { ...base, width: bitmap.width, height: bitmap.height };
    bitmap.close();
    return meta;
  }

  const url = URL.createObjectURL(file);
  try {
    const image = new Image();
    image.src = url;
    await image.decode();
    return { ...base, width: image.naturalWidth, height: image.naturalHeight };
  } finally {
    URL.revokeObjectURL(url);
  }
}
