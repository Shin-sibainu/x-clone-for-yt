import { notFound } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import MainLayout from "@/components/layouts/main-layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfileHeader from "@/components/profile-header";
import PostList from "@/components/post-list";
import { toggleFollow } from "@/app/actions/follow.action";
import { Post } from "@prisma/client";

type PostWithRelations = Post & {
  user: {
    name: string;
    username: string;
    image: string | null;
  };
  likes: {
    userId: string;
  }[];
  replies: any[];
};

interface ProfileUser {
  id: string;
  name: string;
  username: string;
  image: string | null;
  avatar: string | null;
  bio: string | null;
  stats: {
    followers: number;
    following: number;
    posts: number;
  };
  posts: PostWithRelations[];
  isCurrentUser: boolean;
  joinedAt: string;
  location: string;
  website: string;
  following: boolean;
  headerImage: string;
}

async function getUser(username: string) {
  const user = await prisma.user.findUnique({
    where: { username },
    include: {
      _count: {
        select: {
          followers: true,
          following: true,
          posts: true,
        },
      },
      posts: {
        include: {
          user: {
            select: {
              name: true,
              username: true,
              image: true,
            },
          },
          likes: {
            select: {
              userId: true,
            },
          },
          replies: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!user) {
    return null;
  }

  return {
    id: user.id,
    name: user.name,
    username: user.username,
    image: user.image,
    bio: user.bio,
    stats: {
      followers: user._count.followers,
      following: user._count.following,
      posts: user._count.posts,
    },
    posts: user.posts,
    isCurrentUser: false,
    joinedAt: user.createdAt.toLocaleDateString(),
    location: "",
    website: "",
    avatar: user.image,
    following: false,
    headerImage: "",
  };
}

async function isFollowing(currentUserId: string, targetUserId: string) {
  const follow = await prisma.follow.findUnique({
    where: {
      followerId_followingId: {
        followerId: currentUserId,
        followingId: targetUserId,
      },
    },
  });
  return !!follow;
}

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}): Promise<JSX.Element> {
  const { userId: clerkId } = await auth();
  const { username } = await params;
  const user = await getUser(username);

  if (!user) {
    notFound();
  }

  let currentUserId: string | undefined;
  if (clerkId) {
    const currentUser = await prisma.user.findUnique({
      where: { clerkId },
    });
    currentUserId = currentUser?.id;
  }

  const isCurrentUser = currentUserId === user?.id;
  const following = currentUserId
    ? await isFollowing(currentUserId, user.id)
    : false;

  const userData = {
    id: user.id,
    name: user.name,
    username: user.username,
    image: user.image,
    avatar: user.image,
    bio: user.bio,
    stats: {
      followers: user.stats.followers,
      following: user.stats.following,
      posts: user.stats.posts,
    },
    posts: user.posts,
    isCurrentUser,
    joinedAt: user.joinedAt,
    location: "",
    website: "",
    headerImage: "",
  };

  return (
    <MainLayout>
      <div className="flex flex-col min-h-screen">
        <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm">
          <div className="flex items-center gap-8 px-4 py-2">
            <Link href="/" className="hover:bg-gray-100 p-2 rounded-full">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="font-bold text-xl">{userData.name}</h1>
              <p className="text-sm text-gray-500">
                {userData.stats.posts} 件のポスト
              </p>
            </div>
          </div>
        </div>

        <ProfileHeader
          user={userData}
          isCurrentUser={isCurrentUser}
          isFollowing={following}
          onToggleFollow={async () => {
            "use server";
            await toggleFollow(user.id);
          }}
        />

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
            <PostList initialPosts={user.posts} currentUserId={currentUserId} />
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
