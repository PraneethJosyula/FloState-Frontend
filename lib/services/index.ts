/**
 * Service Layer Exports
 * 
 * These services communicate with the Express backend API.
 * Import services from this file for cleaner imports:
 * import { signInWithEmail, fetchFeed, toggleLike } from '@/lib/services';
 */

// Auth Service
export {
  signInWithEmail,
  signUpWithEmail,
  signOut,
  getSession,
  getCurrentUser,
  onAuthStateChange,
  resetPassword,
  updatePassword,
} from './auth';

// Activity Service
export {
  createActivity,
  fetchFeed,
  fetchUserActivities,
  fetchActivityById,
  updateActivity,
  deleteActivity,
} from './activities';

// Profile Service
export {
  fetchProfile,
  updateProfile,
  followUser,
  unfollowUser,
  checkFollowStatus,
  getSuggestedUsers,
  getFollowers,
  getFollowing,
  searchUsers,
} from './profiles';

// Interaction Service
export {
  toggleLike,
  checkLikeStatus,
  getLikeCount,
  postComment,
  updateComment,
  deleteComment,
  fetchComments,
  incrementShareCount,
  getLikers,
} from './interactions';

// Storage Service
export {
  uploadEvidenceImage,
  deleteEvidenceImage,
  uploadAvatar,
  listUserFiles,
  compressImage,
} from './storage';

// API Client (for direct access if needed)
export { api, setSession, clearSession, getStoredSession } from '../api/client';
