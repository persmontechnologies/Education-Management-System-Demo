import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={`bg-white dark:bg-gray-900/70 rounded-xl shadow-md border border-gray-200/50 dark:border-gray-800/50 p-6 ${className}`}>
      {children}
    </div>
  );
};

export default Card;
