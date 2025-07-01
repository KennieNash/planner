import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useLocation } from 'wouter';
import { useToast } from '@/hooks/use-toast';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, firstName: string, lastName: string, phone: string, userType: 'customer' | 'provider') => Promise<void>;
  logout: () => void;
  socialLogin: (provider: 'google' | 'facebook') => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    // Simulate checking for existing session
    const checkSession = async () => {
      try {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
      } catch (error) {
        console.error('Session check failed:', error);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      // Mock login for development
      const mockUser: User = {
        id: '1',
        email,
        firstName: 'John',
        lastName: 'Doe',
        role: 'customer'
      };
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
      localStorage.setItem('token', 'mock-token');
      
      toast({
        title: "Login Successful",
        description: "Welcome back!"
      });
      
      if (mockUser.role === 'ADMIN') {
        setLocation('/admin');
      } else if (mockUser.role === 'PROVIDER') {
        setLocation('/provider-dashboard');
      } else {
        setLocation('/customer-dashboard');
      }
    } catch (error) {
      toast({
        title: "Login Failed",
        description: error instanceof Error ? error.message : 'Login failed',
        variant: "destructive"
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, firstName: string, lastName: string, phone: string, userType: 'customer' | 'provider') => {
    setLoading(true);
    try {
      // Mock registration for development
      const mockUser: User = {
        id: '1',
        email,
        firstName,
        lastName,
        phone,
        role: userType
      };
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
      localStorage.setItem('token', 'mock-token');
      
      toast({
        title: "Registration Successful",
        description: "Welcome to ServiceConnect!"
      });
      
      if (userType === 'provider') {
        setLocation('/provider-registration');
      } else {
        setLocation('/customer-dashboard');
      }
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: error instanceof Error ? error.message : 'Registration failed',
        variant: "destructive"
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setLocation('/');
    
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully"
    });
  };

  const socialLogin = async (provider: 'google' | 'facebook') => {
    setLoading(true);
    try {
      // Mock social login for development
      const mockUser: User = {
        id: '1',
        email: `user@${provider}.com`,
        firstName: 'Social',
        lastName: 'User',
        role: 'customer'
      };
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
      localStorage.setItem('token', 'mock-token');
      
      toast({
        title: "Login Successful",
        description: `Welcome! Logged in with ${provider}`
      });
      
      setLocation('/customer-dashboard');
    } catch (error) {
      toast({
        title: "Login Failed",
        description: `${provider} login failed`,
        variant: "destructive"
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    logout,
    socialLogin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}