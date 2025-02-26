import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  fallbackSrc?: string;
  className?: string;
}

export default function ImageWithFallback({
  src,
  alt,
  fallbackSrc = "https://api.dicebear.com/7.x/avatars/svg?seed=fallback",
  className = ""
}: ImageWithFallbackProps) {
  const [imgSrc, setImgSrc] = useState<string>(src);
  const [isLoading, setIsLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;

  useEffect(() => {
    setImgSrc(src);
    setIsLoading(true);
    setRetryCount(0);
  }, [src]);

  const handleError = () => {
    if (retryCount < maxRetries) {
      // Retry loading the original image
      setRetryCount(prev => prev + 1);
      setImgSrc(`${src}?retry=${retryCount + 1}`);
    } else {
      // Use fallback after max retries
      setImgSrc(fallbackSrc);
    }
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-gray-800 animate-pulse rounded-inherit" />
      )}
      <motion.img
        src={imgSrc}
        alt={alt}
        onError={handleError}
        onLoad={handleLoad}
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoading ? 0 : 1 }}
        transition={{ duration: 0.3 }}
        className={`w-full h-full object-cover ${className}`}
        loading="lazy"
      />
    </div>
  );
}