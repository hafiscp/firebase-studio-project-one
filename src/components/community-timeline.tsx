
'use client';

import type { CommunityInvolvement } from '@/lib/entities';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Users } from 'lucide-react';
import { format } from 'date-fns';

type CommunityTimelineProps = {
  items: CommunityInvolvement[];
};

export function CommunityTimeline({ items }: CommunityTimelineProps) {
  return (
    <div className="relative pl-8">
      {/* The vertical line */}
      <div className="absolute left-3 top-0 h-full w-0.5 bg-border translate-x-px"></div>
      
      <div className="space-y-8">
        {items.map((item) => (
          <div key={item.id} className="relative flex items-start">
            {/* Dot on the timeline */}
            <div className="absolute left-0 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-primary">
              <Users className="h-4 w-4 text-primary-foreground" />
            </div>

            <Card className="ml-12 w-full">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                    <CardTitle>{item.communityName}</CardTitle>
                    <Badge variant="outline">{format(new Date(`${item.date}-02`), 'MMMM yyyy')}</Badge>
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
