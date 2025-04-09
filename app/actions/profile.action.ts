"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateProfile(bio: string) {
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

    // プロフィールを更新
    await prisma.user.update({
      where: { id: user.id },
      data: { bio },
    });

    revalidatePath(`/profile/${user.username}`);
    return { success: true };
  } catch (error) {
    console.error("プロフィールの更新に失敗しました:", error);
    throw new Error("プロフィールの更新に失敗しました");
  }
}
