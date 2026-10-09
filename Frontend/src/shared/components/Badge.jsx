import React from 'react';

const VARIANTS = {
  violet: 'bg-violet-100 text-violet-800 border-violet-200',
  emerald: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  rose: 'bg-rose-50 text-rose-800 border-rose-200',
  amber: 'bg-amber-50 text-amber-800 border-amber-200',
  slate: 'bg-slate-100 text-slate-700 border-slate-200',
  primary: 'bg-slate-900 text-white border-slate-900',
};

export default function Badge({ 
  children, 
  variant = 'slate', 
  size = 'sm', 
  className = '', 
  dot = false 
}) {
  const sizeClasses = size === 'xs' ? 'px-2 py-0.2 text-[9px]' : 'px-2.5 py-0.5 text-[10px]';
  const colorClasses = VARIANTS[variant] || VARIANTS.slate;

  return (
    <span className={`inline-flex items-center space-x-1.5 rounded-full font-bold border ${sizeClasses} ${colorClasses} ${className}`}>
      {dot && (
        <span className={`w-1.5 h-1.5 rounded-full ${
          variant === 'violet' ? 'bg-violet-600' :
          variant === 'emerald' ? 'bg-emerald-500' :
          variant === 'rose' ? 'bg-rose-500' :
          variant === 'amber' ? 'bg-amber-500' : 'bg-slate-400'
        }`} />
      )}
      <span>{children}</span>
    </span>
  );
}
