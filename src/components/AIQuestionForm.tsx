'use client';

import { useState, useEffect, useRef } from 'react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

interface UsageInfo {
  limit: number;
  remaining: number;
  resetDate: string;
}

const STORAGE_KEY = 'coffee-faq-chat-history';

function loadChatHistory(): ChatMessage[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveChatHistory(messages: ChatMessage[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  } catch {
    // localStorage might be full or unavailable
  }
}

export default function AIQuestionForm() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [usage, setUsage] = useState<UsageInfo | null>(null);
  const [usageLoading, setUsageLoading] = useState(true);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Load history on mount
  useEffect(() => {
    const history = loadChatHistory();
    setMessages(history);
    setIsInitialized(true);
  }, []);

  // Fetch usage info on mount
  useEffect(() => {
    async function fetchUsage() {
      try {
        const res = await fetch('/api/faq-ai');
        if (res.ok) {
          const data = await res.json();
          setUsage(data);
        }
      } catch {
        // silently fail
      } finally {
        setUsageLoading(false);
      }
    }
    fetchUsage();
  }, []);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (isInitialized) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isInitialized]);

  const handleSend = async () => {
    const question = input.trim();
    if (!question || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: question,
      timestamp: Date.now(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);
    saveChatHistory(updatedMessages);

    try {
      const res = await fetch('/api/faq-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, history: updatedMessages.slice(-10) }),
      });

      const data = await res.json();

      // Update usage info from response
      if (data.limit !== undefined && data.remaining !== undefined) {
        setUsage({ limit: data.limit, remaining: data.remaining, resetDate: data.resetDate });
      }

      if (!res.ok) {
        throw new Error(data.error || 'Gagal mendapatkan jawaban');
      }

      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: data.answer,
        timestamp: Date.now(),
      };

      const finalMessages = [...updatedMessages, assistantMessage];
      setMessages(finalMessages);
      saveChatHistory(finalMessages);
    } catch (err) {
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content:
          err instanceof Error
            ? `Maaf, terjadi kesalahan: ${err.message}`
            : 'Maaf, terjadi kesalahan. Silakan coba lagi.',
        timestamp: Date.now(),
      };
      const finalMessages = [...updatedMessages, errorMessage];
      setMessages(finalMessages);
      saveChatHistory(finalMessages);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearHistory = () => {
    setMessages([]);
    saveChatHistory([]);
  };

  const isQuotaExhausted = usage !== null && usage.remaining <= 0;

  const suggestedQuestions = [
    'Apa perbedaan Arabica dan Robusta?',
    'Bagaimana cara menyimpan kopi?',
    'Apakah ada minimal pembelian?',
    'Berapa lama waktu pengiriman?',
  ];

  // Auto-resize textarea
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 120)}px`;
    }
  }, [input]);

  return (
    <div className="bg-surface-card border border-border rounded-xl overflow-hidden flex flex-col h-[500px]">
      {/* Header */}
      <div className="px-5 py-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gold/20 flex items-center justify-center">
            <svg className="w-5 h-5 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-text-primary">Tanya AI</h3>
            <p className="text-xs text-text-secondary">Bertanya tentang kopi & pesanan</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Quota Badge */}
          {usage && !usageLoading && (
            <div
              className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${
                usage.remaining <= 3
                  ? 'text-red-500 border-red-500/30 bg-red-500/10'
                  : 'text-text-secondary border-border bg-surface-alt'
              }`}
              title={`Sisa ${usage.remaining} dari ${usage.limit} pertanyaan hari ini`}
            >
              {usage.remaining}/{usage.limit}
            </div>
          )}
          {messages.length > 0 && (
            <button
              onClick={clearHistory}
              className="text-xs text-text-secondary hover:text-red-500 transition-colors px-2 py-1 rounded hover:bg-red-500/10"
              title="Hapus riwayat chat"
            >
              Hapus
            </button>
          )}
        </div>
      </div>

      {/* Quota Exhausted Banner */}
      {isQuotaExhausted && (
        <div className="mx-3 mt-3 px-3 py-2 bg-red-500/10 border border-red-500/30 rounded-lg">
          <div className="flex items-start gap-2">
            <svg className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <div>
              <p className="text-xs font-medium text-red-600">
                Batas chat harian tercapai
              </p>
              <p className="text-[11px] text-red-500/80 mt-0.5">
                Kamu sudah mencapai batas {usage?.limit} pertanyaan hari ini. Silakan hubungi kami via WhatsApp atau Email.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
              </svg>
            </div>
            <p className="text-text-secondary text-sm mb-3">
              Tanya apa saja tentang kopi atau pesanan!
            </p>
            <div className="flex flex-wrap gap-2 justify-center max-w-xs">
              {suggestedQuestions.map((q) => (
                <button
                  key={q}
                  onClick={() => {
                    setInput(q);
                    inputRef.current?.focus();
                  }}
                  disabled={isQuotaExhausted}
                  className="px-3 py-1.5 bg-surface-alt border border-border rounded-full text-xs text-text-secondary hover:text-gold hover:border-gold/50 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${
                  msg.role === 'user'
                    ? 'bg-gold text-black rounded-tr-sm'
                    : 'bg-surface-alt border border-border rounded-tl-sm text-text-primary'
                }`}
              >
                <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                <p
                  className={`text-[10px] mt-1.5 ${
                    msg.role === 'user' ? 'text-black/50' : 'text-text-secondary'
                  }`}
                >
                  {new Date(msg.timestamp).toLocaleTimeString('id-ID', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
          ))
        )}

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-surface-alt border border-border rounded-2xl rounded-tl-sm px-4 py-3">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 bg-gold rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-gold rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-gold rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-border p-3">
        <div className="flex items-end gap-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isQuotaExhausted ? 'Batas chat hari ini telah tercapai' : 'Ketik pertanyaan Anda...'}
            rows={1}
            disabled={isLoading || isQuotaExhausted}
            className="flex-1 px-4 py-2.5 bg-surface-alt border border-border rounded-xl text-text-primary placeholder-text-secondary text-sm focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30 transition-all duration-300 resize-none disabled:opacity-50"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading || isQuotaExhausted}
            className="p-2.5 bg-gold hover:bg-gold-light text-black rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
        <p className="text-[10px] text-text-secondary mt-1.5 text-center">
          {usage && !usageLoading
            ? `Sisa ${usage.remaining} dari ${usage.limit} pertanyaan hari ini — Ditenagai oleh AI`
            : 'Ditenagai oleh AI — jawaban mungkin tidak 100% akurat'}
        </p>
      </div>
    </div>
  );
}
