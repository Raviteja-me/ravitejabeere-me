import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../lib/firebase';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { Users, Hash, Send, Plus, Settings } from 'lucide-react';
import ChannelList from '../components/community/ChannelList';
import MessageList from '../components/community/MessageList';
import UserList from '../components/community/UserList';

export default function CommunityPage() {
  const [user] = useAuthState(auth);
  const [messages, setMessages] = useState([]);
  const [currentChannel, setCurrentChannel] = useState('general');
  const [input, setInput] = useState('');

  useEffect(() => {
    if (!currentChannel) return;

    const q = query(
      collection(db, `channels/${currentChannel}/messages`),
      orderBy('createdAt')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMessages(messages);
    });

    return () => unsubscribe();
  }, [currentChannel]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    try {
      await addDoc(collection(db, `channels/${currentChannel}/messages`), {
        text: input,
        createdAt: serverTimestamp(),
        userId: user.uid,
        userName: user.displayName,
        userPhoto: user.photoURL
      });
      setInput('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-gray-900 text-white flex"
    >
      {/* Channels Sidebar */}
      <div className="w-60 bg-gray-800 border-r border-white/10">
        <div className="p-4 border-b border-white/10">
          <h1 className="text-xl font-bold">Community</h1>
        </div>
        <ChannelList
          currentChannel={currentChannel}
          onChannelSelect={setCurrentChannel}
        />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Channel Header */}
        <div className="h-16 border-b border-white/10 flex items-center px-4 bg-gray-800">
          <Hash className="w-5 h-5 text-gray-400 mr-2" />
          <span className="font-medium">{currentChannel}</span>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4">
          <MessageList messages={messages} currentUser={user} />
        </div>

        {/* Message Input */}
        <form onSubmit={sendMessage} className="p-4 border-t border-white/10">
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <Plus className="w-5 h-5 text-gray-400" />
            </button>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Message #${currentChannel}`}
              className="flex-1 bg-gray-700 rounded-lg px-4 py-2 focus:outline-none"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors
                       disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </form>
      </div>

      {/* Members Sidebar */}
      <div className="w-60 bg-gray-800 border-l border-white/10">
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <h2 className="font-medium">Members</h2>
          <Users className="w-5 h-5 text-gray-400" />
        </div>
        <UserList channelId={currentChannel} />
      </div>
    </motion.div>
  );
}