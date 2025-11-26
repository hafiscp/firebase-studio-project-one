
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useCollection, useFirebase, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import type { Contribution } from '@/lib/entities';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowUpRight, Loader2 } from "lucide-react";

// This should be the UID of the admin user who manages the content.
const ADMIN_USER_ID = 'R24RFjVJTyd3R5aHbZOJweN62uw1';

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
    <main className="min-h-screen p-4 sm:p-6 lg:p-8">
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
                  <AccordionItem key={item.id} value={item.id} className="bg-muted/50 rounded-lg border">
                    <AccordionTrigger className="p-6 text-left hover:no-underline">
                      <div className="flex-1">
                        <h3 className="font-medium text-lg">{item.heading}</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                            {item.date && (
                                <p>{new Date(item.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</p>
                            )}
                            {item.date && item.proofOfWorkUrl && <span>|</span>}
                            {item.proofOfWorkUrl && (
                                <Link 
                                    href={item.proofOfWorkUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-blue-500 hover:underline flex items-center gap-1"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    View Proof <ArrowUpRight className="h-3 w-3" />
                                </Link>
                            )}
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-6">
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
