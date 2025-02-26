import React from 'react';
import { Hash } from 'lucide-react';

const channels = ['general', 'introductions', 'projects', 'random'];

interface ChannelListProps {
  currentChannel: string;
  onChannelSelect: (channel: string) => void;
}

export default function ChannelList({ currentChannel, onChannelSelect }: ChannelListProps) {
  return (
    <div className="p-2 space-y-1">
      {channels.map((channel) => (
        <button
          key={channel}
          onClick={() => onChannelSelect(channel)}
          className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg 
                     transition-colors ${
                       currentChannel === channel
                         ? 'bg-gray-700 text-white'
                         : 'text-gray-400 hover:bg-gray-700/50 hover:text-gray-200'
                     }`}
        >
          <Hash className="w-4 h-4" />
          {channel}
        </button>
      ))}
    </div>
  );
}