
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/ui/Layout';
import { Dashboard } from './pages/Dashboard';
import { Personnel } from './pages/Personnel';
import { RosterManager } from './pages/RosterManager';
import { Reports } from './pages/Reports';
import { Settings } from './pages/Settings';
import { LocalLogin } from './components/auth/LocalLogin';
import { PublicRosters } from './pages/PublicRosters';
import { db } from './services/store';
import { User, UserRole } from './types';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [user, setUser] = useState<User | null>(db.getCurrentUser());

  // Check if current path is public
  const isPublicPath = window.location.pathname === '/public-rosters';

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    }

    // Subscribe to auth changes (Local Store + Supabase)
    const unsubscribe = db.subscribe(() => {
      setUser(db.getCurrentUser());
    });
    
    // Check initial session from Supabase
    import('./services/supabase').then(({ supabase }) => {
      if (supabase) {
        supabase.auth.getSession().then(async ({ data: { session } }) => {
          if (session?.user) {
             // Sync Supabase session to local store format
             let role: UserRole = 'VISUALIZADOR';
             const email = session.user.email?.toLowerCase() || '';
             
             if (email === 'marcos_notigan@hotmail.com') {
                role = 'ADMIN';
             } else if (email.includes('operador')) {
                role = 'OPERADOR';
             }
             
             // Try to fetch profile for exact role
             const { data: profile } = await supabase.from('profiles').select('role').eq('id', session.user.id).maybeSingle();
             if (profile?.role) {
                role = profile.role.toUpperCase() as UserRole;
             }

             const user: User = {
                id: session.user.id,
                username: session.user.email || 'Administrador',
                role
             };
             sessionStorage.setItem('current_user', JSON.stringify(user));
             setUser(user);
          }
        }).catch(err => {
          console.error('Supabase getSession Error:', err);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
          if (session?.user) {
             let role: UserRole = 'VISUALIZADOR';
             const email = session.user.email?.toLowerCase() || '';
             
             if (email === 'marcos_notigan@hotmail.com') {
                role = 'ADMIN';
             } else if (email.includes('operador')) {
                role = 'OPERADOR';
             }
             
             // Try to fetch profile for exact role
             const { data: profile } = await supabase.from('profiles').select('role').eq('id', session.user.id).maybeSingle();
             if (profile?.role) {
                role = profile.role.toUpperCase() as UserRole;
             }

             const user: User = {
                id: session.user.id,
                username: session.user.email || 'Administrador',
                role
             };
             sessionStorage.setItem('current_user', JSON.stringify(user));
             setUser(user);
          } else {
             sessionStorage.removeItem('current_user');
             setUser(null);
          }
        });
        
        return () => subscription.unsubscribe();
      }
    });

    return unsubscribe;
  }, []);

  const toggleTheme = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDarkMode(true);
    }
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Route */}
        <Route path="/public-rosters" element={<PublicRosters />} />
        
        {/* Auth Routes */}
        <Route path="/login" element={user ? <Navigate to="/" replace /> : <LocalLogin />} />

        {/* Protected Routes */}
        <Route path="/" element={
          user ? (
            <Layout isDarkMode={isDarkMode} toggleTheme={toggleTheme}>
              <Dashboard />
            </Layout>
          ) : <Navigate to="/login" replace />
        } />

        <Route path="/personnel" element={
          user ? (
            <Layout isDarkMode={isDarkMode} toggleTheme={toggleTheme}>
              <Personnel />
            </Layout>
          ) : <Navigate to="/login" replace />
        } />

        <Route path="/rosters" element={
          user ? (
            <Layout isDarkMode={isDarkMode} toggleTheme={toggleTheme}>
              <RosterManager />
            </Layout>
          ) : <Navigate to="/login" replace />
        } />

        <Route path="/reports" element={
          user ? (
            <Layout isDarkMode={isDarkMode} toggleTheme={toggleTheme}>
              <Reports />
            </Layout>
          ) : <Navigate to="/login" replace />
        } />

        <Route path="/settings" element={
          user?.role === 'ADMIN' ? (
            <Layout isDarkMode={isDarkMode} toggleTheme={toggleTheme}>
              <Settings />
            </Layout>
          ) : <Navigate to="/" replace />
        } />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
