'use client';
import { useState, useCallback } from 'react';
import { apiClient } from '@/lib/api/apiClient';

interface Message { id: string; role: 'user' | 'bot'; content: string; }

export function useChatbot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const send = useCallback(async (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);
    try {
      const res = await apiClient.post<{ answer: string }>('/main/chatbot', { message: text });
      setMessages(prev => [...prev, { id: Date.now().toString() + 'b', role: 'bot', content: res.answer }]);
    } finally { setIsLoading(false); }
  }, []);

  return { messages, send, isLoading };
}
