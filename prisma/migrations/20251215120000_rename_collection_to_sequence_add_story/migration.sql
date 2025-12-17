-- Rename Collection table to Sequence
ALTER TABLE "Collection" RENAME TO "Sequence";
ALTER TABLE "Sequence" RENAME CONSTRAINT "Collection_pkey" TO "Sequence_pkey";
ALTER TABLE "Sequence" RENAME CONSTRAINT "Collection_userId_fkey" TO "Sequence_userId_fkey";
ALTER INDEX "Collection_title_idx" RENAME TO "Sequence_title_idx";

-- Create Story table
CREATE TABLE "Story" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "visibility" "Visibility" NOT NULL DEFAULT 'PUBLIC',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Story_pkey" PRIMARY KEY ("id")
);

-- Create indexes for Story
CREATE INDEX "Story_title_idx" ON "Story"("title");

-- Add relation fields for Story
ALTER TABLE "Story" ADD CONSTRAINT "Story_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Link Sequences to Stories
ALTER TABLE "Sequence" ADD COLUMN "storyId" INTEGER;
ALTER TABLE "Sequence" ADD CONSTRAINT "Sequence_storyId_fkey" FOREIGN KEY ("storyId") REFERENCES "Story"("id") ON DELETE SET NULL ON UPDATE CASCADE;
CREATE INDEX "Sequence_storyId_idx" ON "Sequence"("storyId");
