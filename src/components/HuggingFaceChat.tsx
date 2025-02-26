import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Loader, AlertCircle, WifiOff } from 'lucide-react';
import { generateAIResponse } from '../lib/huggingface';
import toast from 'react-hot-toast';
import PageTransition from './PageTransition';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'error';
  content: string;
  timestamp: Date;
}

export default function HuggingFaceChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    if (!isOnline) {
      toast.error('You are offline. Please check your internet connection.');
      return;
    }

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const loadingToast = toast.loading('Generating response...');

    try {
      const response = await generateAIResponse(userMessage.content);
      
      const aiMessage: Message = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: response,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
      toast.success('Response generated!', { id: loadingToast });
    } catch (error: any) {
      console.error('Chat Error:', error);
      
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        role: 'error',
        content: error.message || 'An error occurred. Please try again.',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
      toast.error(error.message || 'Failed to generate response', { id: loadingToast });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
        {/* Header */}
        <div className="fixed top-0 left-0 right-0 bg-gray-800/50 backdrop-blur-xl border-b border-white/10 z-10">
          <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-cyan-500/20 rounded-lg">
                <Bot className="w-6 h-6 text-cyan-400" />
              </div>
              <div>
                <h1 className="text-lg font-semibold">HuggingFace Chat</h1>
                <p className="text-sm text-gray-400">Powered by Mistral-7B</p>
              </div>
            </div>
            {!isOnline && (
              <div className="flex items-center gap-2 text-red-400">
                <WifiOff className="w-5 h-5" />
                <span className="text-sm">Offline</span>
              </div>
            )}
          </div>
        </div>

        {/* Messages */}
        <div className="max-w-4xl mx-auto px-4 pt-24 pb-24">
          <AnimatePresence mode="popLayout">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`flex items-start gap-3 mb-6 ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {message.role !== 'user' && (
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    message.role === 'assistant' 
                      ? 'bg-cyan-500/20' 
                      : 'bg-red-500/20'
                  }`}>
                    {message.role === 'assistant' ? (
                      <Bot className="w-5 h-5 text-cyan-400" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-red-400" />
                    )}
                  </div>
                )}

                <div className={`max-w-[80%] rounded-lg p-4 ${
                  message.role === 'user'
                    ? 'bg-cyan-500 text-white'
                    : message.role === 'error'
                    ? 'bg-red-500/20 text-red-200'
                    : 'bg-gray-800/50 backdrop-blur-xl'
                }`}>
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  <p className="text-xs mt-2 opacity-60">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>

                {message.role === 'user' && (
                  <div className="w-8 h-8 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                    <User className="w-5 h-5 text-cyan-400" />
                  </div>
                )}
              </motion.div>
            ))}

            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 text-gray-400"
              >
                <div className="w-8 h-8 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                  <Bot className="w-5 h-5 text-cyan-400" />
                </div>
                <div className="flex items-center gap-2 bg-gray-800/50 backdrop-blur-xl rounded-lg px-4 py-2">
                  <Loader className="w-4 h-4 animate-spin" />
                  <span>Generating response...</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="fixed bottom-0 left-0 right-0 bg-gray-800/50 backdrop-blur-xl border-t border-white/10">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <form onSubmit={handleSubmit} className="flex gap-4">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 bg-gray-700/50 rounded-lg px-4 py-2 
                         placeholder:text-gray-500 focus:outline-none 
                         focus:ring-2 focus:ring-cyan-500"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="bg-cyan-500 hover:bg-cyan-600 disabled:opacity-50 
                         disabled:cursor-not-allowed px-4 rounded-lg 
                         font-medium transition-colors flex items-center gap-2"
              >
                <Send className="w-5 h-5" />
                Send
              </button>
            </form>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}