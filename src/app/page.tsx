import { ProfileCard } from '@/components/profile-card';
import { KeyMetricsCard } from '@/components/key-metrics-card';
import { NavigationCard } from '@/components/navigation-card';
import { TechStackCard } from '@/components/tech-stack-card';
import { ContactCard } from '@/components/contact-card';

export default function Home() {
  return (
    <main className="min-h-screen w-full bg-background p-4 sm:p-6 lg:p-8">
      <div className="mx-auto grid h-full max-w-screen-2xl grid-cols-1 gap-6 lg:grid-cols-6 lg:grid-rows-6 lg:h-[calc(100vh-4rem)]">
        <ProfileCard className="lg:col-start-1 lg:col-span-3 lg:row-start-1 lg:row-span-4" />
        <KeyMetricsCard className="lg:col-start-4 lg:col-span-3 lg:row-start-1 lg:row-span-2" />
        <NavigationCard className="lg:col-start-1 lg:col-span-3 lg:row-start-5 lg:row-span-2" />
        <TechStackCard className="lg:col-start-4 lg:col-span-3 lg:row-start-3 lg:row-span-2" />
        <ContactCard className="lg:col-start-4 lg:col-span-3 lg:row-start-5 lg:row-span-2" />
      </div>
    </main>
  );
}
