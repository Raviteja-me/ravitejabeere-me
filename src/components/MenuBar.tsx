import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { 
  LogOut, 
  ChevronDown,
  Briefcase,
  Package,
  UserCircle,
  Settings as SettingsIcon,
  Menu
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function MenuBar() {
  const [user] = useAuthState(auth);
  const [userData, setUserData] = useState<any>(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setUserData(userSnap.data());
        }
      }
    };
    fetchUserData();
  }, [user]);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const menuItems = [
    {
      icon: UserCircle,
      label: 'Profile',
      onClick: () => navigate('/profile')
    },
    {
      icon: Briefcase,
      label: 'Services',
      onClick: () => navigate('/services')
    },
    {
      icon: Package,
      label: 'Packages',
      onClick: () => navigate('/packages')
    },
    {
      icon: SettingsIcon,
      label: 'Settings',
      onClick: () => navigate('/settings')
    },
    {
      icon: LogOut,
      label: 'Sign Out',
      onClick: handleLogout,
      className: 'text-red-400 hover:bg-red-500/10'
    }
  ];

  return (
    <div className="fixed top-0 left-0 right-0 px-4 py-2 bg-black/20 backdrop-blur-md 
                    border-b border-white/10 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center text-white/90">
        <div className="text-sm font-medium hidden md:block">
          {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>

        <div className="flex items-center gap-4">
          {user && (
            <>
              {/* Desktop Menu */}
              <div className="relative hidden md:block">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-3 hover:bg-white/10 rounded-lg px-3 py-1.5 
                           transition-colors"
                >
                  <div className="w-8 h-8 rounded-full overflow-hidden border border-white/20">
                    <img
                      src={userData?.photoURL || `https://api.dicebear.com/7.x/avatars/svg?seed=${user.uid}`}
                      alt={userData?.name || 'User'}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-sm font-medium">{userData?.name || 'Loading...'}</span>
                  <ChevronDown className="w-4 h-4" />
                </button>

                <AnimatePresence>
                  {showProfileMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-48 bg-gray-800/90 backdrop-blur-md rounded-lg 
                               shadow-xl border border-white/10 overflow-hidden"
                    >
                      {menuItems.map((item, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setShowProfileMenu(false);
                            item.onClick();
                          }}
                          className={`flex items-center gap-2 w-full px-4 py-2 text-sm
                                   hover:bg-gray-700/50 transition-colors ${item.className || 'text-white'}`}
                        >
                          <item.icon className="w-4 h-4" />
                          {item.label}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="md:hidden p-2 hover:bg-white/10 rounded-lg"
              >
                <Menu className="w-6 h-6" />
              </button>

              {/* Mobile Menu */}
              <AnimatePresence>
                {showMobileMenu && (
                  <motion.div
                    initial={{ opacity: 0, x: '100%' }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: '100%' }}
                    className="fixed inset-y-0 right-0 w-64 bg-gray-800/95 backdrop-blur-md z-50
                             border-l border-white/10 md:hidden"
                  >
                    <div className="p-4">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-full overflow-hidden border border-white/20">
                          <img
                            src={userData?.photoURL || `https://api.dicebear.com/7.x/avatars/svg?seed=${user.uid}`}
                            alt={userData?.name || 'User'}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <div className="font-medium">{userData?.name || 'Loading...'}</div>
                          <div className="text-sm text-gray-400">{userData?.email}</div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        {menuItems.map((item, index) => (
                          <button
                            key={index}
                            onClick={() => {
                              setShowMobileMenu(false);
                              item.onClick();
                            }}
                            className={`flex items-center gap-3 w-full px-4 py-3 text-sm
                                     rounded-lg hover:bg-gray-700/50 transition-colors
                                     ${item.className || 'text-white'}`}
                          >
                            <item.icon className="w-5 h-5" />
                            {item.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}
        </div>
      </div>
    </div>
  );
}