"use server";

import DOMPurify from "isomorphic-dompurify";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const MAX_CONTENT_LENGTH = 100;
const MAX_URLS = 2;
const FORBIDDEN_WORDS = ["spam", "scam", "hack"];
const ALLOWED_IMAGE_DOMAINS = [
  "images.unsplash.com",
  "cloudinary.com",
  "res.cloudinary.com",
];

// Zodスキーマの定義
const PostSchema = z.object({
  content: z
    .string()
    .min(1, "投稿内容は必須です")
    .max(
      MAX_CONTENT_LENGTH,
      `投稿は${MAX_CONTENT_LENGTH}文字以内にしてください`
    )
    .refine(
      (content) =>
        !FORBIDDEN_WORDS.some((word) => content.toLowerCase().includes(word)),
      "不適切な内容が含まれています"
    )
    .refine(
      (content) =>
        (content.match(/https?:\/\/[^\s]+/g) || []).length <= MAX_URLS,
      `URLは${MAX_URLS}個までしか含められません`
    )
    .refine((content) => {
      const imageUrls =
        content.match(/https?:\/\/[^\s]+\.(jpg|jpeg|png|gif)/gi) || [];
      return imageUrls.every((url) =>
        ALLOWED_IMAGE_DOMAINS.some((domain) => url.includes(domain))
      );
    }, "許可されていない画像ドメインが含まれています"),
});

export type CreatePostInput = z.infer<typeof PostSchema>;

export async function createPost(formData: FormData) {
  try {
    const { userId } = auth();
    if (!userId) {
      throw new Error("認証が必要です");
    }

    const rawContent = formData.get("content") as string;

    // Zodによるバリデーション
    const validatedData = PostSchema.parse({ content: rawContent });

    // コンテンツのサニタイズ
    const sanitizedContent = DOMPurify.sanitize(validatedData.content);

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      throw new Error("ユーザーが見つかりません");
    }

    const post = await prisma.post.create({
      data: {
        content: sanitizedContent,
        userId: user.id,
      },
      include: {
        user: true,
      },
    });

    revalidatePath("/");
    return { success: true, data: post };
  } catch (error) {
    // Zodのバリデーションエラーをハンドリング
    if (error instanceof z.ZodError) {
      const errorMessage = error.errors.map((e) => e.message).join(", ");
      throw new Error(errorMessage);
    }

    console.error("投稿作成エラー:", error);
    throw new Error(
      error instanceof Error
        ? error.message
        : "投稿の作成中にエラーが発生しました"
    );
  }
}
