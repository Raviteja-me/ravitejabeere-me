import React from 'react';
import { motion } from 'framer-motion';
import ImageWithFallback from './ImageWithFallback';

export default function Logo() {
  const backgroundImage = "https://firebasestorage.googleapis.com/v0/b/pushpaka-rides-website-oaui41.appspot.com/o/dasdsadsadsa.png?alt=media&token=cf05186e-bbcc-4330-b7c0-f28161e1442c";

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center"
    >
      <div className="w-32 h-32 mx-auto mb-4 relative">
        <ImageWithFallback 
          src={backgroundImage}
          alt="Ravi Teja"
          className="rounded-full object-cover border-4 border-purple-500/50 shadow-lg"
        />
      </div>
      <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 
                   text-transparent bg-clip-text">
        Ravi Teja's World
      </h1>
      <p className="text-lg text-white/80 mt-2">Artist • Creator • Innovator</p>
    </motion.div>
  );
}