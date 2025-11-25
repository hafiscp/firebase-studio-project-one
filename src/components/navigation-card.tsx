import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import data from '@/lib/cms-data.json';
import { BookUser, Lightbulb, Users, type LucideIcon } from 'lucide-react';

type NavigationCardProps = React.HTMLAttributes<HTMLDivElement>;

const iconMap: { [key: string]: LucideIcon } = {
  BookUser,
  Lightbulb,
  Users,
};

export function NavigationCard({ className }: NavigationCardProps) {
  const { navigationLinks } = data;

  return (
    <Card className={cn("bg-card rounded-2xl border border-transparent transition-all duration-300 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10", className)}>
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Explore</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {navigationLinks.map((link) => {
          const Icon = iconMap[link.icon];
          return (
            <Button
              key={link.label}
              asChild
              variant="ghost"
              className="justify-start text-lg h-14"
            >
              <Link href={link.href}>
                {Icon && <Icon className="mr-4 h-6 w-6 text-primary" />}
                {link.label}
              </Link>
            </Button>
          );
        })}
      </CardContent>
    </Card>
  );
}
