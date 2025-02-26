import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { Task } from '../types';
import TaskCard from './TaskCard';
import { LucideIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface TaskColumnProps {
  title: string;
  icon: LucideIcon;
  tasks: Task[];
  column: string;
  color: string;
}

export default function TaskColumn({ title, icon: Icon, tasks, column, color }: TaskColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: column,
  });

  return (
    <motion.div
      ref={setNodeRef}
      animate={{
        scale: isOver ? 1.02 : 1,
        borderColor: isOver ? 'rgba(168, 85, 247, 0.5)' : 'rgba(255, 255, 255, 0.1)',
        transition: { duration: 0.15 }
      }}
      className={`bg-gradient-to-br ${color} rounded-xl border-2 border-white/10 
                backdrop-blur-xl p-6 h-[calc(100vh-12rem)] overflow-hidden flex flex-col
                ${isOver ? 'shadow-lg ring-2 ring-purple-500/20' : ''}`}
    >
      <div className="flex items-center gap-3 mb-6">
        <div className={`p-2 rounded-lg bg-slate-800/50`}>
          <Icon className="w-5 h-5" />
        </div>
        <h3 className="text-lg font-medium">{title}</h3>
        <span className="ml-auto text-sm text-slate-400 bg-slate-700/50 
                      px-2.5 py-0.5 rounded-full">
          {tasks.length}
        </span>
      </div>
      
      <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
        <AnimatePresence mode="popLayout">
          {tasks.map((task) => (
            <motion.div
              key={task.id}
              layout
              layoutId={task.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 25,
                mass: 0.5
              }}
            >
              <TaskCard task={task} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}