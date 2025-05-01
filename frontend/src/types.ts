export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  createdAt?: string;
  updatedAt?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface ApiError {
  message: string;
  status?: number;
  errors?: Record<string, string[]>;
} 