"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { updateProfile } from "@/app/actions/profile.action";
import { Loader2 } from "lucide-react";

interface ProfileEditDialogProps {
  currentBio: string;
  trigger: React.ReactNode;
}

export default function ProfileEditDialog({
  currentBio,
  trigger,
}: ProfileEditDialogProps) {
  const router = useRouter();
  const [bio, setBio] = useState(currentBio);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await updateProfile(bio);
      setIsOpen(false);
      router.refresh();
    } catch (error) {
      console.error("プロフィールの更新に失敗しました:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>プロフィールを編集</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="自己紹介を入力"
            className="min-h-[100px]"
          />
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isSubmitting}
            >
              キャンセル
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "保存"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
