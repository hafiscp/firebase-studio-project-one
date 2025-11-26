
'use client';

import type { Metadata } from 'next';
import { cn } from '@/lib/utils';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { ModeToggle } from '@/components/mode-toggle';
import { Toaster } from '@/components/ui/toaster';
import { FirebaseClientProvider } from '@/firebase';
import { FirebaseErrorListener } from '@/components/FirebaseErrorListener';
import { BackButton } from '@/components/back-button';
import { usePathname } from 'next/navigation';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { useState, useEffect } from 'react';


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isHomePage = pathname === '/';
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Space+Grotesk:wght@500;700&display=swap"
          rel="stylesheet"
        />
        <title>Hafis CP | PM</title>
        <meta name="description" content="Hafis CP's personal portfolio website." />
      </head>
      <body className={cn('font-body antialiased')}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <FirebaseClientProvider>
            <div className="relative min-h-screen">
              {mounted && !isHomePage && (
                <header className="fixed top-0 left-0 right-0 z-50 h-16 flex items-center justify-between px-4 bg-background/80 backdrop-blur-sm">
                    <div className="flex items-center gap-4">
                        <BackButton />
                        <Breadcrumbs />
                    </div>
                    <ModeToggle />
                </header>
              )}
               {mounted && isHomePage && (
                 <div className="absolute top-4 right-4 z-50">
                    <ModeToggle />
                 </div>
               )}
              <div className={cn(mounted && !isHomePage ? "pt-16" : "")}>
                {children}
              </div>
            </div>
            <Toaster />
            <FirebaseErrorListener />
          </FirebaseClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
