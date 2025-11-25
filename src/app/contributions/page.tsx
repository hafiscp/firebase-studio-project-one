
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useCollection, useFirebase, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import type { Contribution } from '@/lib/entities';
import { Loader2 } from "lucide-react";

// This should be the UID of the admin user who manages the content.
const ADMIN_USER_ID = 'arxO7bMR0vPj8KeHwyHExv2h5vz2';

export default function ContributionsPage() {
  const { firestore } = useFirebase();

  const contributionsCollectionRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'users', ADMIN_USER_ID, 'profiles', 'main-profile', 'contributions');
  }, [firestore]);

  const contributionsQuery = useMemoFirebase(() => {
    if (!contributionsCollectionRef) return null;
    return query(contributionsCollectionRef, orderBy('order'));
  }, [contributionsCollectionRef]);

  const { data: contributions, isLoading } = useCollection<Contribution>(contributionsQuery);

  return (
    <main className="min-h-screen p-4 sm:p-6 lg:p-8 pt-24 md:pt-32">
      <div className="mx-auto max-w-screen-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-3xl">Contributions</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : contributions && contributions.length > 0 ? (
              <Accordion type="single" collapsible className="w-full space-y-4">
                {contributions.map((item) => (
                  <AccordionItem key={item.id} value={item.id} className="bg-background/50 rounded-lg border px-4">
                    <AccordionTrigger>
                      <div className="flex justify-between items-center w-full pr-4">
                        <span className="font-medium text-lg">{item.heading}</span>
                        <span className="text-sm text-muted-foreground">{item.date}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="prose dark:prose-invert max-w-none text-muted-foreground whitespace-pre-wrap pt-2">
                        {item.content}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              <p className="text-muted-foreground">No contributions have been added yet.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
