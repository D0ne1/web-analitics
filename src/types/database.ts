export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      dishes: {
        Row: {
          id: string
          name: string
          category: string
          price: number
          is_available: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          category: string
          price: number
          is_available?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          category?: string
          price?: number
          is_available?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      waiters: {
        Row: {
          id: string
          name: string
          phone: string
          hired_at: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          phone: string
          hired_at: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          phone?: string
          hired_at?: string
          created_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          table_number: number
          waiter_id: string
          total_amount: number
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          table_number: number
          waiter_id: string
          total_amount: number
          status?: string
          created_at?: string
        }
        Update: {
          id?: string
          table_number?: number
          waiter_id?: string
          total_amount?: number
          status?: string
          created_at?: string
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          dish_id: string
          quantity: number
          price: number
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          dish_id: string
          quantity: number
          price: number
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          dish_id?: string
          quantity?: number
          price?: number
          created_at?: string
        }
      }
      uploads: {
        Row: {
          id: string
          file_name: string
          file_path: string
          user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          file_name: string
          file_path: string
          user_id: string
          created_at?: string
        }
        Update: {
          id?: string
          file_name?: string
          file_path?: string
          user_id?: string
          created_at?: string
        }
      }
    }
  }
}