import { initializeApp } from 'firebase/app';
import { getFirestore, enableIndexedDbPersistence, CACHE_SIZE_UNLIMITED } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import toast from 'react-hot-toast';
import { nanoid } from 'nanoid';

const firebaseConfig = {
  apiKey: "AIzaSyDznqgcDwOx_9gpTgVaCIUniQMZ9TDvLBE",
  authDomain: "pushpaka-rides-website-oaui41.firebaseapp.com",
  projectId: "pushpaka-rides-website-oaui41",
  storageBucket: "pushpaka-rides-website-oaui41.appspot.com",
  messagingSenderId: "266374400237",
  appId: "1:266374400237:web:e7bfce7b863e75d0f924e4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Configure Google Provider with custom parameters
export const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('profile');
googleProvider.addScope('email');
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Helper function for Google Sign In
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result;
  } catch (error: any) {
    if (error.code === 'auth/popup-blocked') {
      toast.error('Please allow popups for this site');
    } else if (error.code === 'auth/popup-closed-by-user') {
      // User closed popup, no need to show error
      return null;
    } else {
      toast.error('Failed to sign in with Google');
      console.error('Google Sign In Error:', error);
    }
    throw error;
  }
};

// Enable offline persistence with error handling
try {
  enableIndexedDbPersistence(db, {
    cacheSizeBytes: CACHE_SIZE_UNLIMITED
  });
} catch (err: any) {
  if (err.code === 'failed-precondition') {
    toast.error('Multiple tabs open, offline mode disabled');
  } else if (err.code === 'unimplemented') {
    toast.error('Browser doesn\'t support offline mode');
  }
}

// Collection references
export const collections = {
  users: 'users',
  posts: 'posts',
  channels: 'channels',
  messages: 'messages',
  courses: 'courses'
};

// Storage paths helper
export const getStoragePath = {
  profilePhoto: (userId: string, fileExt: string) => 
    `users/${userId}/profile-${nanoid()}.${fileExt}`,
  postImage: (userId: string, fileExt: string) => 
    `posts/${userId}/${nanoid()}.${fileExt}`,
  coverPhoto: (userId: string, fileExt: string) => 
    `users/${userId}/cover-${nanoid()}.${fileExt}`,
  courseContent: (courseId: string, fileExt: string) =>
    `courses/${courseId}/content-${nanoid()}.${fileExt}`
};