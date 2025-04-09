/*
  Warnings:

  - A unique constraint covering the columns `[userId,replyId]` on the table `likes` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "likes" ADD COLUMN     "replyId" TEXT,
ALTER COLUMN "postId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "replies" ADD COLUMN     "parentReplyId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "likes_userId_replyId_key" ON "likes"("userId", "replyId");

-- AddForeignKey
ALTER TABLE "likes" ADD CONSTRAINT "likes_replyId_fkey" FOREIGN KEY ("replyId") REFERENCES "replies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "replies" ADD CONSTRAINT "replies_parentReplyId_fkey" FOREIGN KEY ("parentReplyId") REFERENCES "replies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
