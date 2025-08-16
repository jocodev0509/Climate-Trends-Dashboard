import axios from 'axios';
import type {
  ApiResponse,
  LoginRequest,
  RegisterRequest,
  User,
  ClimateData,
  Region,
  ClimateFilters
} from '../types';

// Mock API base URL - in production this would be your backend URL
const API_BASE_URL = 'http://localhost:3001/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth-storage');
  if (token) {
    try {
      const parsed = JSON.parse(token);
      if (parsed.state?.token) {
        config.headers.Authorization = `Bearer ${parsed.state.token}`;
      }
    } catch (error) {
      console.error('Error parsing auth token:', error);
    }
  }
  return config;
});

// Mock data for development
const mockUsers: User[] = [
  {
    id: '1',
    username: 'admin',
    email: 'admin@climate.com',
    role: 'admin',
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    username: 'john_doe',
    email: 'john@example.com',
    role: 'user',
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    username: 'jane_smith',
    email: 'jane@example.com',
    role: 'user',
    isActive: true,
    createdAt: new Date().toISOString(),
  },
];

const mockRegions: Region[] = [
  { id: '1', name: 'North America' },
  { id: '2', name: 'Europe' },
  { id: '3', name: 'Asia' },
  { id: '4', name: 'South America' },
  { id: '5', name: 'Africa' },
  { id: '6', name: 'Oceania' },
];

// Generate mock climate data
const generateMockClimateData = (): ClimateData[] => {
  const data: ClimateData[] = [];
  const regions = ['North America', 'Europe', 'Asia', 'South America', 'Africa', 'Oceania'];

  for (let year = 2000; year <= 2023; year++) {
    regions.forEach((region, regionIndex) => {
      // Generate realistic climate data with trends
      const baseTemp = 15 + regionIndex * 3 + Math.sin(regionIndex) * 5;
      const tempTrend = (year - 2000) * 0.05; // Warming trend
      const avgTemp = baseTemp + tempTrend + (Math.random() - 0.5) * 2;

      const baseCO2 = 370 + (year - 2000) * 2.5; // CO2 increase over time
      const co2Level = baseCO2 + (Math.random() - 0.5) * 10;

      const basePrecip = 800 + regionIndex * 200 + Math.sin(regionIndex * 2) * 300;
      const precipitation = Math.max(0, basePrecip + (Math.random() - 0.5) * 200);

      data.push({
        id: `${year}-${regionIndex}`,
        year,
        region,
        avg_temp: Math.round(avgTemp * 10) / 10,
        co2_level: Math.round(co2Level * 10) / 10,
        precipitation: Math.round(precipitation),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    });
  }

  return data;
};

const mockClimateData = generateMockClimateData();

// Mock API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Auth API
export const authApi = {
  login: async (credentials: LoginRequest): Promise<ApiResponse<{ user: User; token: string }>> => {
    await delay(500);

    const user = mockUsers.find(u => u.email === credentials.email);
    if (!user || credentials.password !== 'password123') {
      throw new Error('Invalid credentials');
    }

    const token = `mock-jwt-token-${user.id}`;

    return {
      success: true,
      data: { user, token },
    };
  },

  register: async (userData: RegisterRequest): Promise<ApiResponse<{ user: User; token: string }>> => {
    await delay(500);

    // Check if user already exists
    if (mockUsers.find(u => u.email === userData.email)) {
      throw new Error('User already exists');
    }

    const newUser: User = {
      id: String(mockUsers.length + 1),
      username: userData.username,
      email: userData.email,
      role: 'user',
      isActive: true,
      createdAt: new Date().toISOString(),
    };

    mockUsers.push(newUser);
    const token = `mock-jwt-token-${newUser.id}`;

    return {
      success: true,
      data: { user: newUser, token },
    };
  },
};



// Climate data API
export const climateApi = {

  addClimateData: async (data: Omit<ClimateData, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<ClimateData>> => {
    await delay(300);

    const newData: ClimateData = {
      ...data,
      id: String(mockClimateData.length + 1),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockClimateData.push(newData);

    return {
      success: true,
      data: newData,
    };
  },

  updateClimateData: async (id: string, data: Partial<ClimateData>): Promise<ApiResponse<ClimateData>> => {
    await delay(300);

    const index = mockClimateData.findIndex(d => d.id === id);
    if (index === -1) {
      throw new Error('Data not found');
    }

    mockClimateData[index] = {
      ...mockClimateData[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };

    return {
      success: true,
      data: mockClimateData[index],
    };
  },

  deleteClimateData: async (id: string): Promise<ApiResponse<void>> => {
    await delay(300);

    const index = mockClimateData.findIndex(d => d.id === id);
    if (index === -1) {
      throw new Error('Data not found');
    }

    mockClimateData.splice(index, 1);

    return {
      success: true,
      data: undefined,
    };
  },
};

// Regions API
export const regionsApi = {
  getRegions: async (): Promise<ApiResponse<Region[]>> => {
    await delay(200);

    return {
      success: true,
      data: mockRegions,
    };
  },
};

// Users API (Admin only)
export const usersApi = {
  getUsers: async (): Promise<ApiResponse<User[]>> => {
    await delay(300);

    return {
      success: true,
      data: mockUsers,
    };
  },

  updateUserRole: async (id: string, role: 'user' | 'admin'): Promise<ApiResponse<User>> => {
    await delay(300);

    const user = mockUsers.find(u => u.id === id);
    if (!user) {
      throw new Error('User not found');
    }

    user.role = role;

    return {
      success: true,
      data: user,
    };
  },

  deactivateUser: async (id: string): Promise<ApiResponse<User>> => {
    await delay(300);

    const user = mockUsers.find(u => u.id === id);
    if (!user) {
      throw new Error('User not found');
    }

    user.isActive = false;

    return {
      success: true,
      data: user,
    };
  },
};