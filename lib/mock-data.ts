import { Profile, Activity, Comment, ActivityWithProfile, ProfileWithStats } from './types/database';

// Mock Users/Profiles
export const mockProfiles: Profile[] = [
  {
    id: '1',
    username: 'alexchen',
    full_name: 'Alex Chen',
    avatar_url: null,
    bio: 'Productivity enthusiast | Building FocusFlow',
    theme_preference: 'system',
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
    username: 'sarahkim',
    full_name: 'Sarah Kim',
    avatar_url: null,
    bio: 'Deep work advocate | Writer',
    theme_preference: 'system',
    created_at: '2024-01-10T10:00:00Z',
    updated_at: '2024-01-10T10:00:00Z',
  },
  {
    id: '3',
    username: 'mikejohnson',
    full_name: 'Mike Johnson',
    avatar_url: null,
    bio: 'Software engineer | Focus on what matters',
    theme_preference: 'system',
    created_at: '2024-01-05T10:00:00Z',
    updated_at: '2024-01-05T10:00:00Z',
  },
  {
    id: '4',
    username: 'emilydavis',
    full_name: 'Emily Davis',
    avatar_url: null,
    bio: 'Designer | Creating beautiful things',
    theme_preference: 'system',
    created_at: '2024-01-01T10:00:00Z',
    updated_at: '2024-01-01T10:00:00Z',
  },
];

// Mock Activities
export const mockActivities: Activity[] = [
  {
    id: 'a1',
    user_id: '1',
    category: 'Deep Work',
    duration_minutes: 120,
    note: 'Finished the authentication system and started on the feed component. Feeling super focused today!',
    evidence_url: null,
    focus_level: 9,
    visibility: 'public',
    share_count: 5,
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'a2',
    user_id: '2',
    category: 'Reading',
    duration_minutes: 90,
    note: 'Read "Deep Work" by Cal Newport. Amazing insights on focused work.',
    evidence_url: null,
    focus_level: 8,
    visibility: 'public',
    share_count: 12,
    created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'a3',
    user_id: '3',
    category: 'Coding',
    duration_minutes: 180,
    note: 'Built the entire backend API. No distractions, pure flow state.',
    evidence_url: null,
    focus_level: 10,
    visibility: 'public',
    share_count: 8,
    created_at: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'a4',
    user_id: '4',
    category: 'Design',
    duration_minutes: 150,
    note: 'Designed the new UI components. Love the ivory and purple color scheme!',
    evidence_url: null,
    focus_level: 9,
    visibility: 'public',
    share_count: 15,
    created_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'a5',
    user_id: '1',
    category: 'Writing',
    duration_minutes: 60,
    note: 'Wrote 2000 words on productivity tips. The Pomodoro technique really works!',
    evidence_url: null,
    focus_level: 7,
    visibility: 'public',
    share_count: 3,
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
];

// Mock Comments
export const mockComments: Comment[] = [
  {
    id: 'c1',
    activity_id: 'a1',
    user_id: '2',
    text: 'Great work! Keep it up!',
    created_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'c2',
    activity_id: 'a1',
    user_id: '3',
    text: 'Impressive focus level! How do you maintain it?',
    created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
  },
];

// Mock Likes (activity_id -> user_ids who liked)
export const mockLikes: Record<string, string[]> = {
  'a1': ['2', '3', '4'],
  'a2': ['1', '3'],
  'a3': ['1', '2', '4'],
  'a4': ['1', '2', '3'],
  'a5': ['2'],
};

// Current user (for mock)
export const mockCurrentUser = {
  id: '1',
  email: 'alex@example.com',
  profile: mockProfiles[0],
};

// Helper function to create ActivityWithProfile
export function createActivityWithProfile(activity: Activity, currentUserId?: string): ActivityWithProfile {
  const profile = mockProfiles.find(p => p.id === activity.user_id)!;
  const likes = mockLikes[activity.id] || [];
  
  return {
    ...activity,
    profile: {
      username: profile.username,
      full_name: profile.full_name,
      avatar_url: profile.avatar_url,
    },
    like_count: likes.length,
    comment_count: mockComments.filter(c => c.activity_id === activity.id).length,
    is_liked: currentUserId ? likes.includes(currentUserId) : false,
  };
}

// Helper function to get profile with stats
export function getProfileWithStats(profileId: string): ProfileWithStats {
  const profile = mockProfiles.find(p => p.id === profileId)!;
  const userActivities = mockActivities.filter(a => a.user_id === profileId);
  const totalMinutes = userActivities.reduce((sum, a) => sum + a.duration_minutes, 0);
  
  return {
    ...profile,
    stats: {
      total_sessions: userActivities.length,
      total_hours: Math.round(totalMinutes / 60 * 10) / 10,
      current_streak: 7,
    },
    follower_count: 42,
    following_count: 18,
  };
}

