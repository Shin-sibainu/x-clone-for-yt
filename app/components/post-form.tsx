"use client";

import { useState, useTransition } from "react";
import { useUser } from "@clerk/nextjs";
import { createPost } from "@/app/actions/post.action";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ImagePlus, Loader2 } from "lucide-react";

export function PostForm() {
  const { user } = useUser();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string>("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const formData = new FormData();
    formData.append("content", content);
    if (imageUrl) formData.append("image", imageUrl);

    startTransition(async () => {
      try {
        await createPost(formData);
        setContent("");
        setImageUrl("");
      } catch (error) {
        setError(error instanceof Error ? error.message : "投稿に失敗しました");
      }
    });
  };

  if (!user) return null;

  return (
    <form onSubmit={handleSubmit} className="border-b border-gray-200 p-4">
      <div className="flex gap-4">
        <img
          src={user.imageUrl}
          alt={user.username || ""}
          className="h-12 w-12 rounded-full"
        />
        <div className="flex-1">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="いまどうしてる？"
            className="min-h-[100px] resize-none border-none focus-visible:ring-0"
          />
          {imageUrl && (
            <div className="relative mt-2">
              <img
                src={imageUrl}
                alt="投稿画像"
                className="max-h-[300px] rounded-2xl object-cover"
              />
              <button
                type="button"
                onClick={() => setImageUrl("")}
                className="absolute right-2 top-2 rounded-full bg-black/50 p-1 text-white"
              >
                ✕
              </button>
            </div>
          )}
          {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
          <div className="mt-4 flex items-center justify-between">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="text-blue-500"
              onClick={() => {
                // TODO: 画像アップロード機能を実装
                const url = prompt("画像URLを入力してください");
                if (url) setImageUrl(url);
              }}
            >
              <ImagePlus className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500">
                {content.length}/280
              </span>
              <Button
                type="submit"
                disabled={isPending || !content.trim() || content.length > 280}
                className="rounded-full px-4 py-2"
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
    </form>
  );
}
