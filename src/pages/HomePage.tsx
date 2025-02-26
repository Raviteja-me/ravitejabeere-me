import React from 'react';
import { motion } from 'framer-motion';

export function HomePage() {
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
    </div>
  );
}