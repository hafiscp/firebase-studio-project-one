import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import data from '@/lib/cms-data.json';
import { Github, Linkedin, Twitter, Mail, type LucideIcon } from 'lucide-react';

type ContactCardProps = React.HTMLAttributes<HTMLDivElement>;

const iconMap: { [key: string]: LucideIcon } = {
  Github,
  Linkedin,
  Twitter,
};

export function ContactCard({ className }: ContactCardProps) {
  const { contact } = data;

  return (
    <Card className={cn("flex flex-col justify-center text-center p-6 bg-card rounded-2xl border border-transparent transition-all duration-300 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10", className)}>
      <CardHeader className="p-0 pb-6">
        <CardTitle className="font-headline text-2xl">{contact.title}</CardTitle>
        <CardDescription className="pt-2">{contact.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-4 p-0">
        <Button asChild className="w-full max-w-xs">
          <Link href={`mailto:${contact.email}`}>
            <Mail className="mr-2 h-4 w-4" /> {contact.email}
          </Link>
        </Button>
        <div className="flex gap-4 pt-2">
          {contact.socials.map((social) => {
            const Icon = iconMap[social.icon];
            return (
              <Button key={social.name} asChild variant="ghost" size="icon">
                <Link href={social.url} aria-label={social.name} target="_blank" rel="noopener noreferrer">
                  {Icon && <Icon className="h-6 w-6 text-muted-foreground transition-colors hover:text-primary" />}
                </Link>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
