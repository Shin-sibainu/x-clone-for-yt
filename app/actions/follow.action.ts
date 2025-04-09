"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function toggleFollow(targetUserId: string) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      throw new Error("認証が必要です");
    }

    // ClerkのユーザーIDをデータベースのユーザーIDに変換
    const currentUser = await prisma.user.findUnique({
      where: { clerkId },
    });

    if (!currentUser) {
      throw new Error("ユーザーが見つかりません");
    }

    // 自分自身をフォローできないようにする
    if (currentUser.id === targetUserId) {
      throw new Error("自分自身をフォローすることはできません");
    }

    // 現在のフォロー状態を確認
    const existingFollow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: currentUser.id,
          followingId: targetUserId,
        },
      },
    });

    if (existingFollow) {
      // フォロー解除
      await prisma.follow.delete({
        where: {
          followerId_followingId: {
            followerId: currentUser.id,
            followingId: targetUserId,
          },
        },
      });
    } else {
      // フォロー
      await prisma.follow.create({
        data: {
          followerId: currentUser.id,
          followingId: targetUserId,
        },
      });
    }

    revalidatePath(`/profile/${targetUserId}`);
    return { success: true };
  } catch (error) {
    console.error("フォロー処理エラー:", error);
    throw new Error("フォロー処理に失敗しました");
  }
}
