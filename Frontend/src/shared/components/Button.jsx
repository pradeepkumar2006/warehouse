import React from 'react';
import { Loader2 } from 'lucide-react';

const VARIANTS = {
  primary: 'bg-slate-900 hover:bg-slate-800 text-white shadow-xs',
  gradient: 'bg-gradient-to-r from-mint-500 to-emerald-500 hover:from-mint-600 hover:to-emerald-600 text-slate-950 font-extrabold shadow-sm',
  secondary: 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200',
  danger: 'bg-rose-600 hover:bg-rose-700 text-white shadow-xs',
  ghost: 'text-slate-500 hover:text-slate-900 hover:bg-slate-100',
};

export default function Button({
  children,
  variant = 'secondary',
  size = 'md',
  isLoading = false,
  icon: Icon,
  disabled = false,
  className = '',
  onClick,
  type = 'button',
  ...props
}) {
  const sizeClasses =
    size === 'sm'
      ? 'px-3 py-1.5 rounded-xl text-xs font-bold'
      : size === 'lg'
      ? 'px-6 py-3 rounded-2xl text-sm font-extrabold'
      : 'px-4 py-2.5 rounded-2xl text-xs font-bold';

  const variantClass = VARIANTS[variant] || VARIANTS.secondary;

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`inline-flex items-center justify-center space-x-2 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${sizeClasses} ${variantClass} ${className}`}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin shrink-0" />
      ) : Icon ? (
        <Icon className="w-4 h-4 shrink-0" />
      ) : null}
      <span>{children}</span>
    </button>
  );
}
