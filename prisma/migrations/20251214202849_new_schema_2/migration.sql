/*
  Warnings:

  - You are about to drop the column `url` on the `Frame` table. All the data in the column will be lost.
  - Added the required column `content` to the `Frame` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Frame_type_createdAt_idx";

-- AlterTable
ALTER TABLE "Frame" DROP COLUMN "url",
ADD COLUMN     "content" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "Frame_createdAt_idx" ON "Frame"("createdAt");
