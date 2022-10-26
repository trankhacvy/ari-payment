export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      hackathon_orders: {
        Row: {
          id: string
          created_at: string | null
          payment_link_id: string | null
          merchant: string | null
          merchant_token_account: string | null
          customer: string | null
          customer_token_account: string | null
          amount: number | null
          quantity: number | null
          delivered: boolean | null
          cancelled: boolean | null
          refunded: boolean | null
          product_id: string | null
          display_amount: number | null
          customer_info: Json | null
        }
        Insert: {
          id: string
          created_at?: string | null
          payment_link_id?: string | null
          merchant?: string | null
          merchant_token_account?: string | null
          customer?: string | null
          customer_token_account?: string | null
          amount?: number | null
          quantity?: number | null
          delivered?: boolean | null
          cancelled?: boolean | null
          refunded?: boolean | null
          product_id?: string | null
          display_amount?: number | null
          customer_info?: Json | null
        }
        Update: {
          id?: string
          created_at?: string | null
          payment_link_id?: string | null
          merchant?: string | null
          merchant_token_account?: string | null
          customer?: string | null
          customer_token_account?: string | null
          amount?: number | null
          quantity?: number | null
          delivered?: boolean | null
          cancelled?: boolean | null
          refunded?: boolean | null
          product_id?: string | null
          display_amount?: number | null
          customer_info?: Json | null
        }
      }
      hackathon_payment_links: {
        Row: {
          id: string
          created_at: string | null
          merchant: string | null
          merchant_token_account: string | null
          phone_number_required: boolean | null
          shipping_address_required: boolean | null
          adjustable_quantity: boolean | null
          product_id: string | null
          currency: string | null
          currency_symbol: string | null
          currency_decimals: number | null
        }
        Insert: {
          id: string
          created_at?: string | null
          merchant?: string | null
          merchant_token_account?: string | null
          phone_number_required?: boolean | null
          shipping_address_required?: boolean | null
          adjustable_quantity?: boolean | null
          product_id?: string | null
          currency?: string | null
          currency_symbol?: string | null
          currency_decimals?: number | null
        }
        Update: {
          id?: string
          created_at?: string | null
          merchant?: string | null
          merchant_token_account?: string | null
          phone_number_required?: boolean | null
          shipping_address_required?: boolean | null
          adjustable_quantity?: boolean | null
          product_id?: string | null
          currency?: string | null
          currency_symbol?: string | null
          currency_decimals?: number | null
        }
      }
      hackathon_products: {
        Row: {
          id: string
          created_at: string | null
          name: string | null
          description: string | null
          merchant: string | null
          price: number | null
          stock: number | null
          images: string[] | null
          currency: string | null
          currency_symbol: string | null
          currency_decimals: number | null
          display_price: number | null
        }
        Insert: {
          id: string
          created_at?: string | null
          name?: string | null
          description?: string | null
          merchant?: string | null
          price?: number | null
          stock?: number | null
          images?: string[] | null
          currency?: string | null
          currency_symbol?: string | null
          currency_decimals?: number | null
          display_price?: number | null
        }
        Update: {
          id?: string
          created_at?: string | null
          name?: string | null
          description?: string | null
          merchant?: string | null
          price?: number | null
          stock?: number | null
          images?: string[] | null
          currency?: string | null
          currency_symbol?: string | null
          currency_decimals?: number | null
          display_price?: number | null
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
