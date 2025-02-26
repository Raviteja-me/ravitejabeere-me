import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Maximize2, Minimize2, X } from 'lucide-react';
import Draggable from 'react-draggable';

interface Window {
  id: string;
  title: string;
  component: React.ReactNode;
  isMaximized: boolean;
  isMinimized: boolean;
  zIndex: number;
  position: { x: number; y: number };
  size: { width: number; height: number };
}

export const WindowContext = React.createContext<{
  openWindow: (id: string, title: string, component: React.ReactNode) => void;
  closeWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  maximizeWindow: (id: string) => void;
}>({
  openWindow: () => {},
  closeWindow: () => {},
  minimizeWindow: () => {},
  maximizeWindow: () => {},
});

export function WindowManager({ children }: { children: React.ReactNode }) {
  const [windows, setWindows] = useState<Window[]>([]);
  const [maxZIndex, setMaxZIndex] = useState(100);
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });
  const windowRefs = useRef<{ [key: string]: React.RefObject<HTMLDivElement> }>({});

  useEffect(() => {
    const updateWindowSize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    updateWindowSize();
    window.addEventListener('resize', updateWindowSize);
    return () => window.removeEventListener('resize', updateWindowSize);
  }, []);

  const getInitialWindowSize = () => ({
    width: Math.min(800, windowSize.width * 0.8),
    height: Math.min(600, windowSize.height * 0.8)
  });

  const openWindow = (id: string, title: string, component: React.ReactNode) => {
    const existingWindow = windows.find(w => w.id === id);
    if (existingWindow) {
      if (existingWindow.isMinimized) {
        minimizeWindow(id);
      }
      bringToFront(id);
      return;
    }

    const newZIndex = maxZIndex + 1;
    setMaxZIndex(newZIndex);
    
    const size = getInitialWindowSize();
    const x = (windowSize.width - size.width) / 2;
    const y = (windowSize.height - size.height) / 2;
    
    windowRefs.current[id] = React.createRef();
    
    setWindows(prev => [...prev, {
      id,
      title,
      component,
      isMaximized: false,
      isMinimized: false,
      zIndex: newZIndex,
      position: { x, y },
      size
    }]);
  };

  const closeWindow = (id: string) => {
    setWindows(prev => prev.filter(w => w.id !== id));
    delete windowRefs.current[id];
  };

  const minimizeWindow = (id: string) => {
    setWindows(prev => prev.map(w => 
      w.id === id ? { ...w, isMinimized: !w.isMinimized } : w
    ));
  };

  const maximizeWindow = (id: string) => {
    setWindows(prev => prev.map(w => 
      w.id === id ? { ...w, isMaximized: !w.isMaximized } : w
    ));
  };

  const bringToFront = (id: string) => {
    const newZIndex = maxZIndex + 1;
    setMaxZIndex(newZIndex);
    setWindows(prev => prev.map(w => 
      w.id === id ? { ...w, zIndex: newZIndex } : w
    ));
  };

  return (
    <WindowContext.Provider value={{ openWindow, closeWindow, minimizeWindow, maximizeWindow }}>
      {children}

      <div className="fixed inset-0 pointer-events-none">
        <AnimatePresence>
          {windows.map(window => (
            <Draggable
              key={window.id}
              handle=".window-handle"
              disabled={window.isMaximized}
              defaultPosition={window.position}
              bounds="parent"
              nodeRef={windowRefs.current[window.id]}
            >
              <motion.div
                ref={windowRefs.current[window.id]}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ 
                  opacity: 1, 
                  scale: 1,
                  width: window.isMaximized ? '100%' : window.size.width,
                  height: window.isMaximized ? '100%' : window.size.height,
                  x: window.isMaximized ? 0 : undefined,
                  y: window.isMaximized ? 0 : undefined,
                  transition: { duration: 0.2 }
                }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`absolute ${window.isMaximized ? 'inset-0' : ''} 
                         ${window.isMinimized ? 'hidden' : ''} 
                         bg-gray-900/95 backdrop-blur-xl rounded-lg border border-white/10 
                         overflow-hidden shadow-2xl pointer-events-auto flex flex-col`}
                style={{ 
                  zIndex: window.zIndex,
                  minWidth: '320px',
                  minHeight: '240px',
                  maxWidth: window.isMaximized ? '100%' : '90vw',
                  maxHeight: window.isMaximized ? '100%' : '90vh'
                }}
                onClick={() => bringToFront(window.id)}
              >
                {/* Window Header */}
                <div className="window-handle flex items-center justify-between px-4 py-3 
                              bg-gray-800/50 border-b border-white/10 cursor-move select-none">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          closeWindow(window.id);
                        }}
                        className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600"
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          minimizeWindow(window.id);
                        }}
                        className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-600"
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          maximizeWindow(window.id);
                        }}
                        className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-600"
                      />
                    </div>
                    <h3 className="text-sm font-medium ml-4">{window.title}</h3>
                  </div>
                </div>

                {/* Window Content */}
                <div className="flex-1 overflow-auto">
                  {window.component}
                </div>
              </motion.div>
            </Draggable>
          ))}
        </AnimatePresence>
      </div>
    </WindowContext.Provider>
  );
}