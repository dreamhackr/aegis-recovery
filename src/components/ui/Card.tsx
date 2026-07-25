import React from 'react';

interface CardProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
  interactive?: boolean;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  title, 
  className = '',
  interactive = false
}) => {
  return (
    <div 
      className={`glass-panel ${className}`}
      style={{
        transition: interactive ? 'all 0.3s ease' : 'none',
        cursor: interactive ? 'pointer' : 'default',
        transform: interactive ? 'scale(1)' : 'none',
      }}
      onMouseEnter={(e) => {
        if (interactive) {
          e.currentTarget.style.transform = 'translateY(-5px) scale(1.02)';
          e.currentTarget.style.boxShadow = '0 15px 35px rgba(0, 0, 0, 0.4)';
        }
      }}
      onMouseLeave={(e) => {
        if (interactive) {
          e.currentTarget.style.transform = 'translateY(0) scale(1)';
          e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.3)';
        }
      }}
    >
      {title && <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-main)' }}>{title}</h3>}
      {children}
    </div>
  );
};
