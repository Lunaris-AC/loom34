import { db, withRetry } from './client';
import { v4 as uuidv4 } from 'uuid';

// Session interface
export interface Session {
  id: string;
  userId: string;
  createdAt: Date;
  expiresAt: Date;
  ipAddress?: string;
  userAgent?: string;
}

/**
 * Creates a new session for a user
 */
export const createSession = async (
  userId: string,
  ipAddress?: string, 
  userAgent?: string
): Promise<Session | null> => {
  try {
    // Create expiration date (24 hours from now)
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);
    
    const sessionId = uuidv4();
    const now = new Date();
    
    // Insert session into database
    const { error } = await withRetry(async () => {
      return db.from('sessions').insert({
        id: sessionId,
        user_id: userId,
        created_at: now.toISOString(),
        expires_at: expiresAt.toISOString(),
        ip_address: ipAddress || null,
        user_agent: userAgent || null
      });
    });
    
    if (error) {
      console.error('Failed to create session:', error);
      return null;
    }
    
    return {
      id: sessionId,
      userId,
      createdAt: now,
      expiresAt,
      ipAddress,
      userAgent
    };
  } catch (error) {
    console.error('Session creation error:', error);
    return null;
  }
};

/**
 * Gets a session by ID
 */
export const getSession = async (sessionId: string): Promise<Session | null> => {
  try {
    const { data, error } = await withRetry(async () => {
      return db
        .from('sessions')
        .select('*')
        .eq('id', sessionId)
        .single();
    });
    
    if (error || !data) {
      console.error('Failed to get session:', error);
      return null;
    }
    
    return {
      id: data.id,
      userId: data.user_id,
      createdAt: new Date(data.created_at),
      expiresAt: new Date(data.expires_at),
      ipAddress: data.ip_address || undefined,
      userAgent: data.user_agent || undefined
    };
  } catch (error) {
    console.error('Session retrieval error:', error);
    return null;
  }
};

/**
 * Deletes a session by ID
 */
export const deleteSession = async (sessionId: string): Promise<boolean> => {
  try {
    const { error } = await withRetry(async () => {
      return db
        .from('sessions')
        .delete()
        .eq('id', sessionId);
    });
    
    if (error) {
      console.error('Failed to delete session:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Session deletion error:', error);
    return false;
  }
};

/**
 * Deletes all sessions for a user
 */
export const deleteUserSessions = async (userId: string): Promise<boolean> => {
  try {
    const { error } = await withRetry(async () => {
      return db
        .from('sessions')
        .delete()
        .eq('user_id', userId);
    });
    
    if (error) {
      console.error('Failed to delete user sessions:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('User sessions deletion error:', error);
    return false;
  }
};

/**
 * Cleans up expired sessions
 */
export const cleanupExpiredSessions = async (): Promise<boolean> => {
  try {
    const now = new Date().toISOString();
    
    const { error } = await withRetry(async () => {
      return db
        .from('sessions')
        .delete()
        .lt('expires_at', now);
    });
    
    if (error) {
      console.error('Failed to clean up expired sessions:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Session cleanup error:', error);
    return false;
  }
}; 