
'use client';

import React, { DependencyList, createContext, useContext, ReactNode, useMemo, useState, useEffect } from 'react';
import { FirebaseApp } from 'firebase/app';
import { Firestore, writeBatch, doc, getDoc } from 'firebase/firestore';
import { Auth, User, onAuthStateChanged, createUserWithEmailAndPassword } from 'firebase/auth';
import { FirebaseErrorListener } from '@/components/FirebaseErrorListener'
import { useRouter } from 'next/navigation';
import type { Profile } from '@/lib/entities';

interface FirebaseProviderProps {
  children: ReactNode;
  firebaseApp: FirebaseApp;
  firestore: Firestore;
  auth: Auth;
}

// Internal state for user authentication
interface UserAuthState {
  user: User | null;
  isUserLoading: boolean;
  userError: Error | null;
}

// Combined state for the Firebase context
export interface FirebaseContextState {
  areServicesAvailable: boolean; // True if core services (app, firestore, auth instance) are provided
  firebaseApp: FirebaseApp | null;
  firestore: Firestore | null;
  auth: Auth | null; // The Auth service instance
  // User authentication state
  user: User | null;
  isUserLoading: boolean; // True during initial auth check
  userError: Error | null; // Error from auth listener
}

// Return type for useFirebase()
export interface FirebaseServicesAndUser {
  firebaseApp: FirebaseApp;
  firestore: Firestore;
  auth: Auth;
  user: User | null;
  isUserLoading: boolean;
  userError: Error | null;
}

// Return type for useUser() - specific to user auth state
export interface UserHookResult { // Renamed from UserAuthHookResult for consistency if desired, or keep as UserAuthHookResult
  user: User | null;
  isUserLoading: boolean;
  userError: Error | null;
}

// React Context
export const FirebaseContext = createContext<FirebaseContextState | undefined>(undefined);


