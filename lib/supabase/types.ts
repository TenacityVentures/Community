export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type PostCategory =
  | 'building'
  | 'ideas'
  | 'stories'
  | 'opportunities'
  | 'challenges'

export type ReactionType =
  | 'fire'
  | 'lightbulb'
  | 'launch'
  | 'tenacity'
  | 'respect'

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          username: string
          full_name: string | null
          avatar_url: string | null
          bio: string | null
          website: string | null
          skills: string[] | null
          role: 'builder' | 'partner' | 'learner'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          username: string
          full_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          website?: string | null
          skills?: string[] | null
          role?: 'builder' | 'partner' | 'learner'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          username?: string
          full_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          website?: string | null
          skills?: string[] | null
          role?: 'builder' | 'partner' | 'learner'
          created_at?: string
          updated_at?: string
        }
      }
      posts: {
        Row: {
          id: string
          author_id: string
          title: string
          slug: string
          content: Json
          excerpt: string | null
          category: PostCategory
          tags: string[] | null
          featured: boolean
          published: boolean
          view_count: number
          comment_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          author_id: string
          title: string
          slug: string
          content: Json
          excerpt?: string | null
          category: PostCategory
          tags?: string[] | null
          featured?: boolean
          published?: boolean
          view_count?: number
          comment_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          author_id?: string
          title?: string
          slug?: string
          content?: Json
          excerpt?: string | null
          category?: PostCategory
          tags?: string[] | null
          featured?: boolean
          published?: boolean
          view_count?: number
          comment_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      comments: {
        Row: {
          id: string
          post_id: string
          author_id: string
          parent_id: string | null
          content: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          post_id: string
          author_id: string
          parent_id?: string | null
          content: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          post_id?: string
          author_id?: string
          parent_id?: string | null
          content?: string
          created_at?: string
          updated_at?: string
        }
      }
      reactions: {
        Row: {
          id: string
          user_id: string
          post_id: string | null
          comment_id: string | null
          type: ReactionType
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          post_id?: string | null
          comment_id?: string | null
          type: ReactionType
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          post_id?: string | null
          comment_id?: string | null
          type?: ReactionType
          created_at?: string
        }
      }
      follows: {
        Row: {
          id: string
          follower_id: string
          following_id: string
          created_at: string
        }
        Insert: {
          id?: string
          follower_id: string
          following_id: string
          created_at?: string
        }
        Update: {
          id?: string
          follower_id?: string
          following_id?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      post_category: PostCategory
      reaction_type: ReactionType
      user_role: 'builder' | 'partner' | 'learner'
    }
  }
}

// Helper types for easier usage
export type Profile = Database['public']['Tables']['profiles']['Row']
export type Post = Database['public']['Tables']['posts']['Row']
export type Comment = Database['public']['Tables']['comments']['Row']
export type Reaction = Database['public']['Tables']['reactions']['Row']
export type Follow = Database['public']['Tables']['follows']['Row']

// Extended types with relations
export type PostWithAuthor = Post & {
  author: Profile
}

export type CommentWithAuthor = Comment & {
  author: Profile
}

export type PostWithDetails = Post & {
  author: Profile
  comments: CommentWithAuthor[]
  reactions: Reaction[]
}
