"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const ReplySchema = z.object({
  content: z
    .string()
    .min(1, "返信内容は必須です")
    .max(100, "返信は100文字以内にしてください"),
  postId: z.string().min(1, "投稿IDは必須です"),
  parentReplyId: z.string().min(1, "親返信IDは必須です").optional(),
});

export type CreateReplyInput = z.infer<typeof ReplySchema>;

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
    // Zodによるバリデーションのみ実行
    ReplySchema.parse({
      content,
      postId,
      parentReplyId,
    });

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
    if (error instanceof z.ZodError) {
      const errorMessage = error.errors.map((e) => e.message).join(", ");
      throw new Error(errorMessage);
    }

    console.error("返信の作成に失敗しました:", error);
    throw new Error("返信の作成に失敗しました");
  }
}
