"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function createPost(formData: FormData) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("認証が必要です");
  }

  const content = formData.get("content") as string;
  const image = formData.get("image") as string;

  if (!content) {
    throw new Error("投稿内容を入力してください");
  }

  if (content.length > 280) {
    throw new Error("投稿は280文字以内で入力してください");
  }

  try {
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      throw new Error("ユーザーが見つかりません");
    }

    const post = await prisma.post.create({
      data: {
        content,
        image: image || null,
        userId: user.id,
      },
      include: {
        user: true,
      },
    });

    revalidatePath("/");
    return { success: true, data: post };
  } catch (error) {
    console.error("投稿エラー:", error);
    throw new Error("投稿に失敗しました");
  }
}
