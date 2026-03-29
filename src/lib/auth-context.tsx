import React, { createContext, useContext, useState, useCallback } from 'react';
import type { UserRole } from './mock-data';

interface AuthUser {
  name: string;
  email: string;
  role: UserRole;
  department: string;
}

interface AuthContextType {
  user: AuthUser | null;
  login: (email: string, password: string, role: UserRole) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

const mockUsers: Record<UserRole, AuthUser> = {
  hod: { name: 'Dr. Ramesh Gupta', email: 'hod@college.edu', role: 'hod', department: 'CSE' },
  staff: { name: 'Dr. Ananya Sharma', email: 'ananya@college.edu', role: 'staff', department: 'CSE' },
  student: { name: 'Arjun Mehta', email: 'arjun@college.edu', role: 'student', department: 'CSE' },
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const saved = localStorage.getItem('classsync_user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = useCallback((email: string, _password: string, role: UserRole) => {
    const u = mockUsers[role];
    setUser(u);
    localStorage.setItem('classsync_user', JSON.stringify(u));
    return true;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('classsync_user');
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
}
