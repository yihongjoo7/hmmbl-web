'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const FNB_ITEMS = [
  { href: '/home', icon: '🏠', label: '홈' },
];

export function FNB() {
  const pathname = usePathname();

  function isActive(href: string) {
    return pathname === href;
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-bg-primary border-t border-border-default flex items-center justify-around px-1 py-2">
      {FNB_ITEMS.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`flex flex-col items-center gap-0.5 flex-1 py-1 rounded-lg transition-colors ${
            isActive(item.href) ? 'text-primary' : 'text-text-disabled hover:text-text-secondary'
          }`}
        >
          <span className="text-xl leading-none">{item.icon}</span>
          <span className="text-[10px] font-medium">{item.label}</span>
        </Link>
      ))}
    </nav>
  );
}
