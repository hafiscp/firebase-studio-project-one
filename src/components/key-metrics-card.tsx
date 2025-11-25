import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import data from '@/lib/cms-data.json';

type KeyMetricsCardProps = React.HTMLAttributes<HTMLDivElement>;

export function KeyMetricsCard({ className }: KeyMetricsCardProps) {
  const { keyMetrics } = data;

  return (
    <Card className={cn("bg-card rounded-2xl border border-transparent transition-all duration-300 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10", className)}>
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Key Metrics</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {keyMetrics.map((metric) => (
          <div key={metric.label} className="text-center">
            <p className="font-headline text-5xl font-bold text-primary">{metric.value}</p>
            <p className="text-sm text-muted-foreground">{metric.label}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
