
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
  id: string;
  email: string;
  name: string;
  staffId: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string, staffId: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Pre-seeded test users
const TEST_USERS = [
  {
    id: '1',
    email: 'blake@blakeprintz.com',
    password: 'password123',
    name: 'Blake Printz',
    staffId: '10001',
    role: 'Admin',
  },
  {
    id: '2',
    email: 'john@blakeprintz.com',
    password: 'password123',
    name: 'John',
    staffId: '32112',
    role: 'Staff',
  },
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initializeTestUsers();
  }, []);

  const initializeTestUsers = async () => {
    try {
      // Check if users have been initialized
      const initialized = await AsyncStorage.getItem('users_initialized');
      
      if (!initialized) {
        // First time setup - seed test users
        await AsyncStorage.setItem('users', JSON.stringify(TEST_USERS));
        await AsyncStorage.setItem('users_initialized', 'true');
        console.log('Test users initialized successfully');
      }
      
      // Load current user if exists
      await loadUser();
    } catch (error) {
      console.log('Error initializing test users:', error);
      setIsLoading(false);
    }
  };

  const loadUser = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.log('Error loading user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      // Get stored users
      const usersData = await AsyncStorage.getItem('users');
      const users = usersData ? JSON.parse(usersData) : [];
      
      const foundUser = users.find(
        (u: any) => u.email === email && u.password === password
      );

      if (foundUser) {
        const { password: _, ...userWithoutPassword } = foundUser;
        setUser(userWithoutPassword);
        await AsyncStorage.setItem('user', JSON.stringify(userWithoutPassword));
        console.log('User signed in successfully:', userWithoutPassword.email);
      } else {
        throw new Error('Invalid email or password');
      }
    } catch (error) {
      console.log('Sign in error:', error);
      throw error;
    }
  };

  const signUp = async (email: string, password: string, name: string, staffId: string) => {
    try {
      // Get stored users
      const usersData = await AsyncStorage.getItem('users');
      const users = usersData ? JSON.parse(usersData) : [];

      // Check if user already exists
      const existingUser = users.find((u: any) => u.email === email);
      if (existingUser) {
        throw new Error('User with this email already exists');
      }

      // Check if staff ID is already used
      const existingStaffId = users.find((u: any) => u.staffId === staffId);
      if (existingStaffId) {
        throw new Error('Staff ID already registered');
      }

      const newUser = {
        id: Date.now().toString(),
        email,
        password,
        name,
        staffId,
        role: 'Staff',
      };

      users.push(newUser);
      await AsyncStorage.setItem('users', JSON.stringify(users));

      const { password: _, ...userWithoutPassword } = newUser;
      setUser(userWithoutPassword);
      await AsyncStorage.setItem('user', JSON.stringify(userWithoutPassword));
      console.log('User signed up successfully:', userWithoutPassword.email);
    } catch (error) {
      console.log('Sign up error:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await AsyncStorage.removeItem('user');
      setUser(null);
      console.log('User signed out successfully');
    } catch (error) {
      console.log('Sign out error:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
