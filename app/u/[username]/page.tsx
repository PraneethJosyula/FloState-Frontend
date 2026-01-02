'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { ProfileWithStats } from '@/lib/types/database';
import { fetchProfile } from '@/lib/services/profiles';
import { fetchUserActivities } from '@/lib/services/activities';
import { Navbar } from '@/components/navbar';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ActivityCard } from '@/components/activity-card';
import { ActivityWithProfile, Activity } from '@/lib/types/database';
import { checkFollowStatus, followUser, unfollowUser } from '@/lib/services/profiles';
import { getCurrentUser } from '@/lib/services/auth';
import { Clock, Flame, Calendar, Users, UserPlus, UserMinus, Loader2 } from 'lucide-react';

export default function ProfilePage() {
  const params = useParams();
  const username = params.username as string;
  const [profile, setProfile] = useState<ProfileWithStats | null>(null);
  const [activities, setActivities] = useState<ActivityWithProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);

  useEffect(() => {
    loadProfile();
  }, [username]);

  const loadProfile = async () => {
    setLoading(true);
    
    // Get current user to check if viewing own profile
    const currentUser = await getCurrentUser();
    
    const { data: profileData } = await fetchProfile(username);
    if (profileData) {
      setProfile(profileData);
      setIsOwnProfile(currentUser?.id === profileData.id);
      
      // Check follow status if not own profile
      if (currentUser && currentUser.id !== profileData.id) {
        const { is_following } = await checkFollowStatus(profileData.id);
        setIsFollowing(is_following);
      }
      
      const { data: activitiesData } = await fetchUserActivities(profileData.id, { limit: 20 });
      if (activitiesData) {
        // Transform activities to include profile data
        const activitiesWithProfile: ActivityWithProfile[] = activitiesData.map(activity => ({
          ...activity,
          profile: {
            username: profileData.username,
            full_name: profileData.full_name,
            avatar_url: profileData.avatar_url,
          },
          like_count: 0, // Will be fetched separately if needed
          comment_count: 0,
          is_liked: false,
        }));
        setActivities(activitiesWithProfile);
      }
    }
    setLoading(false);
  };

  const handleFollowToggle = async () => {
    if (!profile || followLoading) return;
    
    setFollowLoading(true);
    
    if (isFollowing) {
      const { error } = await unfollowUser(profile.id);
      if (!error) {
        setIsFollowing(false);
        setProfile(prev => prev ? { ...prev, follower_count: prev.follower_count - 1 } : null);
      }
    } else {
      const { error } = await followUser(profile.id);
      if (!error) {
        setIsFollowing(true);
        setProfile(prev => prev ? { ...prev, follower_count: prev.follower_count + 1 } : null);
      }
    }
    
    setFollowLoading(false);
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </main>
      </>
    );
  }

  if (!profile) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-foreground font-medium mb-1">Profile not found</p>
            <p className="text-muted-foreground text-sm">This user doesn't exist.</p>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        <div className="container max-w-2xl mx-auto px-4 py-8">
          {/* Profile Header */}
          <Card className="mb-6">
            <div className="flex flex-col items-center text-center">
              <Avatar
                src={profile.avatar_url}
                name={profile.full_name || profile.username}
                size="xl"
                className="mb-4"
              />
              <h1 className="text-2xl font-bold text-foreground mb-0.5">
                {profile.full_name || profile.username}
              </h1>
              <p className="text-muted-foreground text-sm mb-3">@{profile.username}</p>
              {profile.bio && (
                <p className="text-foreground text-sm mb-4 max-w-sm">{profile.bio}</p>
              )}
              {!isOwnProfile && (
                <Button
                  variant={isFollowing ? 'secondary' : 'default'}
                  onClick={handleFollowToggle}
                  disabled={followLoading}
                  className="mb-6"
                >
                  {followLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : isFollowing ? (
                    <UserMinus className="h-4 w-4" />
                  ) : (
                    <UserPlus className="h-4 w-4" />
                  )}
                  {isFollowing ? 'Following' : 'Follow'}
                </Button>
              )}

              {/* Stats */}
              <div className="grid grid-cols-4 gap-4 w-full border-t border-border pt-6">
                <div className="text-center">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 mx-auto mb-2">
                    <Clock className="h-4 w-4 text-primary" />
                  </div>
                  <div className="text-xl font-bold text-foreground">{profile.stats.total_hours}</div>
                  <div className="text-xs text-muted-foreground">Hours</div>
                </div>
                <div className="text-center">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10 mx-auto mb-2">
                    <Flame className="h-4 w-4 text-accent" />
                  </div>
                  <div className="text-xl font-bold text-foreground">{profile.stats.current_streak}</div>
                  <div className="text-xs text-muted-foreground">Streak</div>
                </div>
                <div className="text-center">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 mx-auto mb-2">
                    <Calendar className="h-4 w-4 text-blue-500" />
                  </div>
                  <div className="text-xl font-bold text-foreground">{profile.stats.total_sessions}</div>
                  <div className="text-xs text-muted-foreground">Sessions</div>
                </div>
                <div className="text-center">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-pink-500/10 mx-auto mb-2">
                    <Users className="h-4 w-4 text-pink-500" />
                  </div>
                  <div className="text-xl font-bold text-foreground">{profile.follower_count}</div>
                  <div className="text-xs text-muted-foreground">Followers</div>
                </div>
              </div>
            </div>
          </Card>

          {/* Activities */}
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-foreground">Recent Activity</h2>
          </div>
          
          {activities.length === 0 ? (
            <Card>
              <div className="text-center py-12">
                <p className="text-muted-foreground text-sm">No activities yet.</p>
              </div>
            </Card>
          ) : (
            activities.map(activity => (
              <ActivityCard key={activity.id} activity={activity} />
            ))
          )}
        </div>
      </main>
    </>
  );
}
