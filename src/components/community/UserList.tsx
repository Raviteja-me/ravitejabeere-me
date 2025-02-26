import React, { useState, useEffect } from 'react';
import { collection, query, onSnapshot } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Circle } from 'lucide-react';

interface User {
  id: string;
  name: string;
  photo: string;
  online: boolean;
}

interface UserListProps {
  channelId: string;
}

export default function UserList({ channelId }: UserListProps) {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'users'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const users = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as User[];
      setUsers(users);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="p-2">
      {users.map((user) => (
        <div
          key={user.id}
          className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-700/50
                     transition-colors cursor-pointer"
        >
          <div className="relative">
            <img
              src={user.photo || `https://api.dicebear.com/7.x/avatars/svg?seed=${user.id}`}
              alt={user.name}
              className="w-8 h-8 rounded-full"
            />
            <Circle
              className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full ${
                user.online ? 'text-green-500' : 'text-gray-500'
              }`}
              fill="currentColor"
            />
          </div>
          <span className="text-sm font-medium">{user.name}</span>
        </div>
      ))}
    </div>
  );
}