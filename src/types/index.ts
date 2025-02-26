export type Priority = 'low' | 'medium' | 'high';
export type Column = 'todo' | 'inProgress' | 'completed' | 'failed';

export interface Task {
  id: string;
  title: string;
  notes?: string;
  priority: Priority;
  deadline?: string;
  status: Column;
  completed: boolean;
  createdAt: string;
  userId?: string;
  failureReason?: string;
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  attachment?: string;
}