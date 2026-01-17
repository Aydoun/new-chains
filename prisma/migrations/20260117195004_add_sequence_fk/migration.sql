-- AddForeignKey
ALTER TABLE "Snippet" ADD CONSTRAINT "Snippet_originSequenceId_fkey" FOREIGN KEY ("originSequenceId") REFERENCES "Sequence"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
