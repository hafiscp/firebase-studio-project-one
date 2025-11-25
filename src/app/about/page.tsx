
'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDoc, useFirebase, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import type { Profile } from '@/lib/entities';
import { Loader2 } from "lucide-react";

// This should be the UID of the admin user who manages the content.
const ADMIN_USER_ID = 'arxO7bMR0vPj8KeHwyHExv2h5vz2';

export default function AboutPage() {
  const { firestore } = useFirebase();

  const profileRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return doc(firestore, 'users', ADMIN_USER_ID, 'profiles', 'main-profile');
  }, [firestore]);

  const { data: profile, isLoading } = useDoc<Profile>(profileRef);

  return (
    <main className="min-h-screen p-4 sm:p-6 lg:p-8 pt-20">
      <div className="mx-auto max-w-screen-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-3xl">About Me</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <div 
                className="prose dark:prose-invert max-w-none text-muted-foreground" 
                dangerouslySetInnerHTML={{ __html: profile?.bio || '' }} 
              />
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
