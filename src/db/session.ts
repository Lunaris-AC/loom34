import { db, withRetry, subscribeToChanges } from './client';
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

// Define change event type
type ChangeEvent<T> = {
  new: T;
  old: T;
  eventType: 'INSERT' | 'UPDATE' | 'DELETE';
};

/**
 * Create a new session
 */
export const createSession = async (
  userId: string,
  ipAddress?: string,
  userAgent?: string
): Promise<Session | null> => {
  try {
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days

    const { data, error } = await withRetry(async () => {
      return db
        .from('sessions')
        .insert({
          id: uuidv4(),
          user_id: userId,
          created_at: now.toISOString(),
          expires_at: expiresAt.toISOString(),
          ip_address: ipAddress,
          user_agent: userAgent
        })
        .select()
        .single();
    });

    if (error || !data) {
      console.error('Failed to create session:', error);
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
    console.error('Session creation error:', error);
    return null;
  }
};

/**
 * Get session by ID
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
 * Delete session
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
 * Clean expired sessions
 */
export const cleanExpiredSessions = async (): Promise<number> => {
  try {
    const now = new Date().toISOString();
    
    const { count, error } = await withRetry(async () => {
      return db
        .from('sessions')
        .delete()
        .lt('expires_at', now)
        .select('count');
    });

    if (error) {
      console.error('Failed to clean expired sessions:', error);
      return 0;
    }

    return count || 0;
  } catch (error) {
    console.error('Session cleanup error:', error);
    return 0;
  }
};

/**
 * Subscribe to session changes
 */
export const subscribeToSession = (
  sessionId: string,
  callback: (session: Session | null) => void
): (() => void) => {
  const channel = db.channel(`session_${sessionId}`);
  
  channel
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'sessions',
        filter: `id=eq.${sessionId}`
      },
      async (payload: any) => {
        if (payload.eventType === 'DELETE') {
          callback(null);
        } else if (payload.new) {
          callback({
            id: payload.new.id,
            userId: payload.new.user_id,
            createdAt: new Date(payload.new.created_at),
            expiresAt: new Date(payload.new.expires_at),
            ipAddress: payload.new.ip_address || undefined,
            userAgent: payload.new.user_agent || undefined
          });
        }
      }
    )
    .subscribe();

  return () => {
    channel.unsubscribe();
  };
}; 