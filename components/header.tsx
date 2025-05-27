import { MessageCircle } from 'lucide-react';

export function Header() {
  return (
    <header className="sticky top-0 z-10 bg-[#07C160] text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between max-w-md">
        <div className="flex items-center space-x-2">
          <MessageCircle size={24} />
          <h1 className="text-xl font-bold">吵架包赢</h1>
        </div>
        <span className="text-sm">Win Every Argument</span>
      </div>
    </header>
  );
}