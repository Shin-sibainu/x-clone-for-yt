"use client";

import { useState, useTransition } from "react";
import {
  Image,
  MapPin,
  Smile,
  Calendar,
  Scroll as Poll,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUser } from "@clerk/nextjs";
import { createPost } from "@/app/actions/post.action";
import { Suspense } from "react";
import Posts from "@/app/components/posts";

export default function Feed() {
  const { user } = useUser();
  const [content, setContent] = useState("");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string>("");

  const handleSubmit = async () => {
    if (!content.trim()) return;
    setError("");

    const formData = new FormData();
    formData.append("content", content);

    startTransition(async () => {
      try {
        await createPost(formData);
        setContent("");
      } catch (error) {
        setError(error instanceof Error ? error.message : "投稿に失敗しました");
      }
    });
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="border-b border-gray-200 p-4">
        <h1 className="text-xl font-bold">ホーム</h1>
      </div>

      {user && (
        <div className="border-b border-gray-200 p-4">
          <div className="flex gap-4">
            <Avatar className="w-12 h-12">
              <AvatarImage src={user.imageUrl} alt={user.username || ""} />
              <AvatarFallback>{user.username?.[0] || "U"}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <Textarea
                placeholder="いまどうしてる？"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[80px] border-none bg-transparent text-xl resize-none placeholder:text-gray-500 pb-0 focus-visible:ring-0"
              />
              {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
              <div className="flex items-center justify-between mt-2">
                <div className="flex gap-2 text-[#1D9BF0]">
                  <button className="hover:bg-blue-50 p-1.5 rounded-full">
                    <Image className="w-5 h-5" />
                  </button>
                  <button className="hover:bg-blue-50 p-1.5 rounded-full">
                    <MapPin className="w-5 h-5" />
                  </button>
                  <button className="hover:bg-blue-50 p-1.5 rounded-full">
                    <Smile className="w-5 h-5" />
                  </button>
                  <button className="hover:bg-blue-50 p-1.5 rounded-full">
                    <Calendar className="w-5 h-5" />
                  </button>
                  <button className="hover:bg-blue-50 p-1.5 rounded-full">
                    <Poll className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-500">
                    {content.length}/280
                  </span>
                  <Button
                    onClick={handleSubmit}
                    className="bg-black hover:bg-gray-900 text-white rounded-full px-6"
                    disabled={
                      isPending || !content.trim() || content.length > 280
                    }
                  >
                    {isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "ポストする"
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="overflow-y-auto flex-1">
        <Suspense
          fallback={<div className="p-4 text-center">読み込み中...</div>}
        >
          <Posts />
        </Suspense>
      </div>
    </div>
  );
}
