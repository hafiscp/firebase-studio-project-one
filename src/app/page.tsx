
import { Button } from '@/components/ui/button';
import { Github, Linkedin, Twitter } from 'lucide-react';
import Link from 'next/link';
import data from '@/lib/cms-data.json';

export default function Home() {
  const { profile, contact } = data;
  return (
    <main className="flex h-screen flex-col items-center justify-center bg-background text-center p-4">
      <div className="max-w-3xl">
        <h1 className="font-headline text-5xl md:text-7xl font-bold text-foreground">
          {profile.name}
        </h1>
        <p className="mt-4 text-lg md:text-xl text-muted-foreground">
          {profile.title}
        </p>

        <nav className="mt-8 flex flex-wrap justify-center gap-4">
          {data.navigationLinks.map((link) => (
            <Button key={link.label} asChild variant="outline">
              <Link href={link.href}>{link.label}</Link>
            </Button>
          ))}
           <Button asChild variant="outline">
            <Link href="/contact">Contact</Link>
          </Button>
        </nav>

        <div className="mt-8 flex justify-center gap-6">
          {contact.socials.map((social) => (
            <Link
              key={social.name}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.name}
              className="text-muted-foreground transition-colors hover:text-primary"
            >
              {social.icon === 'Github' && <Github className="h-6 w-6" />}
              {social.icon === 'Linkedin' && <Linkedin className="h-6 w-6" />}
              {social.icon === 'Twitter' && <Twitter className="h-6 w-6" />}
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
