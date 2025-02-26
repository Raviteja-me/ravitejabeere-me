import React from 'react';
import { Send, PaperclipIcon } from 'lucide-react';

interface ChatInputProps {
  input: string;
  setInput: (value: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  fileInputRef: React.RefObject<HTMLInputElement>;
  isMinimized?: boolean;
}

export default function ChatInput({ 
  input, 
  setInput, 
  handleSubmit, 
  isLoading, 
  fileInputRef,
  isMinimized 
}: ChatInputProps) {
  if (isMinimized) {
    return (
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 bg-gray-700 text-white rounded-lg px-3 py-2 
                   text-sm border border-white/10 focus:outline-none"
        />
        <button 
          type="submit"
          className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700"
          disabled={!input.trim() || isLoading}>
          <Send className="w-4 h-4" />
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="absolute bottom-0 w-full p-4 bg-gray-800">
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="p-2 text-white/60 hover:text-white hover:bg-gray-700 rounded-lg"
        >
          <PaperclipIcon className="w-5 h-5" />
        </button>
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
        />
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 bg-gray-700 text-white rounded-lg px-4 py-2 
                   border border-white/10 focus:outline-none focus:border-blue-500"
        />
        <button 
          type="submit"
          className="bg-blue-600 text-white px-4 rounded-lg hover:bg-blue-700 
                   disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!input.trim() || isLoading}>
          <Send className="w-5 h-5" />
        </button>
      </div>
    </form>
  );
}