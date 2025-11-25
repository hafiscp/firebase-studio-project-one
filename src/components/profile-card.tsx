import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import data from '@/lib/cms-data.json';
import { PlaceHolderImages } from '@/lib/placeholder-images';

type ProfileCardProps = React.HTMLAttributes<HTMLDivElement>;

export function ProfileCard({ className }: ProfileCardProps) {
  const { profile } = data;
  const profileImage = PlaceHolderImages.find(img => img.id === 'profile-pic');

  return (
    <Card className={cn("flex flex-col justify-center p-6 bg-card rounded-2xl border border-transparent transition-all duration-300 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10", className)}>
      <CardHeader className="flex flex-col items-center text-center p-0 pb-6">
        {profileImage && (
          <Image
            src={profileImage.imageUrl}
            alt={profileImage.description}
            width={128}
            height={128}
            className="mb-4 h-32 w-32 rounded-full border-4 border-primary object-cover"
            data-ai-hint={profileImage.imageHint}
            priority
          />
        )}
        <CardTitle className="font-headline text-3xl">{profile.name}</CardTitle>
        <CardDescription className="text-primary">{profile.title}</CardDescription>
      </CardHeader>
      <CardContent className="text-center text-muted-foreground p-0">
        <p>{profile.bio}</p>
      </CardContent>
    </Card>
  );
}
