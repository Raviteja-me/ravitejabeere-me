import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Dock from './components/Dock';
import MenuBar from './components/MenuBar';
import ChatPage from './pages/ChatPage';
import ProfilePage from './pages/ProfilePage';
import ImageGenPage from './pages/ImageGenPage';
import VoiceChatPage from './pages/VoiceChatPage';
import TodoPage from './pages/TodoPage';
import CommunityPage from './pages/CommunityPage';
import AuthPage from './pages/AuthPage';
import ProfileSetupPage from './pages/ProfileSetupPage';
import ServicesPage from './pages/ServicesPage';
import PackagesPage from './pages/PackagesPage';
import MyStoryPage from './pages/MyStoryPage';
import SettingsPage from './pages/SettingsPage';
import CoursesPage from './pages/CoursesPage';
import { HomePage } from './pages/HomePage';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './lib/firebase';
import { useThemeStore } from './store/themeStore';

function AppContent() {
  const [user, loading] = useAuthState(auth);
  const { theme } = useThemeStore();
  const backgroundImage = "https://firebasestorage.googleapis.com/v0/b/pushpaka-rides-website-oaui41.appspot.com/o/dasdsadsadsa.png?alt=media&token=cf05186e-bbcc-4330-b7c0-f28161e1442c";

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className={`${theme} min-h-screen relative overflow-hidden`}>
      {/* Background Image */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat z-0"
        style={{ 
          backgroundImage: `url(${backgroundImage})`,
          filter: 'blur(2px)',
          transform: 'scale(1.05)'
        }}
      />
      <div className="fixed inset-0 bg-black/40 z-0" />

      {/* Content */}
      <div className="relative z-10 min-h-screen">
        <MenuBar />
        <div className="pt-16 md:pt-20">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/auth" element={
              user ? <Navigate to="/" replace /> : <AuthPage />
            } />
            <Route path="/profile-setup" element={
              !user ? <Navigate to="/auth" replace /> : <ProfileSetupPage />
            } />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/packages" element={<PackagesPage />} />
            <Route path="/image-gen" element={<ImageGenPage />} />
            <Route path="/voice-chat" element={<VoiceChatPage />} />
            <Route path="/todo" element={<TodoPage />} />
            <Route path="/courses" element={<CoursesPage />} />
            <Route path="/community" element={
              !user ? <Navigate to="/auth" replace /> : <CommunityPage />
            } />
            <Route path="/my-story" element={<MyStoryPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </div>
        <Dock />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-center" />
      <AppContent />
    </BrowserRouter>
  );
}