'use client';

import Link from 'next/link';
import { Separator } from './ui/separator';

export function Footer() {
  const links = [
    { name: 'Google Firebase Studio', href: 'https://firebase.google.com/studio' },
    { name: 'GitHub', href: 'https://github.com' },
    { name: 'Vercel', href: 'https://vercel.com' },
  ];

  return (
    <footer className="w-full max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 pt-4">
      <Separator className="my-6" />
      <div className="text-center text-sm text-muted-foreground">
        <p>
          Made with 💙 using{' '}
          <Link
            href="https://firebase.google.com/studio"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            Google Firebase Studio
          </Link>
          ,{' '}
          <Link
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            GitHub
          </Link>
          ,{' '}
          <Link
            href="https://vercel.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            Vercel
          </Link>
          , etc by Hafis CP.
        </p>
      </div>
    </footer>
  );
}
