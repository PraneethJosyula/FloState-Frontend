import { StorageError } from '@supabase/storage-js';
import { api } from '../api/client';

/**
 * Uploads an evidence image via the backend API.
 */
export async function uploadEvidenceImage(
  file: File,
  userId: string
): Promise<{ url: string | null; path: string | null; error: StorageError | null }> {
  // Validate file type
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    return {
      url: null,
      path: null,
      error: { message: 'Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.' } as StorageError,
    };
  }
  
  // Validate file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    return {
      url: null,
      path: null,
      error: { message: 'File too large. Maximum size is 5MB.' } as StorageError,
    };
  }
  
  const { data, error } = await api.storage.uploadEvidence(file);
  
  if (error || !data) {
    return {
      url: null,
      path: null,
      error: { message: error || 'Upload failed' } as StorageError,
    };
  }
  
  return {
    url: data.url,
    path: data.path,
    error: null,
  };
}

/**
 * Deletes an evidence image from storage.
 */
export async function deleteEvidenceImage(
  filePath: string
): Promise<{ error: StorageError | null }> {
  const { error } = await api.storage.deleteEvidence(filePath);
  
  if (error) {
    return { error: { message: error } as StorageError };
  }
  
  return { error: null };
}

/**
 * Uploads a user avatar via the backend API.
 */
export async function uploadAvatar(
  file: File,
  userId: string
): Promise<{ url: string | null; error: StorageError | null }> {
  // Validate file type
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    return {
      url: null,
      error: { message: 'Invalid file type for avatar' } as StorageError,
    };
  }
  
  // Validate file size (max 2MB)
  if (file.size > 2 * 1024 * 1024) {
    return {
      url: null,
      error: { message: 'Avatar must be less than 2MB' } as StorageError,
    };
  }
  
  const { data, error } = await api.storage.uploadAvatar(file);
  
  if (error || !data) {
    return {
      url: null,
      error: { message: error || 'Upload failed' } as StorageError,
    };
  }
  
  return { url: data.url, error: null };
}

/**
 * Lists files in a user's evidence folder.
 */
export async function listUserFiles(
  userId: string
): Promise<{ files: { name: string; size: number; created_at: string }[] | null; error: StorageError | null }> {
  const { data, error } = await api.storage.listFiles();
  
  if (error) {
    return { files: null, error: { message: error } as StorageError };
  }
  
  return { files: data || [], error: null };
}

/**
 * Compresses an image before upload (client-side).
 */
export async function compressImage(
  file: File,
  maxWidth: number = 1200,
  quality: number = 0.8
): Promise<File> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      const img = new Image();
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }
        
        ctx.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Could not compress image'));
              return;
            }
            
            const compressedFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now(),
            });
            
            resolve(compressedFile);
          },
          'image/jpeg',
          quality
        );
      };
      
      img.onerror = () => reject(new Error('Could not load image'));
      img.src = event.target?.result as string;
    };
    
    reader.onerror = () => reject(new Error('Could not read file'));
    reader.readAsDataURL(file);
  });
}

// Re-export for compatibility
export async function getSignedUrl(
  filePath: string,
  expiresIn: number = 3600
): Promise<{ url: string | null; error: StorageError | null }> {
  // Not implemented for backend API - use public URLs
  return { url: null, error: { message: 'Not implemented' } as StorageError };
}
