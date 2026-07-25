'use client';

import React, { useState, useEffect, useRef } from 'react';
import { X, Sparkles, Send, Bot, User, RefreshCw } from 'lucide-react';
import { Article } from '@/lib/types';
import { useAuth } from '@/context/AuthContext';

interface AiCompanionModalProps {
  article: Article | null;
  isOpen: boolean;
  onClose: () => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

const PRESET_QUESTIONS = [
  { label: '💡 Explain this simply', text: 'Explain this article simply in plain language.' },
  { label: '🤔 Why is this important?', text: 'Why is this technology story important to the industry?' },
  { label: '🌍 What is the impact?', text: 'What is the real-world impact and future potential of this development?' },
  { label: '🧠 What should I remember?', text: 'What are the top key takeaways I should remember from this story?' },
];

export function AiCompanionModal({ article, isOpen, onClose }: AiCompanionModalProps) {
  const { user, openAuthModal } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Clean raw markdown symbols like ###, **, *, etc. for conversational text
  const cleanConversationalText = (text: string) => {
    return text
      .replace(/#{1,6}\s?/g, '')
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/^[\s]*[-*+]\s+/gm, '• ');
  };

  useEffect(() => {
    if (article && isOpen) {
      const initialMessage: ChatMessage = {
        id: `welcome-${article.id}`,
        sender: 'ai',
        text: `Hi there! I am your TechChurn AI assistant. Feel free to ask me anything about "${article.title}", or choose one of the quick questions below!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages([initialMessage]);
      setInputQuery('');
    }
  }, [article?.id, isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  if (!isOpen || !article) return null;

  const handleSendQuestion = async (questionText: string) => {
    if (!questionText.trim()) return;

    if (!user) {
      openAuthModal('Please sign in to ask AI questions about tech articles');
      return;
    }

    const uniqueId = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    const userMsg: ChatMessage = {
      id: uniqueId,
      sender: 'user',
      text: questionText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsTyping(true);

    try {
      const res = await fetch('/api/ai/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          articleTitle: article.title,
          articleSummary: article.summary,
          articleContent: article.content,
          category: article.category,
          question: questionText,
        }),
      });

      const data = await res.json();
      if (res.ok && data.answer) {
        const replyId = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
        setMessages((prev) => [
          ...prev,
          {
            id: replyId,
            sender: 'ai',
            text: cleanConversationalText(data.answer),
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      } else {
        const errorId = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
        setMessages((prev) => [
          ...prev,
          {
            id: errorId,
            sender: 'ai',
            text: 'I am unable to answer right now. Please try asking again in a moment!',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      }
    } catch {
      const errorId = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      setMessages((prev) => [
        ...prev,
        {
          id: errorId,
          sender: 'ai',
          text: 'Network error communicating with AI server. Please check your connection.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-neutral-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-neutral-950/90 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-400 p-0.5 flex items-center justify-center shadow-lg shadow-purple-500/20">
              <div className="w-full h-full bg-neutral-950 rounded-[14px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-cyan-400" />
              </div>
            </div>
            <div>
              <h3 className="text-base font-bold text-neutral-100 flex items-center gap-2">
                TechChurn AI Assistant
              </h3>
              <p className="text-xs text-neutral-400 truncate max-w-[280px] sm:max-w-[400px]">
                Article: {article.title}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Preset Prompt Buttons */}
        <div className="p-3 bg-neutral-950/50 border-b border-neutral-800/60 overflow-x-auto flex gap-2 scrollbar-none">
          {PRESET_QUESTIONS.map((q) => (
            <button
              key={q.label}
              onClick={() => handleSendQuestion(q.text)}
              disabled={isTyping}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-neutral-800/80 hover:bg-neutral-700 text-neutral-300 hover:text-cyan-300 border border-neutral-700/60 whitespace-nowrap transition-all duration-200 shrink-0 flex items-center gap-1.5"
            >
              {q.label}
            </button>
          ))}
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-neutral-900/40">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'ai' && (
                <div className="w-8 h-8 rounded-full bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 text-cyan-400" />
                </div>
              )}

              <div
                className={`max-w-[82%] p-4 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-line shadow-md ${
                  msg.sender === 'user'
                    ? 'bg-gradient-to-r from-cyan-600 to-indigo-600 text-white rounded-br-none'
                    : 'bg-neutral-800/90 text-neutral-200 border border-neutral-700/60 rounded-bl-none'
                }`}
              >
                {msg.text}
                <div className={`text-[10px] mt-2 font-mono ${msg.sender === 'user' ? 'text-cyan-200/70 text-right' : 'text-neutral-500'}`}>
                  {msg.timestamp}
                </div>
              </div>

              {msg.sender === 'user' && (
                <div className="w-8 h-8 rounded-full bg-cyan-600/30 border border-cyan-500/40 flex items-center justify-center shrink-0">
                  <User className="w-4 h-4 text-cyan-300" />
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-3 text-neutral-400 text-xs">
              <div className="w-8 h-8 rounded-full bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 text-cyan-400 animate-pulse" />
              </div>
              <div className="flex items-center gap-1.5 bg-neutral-800 px-4 py-3 rounded-2xl border border-neutral-700">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-cyan-400" />
                <span>TechChurn AI is thinking...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendQuestion(inputQuery);
          }}
          className="p-3 sm:p-4 bg-neutral-950 border-t border-neutral-800 flex gap-2"
        >
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder={user ? "Ask anything about this story..." : "Sign in to ask AI questions..."}
            disabled={isTyping}
            className="flex-1 bg-neutral-900 border border-neutral-800 focus:border-cyan-500 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none transition-colors"
          />
          <button
            type="submit"
            disabled={isTyping || !inputQuery.trim()}
            className="px-4 py-2.5 rounded-xl font-bold bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 disabled:opacity-50 text-white shadow-md flex items-center justify-center transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
