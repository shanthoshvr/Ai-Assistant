import { useState, useCallback, useEffect } from 'react';
import { getGeminiResponse } from '../services/gemini';
import { useVoice } from './useVoice';

export interface Message {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export const useNila = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [status, setStatus] = useState<'idle' | 'thinking' | 'speaking'>('idle');
  const { isListening, transcript, startListening, speak, isSupported } = useVoice();

  const handleAssistantResponse = useCallback((text: string) => {
    const assistantMessage: Message = { role: 'model', text, timestamp: new Date() };
    setMessages(prev => [...prev, assistantMessage]);
    setStatus('speaking');
    speak(text);
    setTimeout(() => setStatus('idle'), 2000); // Simple status reset
  }, [speak]);

  const processCommand = useCallback(async (input: string) => {
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', text: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setStatus('thinking');

    // System Command Detection
    const lowerInput = input.toLowerCase();
    if (lowerInput.includes('open google')) {
      window.open('https://www.google.com', '_blank');
      const response = "Opening Google for you.";
      handleAssistantResponse(response);
      return;
    }

    if (lowerInput.includes('open youtube')) {
      window.open('https://www.youtube.com', '_blank');
      const response = "Opening YouTube.";
      handleAssistantResponse(response);
      return;
    }

    // AI Conversation
    // We send the history BEFORE the current message to create the chat session
    const history = messages.map(m => ({
      role: m.role,
      parts: [{ text: m.text }]
    }));

    const aiResponse = await getGeminiResponse(input, history);
    handleAssistantResponse(aiResponse);
  }, [messages, handleAssistantResponse]);

  // Handle voice transcript updates
  useEffect(() => {
    if (transcript) {
      processCommand(transcript);
    }
  }, [transcript, processCommand]);

  return {
    messages,
    status,
    isListening,
    startListening,
    processCommand,
    isSupported
  };
};
