import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ContactCard } from "@/components/contact-card";

export default function ContactPage() {
  return (
    <main className="min-h-screen p-4 sm:p-6 lg:p-8 flex items-center justify-center">
      <div className="mx-auto max-w-md w-full">
        <ContactCard />
      </div>
    </main>
  );
}
