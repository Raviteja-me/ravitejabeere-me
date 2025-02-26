import React, { useState, useRef, useEffect } from 'react';
import { X, Maximize2, Loader } from 'lucide-react';
import Draggable from 'react-draggable';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import { Message, WindowPosition } from '../types';

interface ChatWindowProps {
  onClose: () => void;
}

export default function ChatWindow({ onClose }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [model, setModel] = useState('gpt-4');
  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [position, setPosition] = useState<WindowPosition>({ x: 0, y: 0 });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Reset scroll position when new messages are added
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, newMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'This is a demo response. In production, this would connect to the OpenAI API.'
      }]);
      setIsLoading(false);
    }, 1000);
  };

  const handleDragStop = (e: any, data: { x: number; y: number }) => {
    setPosition({ x: data.x, y: data.y });
  };

  const windowClasses = `
    ${isMaximized ? 'fixed inset-0 w-full h-full rounded-none' : 'w-[600px] h-[500px] rounded-xl'}
    ${isMinimized ? 'w-72 h-auto rounded-lg' : ''}
    bg-gray-900 shadow-2xl border border-white/10 overflow-hidden transition-all duration-300
  `;

  if (isMinimized) {
    return (
      <Draggable 
        handle=".drag-handle" 
        defaultPosition={position}
        onStop={handleDragStop}
        bounds="parent"
      >
        <div className="fixed w-72 bg-gray-900 rounded-lg shadow-lg 
                       border border-white/10 overflow-hidden z-50">
          <div className="drag-handle flex items-center justify-between p-3 bg-gray-800 
                         border-b border-white/10 cursor-move">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-white text-sm">AI Chat</span>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setIsMinimized(false)} 
                      className="text-white/60 hover:text-white">
                <Maximize2 className="w-4 h-4" />
              </button>
              <button onClick={onClose} className="text-white/60 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="p-3">
            <ChatInput
              input={input}
              setInput={setInput}
              handleSubmit={handleSubmit}
              isLoading={isLoading}
              fileInputRef={fileInputRef}
              isMinimized={true}
            />
          </div>
        </div>
      </Draggable>
    );
  }

  return (
    <div 
      style={{ 
        transform: isMaximized ? 'none' : 'translate(-50%, -50%)',
        transition: 'all 0.3s ease-in-out'
      }}
      className={`fixed ${isMaximized ? 'top-0 left-0' : 'top-1/2 left-1/2'} ${windowClasses}`}
    >
      <div className="flex items-center justify-between p-4 bg-gray-800 border-b border-white/10">
        <div className="flex items-center gap-4">
          <div className="flex gap-2">
            <button onClick={onClose} 
                    className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600" />
            <button onClick={() => setIsMinimized(true)}
                    className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-600" />
            <button onClick={() => setIsMaximized(!isMaximized)}
                    className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-600" />
          </div>
          <select 
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="bg-gray-700 text-white text-sm rounded-lg px-3 py-1 
                     border border-white/10">
            <option value="gpt-4">GPT-4</option>
            <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
          </select>
        </div>
      </div>

      <div ref={chatContainerRef} className="h-[calc(100%-8rem)] overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <ChatMessage key={index} message={message} />
        ))}
        {isLoading && (
          <div className="flex items-center gap-2 text-white/60">
            <Loader className="w-4 h-4 animate-spin" />
            <span>AI is thinking...</span>
          </div>
        )}
      </div>

      <ChatInput
        input={input}
        setInput={setInput}
        handleSubmit={handleSubmit}
        isLoading={isLoading}
        fileInputRef={fileInputRef}
      />
    </div>
  );
}