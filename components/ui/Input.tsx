import React, { forwardRef } from 'react';
import { AlertCircle } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  variant?: 'default' | 'filled' | 'outlined';
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  helperText,
  icon,
  iconPosition = 'left',
  variant = 'default',
  className = '',
  id,
  ...props
}, ref) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

  const baseClasses = 'w-full px-3 py-2 text-sm bg-white dark:bg-gray-800 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    default: 'border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500',
    filled: 'border-transparent bg-gray-100 dark:bg-gray-700 focus:bg-white dark:focus:bg-gray-800 focus:ring-blue-500',
    outlined: 'border-2 border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500'
  };

  const errorClasses = error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : variants[variant];

  return (
    <div className="space-y-1">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && iconPosition === 'left' && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-400 w-4 h-4">{icon}</span>
          </div>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`${baseClasses} ${errorClasses} ${icon ? (iconPosition === 'left' ? 'pl-10' : 'pr-10') : ''} ${className}`}
          {...props}
        />
        {icon && iconPosition === 'right' && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <span className="text-gray-400 w-4 h-4">{icon}</span>
          </div>
        )}
        {error && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <AlertCircle className="w-4 h-4 text-red-500" />
          </div>
        )}
      </div>
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400 flex items-center">
          <AlertCircle className="w-4 h-4 mr-1" />
          {error}
        </p>
      )}
      {helperText && !error && (
        <p className="text-sm text-gray-500 dark:text-gray-400">{helperText}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
