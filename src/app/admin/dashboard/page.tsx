
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import data from '@/lib/cms-data.json';
import { useState } from 'react';

// NOTE: This is a placeholder for a real CMS. 
// In a real application, you would have a backend API to handle data persistence.
// For this prototype, we are just mocking the "save" functionality.

function HomeForm() {
  const { toast } = useToast();
  const [profile, setProfile] = useState(data.profile);
  const [socials, setSocials] = useState(data.contact.socials);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSocialChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const newSocials = [...socials];
    newSocials[index] = { ...newSocials[index], [e.target.name]: e.target.value };
    setSocials(newSocials);
  };

  const handleSaveChanges = () => {
    // In a real app, this would send a request to a backend API.
    console.log('Saving changes:', { profile, socials });
    toast({
      title: 'Success!',
      description: 'Home page content has been updated.',
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Profile Section</h3>
        <p className="text-sm text-muted-foreground">Update the main headline and sub-headline.</p>
      </div>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Headline (Name)</Label>
          <Input id="name" name="name" value={profile.name} onChange={handleProfileChange} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="title">Sub-headline (Title)</Label>
          <Input id="title" name="title" value={profile.title} onChange={handleProfileChange} />
        </div>
      </div>
      <div>
        <h3 className="text-lg font-medium">Social Links</h3>
        <p className="text-sm text-muted-foreground">Update your social media URLs.</p>
      </div>
      <div className="space-y-4">
        {socials.map((social, index) => (
          <div key={index} className="space-y-2">
            <Label htmlFor={`social-url-${index}`}>{social.name} URL</Label>
            <Input
              id={`social-url-${index}`}
              name="url"
              value={social.url}
              onChange={(e) => handleSocialChange(index, e)}
            />
          </div>
        ))}
      </div>
      <Button onClick={handleSaveChanges}>Save Changes</Button>
    </div>
  );
}

function PlaceholderTab({ title }: { title: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>
          Management features for the {title.toLowerCase()} page will be implemented here.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">Coming soon...</p>
      </CardContent>
    </Card>
  )
}

export default function AdminDashboardPage() {
  return (
    <main className="min-h-screen p-4 sm:p-6 lg:p-8 pt-20">
      <div className="mx-auto max-w-screen-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-3xl">Admin Dashboard</CardTitle>
            <CardDescription>Manage the content for your website pages.</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="home">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="home">Home</TabsTrigger>
                <TabsTrigger value="about">About</TabsTrigger>
                <TabsTrigger value="contributions">Contributions</TabsTrigger>
                <TabsTrigger value="community">Community</TabsTrigger>
                <TabsTrigger value="contact">Contact</TabsTrigger>
              </TabsList>
              <TabsContent value="home" className="pt-6">
                <HomeForm />
              </TabsContent>
              <TabsContent value="about" className="pt-6">
                 <PlaceholderTab title="About Page" />
              </TabsContent>
              <TabsContent value="contributions" className="pt-6">
                 <PlaceholderTab title="Contributions Page" />
              </TabsContent>
              <TabsContent value="community" className="pt-6">
                 <PlaceholderTab title="Community Page" />
              </TabsContent>
              <TabsContent value="contact" className="pt-6">
                 <PlaceholderTab title="Contact Page" />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
