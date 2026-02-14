
import React, { useState, useEffect } from 'react';
import { MemoryRouter, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { Icons, Logo } from './constants';
import Home from './pages/Home';
import Rooms from './pages/Rooms';
import RoomDetail from './pages/RoomDetail';
import Checkout from './pages/Checkout';
import Success from './pages/Success';
import Contact from './pages/Contact';
import Admin from './pages/Admin';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Concierge from './components/Concierge';
// Fix: Import onAuthStateChanged from centralized local firebase module to fix export error
import { auth, db, onAuthStateChanged } from './firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

// Default admin configuration
const DEFAULT_ADMIN_EMAIL = 'admin@wizhomes.com';
const DEFAULT_ADMIN_UID = 'default-admin-001';

// Function to ensure admin exists in Firestore
const ensureAdminExists = async () => {
  try {
    const adminDocRef = doc(db, 'users', DEFAULT_ADMIN_UID);
    const adminDoc = await getDoc(adminDocRef);
    
    if (!adminDoc.exists()) {
      // Create default admin document
      await setDoc(adminDocRef, {
        uid: DEFAULT_ADMIN_UID,
        email: DEFAULT_ADMIN_EMAIL,
        displayName: 'Administrator',
        role: 'Operator',
        isDefaultAdmin: true,
        createdAt: new Date().toISOString()
      });
      console.log('Default admin created in Firestore');
    }
  } catch (error) {
    console.error('Error ensuring admin exists:', error);
  }
};

const Navbar: React.FC<{ theme: string; toggleTheme: () => void; user: any | null; role: string | null }> = ({ theme, toggleTheme, user, role }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const isHidden = location.pathname === '/login' || location.pathname === '/checkout' || location.pathname === '/success';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (isHidden) return null;

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/rooms', label: 'Inventory' },
    { path: '/contact', label: 'Contact' },
    { path: '/login', label: 'Login' },
  ];

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/95 dark:bg-zinc-950/95 shadow-sm' : 'bg-white/90 dark:bg-zinc-950/90'} backdrop-blur-md border-b border-zinc-100 dark:border-zinc-800`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center py-2 group">
              <Logo className="h-9 transform transition-transform group-hover:scale-105" />
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative px-4 py-2 text-sm font-medium transition-colors duration-200 ${location.pathname === link.path
                    ? 'text-red-600 dark:text-red-500'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
                  }`}
                >
                  {link.label}
                  {location.pathname === link.path && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-red-600 dark:bg-red-500 rounded-full" />
                  )}
                </Link>
              ))}
            </div>

            {/* Right Actions */}
            <div className="flex items-center space-x-2">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2.5 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-all duration-200"
                aria-label="Toggle theme"
              >
                {theme === 'light' ? (
                  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
                  </svg>
                ) : (
                  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="4" />
                    <path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41m11.32-11.32l1.41-1.41" />
                  </svg>
                )}
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={toggleMenu}
                className="md:hidden p-2.5 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-all duration-200"
                aria-label="Menu"
              >
                <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  {isMenuOpen ? (
                    <path d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path d="M3 12h18M3 6h18M3 18h18" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 z-[60] bg-white dark:bg-zinc-950 transition-transform duration-300 ${isMenuOpen ? 'translate-y-0' : '-translate-y-full'}`}>
        <div className="flex flex-col h-full">
          {/* Mobile Menu Header */}
          <div className="flex justify-between items-center px-6 py-5 border-b border-zinc-100 dark:border-zinc-800">
            <Logo className="h-8" />
            <button
              onClick={toggleMenu}
              className="p-2 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all"
            >
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Mobile Navigation Links */}
          <nav className="flex-1 flex flex-col justify-center px-6 space-y-4">
            {navLinks.map((link, index) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={toggleMenu}
                className={`text-3xl font-bold tracking-tight py-3 transition-colors duration-200 ${
                  location.pathname === link.path
                    ? 'text-red-600 dark:text-red-500'
                    : 'text-zinc-900 dark:text-white hover:text-red-600 dark:hover:text-red-500'
                }`}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          
          {/* Mobile Menu Footer */}
          <div className="px-6 py-6 border-t border-zinc-100 dark:border-zinc-800">
            <div className="flex items-center justify-end">
              <button
                onClick={toggleTheme}
                className="p-2.5 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-all"
              >
                {theme === 'light' ? (
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
                  </svg>
                ) : (
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="4" />
                    <path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const ProtectedRoute: React.FC<{ 
  children: React.ReactNode; 
  role: string | null; 
  allowedRoles: string[]; 
}> = ({ children, role, allowedRoles }) => {
  // Check for admin session in localStorage
  const isAdminSession = typeof window !== 'undefined' && localStorage.getItem('wiz_admin_session') === 'true';
  
  if (role === null && !isAdminSession) return <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-white font-black uppercase tracking-widest text-xs animate-pulse">Authenticating Security Clearance...</div>;
  
  // Allow access if role matches or if admin session exists
  const hasAccess = role && allowedRoles.includes(role);
  if (!hasAccess && !isAdminSession) return <Navigate to="/rooms" replace />;
  
  return <>{children}</>;
};

const AppContent = () => {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');
  const [user, setUser] = useState<any | null>(null);
  const [role, setRole] = useState<string | null>(() => {
    // Check for admin session immediately on initialization
    if (typeof window !== 'undefined' && localStorage.getItem('wiz_admin_session') === 'true') {
      return 'Operator';
    }
    return null;
  });
  const [loading, setLoading] = useState<boolean>(() => {
    // Don't show loading if we already have admin session
    if (typeof window !== 'undefined' && localStorage.getItem('wiz_admin_session') === 'true') {
      return false;
    }
    return true;
  });

  useEffect(() => {
    // Ensure default admin exists in Firestore on app load
    ensureAdminExists();

    // Check for default admin session first (works without Firebase)
    const adminSession = localStorage.getItem('wiz_admin_session');
    if (adminSession === 'true') {
      setRole('Operator');
      setLoading(false);
      return;
    }

    // Fix: Using onAuthStateChanged from centralized firebase module
    const unsubscribe = onAuthStateChanged(auth, async (currentUser: any) => {
      setUser(currentUser);
      
      // If we already have admin session, keep it
      const storedAdminSession = localStorage.getItem('wiz_admin_session');
      if (storedAdminSession === 'true') {
        setRole('Operator');
        setLoading(false);
        return;
      }

      if (currentUser) {
        // Check user's role from Firestore
        try {
          const docRef = doc(db, 'users', currentUser.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const userRole = docSnap.data().role;
            // Grant admin access if role is Operator or Admin
            if (userRole === 'Operator' || userRole === 'Admin') {
              setRole(userRole);
            } else {
              setRole(userRole || 'Guest');
            }
          } else {
            setRole('Guest');
          }
        } catch (error) {
          console.error("Error fetching user document", error);
          setRole('Guest');
        }
      } else {
        setRole(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark');
  };

  if (loading) return <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-white font-black uppercase tracking-widest text-[10px] animate-pulse">Establishing Secure Connection...</div>;

  return (
    <>
      <Navbar theme={theme} toggleTheme={toggleTheme} user={user} role={role} />
      <div className="pt-24 min-h-screen">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/rooms" element={<Rooms />} />
          <Route path="/rooms/:id" element={<RoomDetail />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/success" element={<Success />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin" element={
            <ProtectedRoute role={role} allowedRoles={['Operator', 'Admin']}>
              <Admin theme={theme} toggleTheme={toggleTheme} onLogout={() => auth.signOut()} />
            </ProtectedRoute>
          } />
        </Routes>
      </div>
      <Concierge />
    </>
  );
};

const App: React.FC = () => {
  return (
    <MemoryRouter>
      <AppContent />
    </MemoryRouter>
  );
};

export default App;
