import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

interface Option {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps {
  options: Option[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  disabled?: boolean;
  multiple?: boolean;
  searchable?: boolean;
  className?: string;
}

const Select: React.FC<SelectProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Select option...',
  label,
  error,
  disabled = false,
  multiple = false,
  searchable = false,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedValues, setSelectedValues] = useState<string[]>(
    multiple ? (Array.isArray(value) ? value : value ? [value] : []) : []
  );
  const selectRef = useRef<HTMLDivElement>(null);

  const filteredOptions = searchable
    ? options.filter(option =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : options;

  const currentSelection = multiple 
    ? selectedValues
    : value ? [value] : [];

  const displayValue = multiple
    ? selectedValues.length > 0
      ? `${selectedValues.length} selected`
      : placeholder
    : value
      ? options.find(opt => opt.value === value)?.label || value
      : placeholder;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleOptionClick = (optionValue: string) => {
    if (multiple) {
      const newSelection = currentSelection.includes(optionValue)
        ? currentSelection.filter(v => v !== optionValue)
        : [...currentSelection, optionValue];
      setSelectedValues(newSelection);
      onChange?.(newSelection.join(','));
    } else {
      onChange?.(optionValue);
      setIsOpen(false);
      setSearchTerm('');
    }
  };

  const baseClasses = 'relative w-full';
  const triggerClasses = `w-full px-3 py-2 text-sm bg-white dark:bg-gray-800 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-between ${
    error 
      ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
      : 'border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500'
  }`;

  return (
    <div className={`${baseClasses} ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label}
        </label>
      )}
      <div ref={selectRef} className="relative">
        <div
          className={triggerClasses}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          role="combobox"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
        >
          <span className={value || selectedValues.length > 0 ? 'text-gray-900 dark:text-white' : 'text-gray-500'}>
            {displayValue}
          </span>
          <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </div>

        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-auto">
            {searchable && (
              <div className="p-2 border-b border-gray-200 dark:border-gray-700">
                <input
                  type="text"
                  className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            )}
            
            <div className="py-1">
              {filteredOptions.length === 0 ? (
                <div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
                  No options found
                </div>
              ) : (
                filteredOptions.map((option) => {
                  const isSelected = currentSelection.includes(option.value);
                  return (
                    <div
                      key={option.value}
                      className={`px-3 py-2 text-sm cursor-pointer flex items-center justify-between hover:bg-gray-100 dark:hover:bg-gray-700 ${
                        option.disabled
                          ? 'opacity-50 cursor-not-allowed'
                          : isSelected
                            ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                            : 'text-gray-900 dark:text-white'
                      }`}
                      onClick={() => !option.disabled && handleOptionClick(option.value)}
                      role="option"
                      aria-selected={isSelected}
                    >
                      <span>{option.label}</span>
                      {isSelected && <Check className="w-4 h-4" />}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
};

export default Select;
