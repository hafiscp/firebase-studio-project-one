
'use client';
import { Button } from '@/components/ui/button';
import { Github, Linkedin, Twitter } from 'lucide-react';
import Link from 'next/link';
import { useDoc, useFirebase, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import type { Profile } from '@/lib/entities';

// This should be the UID of the admin user who manages the content.
// This allows any visitor to view the admin's portfolio content.
const ADMIN_USER_ID = 'arxO7bMR0vPj8KeHwyHExv2h5vz2';

export default function Home() {
  const { firestore } = useFirebase();

  const profileRef = useMemoFirebase(() => {
    // Always fetch the admin's profile, regardless of who is visiting.
    if (!firestore) return null;
    return doc(firestore, 'users', ADMIN_USER_ID, 'profiles', 'main-profile');
  }, [firestore]);
  
  const { data: profile, isLoading } = useDoc<Profile>(profileRef);

  // TODO: Fetch socials and navigation links from Firestore
  const contact = { socials: [] };
  const navigationLinks = [
      { "label": "About", "href": "/about" },
      { "label": "Contributions", "href": "/contributions" },
      { "label": "Community", "href": "/community" }
  ]

  if (isLoading) {
    return (
       <main className="flex h-screen flex-col items-center justify-center bg-background text-center p-4">
        <p>Loading...</p>
      </main>
    )
  }

  return (
    <main className="flex h-screen flex-col items-center justify-center bg-background text-center p-4">
      <div className="max-w-3xl">
        <h1 className="font-headline text-5xl md:text-7xl font-bold text-foreground">
          {profile?.fullName || 'Your Name'}
        </h1>
        <p className="mt-4 text-lg md:text-xl text-muted-foreground">
          {profile?.title || 'Your Title'}
        </p>

        <nav className="mt-8 flex flex-wrap justify-center gap-4">
          {navigationLinks.map((link) => (
            <Button key={link.label} asChild variant="outline">
              <Link href={link.href}>{link.label}</Link>
            </Button>
          ))}
           <Button asChild variant="outline">
            <Link href="/contact">Contact</Link>
          </Button>
        </nav>

        <div className="mt-8 flex justify-center gap-6">
          {/* This part needs to be updated to fetch from firestore */}
          {/*
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
          */}
        </div>
      </div>
    </main>
  );
}
