"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createReply(
  postId: string,
  content: string,
  parentReplyId?: string
) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("認証が必要です");
  }

  try {
    // ユーザーを検索
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      throw new Error("ユーザーが見つかりません");
    }

    // 返信を作成
    const reply = await prisma.reply.create({
      data: {
        content,
        userId: user.id,
        postId,
        parentReplyId,
      },
      include: {
        user: true,
      },
    });

    revalidatePath(`/post/${postId}`);
    return reply;
  } catch (error) {
    console.error("返信の作成に失敗しました:", error);
    throw new Error("返信の作成に失敗しました");
  }
}
