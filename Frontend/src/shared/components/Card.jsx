import React from 'react';

export default function Card({ 
  children, 
  className = '', 
  padding = 'p-6',
  hover = false,
  ...props 
}) {
  return (
    <div
      className={`rounded-3xl bg-white border border-slate-200/90 shadow-xs ${padding} ${
        hover ? 'hover:shadow-md transition-shadow' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
