
'use client';

import type { CommunityInvolvement } from '@/lib/entities';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { format } from 'date-fns';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

type CommunityTimelineProps = {
  items: CommunityInvolvement[];
};

function formatDateRange(startDate: string, endDate: string | null, isCurrent: boolean) {
    const start = format(new Date(`${startDate}-02`), 'MMM yyyy');
    if (isCurrent) {
        return `${start} - Present`;
    }
    if (endDate) {
        const end = format(new Date(`${endDate}-02`), 'MMM yyyy');
        return `${start} - ${end}`;
    }
    return start;
}

export function CommunityTimeline({ items }: CommunityTimelineProps) {
  return (
    <div className="relative">
      <div className="space-y-8">
        {items.map((item) => (
          <div key={item.id} className="relative flex items-start">
            <Card className="w-full">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                    <CardTitle>{item.communityName}</CardTitle>
                    <Badge variant="outline">{formatDateRange(item.startDate, item.endDate, item.isCurrent)}</Badge>
                </div>
                <CardDescription className="flex items-center gap-2">
                  <span>{item.role}</span>
                  {item.url && (
                    <>
                      <span>|</span>
                      <Link
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline flex items-center gap-1 text-sm"
                      >
                        Website <ArrowUpRight className="h-3 w-3" />
                      </Link>
                    </>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{item.description}</p>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}
