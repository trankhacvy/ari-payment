export interface Product {
  id: string;
  created_at: string;
  name: string;
  description: string;
  currency: string;
  currency_symbol: string;
  currency_decimals: number;
  merchant: string;
  price: number;
  display_price: number;
  stock: number;
  images: string[];
}

export interface PaymentLink {
  id: string;
  created_at: string;
  product_id: string;
  merchant: string;
  merchant_token_account: string;
  currency: string;
  currency_symbol: string;
  currency_decimals: number;
  phone_number_required: boolean;
  shipping_address_required: boolean;
  adjustable_quantity: boolean;
  hackathon_products: Product;
}

export interface Order {
  id: string;
  created_at: string;
  product_id: string;
  payment_link_id: string;
  merchant: string;
  merchant_token_account: string;
  customer: string;
  customer_token_account: string;
  amount: number
  display_amount: number
  quantity: number
  delivered: boolean
  cancelled: boolean
  refunded: boolean
  hackathon_payment_links: PaymentLink
  customer_info: {
    email: string
    name?: string,
    phone_number?: string
    state?: string
    city?: string
    address?: string
  }
}