import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/db/types';

// Environment variables (in a real app, these would be in .env)
const SUPABASE_URL = "https://gojxbfefcqjrrrzjdtfu.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdvanhiZmVmY3FqcnJyempkdGZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI4OTIyMjMsImV4cCI6MjA1ODQ2ODIyM30.i1IHA4LZB7r80VN0pZVvT7BNtHuXUqBu_Wy0nkXeqB4";

// Create the Supabase client
export const db = createClient<Database>(SUPABASE_URL, SUPABASE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});

// Health check function
export const isDbConnected = async (): Promise<boolean> => {
  try {
    const { error } = await db.from('profiles').select('count').limit(1);
    return !error;
  } catch (error) {
    console.error('Database connection error:', error);
    return false;
  }
};

// Retry operation utility
export const withRetry = async <T>(
  operation: () => Promise<T>,
  maxAttempts: number = 3
): Promise<T> => {
  let lastError: any;
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      console.warn(`Attempt ${attempt}/${maxAttempts} failed:`, error);
      
      if (attempt < maxAttempts) {
        // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
      }
    }
  }
  
  throw lastError;
}; 