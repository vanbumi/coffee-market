'use client';

interface StatCardProps {
  value: string;
  label: string;
  icon: React.ReactNode;
  index: number;
}

export default function StatCard({ value, label, icon, index }: StatCardProps) {
  return (
    <div
      className="relative bg-[#111111] border border-[#2A2A2A] rounded-xl p-6 text-center group hover:border-gold/30 transition-all duration-500 hover:shadow-[0_0_20px_rgba(212,175,55,0.08)] animate-fade-in-up"
      style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'both' }}
    >
      {/* Gold accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gold group-hover:w-1/2 transition-all duration-500" />
      
      {/* Icon */}
      <div className="text-gold mb-3 flex justify-center group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      
      {/* Value */}
      <p className="text-4xl font-bold text-gold mb-1">{value}</p>
      
      {/* Label */}
      <p className="text-[#A3A3A3] text-sm">{label}</p>
    </div>
  );
}
