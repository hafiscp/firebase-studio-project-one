
'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDoc, useFirebase, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import type { Profile } from '@/lib/entities';
import { Loader2 } from "lucide-react";
import { useCallback } from "react";
import { escape } from 'html-escaper';
import { Text as SlateText, Descendant, Element as SlateElement } from 'slate';

// This should be the UID of the admin user who manages the content.
const ADMIN_USER_ID = 'arxO7bMR0vPj8KeHwyHExv2h5vz2';

const serialize = (nodes: Descendant[]): string => {
  return nodes.map(n => {
    if (SlateText.isText(n)) {
      let html = escape(n.text);
      if (n.bold) {
        html = `<strong>${html}</strong>`;
      }
      if (n.italic) {
        html = `<em>${html}</em>`;
      }
      if (n.underline) {
        html = `<u>${html}</u>`;
      }
      return html;
    }

    if (!n.children) {
      return '';
    }

    const html = serialize(n.children as Descendant[]);

    switch ((n as SlateElement).type) {
      case 'paragraph':
        // Return a <br> for empty paragraphs to preserve line breaks
        return html === '' ? '<br>' : `<p>${html}</p>`;
      case 'link':
        return `<a href="${escape((n as any).url)}">${html}</a>`;
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
    if (!profile?.bio) return '<p></p>';

    try {
      // Always expect the bio to be a JSON string from Slate
      const parsedBio = JSON.parse(profile.bio);
      if (!Array.isArray(parsedBio)) {
          throw new Error('Not a Slate array');
      }
      return serialize(parsedBio);
    } catch (e) {
      // If it's not JSON or parsing fails, treat it as a plain string
      // and wrap it in a paragraph.
      return `<p>${escape(profile.bio)}</p>`;
    }
  }, [profile]);


  return (
    <main className="min-h-screen p-4 sm:p-6 lg:p-8 pt-24 md:pt-32">
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
                className="prose dark:prose-invert max-w-none text-muted-foreground [&_p]:mb-4" 
                dangerouslySetInnerHTML={{ __html: renderBio() }} 
              />
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
