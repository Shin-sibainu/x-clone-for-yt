"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { ja } from "date-fns/locale";
import { MessageCircle, Repeat2, Heart, Share } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { likeReply } from "@/app/actions/like.action";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatDate, formatUsername } from "@/lib/utils";

interface ReplyProps {
  id: string;
  content: string;
  createdAt: Date;
  author: {
    id: string;
    name: string;
    username: string;
    imageUrl: string;
  };
  likes: {
    userId: string;
  }[];
  currentUserId?: string; // Prismaのユーザーid
  postId: string;
  replies?: number;
  disableLink?: boolean;
}

export default function Reply({
  id,
  content,
  createdAt,
  author,
  likes,
  currentUserId,
  postId,
  replies = 0,
  disableLink = false,
}: ReplyProps) {
  const { userId } = useAuth();
  const router = useRouter();
  const [optimisticLikes, setOptimisticLikes] = useState(likes);
  const [isLiked, setIsLiked] = useState(
    optimisticLikes.some((like) => like.userId === currentUserId)
  );

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!userId || !currentUserId) return;

    // 楽観的更新
    setIsLiked(!isLiked);
    if (isLiked) {
      setOptimisticLikes(
        optimisticLikes.filter((like) => like.userId !== currentUserId)
      );
    } else {
      setOptimisticLikes([...optimisticLikes, { userId: currentUserId }]);
    }

    try {
      await likeReply(id);
    } catch (error) {
      // エラーが発生した場合は元に戻す
      setIsLiked(isLiked);
      if (isLiked) {
        setOptimisticLikes([...optimisticLikes, { userId: currentUserId }]);
      } else {
        setOptimisticLikes(
          optimisticLikes.filter((like) => like.userId !== currentUserId)
        );
      }
      console.error("いいねの更新に失敗しました:", error);
    }
  };

  const handleReplyClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/reply/${id}`);
  };

  const ReplyContent = (
    <article className="p-3 sm:p-4 hover:bg-gray-50">
      <div className="flex items-start gap-2 sm:gap-4">
        <button onClick={handleReplyClick} className="hover:opacity-80">
          <Avatar className="w-10 h-10 sm:w-12 sm:h-12">
            <AvatarImage src={author.imageUrl} />
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
            <time className="text-gray-500">
              {formatDate(new Date(createdAt))}
            </time>
          </div>
          <p className="whitespace-pre-line mt-1 break-words">{content}</p>
          <div className="flex justify-between mt-3 max-w-md text-gray-500 text-sm sm:text-base">
            <button
              onClick={handleReplyClick}
              className="flex items-center gap-1 group"
            >
              <div className="p-2 rounded-full group-hover:bg-[#1d9bf0]/10">
                <MessageCircle className="w-5 h-5 group-hover:text-[#1d9bf0]" />
              </div>
              <span className="group-hover:text-[#1d9bf0]">{replies}</span>
            </button>
            <button className="flex items-center gap-1 group">
              <div className="p-2 rounded-full group-hover:bg-[#00ba7c]/10">
                <Repeat2 className="w-5 h-5 group-hover:text-[#00ba7c]" />
              </div>
              <span className="group-hover:text-[#00ba7c]">0</span>
            </button>
            <button
              onClick={handleLike}
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
                {optimisticLikes.length}
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
    return ReplyContent;
  }

  return (
    <Link href={`/reply/${id}`} className="block">
      {ReplyContent}
    </Link>
  );
}
