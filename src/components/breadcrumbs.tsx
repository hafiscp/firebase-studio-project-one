
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Fragment } from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Breadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);

  // Don't show breadcrumbs on admin pages
  if (pathname.startsWith('/admin')) {
    return null;
  }

  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex items-center space-x-1.5 text-sm text-muted-foreground">
        <li>
          <Link href="/" className="hover:text-primary transition-colors">
            <Home className="h-4 w-4" />
            <span className="sr-only">Home</span>
          </Link>
        </li>
        {segments.map((segment, index) => {
          const href = `/${segments.slice(0, index + 1).join('/')}`;
          const isLast = index === segments.length - 1;

          return (
            <Fragment key={href}>
              <li>
                <ChevronRight className="h-4 w-4" />
              </li>
              <li>
                <Link
                  href={href}
                  aria-current={isLast ? 'page' : undefined}
                  className={cn(
                    'hover:text-primary transition-colors',
                    isLast && 'font-medium text-foreground'
                  )}
                >
                  {capitalize(segment)}
                </Link>
              </li>
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
}
