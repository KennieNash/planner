import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

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
  verifyPhone: (phone: string) => Promise<void>;
  verifyOTP: (otp: string) => Promise<void>;
  enableMFA: () => Promise<string>;
  verifyMFA: (code: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await fetch('http://localhost:4000/api/me', {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res.ok) {
            const user = await res.json();
            setUser(user);
          } else {
            setUser(null);
            localStorage.removeItem('token');
          }
        } catch {
          setUser(null);
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };
    checkSession();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:4000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Login failed');
      }
      const { token, user } = await res.json();
      localStorage.setItem('token', token);
      setUser(user);
      toast.success('Login successful!');
      if (user.role === 'ADMIN') {
        navigate('/admin');
      } else if (user.role === 'PROVIDER') {
        navigate('/provider-dashboard');
      } else {
        navigate('/customer-dashboard');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Login failed.');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, firstName: string, lastName: string, phone: string, userType: 'customer' | 'provider') => {
    setLoading(true);
    try {
      const role = userType === 'provider' ? 'PROVIDER' : 'CUSTOMER';
      const res = await fetch('http://localhost:4000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, firstName, lastName, phone, role }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Registration failed');
      }
      toast.success('Registration successful! You can now log in.');
      navigate('/login');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Registration failed.');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    localStorage.removeItem('token');
    setUser(null);
    toast.success('Logged out successfully.');
    navigate('/');
  };

  const socialLogin = async (provider: 'google' | 'facebook') => {
    toast.info('Social login is not implemented in this demo.');
    throw new Error('Social login not implemented');
  };

  const verifyPhone = async (phone: string) => {
    toast.info('Phone verification is not implemented in this demo.');
    return Promise.resolve();
  };

  const verifyOTP = async (otp: string) => {
    toast.info('OTP verification is not implemented in this demo.');
    return Promise.resolve();
  };

  const enableMFA = async () => {
    toast.info('MFA enablement is not implemented in this demo.');
    return Promise.resolve('');
  };

  const verifyMFA = async (code: string) => {
    toast.info('MFA verification is not implemented in this demo.');
    return Promise.resolve();
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, socialLogin, verifyPhone, verifyOTP, enableMFA, verifyMFA }}>
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