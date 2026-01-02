import { User, AuthError, Session } from '@supabase/supabase-js';
import { api, setSession, clearSession, getStoredSession } from '../api/client';
import { Profile } from '../types/database';

/**
 * Signs in a user with email and password.
 */
export async function signInWithEmail(
  email: string,
  password: string
): Promise<{ user: User | null; error: AuthError | null }> {
  const { data, error } = await api.auth.signIn(email, password);
  
  if (error || !data) {
    return {
      user: null,
      error: { message: error || 'Sign in failed' } as AuthError,
    };
  }
  
  // Store the session
  setSession(data.session);
  
  return {
    user: data.user as User,
    error: null,
  };
}

/**
 * Creates a new user account.
 */
export async function signUpWithEmail(
  email: string,
  password: string,
  metadata?: { username?: string; full_name?: string }
): Promise<{ user: User | null; error: AuthError | null }> {
  const { data, error } = await api.auth.signUp(email, password, metadata);
  
  if (error || !data) {
    return {
      user: null,
      error: { message: error || 'Sign up failed' } as AuthError,
    };
  }
  
  // Store the session
  if (data.session) {
    setSession(data.session);
  }
  
  return {
    user: data.user as User,
    error: null,
  };
}

/**
 * Signs out the current user.
 */
export async function signOut(): Promise<{ error: AuthError | null }> {
  await api.auth.signOut();
  clearSession();
  return { error: null };
}

/**
 * Gets the current user session.
 */
export async function getSession(): Promise<Session | null> {
  const stored = getStoredSession();
  if (!stored) return null;
  
  return {
    access_token: stored.access_token,
    refresh_token: stored.refresh_token,
    user: {} as any, // Will be populated by getCurrentUser
  } as Session;
}

/**
 * Gets the current authenticated user with profile data.
 */
export async function getCurrentUser(): Promise<{
  id: string;
  email: string;
  profile: Profile | null;
} | null> {
  const session = getStoredSession();
  if (!session) return null;
  
  const { data, error } = await api.auth.getMe();
  
  if (error || !data) {
    return null;
  }
  
  return {
    id: data.id,
    email: data.email,
    profile: data.profile,
  };
}

/**
 * Subscribes to auth state changes.
 * Returns an unsubscribe function.
 */
export function onAuthStateChange(
  callback: (event: string, session: Session | null) => void
) {
  // For backend auth, we check session on mount
  // This is a simplified version - real impl would use polling or websockets
  const checkSession = async () => {
    const session = getStoredSession();
    if (session) {
      const { data } = await api.auth.getMe();
      if (data) {
        callback('SIGNED_IN', { access_token: session.access_token } as Session);
      } else {
        clearSession();
        callback('SIGNED_OUT', null);
      }
    }
  };
  
  // Check on init
  checkSession();
  
  // Listen for storage events (for multi-tab support)
  const handleStorage = (e: StorageEvent) => {
    if (e.key === 'session') {
      if (e.newValue) {
        callback('SIGNED_IN', JSON.parse(e.newValue));
      } else {
        callback('SIGNED_OUT', null);
      }
    }
  };
  
  if (typeof window !== 'undefined') {
    window.addEventListener('storage', handleStorage);
  }
  
  return () => {
    if (typeof window !== 'undefined') {
      window.removeEventListener('storage', handleStorage);
    }
  };
}

/**
 * Sends a password reset email.
 */
export async function resetPassword(
  email: string
): Promise<{ error: AuthError | null }> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'}/auth/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  
  if (!response.ok) {
    const data = await response.json();
    return { error: { message: data.error } as AuthError };
  }
  
  return { error: null };
}

/**
 * Updates the user's password.
 */
export async function updatePassword(
  newPassword: string
): Promise<{ error: AuthError | null }> {
  // This would need a separate endpoint
  return { error: { message: 'Not implemented' } as AuthError };
}
