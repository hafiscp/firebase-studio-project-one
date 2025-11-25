
'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CommunityTimeline } from "@/components/community-timeline";
import { useCollection, useFirebase, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import type { CommunityInvolvement } from '@/lib/entities';
import { Loader2 } from "lucide-react";

// This should be the UID of the admin user who manages the content.
const ADMIN_USER_ID = 'arxO7bMR0vPj8KeHwyHExv2h5vz2';


export default function CommunityPage() {
  const { firestore } = useFirebase();

  const communityCollectionRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'users', ADMIN_USER_ID, 'profiles', 'main-profile', 'communityInvolvements');
  }, [firestore]);

  const communityQuery = useMemoFirebase(() => {
    if (!communityCollectionRef) return null;
    // Sort by order which is managed by drag-and-drop in admin
    // To sort by date: return query(communityCollectionRef, orderBy('date', 'desc'));
    return query(communityCollectionRef, orderBy('order'));
  }, [communityCollectionRef]);

  const { data: communityInvolvements, isLoading } = useCollection<CommunityInvolvement>(communityQuery);

  const sortedInvolvements = useMemo(() => {
    if (!communityInvolvements) return [];
    // Secondary sort by date on the client-side to ensure latest is first
    return [...communityInvolvements].sort((a, b) => b.date.localeCompare(a.date));
  }, [communityInvolvements]);


  return (
    <main className="min-h-screen p-4 sm:p-6 lg:p-8 pt-24 md:pt-32">
      <div className="mx-auto max-w-screen-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-3xl">Community</CardTitle>
          </CardHeader>
          <CardContent>
             {isLoading ? (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : sortedInvolvements && sortedInvolvements.length > 0 ? (
               <CommunityTimeline items={sortedInvolvements} />
            ) : (
              <p className="text-muted-foreground">No community involvements have been added yet.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
