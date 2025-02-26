import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Users, Star, ChevronRight } from 'lucide-react';
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
  ratings?: {
    average: number;
    count: number;
  };
  enrollments?: number;
}

interface CourseCardProps {
  course: Course;
  onClick: () => void;
}

export default function CourseCard({ course, onClick }: CourseCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="bg-gray-800/50 backdrop-blur-xl rounded-xl border border-white/10 
                overflow-hidden cursor-pointer group"
    >
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent z-10" />
        <ImageWithFallback
          src={`https://source.unsplash.com/800x600/?${encodeURIComponent(course.category)}`}
          alt={course.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute bottom-4 left-4 z-20">
          <span className="px-2 py-1 bg-purple-500 rounded-lg text-sm font-medium">
            {course.category}
          </span>
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2 group-hover:text-purple-400 
                     transition-colors line-clamp-2">
          {course.title}
        </h3>
        <p className="text-gray-400 text-sm mb-4 line-clamp-2">
          {course.description}
        </p>

        <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {course.duration}
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            {course.enrollments || 0}
          </div>
          {course.ratings && (
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-400" />
              {course.ratings.average.toFixed(1)}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ImageWithFallback
              src={course.instructor.avatar}
              alt={course.instructor.name}
              className="w-8 h-8 rounded-full"
            />
            <div>
              <p className="text-sm font-medium">{course.instructor.name}</p>
              <p className="text-xs text-gray-400">Instructor</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold">${course.price}</span>
            <ChevronRight className="w-5 h-5 text-purple-400 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}