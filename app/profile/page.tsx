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
  bio: "5.1万人プログラミング解説系Youtuber | 3万人受講生のUdemy講師 | Next.js書籍を連載中にて執筆中 | AI低動開発エンジニア | お仕事はDMにて",
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
      "【ShinCode_Camp】運営中です📝\n\n👨‍🏫春からリリースしたUdemy講座見放題\n📘オリジナルWebプログラムコース最放題\n👨‍💻Shinと個別相談可能\n💭無制限Discordコミュニティで情報共有\n🎁1週間の無料トライアル付き",
    createdAt: "4月6日",
    stats: {
      replies: 42,
      reposts: 128,
      likes: 891,
    },
  },
  {
    id: 2,
    content:
      "新しいNext.js講座の収録が終わりました！\n\nApp RouterやServer Componentsなど、最新の機能を詳しく解説しています。\n\n公開をお楽しみに！ #NextJS #プログラミング学習",
    createdAt: "4月5日",
    stats: {
      replies: 31,
      reposts: 95,
      likes: 723,
    },
  },
  {
    id: 3,
    content:
      "プログラミング学習で大切なのは継続すること。\n\n毎日コツコツ積み重ねていけば、必ず成長を実感できます。\n\n今日も頑張りましょう！ 💪 #プログラミング初心者",
    createdAt: "4月4日",
    stats: {
      replies: 25,
      reposts: 82,
      likes: 654,
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
            {["posts", "replies", "highlights", "media", "likes"].map((tab) => (
              <TabsTrigger
                key={tab}
                value={tab}
                className="flex-1 py-4 rounded-none border-b-2 border-transparent data-[state=active]:border-[#1D9BF0] data-[state=active]:shadow-none"
              >
                {tab === "posts" && "ポスト"}
                {tab === "replies" && "返信"}
                {tab === "highlights" && "ハイライト"}
                {tab === "media" && "メディア"}
                {tab === "likes" && "いいね"}
              </TabsTrigger>
            ))}
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
          <TabsContent value="replies" className="p-4">
            <div className="text-center text-gray-500">
              まだ返信がありません
            </div>
          </TabsContent>
          <TabsContent value="highlights" className="p-4">
            <div className="text-center text-gray-500">
              まだハイライトがありません
            </div>
          </TabsContent>
          <TabsContent value="media" className="p-4">
            <div className="text-center text-gray-500">
              まだメディアがありません
            </div>
          </TabsContent>
          <TabsContent value="likes" className="p-4">
            <div className="text-center text-gray-500">
              まだいいねがありません
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
