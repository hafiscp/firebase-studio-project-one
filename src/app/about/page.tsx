
'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDoc, useFirebase, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import type { Profile } from '@/lib/entities';
import { Loader2 } from "lucide-react";
import { useCallback } from "react";
import { Descendant, Text as SlateText } from "slate";

// This should be the UID of the admin user who manages the content.
const ADMIN_USER_ID = 'arxO7bMR0vPj8KeHwyHExv2h5vz2';

const serialize = (nodes: Descendant[]): string => {
  return nodes.map(n => {
    if (SlateText.isText(n)) {
      let text = n.text;
      if ((n as any).bold) {
        text = `<strong>${text}</strong>`;
      }
      if ((n as any).italic) {
        text = `<em>${text}</em>`;
      }
      if ((n as any).underline) {
        text = `<u>${text}</u>`;
      }
      return text;
    }

    if (!n.children) {
      return '';
    }

    const html = serialize(n.children as Descendant[]);

    switch ((n as any).type) {
      case 'paragraph':
        return `<p>${html}</p>`;
      case 'link':
        return `<a href="${(n as any).url}">${html}</a>`;
      default:
        return html;
    }
  }).join('');
};


export default function AboutPage() {
  const { firestore } = useFirebase();

  const profileRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return doc(firestore, 'users', ADMIN_USER_ID, 'profiles', 'main-profile');
  }, [firestore]);

  const { data: profile, isLoading } = useDoc<Profile>(profileRef);

  const renderBio = useCallback(() => {
    if (!profile?.bio) return '';

    try {
      const parsedBio = JSON.parse(profile.bio);
      return serialize(parsedBio);
    } catch (e) {
      // If it's not JSON, treat it as a plain string.
      return `<p>${profile.bio}</p>`;
    }
  }, [profile]);


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
                dangerouslySetInnerHTML={{ __html: renderBio() }} 
              />
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
