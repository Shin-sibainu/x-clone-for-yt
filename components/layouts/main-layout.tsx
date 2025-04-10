import LeftSidebar from "@/components/left-sidebar";
import RightSidebar from "@/components/right-sidebar";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen max-w-7xl mx-auto relative">
      {/* モバイルメニュー */}
      <Sheet>
        <SheetTrigger className="fixed bottom-4 right-4 lg:hidden z-[100] bg-primary text-primary-foreground p-3 rounded-full shadow-lg">
          <Menu className="h-6 w-6" />
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-72">
          <SheetHeader>
            <SheetTitle className="sr-only">メニュー</SheetTitle>
          </SheetHeader>
          <LeftSidebar />
        </SheetContent>
      </Sheet>

      {/* デスクトップ左サイドバー */}
      <div className="hidden lg:block w-72 sticky top-0 h-screen overflow-y-auto">
        <LeftSidebar />
      </div>

      {/* メインコンテンツ */}
      <main className="flex-1 border-x border-gray-200 min-h-screen pb-20 lg:pb-0 overflow-y-auto">
        {children}
      </main>

      {/* 右サイドバー */}
      <div className="hidden xl:block w-72 sticky top-0 h-screen overflow-y-auto">
        <RightSidebar />
      </div>
    </div>
  );
}
