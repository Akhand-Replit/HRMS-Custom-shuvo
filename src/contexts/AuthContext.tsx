import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import supabase from '../api/supabase';
import { UserAuth } from '../types/models';
import bcrypt from 'bcryptjs';

interface AuthContextType {
  user: UserAuth | null;
  loading: boolean;
  login: (username: string, password: string, role: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserAuth | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check for saved auth data in local storage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (username: string, password: string, role: string): Promise<boolean> => {
    try {
      setLoading(true);

      if (role === 'admin') {
        // Verify admin
        const { data, error } = await supabase
          .from('admin')
          .select('id, username, profile_name, profile_pic')
          .eq('username', username)
          .single();

        if (error || !data) return false;

        // For demo purposes, check against a hardcoded admin password
        // In production, use proper password hashing and verification
        if (password === 'admin_password') {
          const user: UserAuth = {
            id: data.id,
            username: data.username,
            role: 'admin',
            profile_pic: data.profile_pic || undefined
          };

          setUser(user);
          localStorage.setItem('user', JSON.stringify(user));
          return true;
        }
      } 
      else if (role === 'company') {
        // Verify company
        const { data, error } = await supabase
          .from('company')
          .select('id, company_name, username, password_hash, profile_pic, is_active')
          .eq('username', username)
          .single();

        if (error || !data || !data.is_active) return false;

        // Check password hash
        const passwordMatch = await bcrypt.compare(password, data.password_hash);
        if (passwordMatch) {
          const user: UserAuth = {
            id: data.id,
            username: data.company_name,
            role: 'company',
            profile_pic: data.profile_pic || undefined,
            company_id: data.id
          };

          setUser(user);
          localStorage.setItem('user', JSON.stringify(user));
          return true;
        }
      }
      else {
        // Verify employee (including manager and asst_manager)
        const { data, error } = await supabase
          .from('employee')
          .select(`
            id, employee_name, username, password_hash, profile_pic, role, 
            company_id, branch_id, is_active,
            company:company_id (is_active),
            branch:branch_id (is_active)
          `)
          .eq('username', username)
          .single();

        if (error || !data || !data.is_active || !data.company.is_active || !data.branch.is_active) return false;

        // Check password hash
        const passwordMatch = await bcrypt.compare(password, data.password_hash);
        if (passwordMatch) {
          const user: UserAuth = {
            id: data.id,
            username: data.employee_name,
            role: data.role,
            profile_pic: data.profile_pic || undefined,
            company_id: data.company_id,
            branch_id: data.branch_id
          };

          setUser(user);
          localStorage.setItem('user', JSON.stringify(user));
          return true;
        }
      }

      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};