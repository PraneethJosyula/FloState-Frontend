import { PostgrestError } from '@supabase/supabase-js';
import { api } from '../api/client';
import { Comment, CommentWithProfile } from '../types/database';

/**
 * Toggles like on an activity (like if not liked, unlike if liked).
 */
export async function toggleLike(
  activityId: string
): Promise<{ liked: boolean; error: PostgrestError | null }> {
  const { data, error } = await api.interactions.toggleLike(activityId);
  
  if (error) {
    return { liked: false, error: { message: error } as PostgrestError };
  }
  
  return { liked: data?.liked || false, error: null };
}

/**
 * Checks if the current user has liked an activity.
 * Note: This is now returned as part of activity fetch
 */
export async function checkLikeStatus(
  activityId: string
): Promise<{ liked: boolean; error: PostgrestError | null }> {
  const { data, error } = await api.activities.getById(activityId);
  
  if (error) {
    return { liked: false, error: { message: error } as PostgrestError };
  }
  
  return { liked: data?.is_liked || false, error: null };
}

/**
 * Gets the like count for an activity.
 * Note: This is now returned as part of activity fetch
 */
export async function getLikeCount(
  activityId: string
): Promise<{ count: number; error: PostgrestError | null }> {
  const { data, error } = await api.activities.getById(activityId);
  
  if (error) {
    return { count: 0, error: { message: error } as PostgrestError };
  }
  
  return { count: data?.like_count || 0, error: null };
}

/**
 * Posts a comment on an activity.
 */
export async function postComment(
  activityId: string,
  text: string
): Promise<{ data: Comment | null; error: PostgrestError | null }> {
  const { data, error } = await api.interactions.postComment(activityId, text);
  
  if (error) {
    return { data: null, error: { message: error } as PostgrestError };
  }
  
  return { data, error: null };
}

/**
 * Updates a comment (only own comments).
 */
export async function updateComment(
  commentId: string,
  text: string
): Promise<{ data: Comment | null; error: PostgrestError | null }> {
  const { data, error } = await api.interactions.updateComment(commentId, text);
  
  if (error) {
    return { data: null, error: { message: error } as PostgrestError };
  }
  
  return { data, error: null };
}

/**
 * Deletes a comment (only own comments).
 */
export async function deleteComment(
  commentId: string
): Promise<{ error: PostgrestError | null }> {
  const { error } = await api.interactions.deleteComment(commentId);
  
  if (error) {
    return { error: { message: error } as PostgrestError };
  }
  
  return { error: null };
}

/**
 * Fetches comments for an activity.
 */
export async function fetchComments(
  activityId: string,
  options?: { limit?: number; offset?: number }
): Promise<{ data: CommentWithProfile[] | null; error: PostgrestError | null }> {
  const { data, error } = await api.interactions.getComments(activityId, options);
  
  if (error) {
    return { data: null, error: { message: error } as PostgrestError };
  }
  
  return { data: data || [], error: null };
}

/**
 * Increments the share count for an activity (called when user shares).
 */
export async function incrementShareCount(
  activityId: string
): Promise<{ error: PostgrestError | null }> {
  const { error } = await api.interactions.incrementShare(activityId);
  
  if (error) {
    return { error: { message: error } as PostgrestError };
  }
  
  return { error: null };
}

/**
 * Gets users who liked an activity.
 */
export async function getLikers(
  activityId: string,
  options?: { limit?: number; offset?: number }
): Promise<{ data: { username: string; full_name: string | null; avatar_url: string | null }[] | null; error: PostgrestError | null }> {
  const { data, error } = await api.interactions.getLikers(activityId, options);
  
  if (error) {
    return { data: null, error: { message: error } as PostgrestError };
  }
  
  return { data: data || [], error: null };
}
