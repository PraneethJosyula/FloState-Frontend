import { PostgrestError } from '@supabase/supabase-js';
import { api } from '../api/client';
import { Profile, ProfileWithStats, ProfileUpdate } from '../types/database';

/**
 * Fetches a user profile by username or ID.
 */
export async function fetchProfile(
  usernameOrId: string
): Promise<{ data: ProfileWithStats | null; error: PostgrestError | null }> {
  const { data, error } = await api.profiles.get(usernameOrId);
  
  if (error) {
    return { data: null, error: { message: error } as PostgrestError };
  }
  
  return { data, error: null };
}

/**
 * Updates the current user's profile.
 */
export async function updateProfile(
  updates: Partial<ProfileUpdate>
): Promise<{ data: Profile | null; error: PostgrestError | null }> {
  const { data, error } = await api.profiles.update(updates);
  
  if (error) {
    return { data: null, error: { message: error } as PostgrestError };
  }
  
  return { data, error: null };
}

/**
 * Follows a user.
 */
export async function followUser(
  userId: string
): Promise<{ error: PostgrestError | null }> {
  const { error } = await api.profiles.follow(userId);
  
  if (error) {
    return { error: { message: error } as PostgrestError };
  }
  
  return { error: null };
}

/**
 * Unfollows a user.
 */
export async function unfollowUser(
  userId: string
): Promise<{ error: PostgrestError | null }> {
  const { error } = await api.profiles.unfollow(userId);
  
  if (error) {
    return { error: { message: error } as PostgrestError };
  }
  
  return { error: null };
}

/**
 * Checks if current user follows a specific user.
 * Note: This is now returned as part of fetchProfile
 */
export async function checkFollowStatus(
  userId: string
): Promise<{ is_following: boolean; error: PostgrestError | null }> {
  // Get profile which includes is_following
  const { data, error } = await api.profiles.get(userId);
  
  if (error) {
    return { is_following: false, error: { message: error } as PostgrestError };
  }
  
  return { is_following: data?.is_following || false, error: null };
}

/**
 * Gets suggested users to follow (users not already followed).
 */
export async function getSuggestedUsers(
  limit: number = 5
): Promise<{ data: Profile[] | null; error: PostgrestError | null }> {
  const { data, error } = await api.profiles.getSuggested(limit);
  
  if (error) {
    return { data: null, error: { message: error } as PostgrestError };
  }
  
  return { data: data || [], error: null };
}

/**
 * Gets users that follow the specified user.
 */
export async function getFollowers(
  userId: string,
  options?: { limit?: number; offset?: number }
): Promise<{ data: Profile[] | null; error: PostgrestError | null }> {
  const { data, error } = await api.profiles.getFollowers(userId, options);
  
  if (error) {
    return { data: null, error: { message: error } as PostgrestError };
  }
  
  return { data: data || [], error: null };
}

/**
 * Gets users that the specified user follows.
 */
export async function getFollowing(
  userId: string,
  options?: { limit?: number; offset?: number }
): Promise<{ data: Profile[] | null; error: PostgrestError | null }> {
  const { data, error } = await api.profiles.getFollowing(userId, options);
  
  if (error) {
    return { data: null, error: { message: error } as PostgrestError };
  }
  
  return { data: data || [], error: null };
}

/**
 * Searches for users by username or full name.
 */
export async function searchUsers(
  query: string,
  limit: number = 10
): Promise<{ data: Profile[] | null; error: PostgrestError | null }> {
  const { data, error } = await api.profiles.search(query, limit);
  
  if (error) {
    return { data: null, error: { message: error } as PostgrestError };
  }
  
  return { data: data || [], error: null };
}