// One-time data seeding function
const seedInitialData = async (firestore: Firestore, userId: string, profileId: string) => {
  const profileRef = doc(firestore, `users/${userId}/profiles/${profileId}`);
  
  // Check if profile document already has a 'bio' to prevent overwriting
  const profileSnap = await getDoc(profileRef);
  if (profileSnap.exists() && profileSnap.data().bio) {
    console.log("Profile data already exists. Skipping seed.");
    return;
  }
  
  console.log("Performing one-time data seed.");
  const batch = writeBatch(firestore);

  // 1. Profile Data (About Section)
  const aboutContent = `I’m truly passionate about SaaS Products, Community, Experimenting and People Management. I love interacting with both Users and Makers to identify problems and serve them with solutions. During my academic years, I was part of various communities like IEEE, IEDC, NSS, TinkerHub, and Mulearn; also one of the founders of LucidPixl Designs, a design community within our campus.

After college, I joined IOCOD Infotech Pvt. Ltd. in Calicut as a Business Analyst Intern. Considering my interest in becoming a product person, they transitioned me to a Project Associate role to handle a few products (mainly, there was one. A client project that functioned like a hobby project with no revenue stream).

After exiting IOCOD, we revived a previous community named Pygrammers (a Python Developer Community founded in 2021). During the revival event, I learned more about the platform MakeMyPass (founded by close community friends).

Later, I engaged more deeply with the MakeMyPass team. In the beginning, there weren’t any active users. As I was experimenting with my interest in Product Management, using the design knowledge I gained from running FOF Kozhikode, I offered suggestions on the product’s UX. This eventually led to me joining the MakeMyPass team.

Reflecting on my direct or indirect contributions to 1120+ events on MakeMyPass, I realize that my experience to date has been a hustle. I now want to be part of great leadership, a solid product, with a team where I can contribute, grow, apply my skill sets, and validate my actions faster with active feedback.

I’m confident in my ability to work towards a goal with a great team. Just to add, My end goal is to continue working in Product Management, learning, and experimenting.`;
  
  const profileData: Partial<Profile> = {
    fullName: "Hafis CP",
    title: "Product Management & Community",
    bio: aboutContent,
    email: "cphafis2@gmail.com"
  };
  batch.set(profileRef, profileData, { merge: true });

  // 2. Contributions
  const contributions = [
    {
      heading: "Custom Ticket & Certificate Editors",
      date: "2024-01-01",
      content: "Built a custom solution for the Event Ticket Editor & Certificate Editor on Firebase Studio, which minimized developer dependencies and empowered the sales and operations team.",
      order: 0,
    },
    {
      heading: "Figma Ticket Design Creator",
      date: "2023-11-01",
      content: "Created a Custom Ticket Design Creator on Figma which decreased onboarding/client training time by 30% and was used for more than 250 events.",
      order: 1,
    },
    {
      heading: "Business Growth & Strategy",
      date: "2023-09-01",
      content: "Developed a sales strategy that helped increase average monthly revenue by 30% for two consecutive months. Initiated and implemented partnerships with 3rd party services to improve event experiences.",
      order: 2,
    },
    {
      heading: "Content & Documentation",
      date: "2023-08-01",
      content: "Wrote blogs, prepared an Event Handbook for users, handled API Integration documentation, and created SOPs for the Sales team to streamline operations.",
      order: 3
    },
    {
      heading: "User Behavior Analysis",
      date: "2024-02-01",
      content: "Implemented Microsoft Clarity, Search Console, and Analytics to better identify user behavior, leading to improved user engagement.",
      order: 4
    }
  ];

  contributions.forEach(item => {
    const contributionRef = doc(firestore, `users/${userId}/profiles/${profileId}/contributions`, item.heading.toLowerCase().replace(/ /g, '-'));
    batch.set(contributionRef, { ...item, profileId });
  });

  // 3. Community Involvements
  const communityInvolvements = [
    {
      role: "Co-Lead",
      communityName: "Friends of Figma Kozhikode",
      description: "Co-leading the local chapter of Friends of Figma in Kozhikode to create an active and collaborative design community. Interacting with design community members and leaders to learn deeply about Design and UX Principles.",
      startDate: "2024-06",
      isCurrent: true,
      endDate: null,
      order: 0,
    },
    {
      role: "Volunteer",
      communityName: "Pygrammers",
      description: "Part of the revival and ongoing activities of Pygrammers, a Python Developer Community founded in 2021.",
      startDate: "2023-05",
      isCurrent: true,
      endDate: null,
      order: 1,
    },
    {
      role: "Volunteer",
      communityName: "IEEE",
      description: "Active member and volunteer in various activities and events organized by IEEE.",
      startDate: "2020-01",
      isCurrent: true,
      endDate: null,
      order: 2,
    },
    {
        role: "Volunteer",
        communityName: "The Product Folks",
        description: "Engaged as a volunteer, contributing to community initiatives and learning from product leaders.",
        startDate: "2023-01",
        isCurrent: true,
        endDate: null,
        order: 3,
    }
  ];

  communityInvolvements.forEach(item => {
    const communityRef = doc(firestore, `users/${userId}/profiles/${profileId}/communityInvolvements`, item.communityName.toLowerCase().replace(/ /g, '-'));
    batch.set(communityRef, { ...item, profileId });
  });

  await batch.commit();
  console.log("Initial data seeding complete.");
};


/**
 * FirebaseProvider manages and provides Firebase services and user authentication state.
 */
