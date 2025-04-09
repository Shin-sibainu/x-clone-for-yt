"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function toggleLike(postId: string) {
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

    // 既存のいいねを検索
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId: user.id,
          postId,
        },
      },
    });

    if (existingLike) {
      // いいねが存在する場合は削除
      await prisma.like.delete({
        where: {
          userId_postId: {
            userId: user.id,
            postId,
          },
        },
      });
    } else {
      // いいねが存在しない場合は作成
      await prisma.like.create({
        data: {
          userId: user.id,
          postId,
        },
      });
    }

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("いいね処理エラー:", error);
    throw new Error("いいねの処理に失敗しました");
  }
}

export async function likeReply(replyId: string) {
  const { userId: clerkId } = await auth();

  if (!clerkId) {
    throw new Error("認証が必要です");
  }

  try {
    // ユーザーを検索
    const user = await prisma.user.findUnique({
      where: { clerkId },
    });

    if (!user) {
      throw new Error("ユーザーが見つかりません");
    }

    // 既存のいいねを検索
    const existingLike = await prisma.like.findFirst({
      where: {
        userId: user.id,
        replyId,
      },
    });

    if (existingLike) {
      // いいねを解除
      await prisma.like.delete({
        where: {
          id: existingLike.id,
        },
      });
    } else {
      // いいねを追加
      await prisma.like.create({
        data: {
          userId: user.id,
          replyId,
        },
      });
    }

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("リプライいいね処理エラー:", error);
    throw new Error("いいねの処理に失敗しました");
  }
}
