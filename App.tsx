
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
import { doc, getDoc } from 'firebase/firestore';

const Navbar: React.FC<{ theme: string; toggleTheme: () => void; user: any | null; role: string | null }> = ({ theme, toggleTheme, user, role }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const isHidden = location.pathname === '/login' || location.pathname === '/checkout' || location.pathname === '/success';

  if (isHidden) return null;

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-zinc-100 dark:border-zinc-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-24">
            <div className="flex items-center">
              <Link to="/" className="group py-2">
                <Logo className="h-10 md:h-12 transform transition-transform group-hover:scale-105" />
              </Link>
            </div>
            
            <div className="hidden md:flex items-center space-x-12">
              <Link to="/" className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 dark:text-zinc-400 hover:text-red-600 dark:hover:text-red-500 transition-colors">Home</Link>
              <Link to="/rooms" className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 dark:text-zinc-400 hover:text-red-600 dark:hover:text-red-500 transition-colors">Inventory</Link>
              <Link to="/contact" className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 dark:text-zinc-400 hover:text-red-600 dark:hover:text-red-500 transition-colors">Contact</Link>
            </div>

            <div className="flex items-center space-x-4">
              <button onClick={toggleTheme} className="p-3 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-2xl transition-all">
                {theme === 'light' ? <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg> : <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2m-7.07-15.07 1.41 1.41m11.32 11.32 1.41 1.41M2 12h2m16 0h2m-15.66 5.66 1.41-1.41m11.32-11.32 1.41-1.41"/></svg>}
              </button>
              <button onClick={toggleMenu} className="md:hidden p-3 text-zinc-950 dark:text-white">
                <Icons.Menu />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`fixed inset-0 z-[60] bg-black/90 backdrop-blur-xl transition-transform duration-500 p-12 flex flex-col justify-center ${isMenuOpen ? 'translate-y-0' : '-translate-y-full'}`}>
        <button onClick={toggleMenu} className="absolute top-12 right-12 text-white text-3xl">✕</button>
        <nav className="flex flex-col space-y-12">
          <Link to="/" onClick={toggleMenu} className="text-6xl font-black uppercase tracking-tighter text-white">Home</Link>
          <Link to="/rooms" onClick={toggleMenu} className="text-6xl font-black uppercase tracking-tighter text-white">Inventory</Link>
          <Link to="/contact" onClick={toggleMenu} className="text-6xl font-black uppercase tracking-tighter text-white">Contact</Link>
        </nav>
      </div>
    </>
  );
};

const ProtectedRoute: React.FC<{ 
  children: React.ReactNode; 
  role: string | null; 
  allowedRoles: string[]; 
}> = ({ children, role, allowedRoles }) => {
  if (role === null) return <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-white font-black uppercase tracking-widest text-xs animate-pulse">Authenticating Security Clearance...</div>;
  if (!role || !allowedRoles.includes(role)) return <Navigate to="/rooms" replace />;
  return <>{children}</>;
};

const AppContent = () => {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');
  const [user, setUser] = useState<any | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fix: Using onAuthStateChanged from centralized firebase module
    const unsubscribe = onAuthStateChanged(auth, async (currentUser: any) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const docRef = doc(db, 'users', currentUser.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setRole(docSnap.data().role);
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