export const FirebaseProvider: React.FC<FirebaseProviderProps> = ({
  children,
  firebaseApp,
  firestore,
  auth,
}) => {
  const [userAuthState, setUserAuthState] = useState<UserAuthState>({
    user: null,
    isUserLoading: true, // Start loading until first auth event
    userError: null,
  });
  const router = useRouter();

  // Memoize the core Firebase services to ensure they are stable across re-renders.
  // This is crucial to prevent hooks that depend on these services from re-running unnecessarily.
  const stableServices = useMemo(() => ({
    firebaseApp,
    firestore,
    auth,
  }), [firebaseApp, firestore, auth]);


  // Effect to subscribe to Firebase auth state changes
  useEffect(() => {
    if (!stableServices.auth || !stableServices.firestore) { // If no Auth service instance, cannot determine user state
      setUserAuthState({ user: null, isUserLoading: false, userError: new Error("Auth or Firestore service not provided.") });
      return;
    }

    setUserAuthState({ user: null, isUserLoading: true, userError: null }); // Reset on auth instance change

    const unsubscribe = onAuthStateChanged(
      stableServices.auth,
      (firebaseUser) => { // Auth state determined
        if (firebaseUser) {
           setUserAuthState({ user: firebaseUser, isUserLoading: false, userError: null });
           // Perform one-time data seed after user is authenticated
           seedInitialData(stableServices.firestore, firebaseUser.uid, 'main-profile').catch(console.error);
        } else {
            // Create the admin user if it doesn't exist
            createUserWithEmailAndPassword(stableServices.auth, 'cphafis2@gmail.com', '@dmin123').catch(error => {
                // Ignore 'email-already-in-use' error, as it means admin exists.
                // For other errors, you might want to log them.
                if (error.code !== 'auth/email-already-in-use') {
                    console.error("Error creating admin user:", error);
                }
            }).finally(() => {
                 setUserAuthState({ user: null, isUserLoading: false, userError: null });
            })
        }
      },
      (error) => { // Auth listener error
        console.error("FirebaseProvider: onAuthStateChanged error:", error);
        setUserAuthState({ user: null, isUserLoading: false, userError: error });
      }
    );
    return () => unsubscribe(); // Cleanup
  }, [stableServices.auth, stableServices.firestore, router]);

  // Memoize the context value
  const contextValue = useMemo((): FirebaseContextState => {
    const servicesAvailable = !!(stableServices.firebaseApp && stableServices.firestore && stableServices.auth);
    return {
      areServicesAvailable: servicesAvailable,
      firebaseApp: servicesAvailable ? stableServices.firebaseApp : null,
      firestore: servicesAvailable ? stableServices.firestore : null,
      auth: servicesAvailable ? stableServices.auth : null,
      user: userAuthState.user,
      isUserLoading: userAuthState.isUserLoading,
      userError: userAuthState.userError,
    };
  }, [stableServices, userAuthState]);

  return (
    <FirebaseContext.Provider value={contextValue}>
      <FirebaseErrorListener />
      {children}
    </FirebaseContext.Provider>
  );
};

/**
 * Hook to access core Firebase services and user authentication state.
 * Throws error if core services are not available or used outside provider.
 */
export const useFirebase = (): FirebaseServicesAndUser => {
  const context = useContext(FirebaseContext);

  if (context === undefined) {
    throw new Error('useFirebase must be used within a FirebaseProvider.');
  }

  if (!context.areServicesAvailable || !context.firebaseApp || !context.firestore || !context.auth) {
    throw new Error('Firebase core services not available. Check FirebaseProvider props.');
  }

  return {
    firebaseApp: context.firebaseApp,
    firestore: context.firestore,
    auth: context.auth,
    user: context.user,
    isUserLoading: context.isUserLoading,
    userError: context.userError,
  };
};

/** Hook to access Firebase Auth instance. */
export const useAuth = (): Auth => {
  const { auth } = useFirebase();
  return auth;
};

/** Hook to access Firestore instance. */
export const useFirestore = (): Firestore => {
  const { firestore } = useFirebase();
  return firestore;
};

/** Hook to access Firebase App instance. */
export const useFirebaseApp = (): FirebaseApp => {
  const { firebaseApp } = useFirebase();
  return firebaseApp;
};

type MemoFirebase <T> = T & {__memo?: boolean};

export function useMemoFirebase<T>(factory: () => T, deps: DependencyList): T | (MemoFirebase<T>) {
  const memoized = useMemo(factory, deps);
  
  if(typeof memoized !== 'object' || memoized === null) return memoized;
  (memoized as MemoFirebase<T>).__memo = true;
  
  return memoized;
}

/**
 * Hook specifically for accessing the authenticated user's state.
 * This provides the User object, loading status, and any auth errors.
 * @returns {UserHookResult} Object with user, isUserLoading, userError.
 */
export const useUser = (): UserHookResult => { // Renamed from useAuthUser
  const { user, isUserLoading, userError } = useFirebase(); // Leverages the main hook
  return { user, isUserLoading, userError };
};
