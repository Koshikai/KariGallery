export interface Database {
  public: {
    Tables: {
      artist_profile: {
        Row: {
          id: string
          name: string
          bio: string | null
          profile_image_url: string | null
          email: string | null
          phone: string | null
          studio_address: string | null
          website_url: string | null
          instagram_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          bio?: string | null
          profile_image_url?: string | null
          email?: string | null
          phone?: string | null
          studio_address?: string | null
          website_url?: string | null
          instagram_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          bio?: string | null
          profile_image_url?: string | null
          email?: string | null
          phone?: string | null
          studio_address?: string | null
          website_url?: string | null
          instagram_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      artworks: {
        Row: {
          id: string
          title: string
          slug: string
          description: string | null
          story: string | null
          price: number
          width: number | null
          height: number | null
          depth: number | null
          medium: string | null
          year_created: number | null
          category: string | null
          is_available: boolean
          is_featured: boolean
          display_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          description?: string | null
          story?: string | null
          price: number
          width?: number | null
          height?: number | null
          depth?: number | null
          medium?: string | null
          year_created?: number | null
          category?: string | null
          is_available?: boolean
          is_featured?: boolean
          display_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          description?: string | null
          story?: string | null
          price?: number
          width?: number | null
          height?: number | null
          depth?: number | null
          medium?: string | null
          year_created?: number | null
          category?: string | null
          is_available?: boolean
          is_featured?: boolean
          display_order?: number
          created_at?: string
          updated_at?: string
        }
      }
      artwork_images: {
        Row: {
          id: string
          artwork_id: string
          image_url: string
          alt_text: string | null
          is_primary: boolean
          display_order: number
          created_at: string
        }
        Insert: {
          id?: string
          artwork_id: string
          image_url: string
          alt_text?: string | null
          is_primary?: boolean
          display_order?: number
          created_at?: string
        }
        Update: {
          id?: string
          artwork_id?: string
          image_url?: string
          alt_text?: string | null
          is_primary?: boolean
          display_order?: number
          created_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          customer_name: string
          customer_email: string
          customer_phone: string | null
          shipping_address: Record<string, unknown>
          total_amount: number
          status: string
          stripe_session_id: string | null
          stripe_payment_intent_id: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          customer_name: string
          customer_email: string
          customer_phone?: string | null
          shipping_address: Record<string, unknown>
          total_amount: number
          status?: string
          stripe_session_id?: string | null
          stripe_payment_intent_id?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          customer_name?: string
          customer_email?: string
          customer_phone?: string | null
          shipping_address?: Record<string, unknown>
          total_amount?: number
          status?: string
          stripe_session_id?: string | null
          stripe_payment_intent_id?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          artwork_id: string
          quantity: number
          unit_price: number
          total_price: number
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          artwork_id: string
          quantity?: number
          unit_price: number
          total_price: number
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          artwork_id?: string
          quantity?: number
          unit_price?: number
          total_price?: number
          created_at?: string
        }
      }
      page_contents: {
        Row: {
          id: string
          page_key: string
          title: string | null
          content: string | null
          meta_description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          page_key: string
          title?: string | null
          content?: string | null
          meta_description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          page_key?: string
          title?: string | null
          content?: string | null
          meta_description?: string | null
          created_at?: string
          updated_at?: string
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
      [_ in never]: never
    }
  }
}

// 便利なtype aliases
export type ArtistProfile = Database['public']['Tables']['artist_profile']['Row']
export type Artwork = Database['public']['Tables']['artworks']['Row']
export type ArtworkImage = Database['public']['Tables']['artwork_images']['Row']
export type Order = Database['public']['Tables']['orders']['Row']
export type OrderItem = Database['public']['Tables']['order_items']['Row']
export type PageContent = Database['public']['Tables']['page_contents']['Row']

// 作品に画像を含む型
export type ArtworkWithImages = Artwork & {
  artwork_images: ArtworkImage[]
} 