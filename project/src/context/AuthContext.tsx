import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Role } from '../types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  hasRole: (roles: Role[]) => boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string, role: Role) => Promise<void>;
  logout: () => void;
}

// Mock user data - this would come from your API
const MOCK_USERS = [
  { id: 1, username: 'admin', password: 'admin123', role: 'admin' as Role, createdAt: '2023-01-01' },
  { id: 2, username: 'analyst', password: 'analyst123', role: 'analyst' as Role, createdAt: '2023-01-02' },
  { id: 3, username: 'waiter', password: 'waiter123', role: 'waiter' as Role, createdAt: '2023-01-03' },
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const foundUser = MOCK_USERS.find(
      u => u.username === username && u.password === password
    );
    
    if (!foundUser) {
      setIsLoading(false);
      throw new Error('Неверное имя пользователя или пароль');
    }
    
    const { password: _, ...userWithoutPassword } = foundUser;
    setUser(userWithoutPassword);
    localStorage.setItem('user', JSON.stringify(userWithoutPassword));
    setIsLoading(false);
  };

  const register = async (username: string, password: string, role: Role) => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (MOCK_USERS.some(u => u.username === username)) {
      setIsLoading(false);
      throw new Error('Пользователь с таким именем уже существует');
    }
    
    // In a real app, this would be handled by the server
    const newUser = {
      id: MOCK_USERS.length + 1,
      username,
      password,
      role,
      createdAt: new Date().toISOString(),
    };
    
    MOCK_USERS.push(newUser);
    
    const { password: _, ...userWithoutPassword } = newUser;
    setUser(userWithoutPassword);
    localStorage.setItem('user', JSON.stringify(userWithoutPassword));
    setIsLoading(false);
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  const hasRole = (roles: Role[]) => {
    if (!user) return false;
    return roles.includes(user.role);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        hasRole,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};