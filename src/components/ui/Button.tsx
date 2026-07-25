import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  fullWidth = false,
  className = '',
  style,
  ...props 
}) => {
  const baseClasses = 'btn';
  const variantClasses = variant === 'secondary' ? 'btn-secondary' : variant === 'danger' ? 'btn-danger' : '';
  
  // Merge component styles with caller's styles instead of overwriting
  const computedStyle: React.CSSProperties = {
    width: fullWidth ? '100%' : 'auto',
    padding: size === 'lg' ? '1.5rem 3rem' : size === 'sm' ? '0.75rem 1.5rem' : '1rem 2rem',
    fontSize: size === 'lg' ? '1.25rem' : size === 'sm' ? '1rem' : '1.1rem',
    ...style,
  };

  return (
    <button 
      className={`${baseClasses} ${variantClasses} ${className}`.trim()} 
      style={computedStyle}
      {...props}
    >
      {children}
    </button>
  );
};
