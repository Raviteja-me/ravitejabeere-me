import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { User } from 'lucide-react';
import { auth, db } from '../lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
import toast from 'react-hot-toast';

export default function ProfileSetupPage() {
  const [name, setName] = useState('');
  const [occupation, setOccupation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const navigate = useNavigate();

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      navigate('/auth', { replace: true });
    }

    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !occupation.trim()) return;
    if (isOffline) {
      toast.error('You are offline. Please connect to the internet to complete setup.');
      return;
    }

    setIsLoading(true);
    try {
      const user = auth.currentUser;
      if (!user) {
        toast.error('No user found');
        return;
      }

      // Update user profile
      await updateProfile(user, {
        displayName: name.trim()
      });

      // Create user document in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        name: name.trim(),
        occupation: occupation.trim(),
        email: user.email,
        photoURL: user.photoURL || '',
        createdAt: new Date().toISOString(),
        online: true,
        bio: '',
        location: '',
        website: '',
        social: {
          twitter: '',
          github: '',
          linkedin: ''
        }
      });

      toast.success('Profile setup complete!');
      navigate('/', { replace: true }); // Changed navigation to home page
    } catch (error: any) {
      console.error('Error setting up profile:', error);
      if (error.code === 'unavailable') {
        toast.error('Network error. Please check your connection and try again.');
      } else {
        toast.error(error.message || 'Failed to set up profile');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isOffline) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-gray-800 p-8 rounded-lg text-center">
          <h2 className="text-xl text-white mb-4">You're Offline</h2>
          <p className="text-gray-400">Please check your internet connection to complete profile setup.</p>
        </div>
      </div>
    );
  }

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
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-purple-500/20 rounded-full">
              <User className="w-8 h-8 text-purple-400" />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-center mb-2 text-white">
            Welcome to Ravi Teja's World
          </h2>
          <p className="text-center text-gray-400 mb-6">
            Let's get to know you better
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                What's your name?
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700/50 rounded-lg border border-white/10 
                         focus:outline-none focus:border-purple-500 text-white"
                placeholder="Enter your full name"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                What's your occupation?
              </label>
              <input
                type="text"
                value={occupation}
                onChange={(e) => setOccupation(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700/50 rounded-lg border border-white/10 
                         focus:outline-none focus:border-purple-500 text-white"
                placeholder="e.g. Software Developer, Designer, Student"
                required
                disabled={isLoading}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || !name.trim() || !occupation.trim()}
              className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 
                       hover:opacity-90 rounded-lg font-semibold transition-all 
                       text-white disabled:opacity-50 disabled:cursor-not-allowed 
                       flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  Setting up your profile...
                </>
              ) : (
                'Complete Setup'
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </motion.div>
  );
}