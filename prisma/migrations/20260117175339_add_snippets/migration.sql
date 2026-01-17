-- CreateTable
CREATE TABLE "Snippet" (
    "id" SERIAL NOT NULL,
    "type" "FrameType" NOT NULL DEFAULT 'PHRASE',
    "notes" TEXT,
    "frameId" INTEGER NOT NULL,
    "originSequenceId" INTEGER NOT NULL,
    "createdById" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "sequenceId" INTEGER,

    CONSTRAINT "Snippet_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Snippet_createdById_idx" ON "Snippet"("createdById");

-- CreateIndex
CREATE INDEX "Snippet_originSequenceId_idx" ON "Snippet"("originSequenceId");

-- AddForeignKey
ALTER TABLE "Snippet" ADD CONSTRAINT "Snippet_frameId_fkey" FOREIGN KEY ("frameId") REFERENCES "Frame"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Snippet" ADD CONSTRAINT "Snippet_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
