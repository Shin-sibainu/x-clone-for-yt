import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import Post from "@/components/post";
import Reply from "@/components/reply";
import ReplyForm from "@/components/reply-form";
import MainLayout from "@/components/layouts/main-layout";

export const metadata: Metadata = {
  title: "投稿 / X",
  description: "投稿の詳細",
};

async function getPost(id: string) {
  try {
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        user: true,
        likes: true,
        replies: {
          where: {
            parentReplyId: null,
          },
          include: {
            user: true,
            likes: true,
            replies: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!post) {
      return null;
    }

    return post;
  } catch (error) {
    console.error("投稿の取得に失敗しました:", error);
    throw new Error("投稿の取得に失敗しました");
  }
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<JSX.Element> {
  const { userId } = await auth();
  const { id } = await params;
  const post = await getPost(id);

  if (!post) {
    notFound();
  }

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
          <div className="flex items-center gap-6">
            <Link href="/" className="hover:bg-gray-50 p-2 rounded-full">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-xl font-bold">投稿</h1>
          </div>
        </div>
        <div className="border-b border-gray-200">
          <Post
            id={post.id}
            author={{
              id: post.user.id,
              name: post.user.name,
              username: post.user.username,
              imageUrl: post.user.image || "",
              avatar: post.user.image || "",
            }}
            content={post.content}
            createdAt={post.createdAt.toLocaleDateString("ja-JP", {
              month: "long",
              day: "numeric",
            })}
            stats={{
              replies: post.replies.length,
              likes: post.likes.length,
              reposts: 0,
            }}
            isLiked={
              dbUserId
                ? post.likes.some((like) => like.userId === dbUserId)
                : false
            }
            disableLink
          />
        </div>
        <div className="p-4 border-b border-gray-200">
          <ReplyForm postId={post.id} />
        </div>
        <div className="divide-y divide-gray-200 overflow-y-auto">
          {post.replies.map((reply) => (
            <Reply
              key={reply.id}
              id={reply.id}
              content={reply.content}
              createdAt={reply.createdAt}
              author={{
                id: reply.user.id,
                name: reply.user.name,
                username: reply.user.username,
                imageUrl: reply.user.image || "",
              }}
              likes={reply.likes}
              currentUserId={dbUserId}
              postId={post.id}
              replies={reply.replies.length}
            />
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
