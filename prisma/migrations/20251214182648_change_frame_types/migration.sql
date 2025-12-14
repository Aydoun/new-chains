/*
  Warnings:

  - The values [TEXT] on the enum `FrameType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `engine` on the `Collection` table. All the data in the column will be lost.
  - You are about to drop the column `popularity` on the `Collection` table. All the data in the column will be lost.
  - You are about to drop the column `views` on the `Collection` table. All the data in the column will be lost.
  - You are about to drop the column `likes` on the `Frame` table. All the data in the column will be lost.
  - You are about to drop the column `views` on the `Frame` table. All the data in the column will be lost.
  - You are about to drop the column `passwordHash` on the `User` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "FrameType_new" AS ENUM ('PHRASE', 'IMAGE', 'VIDEO', 'AUDIO', 'DOCUMENT');
ALTER TABLE "Frame" ALTER COLUMN "type" TYPE "FrameType_new" USING ("type"::text::"FrameType_new");
ALTER TYPE "FrameType" RENAME TO "FrameType_old";
ALTER TYPE "FrameType_new" RENAME TO "FrameType";
DROP TYPE "public"."FrameType_old";
COMMIT;

-- AlterTable
ALTER TABLE "Collection" DROP COLUMN "engine",
DROP COLUMN "popularity",
DROP COLUMN "views";

-- AlterTable
ALTER TABLE "Frame" DROP COLUMN "likes",
DROP COLUMN "views",
ALTER COLUMN "type" SET DEFAULT 'PHRASE';

-- AlterTable
ALTER TABLE "User" DROP COLUMN "passwordHash";
