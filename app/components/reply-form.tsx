"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import { createReply } from "@/app/actions/reply.action";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface ReplyFormProps {
  postId: string;
}

export default function ReplyForm({ postId }: ReplyFormProps) {
  const router = useRouter();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const content = textareaRef.current?.value;

    if (!content?.trim()) {
      return;
    }

    try {
      await createReply(postId, content);
      textareaRef.current.value = "";
      router.refresh();
    } catch (error) {
      console.error("返信の投稿に失敗しました:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Textarea
        ref={textareaRef}
        placeholder="返信をポスト"
        className="min-h-[100px]"
      />
      <div className="flex justify-end">
        <Button type="submit">
          返信
        </Button>
      </div>
    </form>
  );
} 