import { Metadata } from "next";
import MainLayout from "@/components/layouts/main-layout";
import PostForm from "@/components/post-form";
import PostList from "@/components/post-list";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export const metadata: Metadata = {
  title: "ホーム / X",
  description: "いまどうしてる？",
};

async function getPosts() {
  try {
    const posts = await prisma.post.findMany({
      include: {
        user: true,
        likes: true,
        replies: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 20,
    });

    return posts;
  } catch (error) {
    console.error("投稿の取得に失敗しました:", error);
    throw new Error("投稿の取得に失敗しました");
  }
}

export default async function Home() {
  const { userId } = await auth();
  const posts = await getPosts();

  // ユーザーIDをデータベースのIDに変換
  let dbUserId: string | undefined;
  if (userId) {
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });
    dbUserId = user?.id;
  }

  return (
    <MainLayout>
      <div className="flex flex-col h-screen">
        <div className="border-b border-gray-200 p-4">
          <h1 className="text-xl font-bold">ホーム</h1>
        </div>
        <PostForm />
        <div className="overflow-y-auto flex-1">
          <PostList initialPosts={posts} currentUserId={dbUserId} />
        </div>
      </div>
    </MainLayout>
  );
}
