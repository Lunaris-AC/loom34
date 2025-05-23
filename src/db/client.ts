import { createClient, RealtimePostgresChangesPayload } from '@supabase/supabase-js';
import type { Database } from '@/db/types';

// Configuration
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  throw new Error('Missing Supabase environment variables. Please check your .env.local file.');
}

// Create the Supabase client
export const db = createClient<Database>(SUPABASE_URL, SUPABASE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  },
  db: {
    schema: 'public'
  }
});

// Types
export type RetryError = Error & {
  attempt?: number;
  maxAttempts?: number;
};

// Simple retry utility with better error handling
export const withRetry = async <T>(
  operation: () => Promise<T>,
  maxAttempts: number = 3
): Promise<T> => {
  let lastError: RetryError | null = null;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as RetryError;
      lastError.attempt = attempt;
      lastError.maxAttempts = maxAttempts;

      if (attempt === maxAttempts) {
        throw lastError;
      }

      // Exponential backoff with jitter
      const delay = Math.min(1000 * Math.pow(2, attempt - 1) + Math.random() * 1000, 10000);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError || new Error('Max retry attempts reached');
};

// Real-time subscription helper with better typing
export type RealtimePayload<T> = {
  new: T | null;
  old: T | null;
  eventType: 'INSERT' | 'UPDATE' | 'DELETE';
};

export const subscribeToChanges = <T>(
  table: string,
  callback: (payload: RealtimePayload<T>) => void,
  filter?: string
): (() => void) => {
  const channel = db.channel(`${table}_changes`);
  
  channel
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: table,
        filter: filter
      },
      (payload: RealtimePostgresChangesPayload<T>) => {
        const typedPayload: RealtimePayload<T> = {
          new: payload.new as T | null,
          old: payload.old as T | null,
          eventType: payload.eventType
        };
        callback(typedPayload);
      }
    )
    .subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        console.log(`Subscribed to ${table} changes`);
      } else if (status === 'CHANNEL_ERROR') {
        console.error(`Error subscribing to ${table} changes`);
      }
    });

  return () => {
    channel.unsubscribe();
    console.log(`Unsubscribed from ${table} changes`);
  };
};

export default db; 