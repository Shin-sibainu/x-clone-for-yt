import { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import Reply from "@/components/reply";
import ReplyForm from "@/components/reply-form";
import MainLayout from "@/components/layouts/main-layout";

export const metadata: Metadata = {
  title: "返信 / X",
  description: "返信の詳細",
};

async function getReply(id: string) {
  try {
    const reply = await prisma.reply.findUnique({
      where: { id },
      include: {
        user: true,
        likes: true,
        replies: {
          include: {
            user: true,
            likes: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        post: true, // 親の投稿情報も取得
      },
    });

    if (!reply) {
      return null;
    }

    return reply;
  } catch (error) {
    console.error("返信の取得に失敗しました:", error);
    throw new Error("返信の取得に失敗しました");
  }
}

export default async function ReplyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<JSX.Element> {
  const { userId } = await auth();
  const { id } = await params;
  const reply = await getReply(id);

  if (!reply) {
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
          <h1 className="text-xl font-bold">返信</h1>
        </div>
        <div className="border-b border-gray-200">
          <Reply
            id={reply.id}
            author={{
              id: reply.user.id,
              name: reply.user.name,
              username: reply.user.username,
              imageUrl: reply.user.image || "",
            }}
            content={reply.content}
            createdAt={reply.createdAt}
            likes={reply.likes}
            currentUserId={dbUserId}
            postId={reply.postId}
            replies={reply.replies.length}
          />
        </div>
        <div className="p-4 border-b border-gray-200">
          <ReplyForm postId={reply.postId} parentReplyId={reply.id} />
        </div>
        <div className="divide-y divide-gray-200">
          {reply.replies.map((childReply) => (
            <Reply
              key={childReply.id}
              id={childReply.id}
              author={{
                id: childReply.user.id,
                name: childReply.user.name,
                username: childReply.user.username,
                imageUrl: childReply.user.image || "",
              }}
              content={childReply.content}
              createdAt={childReply.createdAt}
              likes={childReply.likes}
              currentUserId={dbUserId}
              postId={reply.postId}
              replies={0}
            />
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
