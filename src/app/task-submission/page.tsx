'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useCollection, useFirebase, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import type { Contribution as Task } from '@/lib/entities';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowUpRight, Loader2 } from "lucide-react";

// This is a placeholder and will be updated later.
const ADMIN_USER_ID = 'R24RFjVJTyd3R5aHbZOJweN62uw1';

export default function TaskSubmissionPage() {
  // For now, we will show a loading state and then a "no tasks" message.
  // We can connect this to real data later.
  const isLoading = false;
  const tasks: Task[] = [];

  return (
    <main className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-screen-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-3xl">Task Submissions</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : tasks && tasks.length > 0 ? (
              <Accordion type="single" collapsible className="w-full space-y-4">
                {tasks.map((item) => (
                  <AccordionItem key={item.id} value={item.id} className="bg-muted/50 rounded-lg border">
                    <AccordionTrigger className="p-6 text-left hover:no-underline">
                      <div className="flex-1">
                        <h3 className="font-medium text-lg">{item.heading}</h3>
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
              <p className="text-muted-foreground">No tasks have been added yet.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
