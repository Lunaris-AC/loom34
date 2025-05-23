import { db, withRetry, subscribeToChanges } from './client';
import { Profile } from '@/contexts/AuthContext';
import { User } from '@supabase/supabase-js';

// Define change event type
type ChangeEvent<T> = {
  new: T;
  old: T;
  eventType: 'INSERT' | 'UPDATE' | 'DELETE';
};

/**
 * Get user profile by ID
 */
export const getUserProfile = async (userId: string): Promise<Profile | null> => {
  try {
    const { data, error } = await withRetry(async () => {
      return db
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
    });
    
    if (error || !data) {
      console.error('Failed to fetch user profile:', error);
      return null;
    }
    
    return data as Profile;
  } catch (error) {
    console.error('User profile retrieval error:', error);
    return null;
  }
};

/**
 * Create user profile
 */
export const createUserProfile = async (
  userId: string, 
  profile: Partial<Profile>
): Promise<Profile | null> => {
  try {
    const now = new Date().toISOString();
    
    const { data, error } = await withRetry(async () => {
      return db
        .from('profiles')
        .insert({
          id: userId,
          username: profile.username || null,
          full_name: profile.full_name || null,
          avatar_url: profile.avatar_url || null,
          is_admin: profile.is_admin || false,
          created_at: now,
          updated_at: now
        })
        .select()
        .single();
    });
    
    if (error || !data) {
      console.error('Failed to create user profile:', error);
      return null;
    }
    
    return data as Profile;
  } catch (error) {
    console.error('User profile creation error:', error);
    return null;
  }
};

/**
 * Update user profile
 */
export const updateUserProfile = async (
  userId: string,
  updates: Partial<Profile>
): Promise<Profile | null> => {
  try {
    const { data, error } = await withRetry(async () => {
      return db
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();
    });
    
    if (error || !data) {
      console.error('Failed to update user profile:', error);
      return null;
    }
    
    return data as Profile;
  } catch (error) {
    console.error('User profile update error:', error);
    return null;
  }
};

/**
 * Create or update admin status
 * This function is separated since it requires special permissions
 */
export const setUserAdminStatus = async (
  userId: string, 
  isAdmin: boolean
): Promise<boolean> => {
  try {
    const { error } = await withRetry(async () => {
      return db
        .from('profiles')
        .update({ is_admin: isAdmin })
        .eq('id', userId);
    });
    
    if (error) {
      console.error('Failed to update admin status:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Admin status update error:', error);
    return false;
  }
};

/**
 * Delete user account
 * This will remove auth data and profile 
 */
export const deleteUserAccount = async (userId: string): Promise<boolean> => {
  try {
    // Delete user profile first
    const { error: profileError } = await withRetry(async () => {
      return db
        .from('profiles')
        .delete()
        .eq('id', userId);
    });
    
    if (profileError) {
      console.error('Failed to delete user profile:', profileError);
      return false;
    }
    
    // Delete auth data
    const { error: authError } = await db.auth.admin.deleteUser(userId);
    
    if (authError) {
      console.error('Failed to delete user auth data:', authError);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('User account deletion error:', error);
    return false;
  }
};

/**
 * Subscribe to user profile changes
 */
export const subscribeToUserProfile = (
  userId: string,
  callback: (profile: Profile) => void
): (() => void) => {
  return subscribeToChanges<Profile>(
    'profiles',
    (payload) => {
      if (payload.new && payload.new.id === userId) {
        callback(payload.new);
      }
    },
    `id=eq.${userId}`
  );
};

/**
 * List users with pagination
 */
export const listUsers = async (
  page: number = 1, 
  pageSize: number = 10
): Promise<{ users: Profile[], total: number }> => {
  try {
    // Calculate offset
    const offset = (page - 1) * pageSize;
    
    // Get total count
    const { count, error: countError } = await withRetry(async () => {
      return db
        .from('profiles')
        .select('*', { count: 'exact', head: true });
    });
    
    if (countError) {
      console.error('Failed to count users:', countError);
      return { users: [], total: 0 };
    }
    
    // Get paginated users
    const { data, error } = await withRetry(async () => {
      return db
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })
        .range(offset, offset + pageSize - 1);
    });
    
    if (error || !data) {
      console.error('Failed to list users:', error);
      return { users: [], total: 0 };
    }
    
    return { 
      users: data as Profile[], 
      total: count || 0 
    };
  } catch (error) {
    console.error('User listing error:', error);
    return { users: [], total: 0 };
  }
};

/**
 * Subscribe to user list changes
 */
export const subscribeToUserList = (
  callback: (users: Profile[]) => void
): (() => void) => {
  return subscribeToChanges<ChangeEvent<Profile>>(
    'profiles',
    async () => {
      const { users } = await listUsers();
      callback(users);
    }
  );
}; 