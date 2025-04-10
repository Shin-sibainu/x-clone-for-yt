"use client";

import { Post as PostType } from "@prisma/client";
import Post from "@/components/post";

type PostWithRelations = PostType & {
  user: {
    name: string;
    username: string;
    image: string | null;
  };
  likes: {
    userId: string;
  }[];
  replies: any[];
};

interface PostListProps {
  initialPosts: PostWithRelations[];
  currentUserId?: string;
}

export default function PostList({
  initialPosts,
  currentUserId,
}: PostListProps) {
  // ユーザー名を短くする関数
  const formatUsername = (username: string) => {
    // usernameが8文字より長い場合は、最初の8文字を表示
    return username.length > 8 ? username.slice(0, 8) : username;
  };

  return (
    <div className="divide-y divide-gray-200">
      {initialPosts.map((post) => (
        <div key={post.id} className="p-4">
          <Post
            id={post.id}
            author={{
              id: post.user.username,
              name: post.user.name,
              username: post.user.username,
              imageUrl: post.user.image || "",
              avatar: post.user.image || "",
            }}
            content={post.content}
            createdAt={post.createdAt.toLocaleDateString("ja-JP", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
            stats={{
              replies: post.replies.length,
              likes: post.likes.length,
              reposts: 0,
            }}
            isLiked={
              currentUserId
                ? post.likes.some((like) => like.userId === currentUserId)
                : false
            }
          />
        </div>
      ))}
    </div>
  );
}
