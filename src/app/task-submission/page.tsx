
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowUpRight, Loader2 } from "lucide-react";

const tasks = [
  {
    id: "task-1",
    title: "Task 1",
    subHeading: "Lorem ipsum dolor sit amet",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    submissionUrl: "#"
  },
  {
    id: "task-2",
    title: "Task 2",
    subHeading: "Consectetur adipiscing elit",
    description: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    submissionUrl: "#"
  },
  {
    id: "task-3",
    title: "Task 3",
    subHeading: "Sed do eiusmod tempor incididunt",
    description: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.",
    submissionUrl: "#"
  },
  {
    id: "task-4",
    title: "Task 4",
    subHeading: "Ut enim ad minim veniam",
    description: "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet.",
    submissionUrl: "#"
  }
];

export default function TaskSubmissionPage() {
  const isLoading = false;

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
                        <h3 className="font-medium text-lg">{item.title}</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                          <p>{item.subHeading}</p>
                          {item.submissionUrl && <span>|</span>}
                          {item.submissionUrl && (
                            <Link 
                                href={item.submissionUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-blue-500 hover:underline flex items-center gap-1"
                                onClick={(e) => e.stopPropagation()}
                            >
                                View Submission <ArrowUpRight className="h-3 w-3" />
                            </Link>
                          )}
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-6">
                      <div className="prose dark:prose-invert max-w-none text-muted-foreground whitespace-pre-wrap pt-2">
                        {item.description}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              <p className="text-muted-foreground">No tasks have been submitted yet.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
