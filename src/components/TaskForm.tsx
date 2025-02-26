import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, AlertCircle } from 'lucide-react';
import { useTaskStore } from '../store/taskStore';
import { Priority } from '../types';
import { nanoid } from 'nanoid';

interface TaskFormProps {
  onComplete?: () => void;
}

export default function TaskForm({ onComplete }: TaskFormProps) {
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [deadline, setDeadline] = useState('');

  const { addTask } = useTaskStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newTask = {
      id: nanoid(),
      title: title.trim(),
      notes: notes.trim() || null,
      priority,
      deadline: deadline || null,
      status: 'todo' as const,
      completed: false,
      createdAt: new Date().toISOString(),
    };

    await addTask(newTask);
    onComplete?.();
    
    // Reset form
    setTitle('');
    setNotes('');
    setPriority('medium');
    setDeadline('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <input
          type="text"
          placeholder="Task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full bg-gray-700/50 rounded-lg px-4 py-3 text-lg
                   placeholder:text-gray-500 focus:outline-none focus:ring-2 
                   focus:ring-purple-500 border border-white/10"
          autoFocus
        />
      </div>

      <div>
        <textarea
          placeholder="Add notes or description..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full bg-gray-700/50 rounded-lg p-4 min-h-[120px]
                   placeholder:text-gray-500 focus:outline-none focus:ring-2
                   focus:ring-purple-500 border border-white/10 resize-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Priority
          </label>
          <div className="relative">
            <AlertCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as Priority)}
              className="w-full bg-gray-700/50 rounded-lg pl-10 pr-4 py-2
                       appearance-none focus:outline-none focus:ring-2
                       focus:ring-purple-500 border border-white/10"
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Deadline
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full bg-gray-700/50 rounded-lg pl-10 pr-4 py-2
                       focus:outline-none focus:ring-2 focus:ring-purple-500
                       border border-white/10"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <motion.button
          type="submit"
          disabled={!title.trim()}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500
                   rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Create Task
        </motion.button>
      </div>
    </form>
  );
}