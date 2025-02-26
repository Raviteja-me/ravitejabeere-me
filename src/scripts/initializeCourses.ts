import { db } from '../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

const sampleCourses = [
  {
    title: "Complete Web Development Bootcamp",
    price: 499,
    category: "Web Development",
    level: "Beginner to Advanced",
    duration: "40 hours",
    description: "Master full-stack web development from scratch with modern technologies and best practices.",
    instructor: {
      name: "Ravi Teja",
      bio: "Senior Full Stack Developer",
      avatar: "https://firebasestorage.googleapis.com/v0/b/pushpaka-rides-website-oaui41.appspot.com/o/profile.jpg"
    },
    modules: [
      {
        title: "HTML & CSS Fundamentals",
        videos: [
          {
            title: "Introduction to HTML",
            url: "https://example.com/video1",
            duration: "15:00"
          },
          {
            title: "CSS Basics",
            url: "https://example.com/video2",
            duration: "20:00"
          }
        ],
        resources: [
          {
            title: "HTML Cheat Sheet",
            url: "https://example.com/resource1",
            type: "PDF"
          }
        ]
      }
    ],
    features: [
      "24/7 Support",
      "Project-based learning",
      "Certificate on completion"
    ]
  },
  {
    title: "AI for Business",
    price: 299,
    category: "AI & ML",
    level: "Intermediate",
    duration: "25 hours",
    description: "Learn how to leverage AI tools and technologies to transform your business.",
    instructor: {
      name: "Ravi Teja",
      bio: "AI Consultant",
      avatar: "https://firebasestorage.googleapis.com/v0/b/pushpaka-rides-website-oaui41.appspot.com/o/profile.jpg"
    },
    modules: [
      {
        title: "Introduction to AI",
        videos: [
          {
            title: "What is AI?",
            url: "https://example.com/video1",
            duration: "10:00"
          }
        ],
        resources: [
          {
            title: "AI Tools Guide",
            url: "https://example.com/resource1",
            type: "PDF"
          }
        ]
      }
    ],
    features: [
      "Real-world case studies",
      "Hands-on projects",
      "Industry insights"
    ]
  }
];

export const initializeCourses = async () => {
  try {
    for (const course of sampleCourses) {
      await addDoc(collection(db, 'courses'), {
        ...course,
        createdAt: new Date(),
        enrollments: Math.floor(Math.random() * 1000),
        ratings: {
          average: 4.5 + Math.random() * 0.5,
          count: Math.floor(Math.random() * 500)
        }
      });
    }
    console.log('Courses initialized successfully');
  } catch (error) {
    console.error('Error initializing courses:', error);
  }
};