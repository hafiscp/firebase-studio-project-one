
'use client';

import type { CommunityInvolvement } from '@/lib/entities';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Users } from 'lucide-react';
import { format } from 'date-fns';

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
    <div className="relative pl-8">
      {/* The vertical line */}
      <div className="absolute left-3 top-0 h-full w-0.5 bg-border translate-x-px"></div>
      
      <div className="space-y-8">
        {items.map((item) => (
          <div key={item.id} className="relative flex items-start">
            {/* Dot on the timeline */}
            <div className="absolute left-0 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-primary -translate-x-1/2">
              <Users className="h-4 w-4 text-primary-foreground" />
            </div>

            <Card className="ml-12 w-full">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                    <CardTitle>{item.communityName}</CardTitle>
                    <Badge variant="outline">{formatDateRange(item.startDate, item.endDate, item.isCurrent)}</Badge>
                </div>
                <CardDescription>{item.role}</CardDescription>
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
