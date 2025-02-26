import React from 'react';
import { motion } from 'framer-motion';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { Check, Edit2, Trash2, Clock, AlertCircle, XCircle } from 'lucide-react';
import { Task } from '../types';
import { useTaskStore } from '../store/taskStore';
import { format } from 'date-fns';

interface TaskCardProps {
  task: Task;
}

const priorityConfig = {
  high: {
    color: 'bg-red-500',
    icon: AlertCircle,
    text: 'text-red-400'
  },
  medium: {
    color: 'bg-yellow-500',
    icon: AlertCircle,
    text: 'text-yellow-400'
  },
  low: {
    color: 'bg-green-500',
    icon: AlertCircle,
    text: 'text-green-400'
  }
};

export default function TaskCard({ task }: TaskCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
  });

  const style = {
    transform: CSS.Transform.toString({
      ...transform,
      scaleX: 1,
      scaleY: 1
    }),
    zIndex: isDragging ? 1000 : 1,
  };

  const { deleteTask, toggleTask } = useTaskStore();
  const PriorityIcon = priorityConfig[task.priority].icon;

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      animate={{
        scale: isDragging ? 1.05 : 1,
        boxShadow: isDragging ? '0 10px 20px rgba(0,0,0,0.2)' : '0 1px 3px rgba(0,0,0,0.1)',
        opacity: isDragging ? 0.9 : 1,
      }}
      transition={{
        duration: 0.15,
        ease: "easeInOut"
      }}
      className={`bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 cursor-move 
                border border-white/10 hover:border-purple-500/50
                group shadow-lg touch-none select-none
                ${isDragging ? 'ring-2 ring-purple-500/20' : ''}`}
      dragSnapToOrigin
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <PriorityIcon className={`w-4 h-4 ${priorityConfig[task.priority].text}`} />
            <h4 className={`font-medium ${task.completed ? 'line-through text-slate-500' : ''}`}>
              {task.title}
            </h4>
          </div>
          {task.failureReason && (
            <div className="flex items-start gap-2 mb-2 text-red-400 text-sm">
              <XCircle className="w-4 h-4 mt-0.5" />
              <p>{task.failureReason}</p>
            </div>
          )}
          {task.notes && (
            <p className="text-sm text-slate-400 mb-2">{task.notes}</p>
          )}
          {task.deadline && (
            <div className="flex items-center gap-1 text-sm text-slate-500">
              <Clock className="w-4 h-4" />
              {format(new Date(task.deadline), 'MMM d, yyyy')}
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => toggleTask(task.id)}
            className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <Check className={`w-4 h-4 ${
              task.completed ? 'text-green-400' : 'text-slate-400'
            }`} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => {}} // TODO: Implement edit
            className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <Edit2 className="w-4 h-4 text-slate-400" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => deleteTask(task.id)}
            className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4 text-slate-400" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}