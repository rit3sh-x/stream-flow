import { ClerkLoading, SignedIn, useUser } from '@clerk/clerk-react';
import { Loader } from './loader';
import { useEffect, useState } from 'react';
import { fetchUserProfile } from '@/lib/utils';
import { useMediaSources } from '@/hooks/use-media-sources';
import { MediaConfiguration } from './media-configuration';

export const Widget = () => {
    const [profile, setProfile] = useState<{
        status: number;
        user: {
            userProfile: {
                id: string;
                email: string;
                firstname: string;
                lastname: string;
                createdAt: Date;
                clerkid: string;
                image: string;
                trial: boolean;
                firstView: boolean;
                plan: 'PRO' | 'FREE';
                studio: {
                    id: string;
                    screen: string;
                    mic: string;
                    camera: string | null;
                    preset: 'HD' | 'SD';
                    userId: string;
                };
            };
            hasPro: boolean;
        } | null;
    } | null>(null);

    const { user } = useUser();
    const { state, fetchMediaResources } = useMediaSources();

    const fetchProfile = async () => {
        if (user && user.id) {
            try {
                const res = await fetchUserProfile(user.id);
                setProfile(res);
                fetchMediaResources();
            } catch (error) {
                console.error('Failed to fetch user profile:', error);
            }
        }
    };

    useEffect(() => {
        fetchProfile();
    }, [user]);

    useEffect(() => {
        if (user && user.id && !profile) {
            const retryTimeout = setTimeout(() => {
                console.log('Profile is null, retrying fetch...');
                fetchProfile();
            }, 10000);

            return () => clearTimeout(retryTimeout);
        }
    }, [user, profile]);

    return (
        <div className='p-5'>
            <ClerkLoading>
                <div className='h-full flex justify-center items-center'>
                    <Loader />
                </div>
            </ClerkLoading>
            <SignedIn>
                {profile ? (
                    <MediaConfiguration state={state} user={profile?.user} />
                ) : (
                    <div className='w-full h-full flex justify-center items-center'>
                        <Loader color='#fff' />
                    </div>
                )}
            </SignedIn>
        </div>
    );
};