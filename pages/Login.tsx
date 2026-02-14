
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Logo } from '../constants';
// Fix: Importing auth methods from centralized local firebase module to fix export member errors
import { auth, db, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, sendPasswordResetEmail } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [resetSent, setResetSent] = useState(false);

  const handleForgotPassword = async () => {
    if (!email) {
      setError('Please enter your email address first');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      await sendPasswordResetEmail(auth, email);
      setResetSent(true);
    } catch (err: any) {
      setError(err.message || 'Failed to send reset email');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (isRegistering) {
        // Fix: Using auth methods from local firebase config
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        await updateProfile(user, { displayName });

        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          email: user.email,
          displayName,
          role: 'Guest',
          joinedAt: new Date().toISOString()
        });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        // Redirect admins to admin page
        if (email.toLowerCase() === 'wizhomes1@gmail.com') {
          navigate('/admin');
        } else {
          navigate('/rooms');
        }
      }
    } catch (err: any) {
      console.error("Authentication process failure:", err);
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 bg-zinc-50 dark:bg-zinc-950 transition-colors duration-500">
      <div className="w-full max-w-md animate-in fade-in zoom-in duration-500">
        <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] shadow-2xl border border-zinc-100 dark:border-zinc-800 overflow-hidden">
          <div className="p-12">
            <div className="text-center mb-10">
              <Logo className="h-20 mb-8" />
              <h2 className="text-xl font-black uppercase tracking-tighter text-zinc-950 dark:text-white mb-2">
                {isRegistering ? 'Create Your Account' : 'Welcome Back'}
              </h2>
              <p className="text-zinc-500 dark:text-zinc-400 text-[10px] font-black uppercase tracking-widest">
                {isRegistering ? 'Join the WIZ HOMES Private Collection' : 'Sign in to manage your luxury stays'}
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/50 rounded-xl text-red-600 dark:text-red-400 text-xs font-bold uppercase tracking-widest text-center animate-in shake duration-500">
                {error}
              </div>
            )}

            {resetSent && (
              <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-900/50 rounded-xl text-green-600 dark:text-green-400 text-xs font-bold uppercase tracking-widest text-center">
                Password reset email sent! Check your inbox.
              </div>
            )}

            <form onSubmit={handleAuth} className="space-y-6">
              {isRegistering && (
                <div className="space-y-2 animate-in slide-in-from-top-4 duration-300">
                  <label className="text-xs font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-500 ml-1">
                    Full Name
                  </label>
                  <input 
                    type="text" 
                    required
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full px-6 py-4 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-red-600/20 dark:text-white transition-all font-bold" 
                    placeholder="Jane Doe"
                  />
                </div>
              )}

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-500 ml-1">
                  Email Address
                </label>
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-6 py-4 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-red-600/20 dark:text-white transition-all font-bold" 
                  placeholder="traveler@wizhomes.com"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-xs font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
                    Password
                  </label>
                  {!isRegistering && (
                    <button type="button" onClick={handleForgotPassword} className="text-[10px] font-bold text-red-600 hover:underline">
                      Forgot Password?
                    </button>
                  )}
                </div>
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-6 py-4 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-red-600/20 dark:text-white transition-all font-bold" 
                  placeholder="••••••••"
                />
              </div>

              {!isRegistering && (
                <div className="flex items-center space-x-2 ml-1">
                  <input type="checkbox" id="remember" className="accent-red-600 w-4 h-4 rounded" defaultChecked />
                  <label htmlFor="remember" className="text-xs font-bold text-zinc-500 dark:text-zinc-400 select-none">
                    Stay logged in
                  </label>
                </div>
              )}

              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full py-5 bg-red-600 text-white font-black rounded-2xl hover:bg-red-700 transition-all shadow-xl shadow-red-600/20 flex items-center justify-center space-x-2 active:scale-95 uppercase tracking-widest text-[11px]"
              >
                {isLoading ? (
                  <span className="flex items-center space-x-2">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Processing...</span>
                  </span>
                ) : (
                  <span>{isRegistering ? 'Register' : 'Sign In'}</span>
                )}
              </button>
            </form>

            <button 
              onClick={() => setIsRegistering(!isRegistering)}
              className="w-full mt-6 text-xs font-black uppercase tracking-[0.2em] text-zinc-400 hover:text-red-600 transition-colors"
            >
              {isRegistering ? 'Already have an account? Sign In' : 'New to WIZ HOMES? Create Account'}
            </button>
          </div>
          
          <div className="bg-zinc-50 dark:bg-zinc-800/50 p-6 text-center border-t border-zinc-100 dark:border-zinc-800">
             <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400">
               © 2026 WIZ HOMES EXTERIORS SECURITY PROTOCOL
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
