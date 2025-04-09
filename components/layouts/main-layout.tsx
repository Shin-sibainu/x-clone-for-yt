import LeftSidebar from '@/components/left-sidebar';
import RightSidebar from '@/components/right-sidebar';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen max-w-7xl mx-auto">
      <LeftSidebar />
      <main className="flex-1 border-x border-gray-200">
        {children}
      </main>
      <RightSidebar />
    </div>
  );
}