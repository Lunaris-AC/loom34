export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string | null
          full_name: string | null
          avatar_url: string | null
          is_admin: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          is_admin?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          is_admin?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      sessions: {
        Row: {
          id: string
          user_id: string
          created_at: string
          expires_at: string
          ip_address: string | null
          user_agent: string | null
        }
        Insert: {
          id?: string
          user_id: string
          created_at?: string
          expires_at: string
          ip_address?: string | null
          user_agent?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          created_at?: string
          expires_at?: string
          ip_address?: string | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      articles: {
        Row: {
          id: string
          title: string
          slug: string
          excerpt: string
          content: string
          image: string
          category: string
          date: string
          published: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          excerpt: string
          content: string
          image: string
          category: string
          date: string
          published?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          excerpt?: string
          content?: string
          image?: string
          category?: string
          date?: string
          published?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      events: {
        Row: {
          id: string
          title: string
          description: string
          date: string
          time: string
          location: string
          image: string
          published: boolean
          created_at: string
          updated_at: string
          slug: string
          registration_url: string | null
        }
        Insert: {
          id?: string
          title: string
          description: string
          date: string
          time: string
          location: string
          image: string
          published?: boolean
          created_at?: string
          updated_at?: string
          slug: string
          registration_url?: string | null
        }
        Update: {
          id?: string
          title?: string
          description?: string
          date?: string
          time?: string
          location?: string
          image?: string
          published?: boolean
          created_at?: string
          updated_at?: string
          slug?: string
          registration_url?: string | null
        }
        Relationships: []
      }
      gallery_albums: {
        Row: {
          id: string
          title: string
          description: string
          cover_image: string
          created_at: string
          updated_at: string
          date: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          cover_image: string
          created_at?: string
          updated_at?: string
          date: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          cover_image?: string
          created_at?: string
          updated_at?: string
          date?: string
        }
        Relationships: []
      }
      gallery_images: {
        Row: {
          id: string
          album_id: string
          image_url: string
          order: number
          created_at: string
          updated_at: string
          title: string | null
          description: string | null
        }
        Insert: {
          id?: string
          album_id: string
          image_url: string
          order?: number
          created_at?: string
          updated_at?: string
          title?: string | null
          description?: string | null
        }
        Update: {
          id?: string
          album_id?: string
          image_url?: string
          order?: number
          created_at?: string
          updated_at?: string
          title?: string | null
          description?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "gallery_images_album_id_fkey"
            columns: ["album_id"]
            isOneToOne: false
            referencedRelation: "gallery_albums"
            referencedColumns: ["id"]
          }
        ]
      }
      contact_tickets: {
        Row: {
          id: number
          name: string
          email: string
          subject: string
          message: string
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          name: string
          email: string
          subject: string
          message: string
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          name?: string
          email?: string
          subject?: string
          message?: string
          status?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
} 