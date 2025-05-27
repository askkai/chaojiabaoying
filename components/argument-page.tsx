"use client";

import { useState } from 'react';
import { ArgumentForm } from '@/components/argument-form';
import { ResponseDisplay } from '@/components/response-display';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { generateResponses } from '@/lib/api';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { Response } from '@/lib/types';

export function ArgumentPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [responses, setResponses] = useState<Response[]>([]);
  const [history, setHistory] = useLocalStorage<{
    opponentText: string;
    responses: Response[];
    intensity: number;
    timestamp: number;
  }[]>('argument-history', []);

  const handleSubmit = async (opponentText: string, intensity: number) => {
    setIsLoading(true);
    setResponses([]);

    try {
      const newResponses = await generateResponses(opponentText, intensity);
      setResponses(newResponses);
      
      // Save to history
      setHistory((prev) => [
        {
          opponentText,
          responses: newResponses,
          intensity,
          timestamp: Date.now(),
        },
        ...prev.slice(0, 9), // Keep only 10 latest entries
      ]);
    } catch (error) {
      console.error('Failed to generate responses:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-6 max-w-md">
        <div className="space-y-6">
          <ArgumentForm onSubmit={handleSubmit} isLoading={isLoading} />
          <ResponseDisplay 
            responses={responses} 
            isLoading={isLoading} 
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}