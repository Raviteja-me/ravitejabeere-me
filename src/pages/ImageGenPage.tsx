import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Loader, ImageIcon, Sparkles } from 'lucide-react';
import axios from 'axios';

export default function ImageGenPage() {
  const [prompt, setPrompt] = useState('');
  const [image, setImage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const generateImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsLoading(true);
    setError('');
    try {
      const response = await axios.post('https://api.openai.com/v1/images/generations', {
        model: "dall-e-3",
        prompt: prompt,
        n: 1,
        size: "1024x1024",
      }, {
        headers: {
          'Authorization': `Bearer sk-mpePIsFXAJGEdLzDbvdT3nB86lrpzu-ytM6u4WL_N4T3BlbkFJ3IFqGdIuTA1TxSVQ4RIfUSp08XtCVlP2Gf7ykN6B8A`,
          'Content-Type': 'application/json',
        }
      });

      setImage(response.data.data[0].url);
    } catch (err) {
      setError('Failed to generate image. Please try again.');
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!image) return;
    
    try {
      const response = await axios({
        url: image,
        method: 'GET',
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `ai-generated-${Date.now()}.png`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download error:', err);
      setError('Failed to download image. Please try again.');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-8"
    >
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <motion.div
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            className="inline-block p-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 mb-6"
          >
            <ImageIcon className="w-8 h-8" />
          </motion.div>
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text">
            AI Image Generator
          </h1>
          <p className="text-gray-400">Transform your ideas into stunning visuals with AI</p>
        </div>

        <form onSubmit={generateImage} className="mb-12">
          <div className="flex gap-4">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the image you want to create..."
              className="flex-1 bg-gray-800 rounded-lg px-6 py-4 focus:outline-none focus:ring-2 
                       focus:ring-purple-500 border border-gray-700"
            />
            <button
              type="submit"
              disabled={!prompt.trim() || isLoading}
              className="bg-gradient-to-r from-purple-500 to-pink-500 px-8 py-4 rounded-lg 
                       font-semibold flex items-center gap-2 hover:opacity-90 transition-opacity
                       disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader className="w-5 h-5 animate-spin" />
              ) : (
                <Sparkles className="w-5 h-5" />
              )}
              Generate
            </button>
          </div>
        </form>

        {error && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-red-500 text-center mb-8 p-4 bg-red-500/10 rounded-lg"
          >
            {error}
          </motion.div>
        )}

        {image && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative group"
          >
            <img
              src={image}
              alt="Generated"
              className="w-full rounded-lg shadow-2xl"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleDownload}
              className="absolute bottom-4 right-4 bg-white text-gray-900 px-4 py-2 rounded-lg
                       font-semibold flex items-center gap-2 opacity-0 group-hover:opacity-100
                       transition-opacity shadow-lg hover:bg-gray-100"
            >
              <Download className="w-5 h-5" />
              Download
            </motion.button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}