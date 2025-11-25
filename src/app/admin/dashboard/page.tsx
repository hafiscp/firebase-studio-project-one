
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState, useMemo } from 'react';
import { useCollection, useDoc, useFirebase, useMemoFirebase } from '@/firebase';
import { collection, doc, writeBatch, query, orderBy } from 'firebase/firestore';
import { setDocumentNonBlocking, addDocumentNonBlocking, deleteDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import type { Profile, Contribution } from '@/lib/entities';
import { useRouter } from 'next/navigation';
import { Textarea } from '@/components/ui/textarea';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { DndContext, closestCenter, type DragEndEvent } from '@dnd-kit/core';
import { SortableContext, useSortable, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2, PlusCircle, Save } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

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

type SortableContributionItemProps = {
  item: Contribution;
  onSave: (id: string, data: Pick<Contribution, 'heading' | 'date' | 'content'>) => void;
  onDelete: (id: string) => void;
};

function SortableContributionItem({ item, onSave, onDelete }: SortableContributionItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: item.id });
  const [heading, setHeading] = useState(item.heading);
  const [date, setDate] = useState(item.date);
  const [content, setContent] = useState(item.content);

  useEffect(() => {
    setHeading(item.heading);
    setDate(item.date);
    setContent(item.content);
  }, [item]);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleSave = () => {
    onSave(item.id, { heading, date, content });
  };

  return (
    <div ref={setNodeRef} style={style} className="bg-card p-4 rounded-lg border flex items-center gap-4">
      <div {...attributes} {...listeners} className="cursor-grab p-2">
        <GripVertical className="h-5 w-5 text-muted-foreground" />
      </div>
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value={item.id} className="border-b-0">
          <AccordionTrigger className="hover:no-underline p-0">
             <Input
                value={heading}
                onChange={(e) => setHeading(e.target.value)}
                className="text-lg font-medium border-none shadow-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-0"
                onClick={(e) => e.stopPropagation()}
            />
          </AccordionTrigger>
          <AccordionContent className="pt-4 space-y-4">
            <div className="space-y-2">
              <Label>Date</Label>
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Content</Label>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={5}
              />
            </div>
             <div className="flex gap-2">
                <Button onClick={handleSave}><Save className="mr-2 h-4 w-4" /> Save</Button>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm"><Trash2 className="mr-2 h-4 w-4" /> Delete</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently delete the contribution: "{item.heading}". This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => onDelete(item.id)}>Continue</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

function ContributionsForm() {
    const { toast } = useToast();
    const { firestore, user } = useFirebase();
    const profileId = 'main-profile';

    const contributionsCollectionRef = useMemoFirebase(() => {
        if (!user?.uid || !firestore) return null;
        return collection(firestore, 'users', user.uid, 'profiles', profileId, 'contributions');
    }, [user?.uid, firestore]);
    
    const contributionsQuery = useMemoFirebase(() => {
        if(!contributionsCollectionRef) return null;
        return query(contributionsCollectionRef, orderBy('order'));
    }, [contributionsCollectionRef]);

    const { data: contributionsData, isLoading } = useCollection<Contribution>(contributionsQuery);
    const [items, setItems] = useState<Contribution[]>([]);

    useEffect(() => {
        if (contributionsData) {
            setItems(contributionsData);
        }
    }, [contributionsData]);

    const handleCreateContribution = () => {
        if (!contributionsCollectionRef || !user) return;
        const newOrder = items.length > 0 ? Math.max(...items.map(i => i.order)) + 1 : 0;
        const newContribution: Omit<Contribution, 'id'> = {
            profileId: profileId,
            heading: 'New Contribution',
            date: new Date().toISOString().split('T')[0],
            content: '',
            order: newOrder,
        };
        addDocumentNonBlocking(contributionsCollectionRef, newContribution);
    };
    
    const handleSaveContribution = (id: string, data: Pick<Contribution, 'heading' | 'date' | 'content'>) => {
      if (!contributionsCollectionRef) return;
      const docRef = doc(contributionsCollectionRef, id);
      setDocumentNonBlocking(docRef, data, { merge: true });
      toast({
          title: "Contribution Saved!",
          description: `Changes to "${data.heading}" have been saved.`,
      });
    };

    const handleDeleteContribution = (id: string) => {
        if (!contributionsCollectionRef) return;
        const docRef = doc(contributionsCollectionRef, id);
        deleteDocumentNonBlocking(docRef);
        toast({ title: "Success!", description: "Contribution has been deleted." });
    };

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
        if (active.id !== over?.id) {
            const oldIndex = items.findIndex((item) => item.id === active.id);
            const newIndex = items.findIndex((item) => item.id === over!.id);
            const newItems = arrayMove(items, oldIndex, newIndex);
            
            setItems(newItems);
            
            if (!firestore || !user) return;
            const batch = writeBatch(firestore);
            newItems.forEach((item, index) => {
                const docRef = doc(firestore, `users/${user.uid}/profiles/${profileId}/contributions`, item.id);
                batch.update(docRef, { order: index });
            });
            await batch.commit();
            toast({ title: "Success!", description: "Contribution order has been updated." });
        }
    };

    if (isLoading) {
        return <p>Loading contributions...</p>;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-lg font-medium">Contributions Page</h3>
                    <p className="text-sm text-muted-foreground">Manage your contributions.</p>
                </div>
                <Button onClick={handleCreateContribution}><PlusCircle className="mr-2 h-4 w-4"/> Create New</Button>
            </div>
            
            <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={items.map(i => i.id)} strategy={verticalListSortingStrategy}>
                    <div className="space-y-4">
                        {items.map(item => (
                            <SortableContributionItem 
                              key={item.id} 
                              item={item} 
                              onSave={handleSaveContribution}
                              onDelete={handleDeleteContribution}
                            />
                        ))}
                    </div>
                </SortableContext>
            </DndContext>
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
                 <ContributionsForm />
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

    

    