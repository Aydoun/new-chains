/*
  Warnings:

  - You are about to drop the column `visibility` on the `Story` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "User_username_key";

-- AlterTable
ALTER TABLE "Story" DROP COLUMN "visibility";
