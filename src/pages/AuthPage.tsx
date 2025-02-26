import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { auth, db, signInWithGoogle } from '../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { Mail, LogIn } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const checkUserProfile = async (uid: string) => {
    const userDoc = await getDoc(doc(db, 'users', uid));
    return userDoc.exists();
  };

  const handleGoogleAuth = async () => {
    try {
      setIsLoading(true);
      const result = await signInWithGoogle();
      
      if (!result) return; // User closed popup

      const { user } = result;
      const hasProfile = await checkUserProfile(user.uid);
      
      if (!hasProfile) {
        // Create initial user profile
        await setDoc(doc(db, 'users', user.uid), {
          name: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          createdAt: new Date().toISOString(),
          bio: '',
          location: '',
          website: '',
          social: {
            twitter: '',
            github: '',
            linkedin: ''
          }
        });
      }
      
      navigate('/', { replace: true });
    } catch (error) {
      // Error is already handled in signInWithGoogle
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setIsLoading(true);
    try {
      if (isSignUp) {
        const { user } = await createUserWithEmailAndPassword(auth, email, password);
        navigate('/profile-setup', { replace: true });
      } else {
        const { user } = await signInWithEmailAndPassword(auth, email, password);
        const hasProfile = await checkUserProfile(user.uid);
        navigate(hasProfile ? '/' : '/profile-setup', { replace: true });
      }
    } catch (error: any) {
      console.error('Email Auth Error:', error);
      const errorMessages: { [key: string]: string } = {
        'auth/email-already-in-use': 'Email already in use',
        'auth/invalid-email': 'Invalid email address',
        'auth/operation-not-allowed': 'Email/password sign in is not enabled',
        'auth/weak-password': 'Password should be at least 6 characters',
        'auth/user-disabled': 'This account has been disabled',
        'auth/user-not-found': 'No account found with this email',
        'auth/wrong-password': 'Incorrect password'
      };
      toast.error(errorMessages[error.code] || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center p-4"
    >
      <div className="max-w-md w-full">
        <motion.div
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="bg-gray-800/50 backdrop-blur-xl rounded-xl p-8 border border-white/10"
        >
          <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text">
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </h2>

          <button
            onClick={handleGoogleAuth}
            disabled={isLoading}
            className="w-full mb-6 py-2 px-4 bg-white text-gray-900 rounded-lg 
                     font-semibold flex items-center justify-center gap-2 
                     hover:bg-gray-100 transition-colors disabled:opacity-50
                     disabled:cursor-not-allowed"
          >
            <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
            Continue with Google
          </button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-800/50 text-gray-400">Or continue with email</span>
            </div>
          </div>

          <form onSubmit={handleEmailAuth} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700/50 rounded-lg border border-white/10 
                         focus:outline-none focus:border-purple-500 text-white"
                placeholder="Enter your email"
                disabled={isLoading}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700/50 rounded-lg border border-white/10 
                         focus:outline-none focus:border-purple-500 text-white"
                placeholder="Enter your password"
                disabled={isLoading}
                required
              />
            </div>
            <button
              type="submit"
              disabled={isLoading || !email || !password}
              className="w-full py-2 bg-purple-500 hover:bg-purple-600 rounded-lg 
                       font-semibold transition-colors text-white disabled:opacity-50
                       disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  {isSignUp ? 'Creating Account...' : 'Signing In...'}
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  {isSignUp ? 'Sign Up' : 'Sign In'}
                </>
              )}
            </button>
          </form>

          <p className="text-center text-gray-400 mt-6">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-purple-400 hover:text-purple-300"
              disabled={isLoading}
            >
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </button>
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}