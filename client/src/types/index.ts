export interface User {
  id: string;
  username: string;
  email: string;
  role: 'user' | 'admin';
  is_active: boolean;
  createdAt: string;
}

export interface ClimateData {
  id: string;
  year: number;
  region: string
  avg_temp: number;
  co2_level: number;
  precipitation: number;
  createdAt: string;
  updatedAt: string;
}

export interface Region {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
}

export interface ClimateFilters {
  region?: string;
  startYear?: number;
  endYear?: number;
  dataType?: 'temperature' | 'co2' | 'precipitation';
}

export interface ChartData {
  x: number | string;
  y: number;
  label?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}