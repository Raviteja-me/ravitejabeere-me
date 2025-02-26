import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Task, Column } from '../types';
import { auth, db } from '../lib/firebase';
import { 
  collection, 
  addDoc, 
  deleteDoc, 
  updateDoc, 
  doc, 
  query, 
  where, 
  getDocs 
} from 'firebase/firestore';

interface TaskStore {
  tasks: Task[];
  addTask: (task: Task) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  toggleTask: (id: string) => Promise<void>;
  moveTask: (id: string, newStatus: Column, failureReason?: string) => Promise<void>;
  loadUserTasks: () => Promise<void>;
}

export const useTaskStore = create<TaskStore>()(
  persist(
    (set, get) => ({
      tasks: [],
      
      addTask: async (task: Task) => {
        const user = auth.currentUser;
        if (user) {
          // Clean up task data for Firestore
          const taskData = {
            ...task,
            userId: user.uid,
            notes: task.notes || null,
            deadline: task.deadline || null,
            failureReason: task.failureReason || null
          };

          // Remove undefined values
          Object.keys(taskData).forEach(key => 
            taskData[key] === undefined && delete taskData[key]
          );

          // Add to Firestore
          const docRef = await addDoc(collection(db, 'tasks'), taskData);
          set((state) => ({
            tasks: [...state.tasks, { ...taskData, id: docRef.id }]
          }));
        } else {
          // Local only
          set((state) => ({
            tasks: [...state.tasks, task]
          }));
        }
      },

      deleteTask: async (id: string) => {
        const user = auth.currentUser;
        if (user) {
          // Delete from Firestore
          await deleteDoc(doc(db, 'tasks', id));
        }
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id)
        }));
      },

      toggleTask: async (id: string) => {
        const user = auth.currentUser;
        const task = get().tasks.find(t => t.id === id);
        if (!task) return;

        const updatedTask = { 
          ...task, 
          completed: !task.completed,
          status: !task.completed ? 'completed' as Column : 'todo' as Column
        };

        if (user && task.userId) {
          // Update in Firestore
          await updateDoc(doc(db, 'tasks', id), updatedTask);
        }

        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id ? updatedTask : t
          ),
        }));
      },

      moveTask: async (id: string, newStatus: Column, failureReason?: string) => {
        const user = auth.currentUser;
        const task = get().tasks.find(t => t.id === id);
        if (!task) return;

        const updatedTask = {
          ...task,
          status: newStatus,
          completed: newStatus === 'completed',
          failureReason: newStatus === 'failed' ? failureReason || null : null
        };

        if (user && task.userId) {
          // Update in Firestore
          await updateDoc(doc(db, 'tasks', id), updatedTask);
        }

        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id ? updatedTask : t
          ),
        }));
      },

      loadUserTasks: async () => {
        const user = auth.currentUser;
        if (!user) {
          set({ tasks: [] });
          return;
        }

        const q = query(collection(db, 'tasks'), where('userId', '==', user.uid));
        const querySnapshot = await getDocs(q);
        const userTasks = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Task[];

        set({ tasks: userTasks });
      },
    }),
    {
      name: 'task-storage',
      version: 1,
    }
  )
);