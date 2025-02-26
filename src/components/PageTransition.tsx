import React from 'react';
import { motion } from 'framer-motion';

interface PageTransitionProps {
  children: React.ReactNode;
}

export default function PageTransition({ children }: PageTransitionProps) {
  return (
    <motion.div
      initial={{ 
        opacity: 0,
        scale: 0.95,
        y: 20
      }}
      animate={{ 
        opacity: 1,
        scale: 1,
        y: 0
      }}
      exit={{ 
        opacity: 0,
        scale: 0.95,
        y: 20
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30
      }}
      className="w-full min-h-screen absolute inset-0"
    >
      {children}
    </motion.div>
  );
}