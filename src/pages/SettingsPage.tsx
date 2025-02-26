import React from 'react';
import { motion } from 'framer-motion';
import { 
  Moon, 
  Sun, 
  Bell, 
  Globe, 
  Shield, 
  Key, 
  Smartphone,
  Mail
} from 'lucide-react';
import { useThemeStore } from '../store/themeStore';

export default function SettingsPage() {
  const { theme, toggleTheme } = useThemeStore();

  const settingSections = [
    {
      title: 'Appearance',
      items: [
        {
          icon: theme === 'dark' ? Moon : Sun,
          label: 'Theme',
          description: 'Toggle between light and dark mode',
          action: (
            <button
              onClick={toggleTheme}
              className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-700"
            >
              <span className="sr-only">Toggle theme</span>
              <span
                className={`${
                  theme === 'dark' ? 'translate-x-6' : 'translate-x-1'
                } inline-block h-4 w-4 transform rounded-full bg-white transition`}
              />
            </button>
          )
        }
      ]
    },
    {
      title: 'Notifications',
      items: [
        {
          icon: Bell,
          label: 'Push Notifications',
          description: 'Receive notifications about updates and messages',
          action: (
            <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-700">
              <span className="sr-only">Enable notifications</span>
              <span className="translate-x-1 inline-block h-4 w-4 transform rounded-full bg-white transition" />
            </button>
          )
        },
        {
          icon: Mail,
          label: 'Email Notifications',
          description: 'Receive email updates about your account',
          action: (
            <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-700">
              <span className="sr-only">Enable email notifications</span>
              <span className="translate-x-1 inline-block h-4 w-4 transform rounded-full bg-white transition" />
            </button>
          )
        }
      ]
    },
    {
      title: 'Privacy & Security',
      items: [
        {
          icon: Shield,
          label: 'Two-Factor Authentication',
          description: 'Add an extra layer of security to your account',
          action: (
            <button className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm">
              Enable
            </button>
          )
        },
        {
          icon: Key,
          label: 'Change Password',
          description: 'Update your account password',
          action: (
            <button className="px-4 py-2 bg-gray-700 text-white rounded-lg text-sm">
              Update
            </button>
          )
        }
      ]
    },
    {
      title: 'Preferences',
      items: [
        {
          icon: Globe,
          label: 'Language',
          description: 'Choose your preferred language',
          action: (
            <select className="bg-gray-700 text-white rounded-lg px-3 py-2 text-sm">
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
            </select>
          )
        },
        {
          icon: Smartphone,
          label: 'Mobile Notifications',
          description: 'Manage how you receive mobile notifications',
          action: (
            <button className="px-4 py-2 bg-gray-700 text-white rounded-lg text-sm">
              Configure
            </button>
          )
        }
      ]
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-8"
    >
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Settings</h1>

        <div className="space-y-8">
          {settingSections.map((section, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-800/50 backdrop-blur-xl rounded-xl p-6 border border-white/10"
            >
              <h2 className="text-xl font-semibold mb-4">{section.title}</h2>
              <div className="space-y-4">
                {section.items.map((item, itemIndex) => (
                  <div
                    key={itemIndex}
                    className="flex items-center justify-between py-2"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2 rounded-lg bg-gray-700/50">
                        <item.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-medium">{item.label}</h3>
                        <p className="text-sm text-gray-400">{item.description}</p>
                      </div>
                    </div>
                    {item.action}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}