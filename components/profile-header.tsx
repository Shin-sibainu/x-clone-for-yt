"use client";

import { Calendar, Link as LinkIcon, MapPin } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import ProfileEditDialog from "./profile-edit-dialog";
import { useTransition } from "react";

export interface ProfileUser {
  name: string;
  username: string;
  avatar: string | null;
  bio: string | null;
  location: string | null;
  website: string | null;
  joinedAt: string;
  stats: {
    following: number;
    followers: number;
    posts: number;
  };
  headerImage: string;
}

interface ProfileHeaderProps {
  user: ProfileUser;
  isCurrentUser?: boolean;
  isFollowing?: boolean;
  onToggleFollow?: () => Promise<void>;
}

export default function ProfileHeader({
  user,
  isCurrentUser,
  isFollowing,
  onToggleFollow,
}: ProfileHeaderProps) {
  const [isPending, startTransition] = useTransition();

  return (
    <div>
      <div className="h-48 relative bg-gray-200">
        <Image
          src="https://images.unsplash.com/photo-1484950763426-56b5bf172dbb?w=800&auto=format&fit=crop"
          alt="Header"
          fill
          className="object-cover"
          priority
        />
      </div>
      <div className="px-4">
        <div className="flex justify-between items-start">
          <div className="-mt-16 mb-4">
            <Avatar className="w-32 h-32 border-4 border-white">
              <AvatarImage src={user.avatar || undefined} />
              <AvatarFallback>{user.name[0]}</AvatarFallback>
            </Avatar>
          </div>
          <div className="mt-4 flex gap-2">
            {isCurrentUser ? (
              <ProfileEditDialog
                currentBio={user.bio || ""}
                trigger={
                  <Button variant="outline" className="rounded-full">
                    プロフィールを編集
                  </Button>
                }
              />
            ) : (
              <Button
                variant={isFollowing ? "outline" : "default"}
                className="rounded-full"
                onClick={() => {
                  if (onToggleFollow) {
                    startTransition(() => {
                      onToggleFollow();
                    });
                  }
                }}
                disabled={isPending}
              >
                {isFollowing ? "フォロー解除" : "フォロー"}
              </Button>
            )}
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <h1 className="font-bold text-xl">{user.name}</h1>
            <p className="text-gray-500">@{user.username}</p>
          </div>
          {user.bio && <p className="whitespace-pre-line">{user.bio}</p>}
          <div className="flex flex-wrap gap-4 text-gray-500">
            {user.location && (
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                <span>{user.location}</span>
              </div>
            )}
            {user.website && (
              <div className="flex items-center gap-2">
                <LinkIcon className="w-5 h-5" />
                <a
                  href={`https://${user.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#1D9BF0] hover:underline"
                >
                  {user.website}
                </a>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              <span>{user.joinedAt}に登録</span>
            </div>
          </div>
          <div className="flex gap-4 text-gray-500">
            <div>
              <span className="font-bold text-black">
                {user.stats.following}
              </span>{" "}
              フォロー中
            </div>
            <div>
              <span className="font-bold text-black">
                {user.stats.followers}
              </span>{" "}
              フォロワー
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
