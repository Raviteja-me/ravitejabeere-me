import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, FileText, MessageCircle, Download } from 'lucide-react';
import ImageWithFallback from '../ImageWithFallback';

interface Course {
  id: string;
  title: string;
  price: number;
  category: string;
  level: string;
  duration: string;
  description: string;
  instructor: {
    name: string;
    bio: string;
    avatar: string;
  };
  modules: {
    title: string;
    videos: {
      title: string;
      url: string;
      duration: string;
    }[];
    resources: {
      title: string;
      url: string;
      type: string;
    }[];
  }[];
  features: string[];
}

interface CourseModalProps {
  course: Course;
  onClose: () => void;
}

export default function CourseModal({ course, onClose }: CourseModalProps) {
  const [selectedTab, setSelectedTab] = useState<'content' | 'resources' | 'discussion'>('content');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center 
                justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-gray-900 rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative h-64">
          <ImageWithFallback
            src={`https://source.unsplash.com/1600x900/?${encodeURIComponent(course.category)}`}
            alt={course.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent" />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-lg bg-black/50 
                     hover:bg-black/70 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="absolute bottom-4 left-4">
            <h2 className="text-2xl font-bold mb-2">{course.title}</h2>
            <div className="flex items-center gap-4 text-sm">
              <span className="px-2 py-1 bg-purple-500 rounded-lg">
                {course.category}
              </span>
              <span className="text-gray-400">{course.level}</span>
              <span className="text-gray-400">{course.duration}</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-800">
          <div className="flex">
            <button
              onClick={() => setSelectedTab('content')}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                selectedTab === 'content'
                  ? 'border-purple-500 text-purple-500'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              Course Content
            </button>
            <button
              onClick={() => setSelectedTab('resources')}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                selectedTab === 'resources'
                  ? 'border-purple-500 text-purple-500'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              Resources
            </button>
            <button
              onClick={() => setSelectedTab('discussion')}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                selectedTab === 'discussion'
                  ? 'border-purple-500 text-purple-500'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              Discussion
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-24rem)]">
          <AnimatePresence mode="wait">
            {selectedTab === 'content' && (
              <motion.div
                key="content"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                {course.modules.map((module, index) => (
                  <div key={index} className="space-y-4">
                    <h3 className="text-lg font-semibold">{module.title}</h3>
                    <div className="space-y-2">
                      {module.videos.map((video, vIndex) => (
                        <div
                          key={vIndex}
                          className="flex items-center gap-4 p-3 bg-gray-800/50 
                                   rounded-lg hover:bg-gray-800 transition-colors"
                        >
                          <Play className="w-5 h-5 text-purple-400" />
                          <div className="flex-1">
                            <p className="font-medium">{video.title}</p>
                            <p className="text-sm text-gray-400">{video.duration}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {selectedTab === 'resources' && (
              <motion.div
                key="resources"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-4"
              >
                {course.modules.map((module) =>
                  module.resources.map((resource, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 p-4 bg-gray-800/50 
                               rounded-lg hover:bg-gray-800 transition-colors"
                    >
                      <FileText className="w-5 h-5 text-purple-400" />
                      <div className="flex-1">
                        <p className="font-medium">{resource.title}</p>
                        <p className="text-sm text-gray-400">{resource.type}</p>
                      </div>
                      <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
                        <Download className="w-5 h-5" />
                      </button>
                    </div>
                  ))
                )}
              </motion.div>
            )}

            {selectedTab === 'discussion' && (
              <motion.div
                key="discussion"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-4"
              >
                <div className="flex items-center gap-4 mb-6">
                  <MessageCircle className="w-6 h-6 text-purple-400" />
                  <h3 className="text-lg font-semibold">Course Discussion</h3>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-6 text-center">
                  <p className="text-gray-400">
                    Join the course to participate in discussions
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-800 flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold">${course.price}</p>
            <p className="text-sm text-gray-400">One-time payment</p>
          </div>
          <button className="px-6 py-3 bg-purple-500 hover:bg-purple-600 
                         rounded-lg font-semibold transition-colors">
            Enroll Now
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}