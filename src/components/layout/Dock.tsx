import React from 'react';
import { MessageSquare, Image, Mic, Car } from 'lucide-react';

interface DockItem {
  icon: React.ElementType;
  label: string;
  path: string;
  color: string;
  externalLink?: string;
  customIcon?: string;
}

export function Dock() {
  const dockItems: DockItem[] = [
    {
      icon: MessageSquare,
      label: 'Chat',
      path: '/chat',
      color: 'from-blue-500/20 to-blue-600/20'
    },
    {
      icon: Image,
      label: 'Image Generation',
      path: '/image',
      color: 'from-green-500/20 to-green-600/20'
    },
    {
      icon: Mic,
      label: 'Voice Chat',
      path: '/voice',
      color: 'from-purple-500/20 to-purple-600/20'
    },
    {
      icon: Car,
      label: 'Pushpaka',
      path: '/pushpaka',
      color: 'from-orange-500/20 to-orange-600/20',
      externalLink: 'https://pushpakarides.in',
      customIcon: 'https://storage.googleapis.com/pushpaka-rides-website-oaui41.appspot.com/Pushpaka.png'
    }
  ];

  const handleItemClick = (item: DockItem) => {
    if (item.externalLink) {
      window.open(item.externalLink, '_blank');
    }
  };

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2">
      <div className="dock flex items-center gap-4 bg-gray-800/50 backdrop-blur-xl px-6 py-3 rounded-2xl border border-white/10">
        {dockItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <div key={index} className="flex flex-col items-center">
              <button
                onClick={() => handleItemClick(item)}
                className="dock-item group relative p-3 rounded-xl bg-gradient-to-br hover:scale-110 transition-all"
              >
                {item.customIcon ? (
                  <img 
                    src={item.customIcon} 
                    alt={item.label}
                    className="w-6 h-6 object-contain"
                  />
                ) : (
                  <Icon className="w-6 h-6" />
                )}
                <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {item.label}
                </span>
              </button>
              <span className="text-xs mt-1 text-gray-400">{item.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}