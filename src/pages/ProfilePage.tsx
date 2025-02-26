import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { auth, db } from '../lib/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { User, MapPin, Globe, Twitter, Github, Linkedin, Mail, Edit2, Save, Camera } from 'lucide-react';
import toast from 'react-hot-toast';
import ImageUpload from '../components/profile/ImageUpload';
import PostCreate from '../components/profile/PostCreate';
import PostList from '../components/profile/PostList';
import { useFirestoreDoc } from '../hooks/useFirestore';

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [posts, setPosts] = useState([]);
  const [editForm, setEditForm] = useState({
    bio: '',
    location: '',
    website: '',
    social: {
      twitter: '',
      github: '',
      linkedin: ''
    }
  });

  const user = auth.currentUser;
  const { data: userData, loading } = useFirestoreDoc('users', user?.uid || '');

  useEffect(() => {
    if (userData) {
      setEditForm({
        bio: userData.bio || '',
        location: userData.location || '',
        website: userData.website || '',
        social: {
          twitter: userData.social?.twitter || '',
          github: userData.social?.github || '',
          linkedin: userData.social?.linkedin || ''
        }
      });
    }
  }, [userData]);

  const handleSave = async () => {
    try {
      if (!user) return;

      await updateDoc(doc(db, 'users', user.uid), {
        bio: editForm.bio,
        location: editForm.location,
        website: editForm.website,
        social: editForm.social
      });

      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  const handleProfilePhotoUpdate = async (url: string) => {
    if (!user) return;
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        photoURL: url
      });
    } catch (error) {
      console.error('Error updating profile in Firestore:', error);
    }
  };

  if (loading || !userData) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white"
    >
      {/* Cover Photo Section */}
      <div className="relative h-64 bg-gradient-to-r from-purple-500/20 to-pink-500/20">
        <label className="absolute bottom-4 right-4 p-2 bg-black/50 rounded-lg cursor-pointer
                       hover:bg-black/70 transition-colors flex items-center gap-2">
          <Camera className="w-5 h-5" />
          <span className="text-sm">Change Cover</span>
          <input type="file" accept="image/*" className="hidden" />
        </label>
      </div>

      <div className="max-w-4xl mx-auto px-4 -mt-20">
        {/* Profile Header */}
        <div className="flex items-end gap-6 mb-8">
          <ImageUpload
            currentPhotoURL={userData.photoURL}
            onSuccess={handleProfilePhotoUpdate}
          />
          <div className="flex-1 mb-4">
            <h1 className="text-3xl font-bold">{userData.name}</h1>
            <p className="text-gray-400">{userData.occupation}</p>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
          >
            {isEditing ? <Save onClick={handleSave} /> : <Edit2 />}
          </button>
        </div>

        {/* Profile Info */}
        {isEditing ? (
          <div className="space-y-6 mb-8">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Bio</label>
              <textarea
                value={editForm.bio}
                onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                className="w-full bg-gray-800/50 rounded-lg p-3 border border-white/10"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Location</label>
                <input
                  type="text"
                  value={editForm.location}
                  onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                  className="w-full bg-gray-800/50 rounded-lg px-3 py-2 border border-white/10"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Website</label>
                <input
                  type="text"
                  value={editForm.website}
                  onChange={(e) => setEditForm({ ...editForm, website: e.target.value })}
                  className="w-full bg-gray-800/50 rounded-lg px-3 py-2 border border-white/10"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Twitter</label>
                <input
                  type="text"
                  value={editForm.social.twitter}
                  onChange={(e) => setEditForm({
                    ...editForm,
                    social: { ...editForm.social, twitter: e.target.value }
                  })}
                  className="w-full bg-gray-800/50 rounded-lg px-3 py-2 border border-white/10"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">GitHub</label>
                <input
                  type="text"
                  value={editForm.social.github}
                  onChange={(e) => setEditForm({
                    ...editForm,
                    social: { ...editForm.social, github: e.target.value }
                  })}
                  className="w-full bg-gray-800/50 rounded-lg px-3 py-2 border border-white/10"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">LinkedIn</label>
                <input
                  type="text"
                  value={editForm.social.linkedin}
                  onChange={(e) => setEditForm({
                    ...editForm,
                    social: { ...editForm.social, linkedin: e.target.value }
                  })}
                  className="w-full bg-gray-800/50 rounded-lg px-3 py-2 border border-white/10"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6 mb-8">
            {userData.bio && (
              <p className="text-gray-300">{userData.bio}</p>
            )}

            <div className="flex flex-wrap gap-6">
              {userData.location && (
                <div className="flex items-center gap-2 text-gray-400">
                  <MapPin className="w-4 h-4" />
                  <span>{userData.location}</span>
                </div>
              )}
              {userData.website && (
                <div className="flex items-center gap-2 text-gray-400">
                  <Globe className="w-4 h-4" />
                  <a href={userData.website} target="_blank" rel="noopener noreferrer" 
                     className="hover:text-purple-400">
                    {userData.website.replace(/^https?:\/\//, '')}
                  </a>
                </div>
              )}
              <div className="flex items-center gap-2 text-gray-400">
                <Mail className="w-4 h-4" />
                <a href={`mailto:${userData.email}`} className="hover:text-purple-400">
                  {userData.email}
                </a>
              </div>
            </div>

            <div className="flex gap-4">
              {userData.social?.twitter && (
                <a href={`https://twitter.com/${userData.social.twitter}`}
                   target="_blank" rel="noopener noreferrer"
                   className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                  <Twitter className="w-5 h-5" />
                </a>
              )}
              {userData.social?.github && (
                <a href={`https://github.com/${userData.social.github}`}
                   target="_blank" rel="noopener noreferrer"
                   className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                  <Github className="w-5 h-5" />
                </a>
              )}
              {userData.social?.linkedin && (
                <a href={`https://linkedin.com/in/${userData.social.linkedin}`}
                   target="_blank" rel="noopener noreferrer"
                   className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                  <Linkedin className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>
        )}

        {/* Posts Section */}
        <div className="space-y-6">
          <PostCreate />
          <PostList posts={posts} />
        </div>
      </div>
    </motion.div>
  );
}