import React, { useRef } from 'react';
import { Camera } from 'lucide-react';
import { storage, auth, db } from '../../lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, updateDoc } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
import toast from 'react-hot-toast';
import { nanoid } from 'nanoid';
import ImageWithFallback from '../ImageWithFallback';

interface ImageUploadProps {
  currentPhotoURL: string | null;
  onSuccess: (url: string) => void;
}

export default function ImageUpload({ currentPhotoURL, onSuccess }: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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

    const loadingToast = toast.loading('Uploading image...');

    try {
      const user = auth.currentUser;
      if (!user) throw new Error('No user found');

      const fileExt = file.name.split('.').pop() || 'jpeg';
      const fileName = `${nanoid()}.${fileExt}`;
      const storagePath = `users/${user.uid}/${fileName}`;
      const storageRef = ref(storage, storagePath);
      
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);

      await updateProfile(user, { photoURL: downloadURL });
      await updateDoc(doc(db, 'users', user.uid), {
        photoURL: downloadURL,
        updatedAt: new Date().toISOString()
      });

      onSuccess(downloadURL);
      toast.success('Profile photo updated successfully!', { id: loadingToast });
    } catch (error: any) {
      console.error('Error uploading image:', error);
      let errorMessage = 'Failed to upload image. Please try again.';
      
      if (error.code === 'storage/unauthorized') {
        errorMessage = 'Permission denied. Please sign out and sign in again.';
      } else if (error.code === 'storage/quota-exceeded') {
        errorMessage = 'Storage quota exceeded. Please contact support.';
      }
      
      toast.error(errorMessage, { id: loadingToast });
    }
  };

  return (
    <div className="relative group">
      <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-purple-500/50">
        <ImageWithFallback
          src={currentPhotoURL || `https://api.dicebear.com/7.x/avatars/svg?seed=${auth.currentUser?.uid}`}
          alt="Profile"
          className="w-full h-full object-cover"
        />
      </div>
      <button
        onClick={() => fileInputRef.current?.click()}
        className="absolute bottom-0 right-0 p-2 bg-purple-500 rounded-full 
                 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity
                 hover:bg-purple-600 smooth-transition"
      >
        <Camera className="w-5 h-5 text-white" />
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleImageUpload}
        className="hidden"
      />
    </div>
  );
}