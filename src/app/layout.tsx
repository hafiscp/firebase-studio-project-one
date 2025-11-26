
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


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isHomePage = pathname === '/';

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
              {!isHomePage && (
                <div className="absolute top-4 left-4 z-50 flex items-center gap-4">
                  <BackButton />
                  <Breadcrumbs />
                </div>
              )}
              <div className="absolute top-4 right-4 z-50">
                <ModeToggle />
              </div>
              {children}
            </div>
            <Toaster />
            <FirebaseErrorListener />
          </FirebaseClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
