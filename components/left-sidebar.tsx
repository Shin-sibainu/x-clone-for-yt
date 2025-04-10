"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Search,
  Bell,
  Mail,
  Bookmark,
  Users,
  User,
  Settings,
  MoreHorizontal,
  Brain,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserButton, SignInButton, useUser } from "@clerk/nextjs";

const navItems = [
  { icon: Home, label: "ホーム", path: "/" },
  { icon: Search, label: "話題を検索", path: "/search" },
  { icon: Bell, label: "通知", path: "/notifications" },
  { icon: Mail, label: "メッセージ", path: "/messages" },
  { icon: Bookmark, label: "ブックマーク", path: "/bookmarks" },
  { icon: Users, label: "コミュニティ", path: "/communities" },
  { icon: Settings, label: "設定", path: "/settings" },
];

export default function LeftSidebar() {
  const pathname = usePathname();
  const { isSignedIn, user } = useUser();

  const profilePath =
    isSignedIn && user?.id
      ? `/profile/${user.username || user.id}`
      : "/profile";

  return (
    <aside className="w-[275px] sticky top-0 h-screen flex flex-col px-4 py-2">
      <Link href="/" className="p-2 hover:bg-gray-100 rounded-full w-fit">
        <div className="flex items-center gap-2 text-primary">
          <Brain className="w-8 h-8" />
          <span className="text-xl font-bold">AI SNS</span>
        </div>
      </Link>

      <nav className="mt-2 space-y-1">
        {navItems.slice(0, 6).map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path;

          return (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center gap-4 p-3 hover:bg-gray-100 rounded-full transition-colors ${
                isActive ? "font-bold" : ""
              }`}
            >
              <Icon className="w-6 h-6" />
              <span className="text-xl">{item.label}</span>
            </Link>
          );
        })}

        {/* プロフィールリンク */}
        <Link
          href={profilePath}
          className={`flex items-center gap-4 p-3 hover:bg-gray-100 rounded-full transition-colors ${
            pathname === profilePath ? "font-bold" : ""
          }`}
        >
          <User className="w-6 h-6" />
          <span className="text-xl">プロフィール</span>
        </Link>

        {/* 設定リンク */}
        <Link
          href="/settings"
          className={`flex items-center gap-4 p-3 hover:bg-gray-100 rounded-full transition-colors ${
            pathname === "/settings" ? "font-bold" : ""
          }`}
        >
          <Settings className="w-6 h-6" />
          <span className="text-xl">設定</span>
        </Link>

        <button className="flex items-center gap-4 p-3 hover:bg-gray-100 rounded-full w-full">
          <MoreHorizontal className="w-6 h-6" />
          <span className="text-xl">もっと見る</span>
        </button>
      </nav>

      <Button className="bg-primary hover:bg-primary/90 text-white rounded-full py-6 mt-4 text-lg font-bold">
        投稿する
      </Button>

      <div className="mt-auto mb-4 flex flex-col gap-4">
        {isSignedIn ? (
          <>
            <div className="flex items-center gap-2 p-4 hover:bg-gray-100 rounded-full cursor-pointer">
              <UserButton
                appearance={{
                  elements: {
                    userButtonAvatarBox: "w-12 h-12",
                  },
                }}
              />
              <div className="flex flex-col">
                <span className="font-semibold">
                  {user.fullName || "ユーザー"}
                </span>
                <span className="text-gray-500">
                  @{user.username || user.id?.slice(0, 8)}
                </span>
              </div>
            </div>
          </>
        ) : (
          <SignInButton>
            <Button variant="outline" className="w-full rounded-full border-2">
              サインイン
            </Button>
          </SignInButton>
        )}
      </div>
    </aside>
  );
}
