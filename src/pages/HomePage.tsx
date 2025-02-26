import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, ImageIcon, Mic, Car } from 'lucide-react';

export function HomePage() {
  const features = [
    {
      icon: MessageSquare,
      title: 'Chat Assistant',
      description: 'Engage in natural conversations with our AI assistant',
      path: '/chat',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: ImageIcon,
      title: 'Image Generation',
      description: 'Create unique images from text descriptions',
      path: '/image-gen',
      color: 'from-green-500 to-green-600'
    },
    {
      icon: Mic,
      title: 'Voice Chat',
      description: 'Talk naturally with our AI using voice commands',
      path: '/voice-chat',
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: Car,
      title: 'Pushpaka Rides',
      description: 'Book your rides with zero commission ride-hailing platform',
      path: 'https://pushpakarides.in',
      color: 'from-orange-500 to-orange-600',
      customIcon: 'https://storage.googleapis.com/pushpaka-rides-website-oaui41.appspot.com/Pushpaka.png'
    }
  ];

  const handleFeatureClick = (path: string) => {
    if (path.startsWith('http')) {
      window.open(path, '_blank');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
          Welcome to My Website
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
          Feel free to explore and use all the apps I've created. Each one is designed to make your life easier and more productive.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => handleFeatureClick(feature.path)}
              className="bg-gray-800/50 backdrop-blur-xl p-6 rounded-xl border border-white/10 
                       hover:border-purple-500/50 transition-all cursor-pointer group"
            >
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${feature.color} 
                           flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                {feature.customIcon ? (
                  <img 
                    src={feature.customIcon} 
                    alt={feature.title}
                    className="w-6 h-6 object-contain"
                  />
                ) : (
                  <Icon className="w-6 h-6 text-white" />
                )}
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}