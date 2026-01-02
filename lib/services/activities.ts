import { PostgrestError } from '@supabase/supabase-js';
import { api } from '../api/client';
import {
  Activity,
  ActivityWithProfile,
  ActivityDetail,
  CreateActivityInput,
  FeedOptions,
} from '../types/database';

/**
 * Creates a new activity/post.
 */
export async function createActivity(
  data: CreateActivityInput
): Promise<{ data: Activity | null; error: PostgrestError | null }> {
  const { data: result, error } = await api.activities.create(data);
  
  if (error) {
    return { data: null, error: { message: error } as PostgrestError };
  }
  
  return { data: result, error: null };
}

/**
 * Fetches activities for the feed (following + own + public).
 */
export async function fetchFeed(
  options?: FeedOptions
): Promise<{ data: ActivityWithProfile[] | null; error: PostgrestError | null }> {
  const { data, error } = await api.activities.getFeed(options);
  
  if (error) {
    return { data: null, error: { message: error } as PostgrestError };
  }
  
  return { data: data || [], error: null };
}

/**
 * Fetches activities for a specific user (for profile page).
 */
export async function fetchUserActivities(
  userId: string,
  options?: { limit?: number; offset?: number }
): Promise<{ data: Activity[] | null; error: PostgrestError | null }> {
  const { data, error } = await api.activities.getByUser(userId, options);
  
  if (error) {
    return { data: null, error: { message: error } as PostgrestError };
  }
  
  return { data: data || [], error: null };
}

/**
 * Fetches a single activity with full details (for activity detail page).
 */
export async function fetchActivityById(
  activityId: string
): Promise<{ data: ActivityDetail | null; error: PostgrestError | null }> {
  const { data, error } = await api.activities.getById(activityId);
  
  if (error) {
    return { data: null, error: { message: error } as PostgrestError };
  }
  
  return { data, error: null };
}

/**
 * Updates an existing activity (only own activities).
 */
export async function updateActivity(
  activityId: string,
  updates: Partial<CreateActivityInput>
): Promise<{ data: Activity | null; error: PostgrestError | null }> {
  const { data, error } = await api.activities.update(activityId, updates);
  
  if (error) {
    return { data: null, error: { message: error } as PostgrestError };
  }
  
  return { data, error: null };
}

/**
 * Deletes an activity (only own activities).
 */
export async function deleteActivity(
  activityId: string
): Promise<{ error: PostgrestError | null }> {
  const { error } = await api.activities.delete(activityId);
  
  if (error) {
    return { error: { message: error } as PostgrestError };
  }
  
  return { error: null };
}
