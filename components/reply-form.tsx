"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Image,
  MapPin,
  Smile,
  Calendar,
  Scroll as Poll,
  Loader2,
} from "lucide-react";
import { createReply } from "@/app/actions/reply.action";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth, useUser } from "@clerk/nextjs";

interface ReplyFormProps {
  postId: string;
  parentReplyId?: string;
}

export default function ReplyForm({ postId, parentReplyId }: ReplyFormProps) {
  const router = useRouter();
  const { userId } = useAuth();
  const { user } = useUser();
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!content?.trim() || isSubmitting) {
      return;
    }

    try {
      setIsSubmitting(true);
      await createReply(postId, content, parentReplyId);
      setContent("");
      router.refresh();
    } catch (error) {
      console.error("返信の投稿に失敗しました:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!userId || !user) {
    return (
      <div className="p-4 text-center text-gray-500">
        返信するにはログインが必要です
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex gap-4 p-4 border-b border-gray-200"
    >
      <Avatar className="w-12 h-12">
        <AvatarImage src={user.imageUrl} />
        <AvatarFallback>{user.firstName?.[0]}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="返信をポスト"
          className="min-h-[80px] border-none bg-transparent text-xl resize-none placeholder:text-gray-500 pb-0 focus-visible:ring-0"
        />
        <div className="flex items-center justify-between mt-2">
          <div className="flex gap-2 text-[#1D9BF0]">
            <button
              type="button"
              className="hover:bg-blue-50 p-1.5 rounded-full"
            >
              <Image className="w-5 h-5" />
            </button>
            <button
              type="button"
              className="hover:bg-blue-50 p-1.5 rounded-full"
            >
              <MapPin className="w-5 h-5" />
            </button>
            <button
              type="button"
              className="hover:bg-blue-50 p-1.5 rounded-full"
            >
              <Smile className="w-5 h-5" />
            </button>
            <button
              type="button"
              className="hover:bg-blue-50 p-1.5 rounded-full"
            >
              <Calendar className="w-5 h-5" />
            </button>
            <button
              type="button"
              className="hover:bg-blue-50 p-1.5 rounded-full"
            >
              <Poll className="w-5 h-5" />
            </button>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">{content.length}/280</span>
            <Button
              type="submit"
              className="bg-black hover:bg-gray-900 text-white rounded-full px-6"
              disabled={isSubmitting || !content.trim() || content.length > 280}
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "返信"
              )}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
