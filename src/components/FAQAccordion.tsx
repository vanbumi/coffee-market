'use client';

import { useState } from 'react';
import { faqData, faqCategories, type FAQItem } from '@/data/faq';

export default function FAQAccordion() {
  const [activeCategory, setActiveCategory] = useState<string>('semua');
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  const filteredFaqs =
    activeCategory === 'semua'
      ? faqData
      : faqData.filter((faq) => faq.category === activeCategory);

  const toggleItem = (id: string) => {
    setOpenItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div>
      {/* Category Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setActiveCategory('semua')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
            activeCategory === 'semua'
              ? 'bg-gold text-black shadow-md shadow-gold/20'
              : 'bg-surface-card border border-border text-text-secondary hover:text-gold hover:border-gold/50'
          }`}
        >
          Semua
        </button>
        {faqCategories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-1.5 ${
              activeCategory === cat.id
                ? 'bg-gold text-black shadow-md shadow-gold/20'
                : 'bg-surface-card border border-border text-text-secondary hover:text-gold hover:border-gold/50'
            }`}
          >
            <span>{cat.icon}</span>
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      {/* FAQ Items */}
      <div className="space-y-3">
        {filteredFaqs.map((faq) => (
          <FAQCard
            key={faq.id}
            faq={faq}
            isOpen={openItems.has(faq.id)}
            onToggle={() => toggleItem(faq.id)}
          />
        ))}
      </div>

      {/* Empty State */}
      {filteredFaqs.length === 0 && (
        <div className="text-center py-16">
          <span className="text-4xl mb-4 block">📭</span>
          <p className="text-text-secondary text-sm">
            Tidak ada pertanyaan di kategori ini.
          </p>
        </div>
      )}
    </div>
  );
}

function FAQCard({
  faq,
  isOpen,
  onToggle,
}: {
  faq: FAQItem;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="bg-surface-card border border-border rounded-xl overflow-hidden transition-all duration-300 hover:border-gold/30">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-5 py-4 text-left group"
        aria-expanded={isOpen}
      >
        <span className="text-sm font-medium text-text-primary group-hover:text-gold transition-colors duration-300 pr-4">
          {faq.question}
        </span>
        <svg
          className={`w-5 h-5 text-gold flex-shrink-0 transition-transform duration-300 ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-5 pb-4 text-sm text-text-secondary leading-relaxed border-t border-border pt-3">
          {/* Render markdown-like answer: support **bold** and \n newlines */}
          <FormattedAnswer answer={faq.answer} />
        </div>
      </div>
    </div>
  );
}

function FormattedAnswer({ answer }: { answer: string }) {
  const lines = answer.split('\n');

  return (
    <div className="space-y-1">
      {lines.map((line, i) => {
        // Handle bold text (**text**)
        const parts = line.split(/(\*\*[^*]+\*\*)/g);
        const rendered = parts.map((part, j) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return (
              <strong key={j} className="text-text-primary font-semibold">
                {part.slice(2, -2)}
              </strong>
            );
          }
          return part;
        });

        // Handle bullet points
        if (line.trimStart().startsWith('•') || line.trimStart().startsWith('-')) {
          return (
            <div key={i} className="flex items-start gap-2 ml-2">
              <span className="text-gold mt-0.5">•</span>
              <span>{rendered}</span>
            </div>
          );
        }

        // Handle numbered lists (e.g., "1. text")
        const numberedMatch = line.match(/^(\d+)\.\s*/);
        if (numberedMatch) {
          return (
            <div key={i} className="flex items-start gap-2 ml-2">
              <span className="text-gold font-medium text-xs mt-1 min-w-[1.2rem]">
                {numberedMatch[1]}.
              </span>
              <span>{line.slice(numberedMatch[0].length)}</span>
            </div>
          );
        }

        // Handle links: [text](/path)
        if (line.includes('[http') || line.includes('](/')) {
          // Re-render with link support
          const allParts = line.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g);
          const renderedWithLinks = allParts.map((part, j) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return (
                <strong key={j} className="text-text-primary font-semibold">
                  {part.slice(2, -2)}
                </strong>
              );
            }
            const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
            if (linkMatch) {
              return (
                <a
                  key={j}
                  href={linkMatch[2]}
                  className="text-gold hover:text-gold-light underline underline-offset-2 transition-colors"
                >
                  {linkMatch[1]}
                </a>
              );
            }
            return part;
          });
          return <p key={i}>{renderedWithLinks}</p>;
        }

        if (line.trim() === '') {
          return <div key={i} className="h-2" />;
        }

        return <p key={i}>{rendered}</p>;
      })}
    </div>
  );
}
