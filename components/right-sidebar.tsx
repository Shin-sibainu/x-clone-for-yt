'use client';

import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function RightSidebar() {
  return (
    <aside className="w-[350px] sticky top-0 h-screen overflow-y-auto px-4 py-2">
      <div className="sticky top-0 bg-white pb-2">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
          <Input
            placeholder="検索"
            className="pl-12 bg-gray-100 border-none rounded-full"
          />
        </div>
      </div>

      <div className="bg-gray-50 rounded-xl p-4 mt-4">
        <h2 className="text-xl font-bold mb-4">プレミアムにアップグレード</h2>
        <p className="mb-4">サブスクライブして新機能を利用しましょう！</p>
        <Button className="rounded-full font-bold bg-black hover:bg-gray-900">
          アップグレード
        </Button>
      </div>

      <div className="bg-gray-50 rounded-xl p-4 mt-4">
        <h2 className="text-xl font-bold mb-4">トレンド</h2>
        <div className="space-y-6">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="space-y-1">
              <p className="text-sm text-gray-500">トレンド{i}</p>
              <p className="font-bold">#{`トレンドトピック${i}`}</p>
              <p className="text-sm text-gray-500">{`${i}00K posts`}</p>
            </div>
          ))}
        </div>
        <Button variant="link" className="text-[#1D9BF0] mt-4 p-0 h-auto hover:text-[#1A8CD8]">
          さらに表示
        </Button>
      </div>

      <div className="bg-gray-50 rounded-xl p-4 mt-4">
        <h2 className="text-xl font-bold mb-4">おすすめユーザー</h2>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-gray-200" />
                <div>
                  <p className="font-bold">ユーザー{i}</p>
                  <p className="text-sm text-gray-500">@user{i}</p>
                </div>
              </div>
              <Button variant="outline" className="rounded-full hover:bg-gray-100">
                フォロー
              </Button>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}