"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import MainLayout from "@/components/layouts/main-layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Post from "@/components/post";
import ProfileHeader from "@/components/profile-header";

const dummyUser = {
  id: "1",
  name: "Shin@プログラミングチュートリアル",
  username: "Shin_Engineer",
  imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=1",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=1",
  bio: "プログラミング講師 | 技術書執筆中 | フルスタックエンジニア | 新しい技術が大好き",
  location: "東京",
  website: "shincode.info",
  joinedAt: "2020年11月",
  stats: {
    following: 28,
    followers: 7037,
    posts: 1811,
  },
  headerImage:
    "https://images.unsplash.com/photo-1484417894907-623942c8ee29?q=80&w=2532&auto=format&fit=crop",
};

const dummyPosts = [
  {
    id: 1,
    content:
      "【新講座開講のお知らせ】\n\n✨ プログラミング入門講座\n📚 基礎から応用まで\n💻 実践的な演習付き\n🎉 受講生特典あり\n\n詳しくはプロフィールのリンクから！",
    createdAt: "4月6日",
    stats: {
      discussions: 42,
      shares: 128,
      favorites: 891,
    },
  },
  {
    id: 2,
    content:
      "新しいWeb開発講座の収録完了！\n\n最新のフレームワークや開発手法について、詳しく解説しています。\n\n公開をお楽しみに！ #プログラミング学習",
    createdAt: "4月5日",
    stats: {
      discussions: 31,
      shares: 95,
      favorites: 723,
    },
  },
];

export default function ProfilePage() {
  return (
    <MainLayout>
      <div className="flex flex-col min-h-screen">
        <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm">
          <div className="flex items-center gap-8 px-4 py-2">
            <Link href="/" className="hover:bg-gray-100 p-2 rounded-full">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="font-bold text-xl">{dummyUser.name}</h1>
              <p className="text-sm text-gray-500">1,811 件のポスト</p>
            </div>
          </div>
        </div>

        <ProfileHeader user={dummyUser} />

        <Tabs defaultValue="posts" className="w-full">
          <TabsList className="w-full justify-start h-auto p-0 bg-transparent border-b border-gray-200">
            {["posts", "discussions", "bookmarks", "media", "favorites"].map(
              (tab) => (
                <TabsTrigger
                  key={tab}
                  value={tab}
                  className="flex-1 py-4 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none"
                >
                  {tab === "posts" && "投稿"}
                  {tab === "discussions" && "トーク"}
                  {tab === "bookmarks" && "ブックマーク"}
                  {tab === "media" && "メディア"}
                  {tab === "favorites" && "お気に入り"}
                </TabsTrigger>
              )
            )}
          </TabsList>
          <TabsContent value="posts">
            {dummyPosts.map((post, index) => (
              <div key={post.id} className="border-b border-gray-200">
                <Post
                  id={String(post.id)}
                  author={dummyUser}
                  content={post.content}
                  createdAt={post.createdAt}
                  stats={post.stats}
                />
              </div>
            ))}
          </TabsContent>
          <TabsContent value="discussions" className="p-4">
            <div className="text-center text-gray-500">
              まだトークがありません
            </div>
          </TabsContent>
          <TabsContent value="bookmarks" className="p-4">
            <div className="text-center text-gray-500">
              まだブックマークがありません
            </div>
          </TabsContent>
          <TabsContent value="media" className="p-4">
            <div className="text-center text-gray-500">
              まだメディアがありません
            </div>
          </TabsContent>
          <TabsContent value="favorites" className="p-4">
            <div className="text-center text-gray-500">
              まだお気に入りがありません
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
