import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../lib/firebase';
import { 
  User, 
  MessageSquare,
  ImageIcon,
  Mic,
  CheckSquare,
  Users,
  BookOpen,
  Briefcase,
  Car
} from 'lucide-react';
import { motion } from 'framer-motion';

const DockItem = ({ 
  icon: Icon, 
  label, 
  color,
  onClick,
  customIcon 
}: { 
  icon: React.ElementType; 
  label: string;
  color: string;
  onClick?: () => void;
  customIcon?: string;
}) => {
  return (
    <motion.div 
      whileHover={{ scale: 1.2 }}
      whileTap={{ scale: 0.95 }}
      className="group relative flex flex-col items-center cursor-pointer mx-2" 
      onClick={onClick}
    >
      <div className={`dock-item relative p-2.5 rounded-xl ${color} backdrop-blur-md 
                    border border-white/20 transition-all duration-300`}>
        {customIcon ? (
          <img src={customIcon} alt={label} className="w-5 h-5 object-contain" />
        ) : (
          <Icon className="w-5 h-5 text-white" strokeWidth={1.5} />
        )}
      </div>
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        whileHover={{ opacity: 1, y: 0 }}
        className="absolute -top-10 z-50"
      >
        <div className="bg-black/80 text-white text-sm px-3 py-1 rounded-lg whitespace-nowrap">
          {label}
        </div>
      </motion.div>
      <span className="text-xs text-gray-400 mt-1">{label}</span>
    </motion.div>
  );
};

export default function Dock() {
  const navigate = useNavigate();
  const [user] = useAuthState(auth);

  const apps = [
    // Only show My Story for non-authenticated users
    ...(!user ? [{
      icon: BookOpen,
      label: 'My Story',
      color: 'bg-gradient-to-br from-amber-500/80 to-red-700/80',
      onClick: () => navigate('/my-story')
    }] : []),
    ...(user ? [{
      icon: User,
      label: 'Profile',
      color: 'bg-gradient-to-br from-purple-500/80 to-purple-700/80',
      onClick: () => navigate('/profile')
    }] : []),
    { 
      icon: MessageSquare,
      label: 'Chat',
      color: 'bg-gradient-to-br from-blue-500/80 to-blue-700/80',
      onClick: () => navigate('/chat')
    },
    {
      icon: ImageIcon,
      label: 'AI Image',
      color: 'bg-gradient-to-br from-green-500/80 to-green-700/80',
      onClick: () => navigate('/image-gen')
    },
    {
      icon: Mic,
      label: 'Voice Chat',
      color: 'bg-gradient-to-br from-pink-500/80 to-pink-700/80',
      onClick: () => navigate('/voice-chat')
    },
    {
      icon: CheckSquare,
      label: 'Tasks',
      color: 'bg-gradient-to-br from-yellow-500/80 to-yellow-700/80',
      onClick: () => navigate('/todo')
    },
    {
      icon: Users,
      label: 'Community',
      color: 'bg-gradient-to-br from-indigo-500/80 to-indigo-700/80',
      onClick: () => navigate('/community')
    },
    {
      icon: Car,
      label: 'Pushpaka',
      color: 'bg-gradient-to-br from-orange-500/80 to-orange-700/80',
      onClick: () => window.open('https://pushpakarides.in', '_blank'),
      customIcon: 'https://storage.googleapis.com/pushpaka-rides-website-oaui41.appspot.com/Pushpaka.png'
    }
  ];

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="dock flex gap-2 p-3 rounded-2xl bg-black/20 backdrop-blur-2xl 
                  border border-white/10 shadow-xl"
      >
        {apps.map((app, index) => (
          <DockItem 
            key={index} 
            icon={app.icon} 
            label={app.label} 
            color={app.color}
            onClick={app.onClick}
            customIcon={app.customIcon}
          />
        ))}
      </motion.div>
    </div>
  );
}