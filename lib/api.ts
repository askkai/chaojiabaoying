"use client";

import { Response, OpenRouterResponse } from '@/lib/types';

const API_KEY = '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';
const MODEL = 'deepseek/deepseek-chat-v3-0324';

export async function generateResponses(
  opponentText: string,
  intensity: number
): Promise<Response[]> {
  try {
    const prompt = createPrompt(opponentText, intensity);
    
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
        'HTTP-Referer': encodeURIComponent(window.location.origin),
        'X-Title': encodeURIComponent('吵架包赢 | Win Every Argument'),
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          {
            role: 'system',
            content: '你是一个善于辩论的助手，擅长根据对方的话语生成强有力的反驳。你的回复应该尖锐、机智、有力，但不要使用明显的侮辱性语言。'
          },
          {
            role: 'user',
            content: prompt
          }
        ]
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('API error:', errorData);
      throw new Error('Failed to generate responses');
    }

    const data = await response.json() as OpenRouterResponse;
    
    // Parse the response
    const content = data.choices[0].message.content;
    
    // Split into 3 responses
    const responseArray = parseResponses(content);
    
    return responseArray.map(content => ({
      content,
      intensity,
    }));
  } catch (error) {
    console.error('Error generating responses:', error);
    return [
      { content: '抱歉，生成回复时出现了问题，请重试。', intensity },
      { content: '网络连接可能不稳定，请检查后再试一次。', intensity },
      { content: '如果问题持续存在，请尝试刷新页面。', intensity },
    ];
  }
}

function createPrompt(opponentText: string, intensity: number): string {
  return `
对方在争论中说了这段话: "${opponentText}"

请根据这段话，帮我生成3条强有力的反驳，语气强度为${intensity}/10。
要求:
1. 每条反驳必须有理有据，针对对方的论点进行反击
2. 语言要简洁有力，一针见血
3. 反驳要有说服力，能让对方哑口无言
4. 随着强度增加，态度可以更加强硬，但不要使用明显的侮辱性语言
5. 直接输出3条反驳，每条使用数字编号，不要有多余的解释

请确保输出格式为:
1. [第一条反驳]
2. [第二条反驳]
3. [第三条反驳]
`;
}

function parseResponses(content: string): string[] {
  // Try to extract numbered responses
  const regex = /\d+\.\s+(.*?)(?=\d+\.|$)/gs;
  const matches = [...content.matchAll(regex)];
  
  if (matches.length >= 3) {
    return matches.slice(0, 3).map(match => match[1].trim());
  }
  
  // Fallback: split by newlines and clean up
  const lines = content.split('\n').filter(line => line.trim().length > 0);
  
  if (lines.length >= 3) {
    return lines.slice(0, 3).map(line => {
      // Remove number prefixes like "1. " if present
      return line.replace(/^\d+\.\s+/, '').trim();
    });
  }
  
  // Last resort: just split the content into 3 parts
  return [
    content.substring(0, content.length / 3).trim(),
    content.substring(content.length / 3, 2 * content.length / 3).trim(),
    content.substring(2 * content.length / 3).trim()
  ].filter(Boolean);
}