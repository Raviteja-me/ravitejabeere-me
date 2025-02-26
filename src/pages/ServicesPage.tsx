import React from 'react';
import { motion } from 'framer-motion';
import { 
  Smartphone, 
  Globe, 
  Brain, 
  Video, 
  BookOpen, 
  Code,
  MessageSquare,
  ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const services = [
  {
    icon: Smartphone,
    title: "Application Development",
    description: "Custom mobile and web applications built with cutting-edge technology.",
    items: ["Android Apps", "iOS Apps", "Web Apps", "AI-Powered Apps", "SaaS Applications"]
  },
  {
    icon: Brain,
    title: "AI-Powered Solutions",
    description: "Intelligent solutions to automate and optimize your business processes.",
    items: ["Customized AI Solutions", "Chatbots", "AI Analytics", "Content Generation"]
  },
  {
    icon: Globe,
    title: "Business Consulting",
    description: "Strategic guidance to help your business grow and succeed.",
    items: ["Process Optimization", "Tech Consulting", "Strategic Planning", "Digital Transformation"]
  },
  {
    icon: Video,
    title: "Content Creation",
    description: "Professional video editing and content development services.",
    items: ["Video Editing", "Content Writing", "Channel Management", "Social Media"]
  },
  {
    icon: BookOpen,
    title: "AI Training",
    description: "Learn to leverage AI tools and technologies effectively.",
    items: ["AI Workshops", "One-to-One Training", "Corporate Training"]
  },
  {
    icon: Code,
    title: "Custom Software",
    description: "Tailored software solutions for your specific needs.",
    items: ["End-to-End Solutions", "API Development", "CRM Systems"]
  }
];

export default function ServicesPage() {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-8"
    >
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto mb-16 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text">
          Explore What I Can Do for You
        </h1>
        <p className="text-xl text-gray-400 max-w-3xl mx-auto">
          From application development to AI solutions, I bring expertise and innovation to help you succeed.
        </p>
      </div>

      {/* Services Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        {services.map((service, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gray-800/50 backdrop-blur-xl rounded-xl p-6 border border-white/10 
                     hover:border-purple-500/50 transition-all group"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20">
                <service.icon className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold">{service.title}</h3>
            </div>
            <p className="text-gray-400 mb-4">{service.description}</p>
            <ul className="space-y-2 mb-6">
              {service.items.map((item, idx) => (
                <li key={idx} className="flex items-center gap-2 text-sm text-gray-300">
                  <div className="w-1 h-1 rounded-full bg-purple-400" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>

      {/* CTA Section */}
      <div className="max-w-6xl mx-auto text-center">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/packages')}
          className="bg-gradient-to-r from-purple-500 to-pink-500 px-8 py-4 rounded-lg
                   font-semibold flex items-center gap-2 mx-auto hover:opacity-90 transition-opacity"
        >
          View Pricing Packages
          <ArrowRight className="w-5 h-5" />
        </motion.button>
      </div>

      {/* Contact Section */}
      <div className="max-w-6xl mx-auto mt-16 text-center">
        <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl p-8 border border-white/10">
          <h2 className="text-2xl font-bold mb-4">Need a Custom Solution?</h2>
          <p className="text-gray-400 mb-6">
            Let's discuss your specific requirements and create a tailored solution for you.
          </p>
          <button
            onClick={() => navigate('/chat')}
            className="bg-white/10 hover:bg-white/20 px-6 py-3 rounded-lg
                     flex items-center gap-2 mx-auto transition-colors"
          >
            <MessageSquare className="w-5 h-5" />
            Start a Conversation
          </button>
        </div>
      </div>
    </motion.div>
  );
}