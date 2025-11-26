
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
    subHeading: "Use Vibecoding or Gemini to make a landing page",
    description: "Use vibecoding or Gemini 3 to make a landing page about the things mentioned.",
    submissionUrl: "https://hafiscp-portfolio-pm.vercel.app/"
  },
  {
    id: "task-2",
    title: "Task 2",
    subHeading: "Make a CMS with database and front end",
    description: "Make a CMS with database and front end to make changes to this landing page.",
    submissionUrl: "https://hafiscp-portfolio-pm.vercel.app/admin"
  },
  {
    id: "task-3",
    title: "Task 3",
    subHeading: "Pitching the community offering",
    description: "If you were pitching the community offering, how would you design the slides on Figma.",
    submissionUrl: "https://www.figma.com/deck/A5bdaSaPEpLV01hHbnHCxM/FOF-Kozhikode-Community-Offerings?node-id=1-143&t=ehK9gGFabbIDgrQ4-1"
  },
  {
    id: "task-4",
    title: "Task 4",
    subHeading: "Figuring out PMF of a product",
    description: "If you’re tasked to figure out PMF of a product how would you think.",
    submissionUrl: "https://www.notion.so/hafiscp/Product-Market-Fit-My-way-of-Approach-Hafis-CP-2b79d9bc720280cab39ef70255d86dc8?source=copy_link"
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
