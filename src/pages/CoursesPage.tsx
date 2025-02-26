import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Play, Clock, Book, Users, Star } from 'lucide-react';
import CourseCard from '../components/courses/CourseCard';
import CourseModal from '../components/courses/CourseModal';

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
  ratings?: {
    average: number;
    count: number;
  };
  enrollments?: number;
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const q = query(collection(db, 'courses'), orderBy('enrollments', 'desc'));
        const querySnapshot = await getDocs(q);
        const coursesData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Course[];
        setCourses(coursesData);
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const categories = ['All', 'Web Development', 'AI & ML', 'Mobile Development', 'Business'];

  const filteredCourses = courses.filter(course => 
    filter === 'all' || course.category.toLowerCase() === filter.toLowerCase()
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-8"
    >
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text">
          Learn and Grow with Our Courses
        </h1>
        <p className="text-xl text-gray-400 max-w-3xl mx-auto">
          Master new skills with in-depth courses taught by industry experts
        </p>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl p-4 border border-white/10">
          <div className="flex items-center gap-3 mb-2">
            <Play className="w-5 h-5 text-purple-400" />
            <span className="text-2xl font-bold">{courses.length}</span>
          </div>
          <p className="text-sm text-gray-400">Total Courses</p>
        </div>
        <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl p-4 border border-white/10">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="w-5 h-5 text-blue-400" />
            <span className="text-2xl font-bold">500+</span>
          </div>
          <p className="text-sm text-gray-400">Hours of Content</p>
        </div>
        <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl p-4 border border-white/10">
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-5 h-5 text-green-400" />
            <span className="text-2xl font-bold">1000+</span>
          </div>
          <p className="text-sm text-gray-400">Active Students</p>
        </div>
        <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl p-4 border border-white/10">
          <div className="flex items-center gap-3 mb-2">
            <Star className="w-5 h-5 text-yellow-400" />
            <span className="text-2xl font-bold">4.8</span>
          </div>
          <p className="text-sm text-gray-400">Average Rating</p>
        </div>
      </div>

      {/* Category Filter */}
      <div className="max-w-7xl mx-auto mb-8 flex gap-2 overflow-x-auto pb-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setFilter(category.toLowerCase())}
            className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
              filter === category.toLowerCase()
                ? 'bg-purple-500 text-white'
                : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Courses Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <CourseCard
            key={course.id}
            course={course}
            onClick={() => setSelectedCourse(course)}
          />
        ))}
      </div>

      {/* Course Modal */}
      {selectedCourse && (
        <CourseModal
          course={selectedCourse}
          onClose={() => setSelectedCourse(null)}
        />
      )}
    </motion.div>
  );
}