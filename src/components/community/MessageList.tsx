import React from 'react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

interface Message {
  id: string;
  text: string;
  createdAt: any;
  userId: string;
  userName: string;
  userPhoto: string;
}

interface MessageListProps {
  messages: Message[];
  currentUser: any;
}

export default function MessageList({ messages, currentUser }: MessageListProps) {
  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <motion.div
          key={message.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start gap-4"
        >
          <img
            src={message.userPhoto || 'https://api.dicebear.com/7.x/avatars/svg?seed=' + message.userId}
            alt={message.userName}
            className="w-10 h-10 rounded-full"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-medium">{message.userName}</span>
              <span className="text-xs text-gray-400">
                {message.createdAt?.toDate() && 
                  format(message.createdAt.toDate(), 'HH:mm')}
              </span>
            </div>
            <p className="text-gray-200">{message.text}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}