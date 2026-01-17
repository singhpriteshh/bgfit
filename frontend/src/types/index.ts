export interface User {
  id: string;
  email: string;
  full_name: string;
  phone_number?: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  country?: string;
  profile_image_url?: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  image_url: string;
  back_image_url?: string;
  category: string;
  type: string;
  is_new_arrival: boolean;
  color: string;
}

export interface CartItem {
  id: string;
  user_id: string;
  product_id: string;
  quantity: number;
  size: string;
  color: string;
  product?: Product;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

export interface OrderItem {
  id: string;
  product_id: string;
  quantity: number;
  price: number;
  size: string;
  color: string;
  product?: Product;
}

export interface Order {
  id: string;
  total_amount: number;
  status: string;
  created_at: string;
  items: OrderItem[];
  shipping_full_name: string;
  shipping_address_line1: string;
  shipping_address_line2?: string;
  shipping_city: string;
  shipping_state: string;
  shipping_zip_code: string;
  shipping_country: string;
  shipping_phone: string;
}

export interface OrderResponse {
  id: string;
  entity: string;
  amount: number;
  currency: string;
  status: string;
  key_id: string;
}

export interface LoginRequest {
  username: string; // OAuth2PasswordRequestForm uses username
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  full_name: string;
}

export interface UserUpdate {
  full_name?: string;
  email?: string;
  password?: string;
  confirm_password?: string;
  phone_number?: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  country?: string;
  profile_image_url?: string;
}

export interface OrderState {
  orders: Order[];
  isLoading: boolean;
  error: string | null;
}
