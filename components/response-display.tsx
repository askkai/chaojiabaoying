"use client";

import { useState, useEffect } from 'react';
import { Response } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ResponseDisplayProps {
  responses: Response[];
  isLoading: boolean;
}

export function ResponseDisplay({ responses, isLoading }: ResponseDisplayProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [displayedTexts, setDisplayedTexts] = useState<string[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (responses.length > 0) {
      setIsAnimating(true);
      setDisplayedTexts(responses.map(() => ''));
      
      responses.forEach((response, responseIndex) => {
        const text = response.content;
        let charIndex = 0;
        
        const interval = setInterval(() => {
          if (charIndex <= text.length) {
            setDisplayedTexts(prev => 
              prev.map((t, i) => 
                i === responseIndex ? text.slice(0, charIndex) : t
              )
            );
            charIndex++;
          } else {
            clearInterval(interval);
            if (responseIndex === responses.length - 1) {
              setIsAnimating(false);
            }
          }
        }, 30); // Adjust speed here (lower = faster)

        return () => clearInterval(interval);
      });
    }
  }, [responses]);

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-10 space-y-4 bg-white rounded-lg shadow">
        <Loader2 className="h-10 w-10 text-[#07C160] animate-spin" />
        <p className="text-gray-600 text-center">正在生成强有力的回复...</p>
      </div>
    );
  }

  if (responses.length === 0) {
    return null;
  }

  return (
    <AnimatePresence>
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">精彩回复:</h2>
        {responses.map((response, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start">
              <div className="bg-[#95EC69] rounded-lg p-3 max-w-[90%] text-black">
                <p className="text-base break-words">
                  {displayedTexts[index]}
                  {isAnimating && index === displayedTexts.findIndex(t => t.length < response.content.length) && (
                    <span className="animate-pulse">|</span>
                  )}
                </p>
              </div>
              
              <button
                onClick={() => copyToClipboard(response.content, index)}
                className="text-xs px-2 py-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
                disabled={isAnimating}
              >
                {copiedIndex === index ? '已复制' : '复制'}
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </AnimatePresence>
  );
}