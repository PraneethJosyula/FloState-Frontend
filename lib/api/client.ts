/**
 * API Client for communicating with the Express backend
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

interface Session {
  access_token: string;
  refresh_token: string;
  expires_at?: number;
}

// Session storage
let currentSession: Session | null = null;

/**
 * Get the stored session
 */
export function getStoredSession(): Session | null {
  if (typeof window === 'undefined') return null;
  
  if (currentSession) return currentSession;
  
  const stored = localStorage.getItem('session');
  if (stored) {
    try {
      currentSession = JSON.parse(stored);
      return currentSession;
    } catch {
      return null;
    }
  }
  return null;
}

/**
 * Store session
 */
export function setSession(session: Session | null): void {
  currentSession = session;
  if (typeof window !== 'undefined') {
    if (session) {
      localStorage.setItem('session', JSON.stringify(session));
    } else {
      localStorage.removeItem('session');
    }
  }
}

/**
 * Clear session
 */
export function clearSession(): void {
  currentSession = null;
  if (typeof window !== 'undefined') {
    localStorage.removeItem('session');
  }
}

/**
 * Make an API request
 */
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const session = getStoredSession();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  if (session?.access_token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${session.access_token}`;
  }
  
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      // Handle token expiration
      if (response.status === 401 && session?.refresh_token) {
        const refreshed = await refreshToken(session.refresh_token);
        if (refreshed) {
          // Retry the request with new token
          return apiRequest<T>(endpoint, options);
        }
      }
      
      return { error: data.error || 'Request failed' };
    }
    
    return { data: data.data ?? data };
  } catch (error) {
    console.error('API request error:', error);
    return { error: 'Network error' };
  }
}

/**
 * Refresh the access token
 */
async function refreshToken(refresh_token: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token }),
    });
    
    if (!response.ok) {
      clearSession();
      return false;
    }
    
    const data = await response.json();
    if (data.session) {
      setSession(data.session);
      return true;
    }
    
    return false;
  } catch {
    clearSession();
    return false;
  }
}

// ============================================================================
// API Methods
// ============================================================================

export const api = {
  // Auth
  auth: {
    signUp: (email: string, password: string, metadata?: { username?: string; full_name?: string }) =>
      apiRequest<{ user: any; session: Session }>('/auth/signup', {
        method: 'POST',
        body: JSON.stringify({ email, password, ...metadata }),
      }),
    
    signIn: (email: string, password: string) =>
      apiRequest<{ user: any; session: Session }>('/auth/signin', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }),
    
    signOut: () =>
      apiRequest<{ success: boolean }>('/auth/signout', { method: 'POST' }),
    
    getMe: () =>
      apiRequest<{ id: string; email: string; profile: any }>('/auth/me'),
  },
  
  // Activities
  activities: {
    create: (data: {
      category: string;
      duration_minutes: number;
      note?: string;
      evidence_url?: string;
      focus_level?: number;
      visibility?: 'public' | 'private';
    }) =>
      apiRequest<any>('/activities', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    
    getFeed: (options?: { page?: number; limit?: number; filter?: 'following' | 'global' }) => {
      const params = new URLSearchParams();
      if (options?.page) params.set('page', String(options.page));
      if (options?.limit) params.set('limit', String(options.limit));
      if (options?.filter) params.set('filter', options.filter);
      return apiRequest<any[]>(`/activities/feed?${params}`);
    },
    
    getByUser: (userId: string, options?: { limit?: number; offset?: number }) => {
      const params = new URLSearchParams();
      if (options?.limit) params.set('limit', String(options.limit));
      if (options?.offset) params.set('offset', String(options.offset));
      return apiRequest<any[]>(`/activities/user/${userId}?${params}`);
    },
    
    getById: (id: string) =>
      apiRequest<any>(`/activities/${id}`),
    
    update: (id: string, data: Partial<{
      category: string;
      duration_minutes: number;
      note: string;
      evidence_url: string;
      focus_level: number;
      visibility: 'public' | 'private';
    }>) =>
      apiRequest<any>(`/activities/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
    
    delete: (id: string) =>
      apiRequest<{ success: boolean }>(`/activities/${id}`, { method: 'DELETE' }),
  },
  
  // Profiles
  profiles: {
    get: (usernameOrId: string) =>
      apiRequest<any>(`/profiles/${usernameOrId}`),
    
    update: (data: Partial<{
      username: string;
      full_name: string;
      bio: string;
      avatar_url: string;
      theme_preference: 'light' | 'dark' | 'system';
    }>) =>
      apiRequest<any>('/profiles/me', {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
    
    follow: (userId: string) =>
      apiRequest<{ success: boolean }>(`/profiles/${userId}/follow`, { method: 'POST' }),
    
    unfollow: (userId: string) =>
      apiRequest<{ success: boolean }>(`/profiles/${userId}/follow`, { method: 'DELETE' }),
    
    getFollowers: (userId: string, options?: { limit?: number; offset?: number }) => {
      const params = new URLSearchParams();
      if (options?.limit) params.set('limit', String(options.limit));
      if (options?.offset) params.set('offset', String(options.offset));
      return apiRequest<any[]>(`/profiles/${userId}/followers?${params}`);
    },
    
    getFollowing: (userId: string, options?: { limit?: number; offset?: number }) => {
      const params = new URLSearchParams();
      if (options?.limit) params.set('limit', String(options.limit));
      if (options?.offset) params.set('offset', String(options.offset));
      return apiRequest<any[]>(`/profiles/${userId}/following?${params}`);
    },
    
    getSuggested: (limit?: number) =>
      apiRequest<any[]>(`/profiles/suggested/list?limit=${limit || 5}`),
    
    search: (query: string, limit?: number) =>
      apiRequest<any[]>(`/profiles/search/query?q=${encodeURIComponent(query)}&limit=${limit || 10}`),
  },
  
  // Interactions
  interactions: {
    toggleLike: (activityId: string) =>
      apiRequest<{ liked: boolean }>(`/interactions/activities/${activityId}/like`, { method: 'POST' }),
    
    getLikers: (activityId: string, options?: { limit?: number; offset?: number }) => {
      const params = new URLSearchParams();
      if (options?.limit) params.set('limit', String(options.limit));
      if (options?.offset) params.set('offset', String(options.offset));
      return apiRequest<any[]>(`/interactions/activities/${activityId}/likes?${params}`);
    },
    
    postComment: (activityId: string, text: string) =>
      apiRequest<any>(`/interactions/activities/${activityId}/comments`, {
        method: 'POST',
        body: JSON.stringify({ text }),
      }),
    
    getComments: (activityId: string, options?: { limit?: number; offset?: number }) => {
      const params = new URLSearchParams();
      if (options?.limit) params.set('limit', String(options.limit));
      if (options?.offset) params.set('offset', String(options.offset));
      return apiRequest<any[]>(`/interactions/activities/${activityId}/comments?${params}`);
    },
    
    updateComment: (commentId: string, text: string) =>
      apiRequest<any>(`/interactions/comments/${commentId}`, {
        method: 'PATCH',
        body: JSON.stringify({ text }),
      }),
    
    deleteComment: (commentId: string) =>
      apiRequest<{ success: boolean }>(`/interactions/comments/${commentId}`, { method: 'DELETE' }),
    
    incrementShare: (activityId: string) =>
      apiRequest<{ success: boolean; share_count: number }>(`/interactions/activities/${activityId}/share`, { method: 'POST' }),
  },
  
  // Storage
  storage: {
    uploadEvidence: async (file: File): Promise<ApiResponse<{ url: string; path: string }>> => {
      const session = getStoredSession();
      const formData = new FormData();
      formData.append('file', file);
      
      try {
        const response = await fetch(`${API_BASE_URL}/storage/evidence`, {
          method: 'POST',
          headers: session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {},
          body: formData,
        });
        
        const data = await response.json();
        if (!response.ok) {
          return { error: data.error || 'Upload failed' };
        }
        return { data };
      } catch (error) {
        return { error: 'Upload failed' };
      }
    },
    
    uploadAvatar: async (file: File): Promise<ApiResponse<{ url: string }>> => {
      const session = getStoredSession();
      const formData = new FormData();
      formData.append('file', file);
      
      try {
        const response = await fetch(`${API_BASE_URL}/storage/avatar`, {
          method: 'POST',
          headers: session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {},
          body: formData,
        });
        
        const data = await response.json();
        if (!response.ok) {
          return { error: data.error || 'Upload failed' };
        }
        return { data };
      } catch (error) {
        return { error: 'Upload failed' };
      }
    },
    
    deleteEvidence: (path: string) =>
      apiRequest<{ success: boolean }>(`/storage/evidence/${path}`, { method: 'DELETE' }),
    
    listFiles: () =>
      apiRequest<any[]>('/storage/files'),
  },
};

export default api;

