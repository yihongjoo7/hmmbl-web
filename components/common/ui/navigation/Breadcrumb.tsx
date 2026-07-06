import { ReactNode } from 'react';
import Link from 'next/link';

interface BreadcrumbItem { label: string; href?: string; }
interface BreadcrumbProps { items: BreadcrumbItem[]; separator?: ReactNode; maxItems?: number; }

export function Breadcrumb({ items, separator = '/', maxItems = 4 }: BreadcrumbProps) {
  const visible = items.length > maxItems
    ? [items[0], { label: '...', href: undefined }, ...items.slice(-2)]
    : items;
  return (
    <nav aria-label="breadcrumb">
      <ol className="flex items-center gap-1 text-sm text-text-secondary">
        {visible.map((item, i) => (
          <li key={i} className="flex items-center gap-1">
            {i > 0 && <span className="text-text-disabled text-xs">{separator}</span>}
            {item.href
              ? <Link href={item.href} className="hover:text-primary transition-colors">{item.label}</Link>
              : <span className={i === visible.length - 1 ? 'text-text-primary font-medium' : ''}>{item.label}</span>
            }
          </li>
        ))}
      </ol>
    </nav>
  );
}
