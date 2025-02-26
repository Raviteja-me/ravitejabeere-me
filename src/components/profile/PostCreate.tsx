import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Image, Send } from 'lucide-react';
import { db, storage, auth } from '../../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { nanoid } from 'nanoid';
import toast from 'react-hot-toast';

export default function PostCreate() {
  const [content, setContent] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB');
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Please upload a valid image file (JPEG, PNG, or WebP)');
      return;
    }

    setImage(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && !image) return;

    const user = auth.currentUser;
    if (!user) {
      toast.error('You must be logged in to post');
      return;
    }

    setIsLoading(true);
    const loadingToast = toast.loading('Creating post...');

    try {
      let imageUrl = null;

      if (image) {
        const fileExt = image.name.split('.').pop();
        const fileName = `${user.uid}-${nanoid()}.${fileExt}`;
        const storageRef = ref(storage, `post-images/${fileName}`);
        await uploadBytes(storageRef, image);
        imageUrl = await getDownloadURL(storageRef);
      }

      await addDoc(collection(db, 'posts'), {
        content: content.trim(),
        imageUrl,
        userId: user.uid,
        userName: user.displayName,
        userPhoto: user.photoURL,
        createdAt: serverTimestamp(),
        likes: 0,
        comments: 0
      });

      setContent('');
      setImage(null);
      toast.success('Post created!', { id: loadingToast });
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error('Failed to create post. Please try again.', { id: loadingToast });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-800/50 backdrop-blur-xl rounded-xl p-4 border border-white/10"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's on your mind?"
          className="w-full bg-transparent border-none outline-none resize-none 
                   placeholder:text-gray-500 text-white"
          rows={3}
        />

        {image && (
          <div className="relative">
            <img
              src={URL.createObjectURL(image)}
              alt="Post preview"
              className="w-full h-48 object-cover rounded-lg"
            />
            <button
              type="button"
              onClick={() => setImage(null)}
              className="absolute top-2 right-2 p-1 bg-black/50 rounded-full 
                       hover:bg-black/70 transition-colors"
            >
              ×
            </button>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <label className="p-2 hover:bg-gray-700/50 rounded-lg cursor-pointer transition-colors">
              <Image className="w-5 h-5 text-gray-400" />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
              />
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading || (!content.trim() && !image)}
            className="bg-purple-500 hover:bg-purple-600 disabled:opacity-50 
                     disabled:cursor-not-allowed px-4 py-2 rounded-lg flex items-center 
                     gap-2 transition-colors"
          >
            <Send className="w-4 h-4" />
            Post
          </button>
        </div>
      </form>
    </motion.div>
  );
}