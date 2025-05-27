"use client";

import { useState, useEffect } from 'react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { MessageSquare, Loader2 } from 'lucide-react';

interface ArgumentFormProps {
  onSubmit: (opponentText: string, intensity: number) => void;
  isLoading: boolean;
}

export function ArgumentForm({ onSubmit, isLoading }: ArgumentFormProps) {
  const [opponentText, setOpponentText] = useState('');
  const [intensity, setIntensity] = useState(5);
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    setIsFormValid(opponentText.trim().length > 0);
  }, [opponentText]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid && !isLoading) {
      onSubmit(opponentText.trim(), intensity);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-5 transition-all duration-200 hover:shadow-lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="opponentText" className="block text-lg font-medium mb-2 text-gray-700">
            对方说了什么？
          </label>
          <Textarea
            id="opponentText"
            placeholder="输入对方的话..."
            value={opponentText}
            onChange={(e) => setOpponentText(e.target.value)}
            className="min-h-[100px] text-base border-gray-300 focus:border-[#07C160] focus:ring-[#07C160]"
          />
        </div>
        
        <div>
          <label htmlFor="intensity" className="block text-lg font-medium mb-2 text-gray-700">
            语气强烈程度: {intensity}
          </label>
          <div className="flex items-center px-1">
            <span className="text-sm text-gray-500">温和</span>
            <Slider
              id="intensity"
              min={1}
              max={10}
              step={1}
              value={[intensity]}
              onValueChange={(value) => setIntensity(value[0])}
              className="mx-4 flex-1"
            />
            <span className="text-sm text-gray-500">强烈</span>
          </div>
        </div>

        <div className="pt-2">
          <Button
            type="submit"
            disabled={!isFormValid || isLoading}
            className="w-full h-12 text-lg bg-[#07C160] hover:bg-[#06A050] transition-colors"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                生成中...
              </span>
            ) : (
              <span className="flex items-center justify-center">
                <MessageSquare className="mr-2 h-5 w-5" />
                开始吵架
              </span>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}