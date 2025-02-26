import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Loader, Volume2, Waveform, Brain } from 'lucide-react';
import { openai } from '../lib/openai';

interface Message {
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

export default function VoiceChatPage() {
  const [isListening, setIsListening] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);

  useEffect(() => {
    // Initialize voice selection
    const initVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(voice => 
        // Prioritize these voices in order
        voice.name.includes('Google US English') ||
        voice.name.includes('Microsoft David') ||
        voice.name.includes('Microsoft Mark') ||
        voice.name.includes('en-US') ||
        (voice.lang.startsWith('en-') && voice.name.includes('Male'))
      );
      if (preferredVoice) {
        setSelectedVoice(preferredVoice);
      }
    };

    // Handle voice loading
    if (typeof speechSynthesis !== 'undefined') {
      speechSynthesis.onvoiceschanged = initVoices;
      initVoices();
    }

    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window) {
      const recognition = new window.webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        handleUserMessage(transcript);
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      setRecognition(recognition);
    }
  }, []);

  const handleUserMessage = async (text: string) => {
    const userMessage: Message = {
      type: 'user',
      content: text,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    generateAIResponse(text);
  };

  const generateAIResponse = async (userInput: string) => {
    setIsLoading(true);
    try {
      const response = await openai.post('/chat/completions', {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a helpful AI assistant that provides clear and concise answers."
          },
          {
            role: "user",
            content: userInput
          }
        ],
        temperature: 0.7,
        max_tokens: 150
      });

      const aiResponse = response.data.choices[0].message.content;
      
      const aiMessage: Message = {
        type: 'ai',
        content: aiResponse,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
      speakResponse(aiResponse);
    } catch (error) {
      console.error('Error generating response:', error);
      const errorMessage: Message = {
        type: 'ai',
        content: "I apologize, but I'm having trouble processing your request at the moment. Please try again.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
      speakResponse(errorMessage.content);
    } finally {
      setIsLoading(false);
    }
  };

  const speakResponse = (text: string) => {
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();

      setIsSpeaking(true);
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Set the selected voice if available
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }
      
      // Optimize voice settings for clarity
      utterance.rate = 0.9; // Slightly slower for better clarity
      utterance.pitch = 1.0; // Natural pitch
      utterance.volume = 1.0; // Full volume
      
      // Add emphasis and pauses for better speech flow
      text = text.replace(/([.!?])\s*/g, '$1|');
      text = text.replace(/([,;:])\s*/g, '$1|');
      const sentences = text.split('|');
      
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      
      window.speechSynthesis.speak(utterance);
    }
  };

  const startListening = useCallback(() => {
    if (recognition && !isListening) {
      recognition.start();
    }
  }, [recognition, isListening]);

  const stopListening = useCallback(() => {
    if (recognition && isListening) {
      recognition.stop();
    }
  }, [recognition, isListening]);

  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-4 md:p-8"
    >
      <div className="max-w-4xl mx-auto flex flex-col min-h-screen">
        {/* Header Section */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="inline-block p-6 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 mb-6 relative"
          >
            <Brain className="w-12 h-12" />
            {isListening && (
              <motion.div
                initial={{ scale: 1, opacity: 0.5 }}
                animate={{ scale: 1.5, opacity: 0 }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="absolute inset-0 rounded-full bg-violet-500"
              />
            )}
          </motion.div>
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-violet-400 to-indigo-500 text-transparent bg-clip-text">
            AI Voice Assistant
          </h1>
          <p className="text-gray-400 mb-6">Ask me anything - I'm here to help!</p>
          
          {/* Voice Control Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onMouseDown={startListening}
            onMouseUp={stopListening}
            onTouchStart={startListening}
            onTouchEnd={stopListening}
            disabled={isLoading}
            className="bg-gradient-to-r from-violet-600 to-indigo-600 px-8 py-4 
                     rounded-full font-semibold inline-flex items-center gap-3
                     hover:opacity-90 transition-all disabled:opacity-50 
                     disabled:cursor-not-allowed shadow-lg group"
          >
            <div className="relative">
              {isListening ? (
                <>
                  <Mic className="w-6 h-6 animate-pulse" />
                  <motion.div
                    initial={{ scale: 1, opacity: 0.5 }}
                    animate={{ scale: 2, opacity: 0 }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="absolute inset-0 rounded-full bg-white"
                  />
                </>
              ) : (
                <Mic className="w-6 h-6" />
              )}
            </div>
            <span className="relative z-10">
              {isListening ? 'Listening...' : 'Hold to Speak'}
            </span>
            {isSpeaking && (
              <div className="flex items-center gap-1 ml-2">
                <motion.div
                  animate={{ height: [4, 12, 4] }}
                  transition={{ repeat: Infinity, duration: 0.8 }}
                  className="w-1 bg-white rounded-full"
                />
                <motion.div
                  animate={{ height: [4, 16, 4] }}
                  transition={{ repeat: Infinity, duration: 0.8, delay: 0.2 }}
                  className="w-1 bg-white rounded-full"
                />
                <motion.div
                  animate={{ height: [4, 8, 4] }}
                  transition={{ repeat: Infinity, duration: 0.8, delay: 0.4 }}
                  className="w-1 bg-white rounded-full"
                />
              </div>
            )}
          </motion.button>
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto space-y-6">
          <AnimatePresence mode="popLayout">
            {messages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`flex items-start gap-4 ${
                  message.type === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div className={`max-w-[80%] rounded-2xl p-4 ${
                  message.type === 'user'
                    ? 'bg-violet-600 text-white'
                    : 'bg-gray-800/80 backdrop-blur-sm'
                }`}>
                  <p className="text-lg">{message.content}</p>
                  <p className="text-xs text-gray-400 mt-2">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </motion.div>
            ))}
            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 text-gray-400"
              >
                <div className="flex gap-1">
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 1, delay: 0 }}
                    className="w-2 h-2 bg-violet-500 rounded-full"
                  />
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
                    className="w-2 h-2 bg-violet-500 rounded-full"
                  />
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}
                    className="w-2 h-2 bg-violet-500 rounded-full"
                  />
                </div>
                <span>AI is thinking...</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}