import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DndContext, DragEndEvent, closestCorners } from '@dnd-kit/core';
import { format } from 'date-fns';
import { 
  Search, 
  BarChart2, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  XCircle,
  Plus,
  Filter,
  SlidersHorizontal,
  X
} from 'lucide-react';
import TaskColumn from '../components/TaskColumn';
import TaskForm from '../components/TaskForm';
import { useTaskStore } from '../store/taskStore';
import { Task, Column, Priority } from '../types';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../lib/firebase';
import PageTransition from '../components/PageTransition';

export default function TodoPage() {
  const [user] = useAuthState(auth);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState<Priority | 'all'>('all');
  const [showStats, setShowStats] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showFailureDialog, setShowFailureDialog] = useState(false);
  const [failureReason, setFailureReason] = useState('');
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  
  const { tasks, moveTask, loadUserTasks } = useTaskStore();

  useEffect(() => {
    if (user) {
      loadUserTasks();
    }
  }, [user]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const newStatus = over.id as Column;
    setDraggedTaskId(active.id as string);

    if (newStatus === 'failed') {
      setShowFailureDialog(true);
    } else {
      moveTask(active.id as string, newStatus);
    }
  };

  const handleFailureSubmit = () => {
    if (draggedTaskId && failureReason.trim()) {
      moveTask(draggedTaskId, 'failed', failureReason.trim());
      setShowFailureDialog(false);
      setFailureReason('');
      setDraggedTaskId(null);
    }
  };

  const filteredTasks = tasks.filter(task => 
    task.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (filterPriority === 'all' || task.priority === filterPriority)
  );

  const getColumnTasks = (column: Column) => 
    filteredTasks.filter(task => task.status === column);

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.completed).length,
    failed: tasks.filter(t => t.status === 'failed').length,
    high: tasks.filter(t => t.priority === 'high').length,
    upcoming: tasks.filter(t => t.deadline && new Date(t.deadline) > new Date()).length
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
        {/* Floating Action Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowTaskForm(true)}
          className="fixed bottom-8 right-8 w-16 h-16 rounded-full bg-gradient-to-r 
                   from-purple-500 to-pink-500 shadow-lg flex items-center justify-center
                   z-50"
        >
          <Plus className="w-8 h-8" />
        </motion.button>

        {/* Header */}
        <div className="sticky top-0 z-40 backdrop-blur-xl bg-gray-900/50 border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 
                             text-transparent bg-clip-text">
                  TaskMaster
                </h1>
                <p className="text-sm text-gray-400">
                  {format(new Date(), 'EEEE, MMMM do')}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowFilters(!showFilters)}
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors relative"
                >
                  <Filter className="w-5 h-5" />
                  {filterPriority !== 'all' && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-purple-500 rounded-full" />
                  )}
                </motion.button>

                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search tasks..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-64 bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2
                             placeholder:text-gray-500 focus:outline-none focus:ring-2 
                             focus:ring-purple-500/50"
                  />
                </div>
              </div>
            </div>

            {/* Stats Row */}
            {showStats && (
              <div className="grid grid-cols-5 gap-4 mt-4">
                <StatCard
                  label="Total Tasks"
                  value={stats.total}
                  icon={CheckCircle2}
                  trend={stats.total > 0 ? '+10%' : '0%'}
                />
                <StatCard
                  label="Completed"
                  value={stats.completed}
                  icon={CheckCircle2}
                  trend={stats.completed > 0 ? '+5%' : '0%'}
                  trendUp={true}
                />
                <StatCard
                  label="Failed"
                  value={stats.failed}
                  icon={XCircle}
                  trend={stats.failed > 0 ? '+2%' : '0%'}
                  trendUp={false}
                />
                <StatCard
                  label="High Priority"
                  value={stats.high}
                  icon={Clock}
                  trend={stats.high > 0 ? '+8%' : '0%'}
                />
                <StatCard
                  label="Upcoming"
                  value={stats.upcoming}
                  icon={Calendar}
                  trend={stats.upcoming > 0 ? '+15%' : '0%'}
                  trendUp={true}
                />
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 py-6">
          <DndContext onDragEnd={handleDragEnd} collisionDetection={closestCorners}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <TaskColumn
                title="To Do"
                icon={CheckCircle2}
                tasks={getColumnTasks('todo')}
                column="todo"
                color="from-blue-500/20 to-blue-600/20"
              />
              <TaskColumn
                title="In Progress"
                icon={Clock}
                tasks={getColumnTasks('inProgress')}
                column="inProgress"
                color="from-yellow-500/20 to-yellow-600/20"
              />
              <TaskColumn
                title="Completed"
                icon={CheckCircle2}
                tasks={getColumnTasks('completed')}
                column="completed"
                color="from-green-500/20 to-green-600/20"
              />
              <TaskColumn
                title="Failed"
                icon={XCircle}
                tasks={getColumnTasks('failed')}
                column="failed"
                color="from-red-500/20 to-red-600/20"
              />
            </div>
          </DndContext>
        </div>

        {/* Task Form Modal */}
        <AnimatePresence>
          {showTaskForm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center 
                       justify-center p-4 z-50"
              onClick={() => setShowTaskForm(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-gray-800 rounded-xl p-6 w-full max-w-lg"
                onClick={e => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">New Task</h2>
                  <button
                    onClick={() => setShowTaskForm(false)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <TaskForm onComplete={() => setShowTaskForm(false)} />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Filters Modal */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center 
                       justify-center p-4 z-50"
              onClick={() => setShowFilters(false)}
            >
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 20, opacity: 0 }}
                className="bg-gray-800 rounded-xl p-6 w-full max-w-md"
                onClick={e => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <SlidersHorizontal className="w-5 h-5" />
                    <h2 className="text-xl font-semibold">Filters</h2>
                  </div>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Priority
                    </label>
                    <select
                      value={filterPriority}
                      onChange={(e) => setFilterPriority(e.target.value as Priority | 'all')}
                      className="w-full bg-gray-700 rounded-lg px-4 py-2 focus:outline-none
                               focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="all">All Priorities</option>
                      <option value="high">High Priority</option>
                      <option value="medium">Medium Priority</option>
                      <option value="low">Low Priority</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between pt-4">
                    <button
                      onClick={() => {
                        setFilterPriority('all');
                        setSearchQuery('');
                      }}
                      className="text-sm text-gray-400 hover:text-white transition-colors"
                    >
                      Reset Filters
                    </button>
                    <button
                      onClick={() => setShowFilters(false)}
                      className="px-4 py-2 bg-purple-500 rounded-lg font-medium
                               hover:bg-purple-600 transition-colors"
                    >
                      Apply Filters
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Failure Reason Dialog */}
        <AnimatePresence>
          {showFailureDialog && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center 
                       justify-center p-4 z-50"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-gray-800 rounded-xl p-6 w-full max-w-md"
              >
                <h3 className="text-xl font-semibold mb-4">Why did this task fail?</h3>
                <textarea
                  value={failureReason}
                  onChange={(e) => setFailureReason(e.target.value)}
                  placeholder="Enter the reason for failure..."
                  className="w-full bg-gray-700 rounded-lg p-3 mb-4 min-h-[120px]
                           focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                />
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => {
                      setShowFailureDialog(false);
                      setFailureReason('');
                      setDraggedTaskId(null);
                    }}
                    className="px-4 py-2 text-gray-400 hover:text-white 
                             hover:bg-white/10 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleFailureSubmit}
                    disabled={!failureReason.trim()}
                    className="px-4 py-2 bg-purple-500 hover:bg-purple-600 
                             rounded-lg disabled:opacity-50"
                  >
                    Submit
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  );
}

interface StatCardProps {
  label: string;
  value: number;
  icon: React.ElementType;
  trend: string;
  trendUp?: boolean;
}

function StatCard({ label, value, icon: Icon, trend, trendUp }: StatCardProps) {
  return (
    <div className="bg-white/5 backdrop-blur-lg rounded-lg p-4 border border-white/10">
      <div className="flex items-center justify-between mb-2">
        <div className="p-2 bg-white/10 rounded-lg">
          <Icon className="w-5 h-5" />
        </div>
        <span className={`text-sm ${
          trendUp === undefined ? 'text-gray-400' :
          trendUp ? 'text-green-400' : 'text-red-400'
        }`}>
          {trend}
        </span>
      </div>
      <div className="text-2xl font-bold mb-1">{value}</div>
      <div className="text-sm text-gray-400">{label}</div>
    </div>
  );
}