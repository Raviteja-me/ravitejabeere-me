import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User } from 'lucide-react';

interface ProfileSetupProps {
  onComplete: (data: { name: string; role: string }) => void;
}

export default function ProfileSetup({ onComplete }: ProfileSetupProps) {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !role.trim()) return;
    onComplete({ name: name.trim(), role: role.trim() });
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
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-purple-500/20 rounded-full">
              <User className="w-8 h-8 text-purple-400" />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-center mb-6 text-white">
            Complete Your Profile
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700/50 rounded-lg border border-white/10 
                         focus:outline-none focus:border-purple-500 text-white"
                placeholder="Enter your full name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                What do you do?
              </label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700/50 rounded-lg border border-white/10 
                         focus:outline-none focus:border-purple-500 text-white"
                placeholder="e.g. Software Developer, Designer, Student"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-purple-500 hover:bg-purple-600 rounded-lg 
                       font-semibold transition-colors text-white"
            >
              Complete Setup
            </button>
          </form>
        </motion.div>
      </div>
    </motion.div>
  );
}