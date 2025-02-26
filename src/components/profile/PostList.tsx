import React from 'react';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, Share2 } from 'lucide-react';
import { format } from 'date-fns';
import ImageWithFallback from '../ImageWithFallback';

interface Post {
  id: string;
  content: string;
  imageUrl?: string;
  userId: string;
  userName: string;
  userPhoto: string;
  createdAt: any;
  likes: number;
  comments: number;
}

interface PostListProps {
  posts: Post[];
}

export default function PostList({ posts }: PostListProps) {
  return (
    <div className="space-y-6">
      {posts.map((post, index) => (
        <motion.div
          key={post.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-gray-800/50 backdrop-blur-xl rounded-xl p-4 border border-white/10"
        >
          <div className="flex items-center gap-3 mb-4">
            <ImageWithFallback
              src={post.userPhoto}
              alt={post.userName}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <h3 className="font-medium">{post.userName}</h3>
              <p className="text-sm text-gray-400">
                {post.createdAt?.toDate() && format(post.createdAt.toDate(), 'MMM d, yyyy')}
              </p>
            </div>
          </div>

          <p className="text-gray-200 mb-4">{post.content}</p>

          {post.imageUrl && (
            <ImageWithFallback
              src={post.imageUrl}
              alt="Post"
              className="w-full rounded-lg mb-4 aspect-video object-cover"
            />
          )}

          <div className="flex items-center gap-6 text-gray-400">
            <button className="flex items-center gap-2 hover:text-purple-400 transition-colors">
              <Heart className="w-5 h-5" />
              {post.likes}
            </button>
            <button className="flex items-center gap-2 hover:text-purple-400 transition-colors">
              <MessageCircle className="w-5 h-5" />
              {post.comments}
            </button>
            <button className="flex items-center gap-2 hover:text-purple-400 transition-colors">
              <Share2 className="w-5 h-5" />
              Share
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  );
}