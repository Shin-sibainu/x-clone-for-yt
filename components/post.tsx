"use client";

import Link from "next/link";
import { MessageCircle, Repeat2, Heart, Share } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toggleLike } from "@/app/actions/like.action";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { formatDate, formatUsername } from "@/lib/utils";

export interface PostStats {
  replies: number;
  reposts: number;
  likes: number;
}

export interface PostAuthor {
  id: string;
  name: string;
  username: string;
  imageUrl: string;
  avatar: string;
}

export interface PostProps {
  id: string;
  author: PostAuthor;
  content: string;
  createdAt: string;
  stats: PostStats;
  isLiked?: boolean;
  disableLink?: boolean;
}

export default function Post({
  id,
  author,
  content,
  createdAt,
  stats: initialStats,
  isLiked: initialIsLiked = false,
  disableLink = false,
}: PostProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [stats, setStats] = useState(initialStats);

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // 楽観的な更新
    setIsLiked(!isLiked);
    setStats((prev) => ({
      ...prev,
      likes: isLiked ? prev.likes - 1 : prev.likes + 1,
    }));

    startTransition(async () => {
      try {
        await toggleLike(id);
      } catch (error) {
        // エラーが発生した場合は状態を元に戻す
        setIsLiked(isLiked);
        setStats((prev) => ({
          ...prev,
          likes: isLiked ? prev.likes + 1 : prev.likes - 1,
        }));
        console.error("いいね処理に失敗しました:", error);
      }
    });
  };

  const handleUserClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/profile/${author.username}`);
  };

  const PostContent = (
    <article className="p-3 sm:p-4 hover:bg-gray-50">
      <div className="flex items-start gap-2 sm:gap-4">
        <button onClick={handleUserClick} className="hover:opacity-80">
          <Avatar className="w-10 h-10 sm:w-12 sm:h-12">
            <AvatarImage src={author.avatar} />
            <AvatarFallback>{author.name[0]}</AvatarFallback>
          </Avatar>
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1 sm:gap-2 text-sm sm:text-base">
            <span className="font-bold hover:underline">{author.name}</span>
            <span className="text-gray-500">
              {formatUsername(author.username)}
            </span>
            <span className="text-gray-500">·</span>
            <time className="text-gray-500">{createdAt}</time>
          </div>
          <p className="whitespace-pre-line mt-1 break-words">{content}</p>
          <div className="flex justify-between mt-3 max-w-md text-gray-500 text-sm sm:text-base">
            <button className="flex items-center gap-1 group">
              <div className="p-2 rounded-full group-hover:bg-[#1d9bf0]/10">
                <MessageCircle className="w-5 h-5 group-hover:text-[#1d9bf0]" />
              </div>
              <span className="group-hover:text-[#1d9bf0]">
                {stats.replies}
              </span>
            </button>
            <button className="flex items-center gap-1 group">
              <div className="p-2 rounded-full group-hover:bg-[#00ba7c]/10">
                <Repeat2 className="w-5 h-5 group-hover:text-[#00ba7c]" />
              </div>
              <span className="group-hover:text-[#00ba7c]">
                {stats.reposts}
              </span>
            </button>
            <button
              onClick={handleLike}
              disabled={isPending}
              className="flex items-center gap-1 group"
            >
              <div className="p-2 rounded-full group-hover:bg-[#f91880]/10">
                <Heart
                  className={`w-5 h-5 ${
                    isLiked
                      ? "text-[#f91880] fill-[#f91880]"
                      : "group-hover:text-[#f91880]"
                  }`}
                />
              </div>
              <span
                className={`${
                  isLiked ? "text-[#f91880]" : "group-hover:text-[#f91880]"
                }`}
              >
                {stats.likes}
              </span>
            </button>
            <button className="flex items-center gap-1 group">
              <div className="p-2 rounded-full group-hover:bg-[#1d9bf0]/10">
                <Share className="w-5 h-5 group-hover:text-[#1d9bf0]" />
              </div>
            </button>
          </div>
        </div>
      </div>
    </article>
  );

  if (disableLink) {
    return PostContent;
  }

  return (
    <Link href={`/post/${id}`} className="block">
      {PostContent}
    </Link>
  );
}
