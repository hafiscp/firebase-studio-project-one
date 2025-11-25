
'use client';
import { Button } from '@/components/ui/button';
import { Github, Linkedin, Twitter, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useDoc, useFirebase, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import type { Profile } from '@/lib/entities';
import LiquidEther from '@/components/liquid-background';
import '@/components/liquid-background.css';


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

  // TODO: Fetch navigation links from Firestore
  const navigationLinks = [
      { "label": "About", "href": "/about" },
      { "label": "Contributions", "href": "/contributions" },
      { "label": "Community", "href": "/community" }
  ]

  const socialLinks = [
    { key: 'githubUrl', Icon: Github, name: 'GitHub' },
    { key: 'linkedinUrl', Icon: Linkedin, name: 'LinkedIn' },
    { key: 'twitterUrl', Icon: Twitter, name: 'Twitter' },
  ] as const;

  if (isLoading) {
    return (
       <main className="flex h-screen flex-col items-center justify-center bg-background text-center p-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </main>
    )
  }

  return (
    <main className="h-screen w-screen flex flex-col items-center justify-center text-center p-4 relative">
       <div className="absolute inset-0 z-0">
         <LiquidEther
            colors={[ '#5227FF', '#FF9FFC', '#B19EEF' ]}
            mouseForce={20}
            cursorSize={100}
            isViscous={false}
            viscous={30}
            iterationsViscous={32}
            iterationsPoisson={32}
            resolution={0.5}
            isBounce={false}
            autoDemo={true}
            autoSpeed={0.5}
            autoIntensity={2.2}
            takeoverDuration={0.25}
            autoResumeDelay={3000}
            autoRampDuration={0.6}
          />
      </div>
      <div className="max-w-3xl relative z-10">
        <h1 className="font-headline text-5xl md:text-7xl font-bold text-foreground">
          {profile?.fullName || 'Hafis CP'}
        </h1>
        <p className="mt-4 text-lg md:text-xl text-muted-foreground">
          {profile?.title || 'Your Title'}
        </p>

        <nav className="mt-8 flex flex-wrap justify-center gap-4">
          {navigationLinks.map((link) => (
            <Button key={link.label} asChild variant="secondary" className="transition-transform hover:scale-105">
              <Link href={link.href}>{link.label}</Link>
            </Button>
          ))}
           <Button asChild variant="secondary" className="transition-transform hover:scale-105">
            <Link href="/contact">Contact</Link>
          </Button>
        </nav>

        <div className="mt-8 flex justify-center gap-6">
          {socialLinks.map(({ key, Icon, name }) => {
            const url = profile?.[key];
            if (!url) return null;
            return (
              <Link
                key={name}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={name}
                className="text-muted-foreground transition-colors hover:text-primary"
              >
                <Icon className="h-6 w-6" />
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}
