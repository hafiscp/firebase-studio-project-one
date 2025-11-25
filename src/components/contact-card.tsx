
'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Github, Linkedin, Twitter, Mail, type LucideIcon, Loader2, Briefcase } from 'lucide-react';
import { useDoc, useFirebase, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import type { Profile } from '@/lib/entities';

// This should be the UID of the admin user who manages the content.
const ADMIN_USER_ID = 'R24RFjVJTyd3R5aHbZOJweN62uw1';

type ContactCardProps = React.HTMLAttributes<HTMLDivElement>;

const socialIcons: { key: keyof Profile, icon: LucideIcon }[] = [
    { key: 'githubUrl', icon: Github },
    { key: 'linkedinUrl', icon: Linkedin },
    { key: 'twitterUrl', icon: Twitter },
];


export function ContactCard({ className }: ContactCardProps) {
    const { firestore } = useFirebase();

    const profileRef = useMemoFirebase(() => {
        if (!firestore) return null;
        return doc(firestore, 'users', ADMIN_USER_ID, 'profiles', 'main-profile');
    }, [firestore]);
    
    const { data: profile, isLoading } = useDoc<Profile>(profileRef);

  return (
    <Card className={cn("flex flex-col justify-center text-center p-6 bg-card rounded-2xl border border-transparent transition-all duration-300 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10", className)}>
      <CardHeader className="p-0 pb-6">
        <CardTitle className="font-headline text-2xl">Let's Connect</CardTitle>
        <CardDescription className="pt-2">Have a project in mind or just want to say hi? Feel free to reach out.</CardDescription>
      </CardHeader>
       {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        ) : profile ? (
      <CardContent className="flex flex-col items-center gap-4 p-0">
        <Button asChild className="w-full max-w-xs">
          <Link href={`mailto:${profile.email}`}>
            <Mail className="mr-2 h-4 w-4" /> {profile.email}
          </Link>
        </Button>
        
        {profile.resumeUrl && (
            <Button asChild variant="secondary" className="w-full max-w-xs">
                <Link href={profile.resumeUrl} target="_blank" rel="noopener noreferrer">
                    <Briefcase className="mr-2 h-4 w-4" /> Hire Me
                </Link>
            </Button>
        )}

        <div className="flex gap-4 pt-2">
          {socialIcons.map(({key, icon: Icon}) => {
            const url = profile[key] as string | undefined;
            if (!url) return null;
            return (
              <Button key={key} asChild variant="ghost" size="icon">
                <Link href={url} aria-label={key.replace('Url', '')} target="_blank" rel="noopener noreferrer">
                  <Icon className="h-6 w-6 text-muted-foreground transition-colors hover:text-primary" />
                </Link>
              </Button>
            );
          })}
        </div>
      </CardContent>
        ) : (
            <CardContent><p className="text-muted-foreground">Contact information not available.</p></CardContent>
        )}
    </Card>
  );
}
