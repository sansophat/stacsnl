import React from 'react';

interface SnlLogoProps {
  className?: string;
  size?: number;
}

export const SnlLogo: React.FC<SnlLogoProps> = ({ className = 'w-8 h-8', size }) => {
  const style = size ? { width: `${size}px`, height: `${size}px` } : undefined;

  return (
    <img
      src="/snl-logo.svg"
      alt="SNL RICH Eco Logo"
      style={style}
      className={`shrink-0 object-contain ${className}`}
    />
  );
};
