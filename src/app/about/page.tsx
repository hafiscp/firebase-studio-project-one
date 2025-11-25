import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AboutPage() {
  return (
    <main className="min-h-screen p-4 sm:p-6 lg:p-8 pt-20">
      <div className="mx-auto max-w-screen-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-3xl">About Me</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">This is the about page. Content will be added here.</p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
