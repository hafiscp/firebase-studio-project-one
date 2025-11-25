
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState } from 'react';
import { useDoc, useFirebase, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import type { Profile } from '@/lib/entities';
import { useRouter } from 'next/navigation';
import { Textarea } from '@/components/ui/textarea';


function HomeForm() {
  const { toast } = useToast();
  const { firestore, user } = useFirebase();
  const profileId = 'main-profile';

  const profileRef = useMemoFirebase(() => {
    if (!user?.uid || !firestore) return null;
    return doc(firestore, 'users', user.uid, 'profiles', profileId);
  }, [user?.uid, firestore]);

  const { data: profileData, isLoading } = useDoc<Profile>(profileRef);

  const [name, setName] = useState('');
  const [title, setTitle] = useState('');

  useEffect(() => {
    if (profileData) {
      setName(profileData.fullName || '');
      setTitle(profileData.title || '');
    }
  }, [profileData]);

  const handleSaveChanges = () => {
    if (!profileRef || !user) {
      toast({
        variant: 'destructive',
        title: 'Error!',
        description: 'You must be logged in to save changes.',
      });
      return;
    }

    let updatedData: Partial<Profile>;

    if (profileData) {
      updatedData = {
        fullName: name,
        title: title,
      };
    } else {
      updatedData = {
        id: profileId,
        fullName: name,
        title: title,
        bio: 'Default bio.',
        location: 'Default location.',
        email: user.email || 'no-email@example.com',
      };
    }
    
    setDocumentNonBlocking(profileRef, updatedData, { merge: true });

    toast({
      title: 'Success!',
      description: 'Home page content has been updated.',
    });
  };
  
  if (isLoading) {
    return <p>Loading profile...</p>
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Profile Section</h3>
        <p className="text-sm text-muted-foreground">Update the main headline and sub-headline.</p>
      </div>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Headline (Name)</Label>
          <Input id="name" name="name" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="title">Sub-headline (Title)</Label>
          <Input id="title" name="title" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
      </div>
      <Button onClick={handleSaveChanges}>Save Changes</Button>
    </div>
  );
}

function AboutForm() {
  const { toast } = useToast();
  const { firestore, user } = useFirebase();
  const profileId = 'main-profile';

  const profileRef = useMemoFirebase(() => {
    if (!user?.uid || !firestore) return null;
    return doc(firestore, 'users', user.uid, 'profiles', profileId);
  }, [user?.uid, firestore]);

  const { data: profileData, isLoading } = useDoc<Profile>(profileRef);

  const [bio, setBio] = useState('');

  useEffect(() => {
    if (profileData) {
      setBio(profileData.bio || '');
    }
  }, [profileData]);

  const handleSaveChanges = () => {
    if (!profileRef) {
      toast({
        variant: 'destructive',
        title: 'Error!',
        description: 'You must be logged in to save changes.',
      });
      return;
    }
    setDocumentNonBlocking(profileRef, { bio: bio }, { merge: true });
    toast({
      title: 'Success!',
      description: 'About page content has been updated.',
    });
  };

  if (isLoading) {
    return <p>Loading about content...</p>
  }
  
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">About Page Content</h3>
        <p className="text-sm text-muted-foreground">Update the content for your about page.</p>
      </div>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="bio">Bio</Label>
           <Textarea 
             id="bio"
             name="bio"
             value={bio}
             onChange={(e) => setBio(e.target.value)}
             rows={10}
             placeholder="Tell your story..."
           />
        </div>
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
  const { user, isUserLoading } = useFirebase();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.replace('/admin');
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading || !user) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </main>
    );
  }
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
                 <AboutForm />
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

    