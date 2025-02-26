import React from 'react';
import { motion } from 'framer-motion';
import { 
  Rocket, 
  Brain, 
  Globe, 
  Clock, 
  MapPin, 
  Wrench,
  MessageSquare,
  Calendar,
  IndianRupee
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const packages = [
  {
    icon: Rocket,
    title: "Startup Booster",
    price: 2500,
    description: "Perfect for startups or small businesses looking to make their mark.",
    features: [
      "Android/iOS App Development (Basic)",
      "Responsive Website",
      "Business Consulting (1 Month)",
      "Marketing Strategy Setup"
    ]
  },
  {
    icon: Brain,
    title: "AI-Powered Growth",
    price: 5000,
    description: "Ideal for businesses looking to scale with AI.",
    features: [
      "AI Integration (Chatbots, Automation)",
      "AI-Powered Analytics",
      "SaaS App Development",
      "Training for Your Team"
    ]
  },
  {
    icon: Globe,
    title: "Complete Digital Makeover",
    price: 12500,
    description: "Comprehensive solutions for businesses ready to modernize.",
    features: [
      "End-to-End App Development",
      "CRM Setup and Integration",
      "Digital Marketing Plan",
      "One Year of Support"
    ]
  }
];

const additionalServices = [
  {
    icon: Clock,
    title: "One-to-One Sessions",
    description: "Personalized training or consulting on any technology.",
    rate: "$100/hour"
  },
  {
    icon: MapPin,
    title: "On-Site Visits",
    description: "On-demand consulting at your office.",
    rate: "$1,000/day + travel"
  },
  {
    icon: Wrench,
    title: "Quick Fixes",
    description: "One-time solutions for technical or business problems.",
    rate: "From $250"
  }
];

export default function PackagesPage() {
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
          Choose the Right Package for You
        </h1>
        <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-4">
          Select from our carefully designed service bundles or explore personalized options tailored to your needs.
        </p>
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500/20 to-green-600/20 
                      px-4 py-2 rounded-lg border border-green-500/30">
          <IndianRupee className="w-4 h-4 text-green-400" />
          <span className="text-green-400">Special 50% discount for Indian clients!</span>
        </div>
      </div>

      {/* Packages Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        {packages.map((pkg, index) => (
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
                <pkg.icon className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold">{pkg.title}</h3>
            </div>
            <p className="text-gray-400 mb-4">{pkg.description}</p>
            <ul className="space-y-2 mb-6">
              {pkg.features.map((feature, idx) => (
                <li key={idx} className="flex items-center gap-2 text-sm text-gray-300">
                  <div className="w-1 h-1 rounded-full bg-purple-400" />
                  {feature}
                </li>
              ))}
            </ul>
            <div className="border-t border-white/10 pt-4">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <p className="text-sm text-gray-400">Starting from</p>
                  <p className="text-2xl font-bold">${pkg.price.toLocaleString()}</p>
                </div>
                <button
                  onClick={() => navigate('/chat')}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-2 
                           rounded-lg font-medium hover:opacity-90 transition-opacity"
                >
                  Get Started
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Additional Services */}
      <div className="max-w-6xl mx-auto mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center">Additional Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {additionalServices.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-800/50 backdrop-blur-xl rounded-xl p-6 border border-white/10"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20">
                  <service.icon className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="text-lg font-semibold">{service.title}</h3>
              </div>
              <p className="text-gray-400 mb-4">{service.description}</p>
              <div className="text-sm">
                <p className="text-white">{service.rate}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-6xl mx-auto text-center">
        <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl p-8 border border-white/10">
          <h2 className="text-2xl font-bold mb-4">Need a Custom Quote?</h2>
          <p className="text-gray-400 mb-6">
            Let's discuss your requirements and create a package that perfectly fits your needs.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => navigate('/chat')}
              className="bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-3 
                       rounded-lg font-semibold flex items-center gap-2 
                       hover:opacity-90 transition-opacity"
            >
              <MessageSquare className="w-5 h-5" />
              Chat Now
            </button>
            <button
              onClick={() => window.open('https://calendly.com/ravitejabeere')}
              className="bg-white/10 hover:bg-white/20 px-6 py-3 rounded-lg
                       flex items-center gap-2 transition-colors"
            >
              <Calendar className="w-5 h-5" />
              Schedule a Call
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}