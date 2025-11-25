
export type Profile = {
    id: string;
    fullName: string;
    title: string;
    bio: string;
    location: string;
    email: string;
    githubUrl?: string;
    linkedinUrl?: string;
};

export type KeyMetric = {
    id: string;
    profileId: string;
    title: string;
    value: number;
    description: string;
};

export type NavigationLink = {
    id: string;
    profileId: string;
    label: string;
    url: string;
    order: number;
};

export type TechStackItem = {
    id: string;
    profileId: string;
    name: string;
    iconUrl: string;
    proficiency: string;
};

export type ContactMethod = {
    id: string;
    profileId: string;
    type: 'email' | 'twitter' | 'linkedin' | 'github';
    url: string;
    label: string;
};

export type Contribution = {
    id: string;
    profileId: string;
    heading: string;
    date: string;
    content: string;
    order: number;
};

export type CommunityInvolvement = {
    id: string;
    profileId: string;
    role: string;
    communityName: string;
    description: string;
    startDate: string;
    endDate: string | null;
    isCurrent: boolean;
    order: number;
};
