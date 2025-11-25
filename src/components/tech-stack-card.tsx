import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import data from '@/lib/cms-data.json';
import { TechIcon } from './tech-icon';

type TechStackCardProps = React.HTMLAttributes<HTMLDivElement>;

export function TechStackCard({ className }: TechStackCardProps) {
  const { techStack } = data;

  return (
    <Card className={cn("bg-card rounded-2xl border border-transparent transition-all duration-300 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10", className)}>
      <CardHeader>
        <CardTitle className="font-headline text-2xl">My Tech Stack</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {techStack.map((tech) => (
          <div key={tech.name} className="flex flex-col items-center justify-center gap-2 p-4 bg-background/50 rounded-lg transition-colors hover:bg-background">
            <TechIcon name={tech.name} className="h-10 w-10" />
            <span className="text-sm font-medium text-muted-foreground">{tech.name}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
