-- Frames get an owner. Existing frames are attributed to the owner of the
-- (earliest) sequence that contains them; frames in no sequence stay NULL.
ALTER TABLE "Frame" ADD COLUMN "createdById" INTEGER;

UPDATE "Frame" f
SET "createdById" = s."userId"
FROM (
  SELECT DISTINCT ON (frame_id) frame_id, "userId"
  FROM (
    SELECT unnest("FrameOrder") AS frame_id, "userId", "createdAt", id
    FROM "Sequence"
  ) expanded
  ORDER BY frame_id, "createdAt", id
) s
WHERE f.id = s.frame_id;

CREATE INDEX "Frame_createdById_idx" ON "Frame"("createdById");

ALTER TABLE "Frame" ADD CONSTRAINT "Frame_createdById_fkey"
  FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Unused: moderation counter, roles, stories and leftover enums.
ALTER TABLE "Frame" DROP COLUMN "reportedCount";
ALTER TABLE "User" DROP COLUMN "role";

ALTER TABLE "Story" DROP CONSTRAINT "Story_userId_fkey";
DROP TABLE "Story";

-- Leftover column from the add_snippets migration; never used (always NULL).
ALTER TABLE "Snippet" DROP COLUMN "sequenceId";

DROP TYPE "Engine";
DROP TYPE "ReportReason";
DROP TYPE "ReportStatus";
DROP TYPE "Role";
