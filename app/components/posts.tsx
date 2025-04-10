import { prisma } from "@/lib/prisma";
import Post from "@/components/post";
import { auth } from "@clerk/nextjs/server";

async function getPosts() {
  try {
    const { userId } = await auth();
    const user = userId
      ? await prisma.user.findUnique({
          where: { clerkId: userId },
        })
      : null;

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

    return posts.map((post) => ({
      ...post,
      isLiked: user
        ? post.likes.some((like) => like.userId === user.id)
        : false,
    }));
  } catch (error) {
    console.error("投稿の取得に失敗しました:", error);
    throw new Error("投稿の取得に失敗しました");
  }
}

export default async function Posts() {
  const posts = await getPosts();

  return (
    <div className="divide-y divide-gray-200">
      {posts.map((post) => (
        <div key={post.id} className="p-4">
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
              reposts: 0, // TODO: 後で実装
            }}
            isLiked={post.isLiked}
          />
        </div>
      ))}
    </div>
  );
}
