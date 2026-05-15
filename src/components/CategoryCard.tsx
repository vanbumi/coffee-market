'use client';

import Link from 'next/link';
import { CoffeeType } from '@/types/product';

interface CategoryCardProps {
  name: string;
  description: string;
  icon: string;
  slug: CoffeeType;
  index: number;
}

export default function CategoryCard({ name, description, icon, slug, index }: CategoryCardProps) {
  return (
    <Link
      href={`/catalog?type=${slug}`}
      className="group relative overflow-hidden rounded-2xl border border-border bg-surface-alt p-8 hover:border-gold/30 transition-all duration-500 hover:shadow-[0_0_30px_rgba(212,175,55,0.1)] animate-fade-in-up"
      style={{ animationDelay: `${index * 150}ms`, animationFillMode: 'both' }}
    >
      {/* Background gradient hover effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-gold/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Gold accent line */}
      <div className="absolute top-0 left-0 w-0 h-0.5 bg-gold group-hover:w-full transition-all duration-500" />
      <div className="absolute top-0 left-0 w-0.5 h-0 bg-gold group-hover:h-full transition-all duration-500" style={{ transitionDelay: '100ms' }} />
      
      {/* Icon */}
      <div className="text-6xl mb-6 group-hover:scale-110 transition-transform duration-500">{icon}</div>
      
      {/* Name */}
      <h3 className="text-2xl font-bold text-text-primary mb-3 group-hover:text-gold transition-colors duration-300">
        {name}
      </h3>
      
      {/* Description */}
      <p className="text-text-secondary text-sm leading-relaxed mb-6">
        {description}
      </p>
      
      {/* Explore Button */}
      <div className="inline-flex items-center text-text-primary border border-border rounded-full px-5 py-2 text-sm font-medium group-hover:bg-gold group-hover:text-black group-hover:border-gold transition-all duration-300">
        Explore {name}
        <svg className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </div>
    </Link>
  );
}
