import React from 'react';
import { motion } from 'framer-motion';
import { 
  GraduationCap, 
  Briefcase, 
  Code, 
  Youtube, 
  TrendingUp,
  Rocket,
  Award,
  Heart,
  Star,
  Coffee
} from 'lucide-react';

interface TimelineEvent {
  year: string;
  title: string;
  description: string;
  icon: React.ElementType;
  category: string;
  details?: string[];
}

const timeline: TimelineEvent[] = [
  {
    year: '1996',
    title: 'Born in Anantapur',
    description: 'Started my journey in the beautiful city of Anantapur, Andhra Pradesh',
    icon: Heart,
    category: 'Personal'
  },
  {
    year: '2014',
    title: 'Higher Secondary Education',
    description: 'Completed schooling from Keshava Reddy Schools & Narayana Jr College with over 85% marks',
    icon: Star,
    category: 'Education'
  },
  {
    year: '2016',
    title: 'Bachelor of Business Administration',
    description: 'Graduated from Patna University with distinction',
    icon: GraduationCap,
    category: 'Education'
  },
  {
    year: '2018',
    title: 'MBA from Reva University',
    description: 'Specialized in HR & Marketing at Reva University, Bangalore',
    icon: GraduationCap,
    category: 'Education',
    details: [
      'Specialized in HR & Marketing',
      'Active participant in college events',
      'Developed leadership skills through various activities'
    ]
  },
  {
    year: '2018-2019',
    title: 'Axis Bank',
    description: 'Relationship Officer handling high-net-worth clients',
    icon: Briefcase,
    category: 'Career',
    details: [
      'Managed portfolio of high-net-worth clients',
      'Achieved 120% of quarterly targets',
      'Developed strong client relationships'
    ]
  },
  {
    year: '2019-2020',
    title: 'Sales & Quality Analyst',
    description: 'Gained experience in sales strategies and quality management',
    icon: TrendingUp,
    category: 'Career'
  },
  {
    year: '2020-2022',
    title: 'Persistent Systems',
    description: 'Started as Developer, promoted to Team Lead in 5 months',
    icon: Code,
    category: 'Career',
    details: [
      'Rapid promotion to Team Lead',
      'Led multiple successful projects',
      'Specialized in Salesforce development',
      'Mentored junior developers'
    ]
  },
  {
    year: '2021',
    title: 'YouTube Channel Launch',
    description: 'Started "Sunshine: The Real School" for Indian students',
    icon: Youtube,
    category: 'Entrepreneurship',
    details: [
      'Educational content creation',
      'Video editing and production',
      'Growing community of learners'
    ]
  },
  {
    year: '2022-Present',
    title: 'Freelance Consultant',
    description: 'Technical & AI Business Consultant',
    icon: Coffee,
    category: 'Career',
    details: [
      'AI integration specialist',
      'Mobile app development (Android & iOS)',
      'Web & SaaS applications',
      'Payment gateway consultancy',
      'Stock market education'
    ]
  },
  {
    year: '2023',
    title: 'Pushpaka Project',
    description: 'Launched commission-free ride-booking platform',
    icon: Rocket,
    category: 'Achievement',
    details: [
      'Innovative pricing model',
      'Focus on driver benefits',
      'Advanced route optimization',
      'Real-time tracking features'
    ]
  }
];

export default function MyStoryPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-8"
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            className="text-5xl font-bold mb-6 bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 
                     text-transparent bg-clip-text"
          >
            My Journey
          </motion.h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            From business graduate to tech innovator, my path has been shaped by curiosity, 
            creativity, and a passion for building impactful solutions.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full 
                        bg-gradient-to-b from-amber-500 via-orange-500 to-red-500" />

          {/* Events */}
          {timeline.map((event, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative flex items-center mb-12 ${
                index % 2 === 0 ? 'justify-start' : 'justify-end'
              }`}
            >
              {/* Content */}
              <div className={`w-5/12 ${index % 2 === 0 ? 'pr-12' : 'pl-12'}`}>
                <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl p-6 
                             border border-white/10 hover:border-amber-500/50 
                             transition-all group">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 rounded-lg bg-gradient-to-br from-amber-500/20 to-red-500/20">
                      <event.icon className="w-6 h-6 text-amber-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">{event.title}</h3>
                      <p className="text-amber-400">{event.year}</p>
                    </div>
                  </div>
                  <p className="text-gray-300 mb-4">{event.description}</p>
                  {event.details && (
                    <ul className="space-y-2">
                      {event.details.map((detail, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm text-gray-400">
                          <div className="w-1 h-1 rounded-full bg-amber-400" />
                          {detail}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              {/* Timeline dot */}
              <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 
                           bg-amber-500 rounded-full border-4 border-gray-900" />
            </motion.div>
          ))}
        </div>

        {/* Skills Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-24 text-center"
        >
          <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-amber-400 to-red-500 
                       text-transparent bg-clip-text">
            Skills & Expertise
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              'Full Stack Development',
              'AI Integration',
              'Mobile App Development',
              'Video Editing',
              'Business Consulting',
              'Technical Leadership',
              'Stock Market Analysis',
              'Content Creation'
            ].map((skill, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-800/50 backdrop-blur-xl rounded-lg p-4 border border-white/10
                         hover:border-amber-500/50 transition-all"
              >
                {skill}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}