import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: any | null;
  loading: boolean;
  signOut: () => Promise<void>;
  signInAsAdmin: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (!error && data) {
      setProfile(data);
    }
  };

  useEffect(() => {
    // Check for mock session first
    const mockUser = localStorage.getItem('wasiny_mock_user');
    if (mockUser) {
      const parsedUser = JSON.parse(mockUser);
      setUser(parsedUser);
      setProfile({ role: 'admin', full_name: 'Admin User', email: parsedUser.email });
      setLoading(false);
    }

    // Check active sessions and sets the user
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!mockUser) {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          await fetchProfile(session.user.id);
        }
        setLoading(false);
      }
    });

    // Listen for changes on auth state (logged in, signed out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!localStorage.getItem('wasiny_mock_user')) {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          await fetchProfile(session.user.id);
        } else {
          setProfile(null);
        }
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    localStorage.removeItem('wasiny_mock_user');
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
  };

  const signInAsAdmin = () => {
    const adminUser = {
      id: 'admin-id',
      email: 'saryatest123@gmail.com',
      user_metadata: { full_name: 'Admin User' },
      aud: 'authenticated',
      role: 'authenticated',
    } as any;
    
    localStorage.setItem('wasiny_mock_user', JSON.stringify(adminUser));
    setUser(adminUser);
    setProfile({ role: 'admin', full_name: 'Admin User', email: adminUser.email });
  };

  return (
    <AuthContext.Provider value={{ user, session, profile, loading, signOut, signInAsAdmin }}>
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
