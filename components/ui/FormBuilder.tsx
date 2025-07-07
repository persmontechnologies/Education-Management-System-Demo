import React, { useState } from 'react';

interface FormField {
  name: string;
  type: 'text' | 'email' | 'password' | 'number' | 'select' | 'textarea' | 'date' | 'checkbox';
  label: string;
  placeholder?: string;
  required?: boolean;
  options?: { value: string; label: string }[];
  validation?: (value: any) => string | null;
  helperText?: string;
}

interface FormProps {
  fields: FormField[];
  onSubmit: (data: Record<string, any>) => void;
  initialData?: Record<string, any>;
  submitText?: string;
  cancelText?: string;
  onCancel?: () => void;
  loading?: boolean;
  className?: string;
}

const FormBuilder: React.FC<FormProps> = ({
  fields,
  onSubmit,
  initialData = {},
  submitText = 'Submit',
  cancelText = 'Cancel',
  onCancel,
  loading = false,
  className = ''
}) => {
  const [formData, setFormData] = useState<Record<string, any>>(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleFieldChange = (name: string, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    fields.forEach(field => {
      const value = formData[field.name];
      
      // Required field validation
      if (field.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
        newErrors[field.name] = `${field.label} is required`;
        return;
      }

      // Custom validation
      if (field.validation && value) {
        const error = field.validation(value);
        if (error) {
          newErrors[field.name] = error;
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const renderField = (field: FormField) => {
    const value = formData[field.name] || '';
    const error = errors[field.name];
    const fieldId = `field-${field.name}`;

    const baseInputClasses = `w-full px-3 py-2 text-sm bg-white dark:bg-gray-800 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed ${
      error 
        ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
        : 'border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500'
    }`;

    switch (field.type) {
      case 'textarea':
        return (
          <div key={field.name} className="space-y-1">
            <label htmlFor={fieldId} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <textarea
              id={fieldId}
              value={value}
              onChange={(e) => handleFieldChange(field.name, e.target.value)}
              placeholder={field.placeholder}
              rows={4}
              className={baseInputClasses}
              disabled={loading}
            />
            {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
            {field.helperText && !error && <p className="text-sm text-gray-500 dark:text-gray-400">{field.helperText}</p>}
          </div>
        );

      case 'select':
        return (
          <div key={field.name} className="space-y-1">
            <label htmlFor={fieldId} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <select
              id={fieldId}
              value={value}
              onChange={(e) => handleFieldChange(field.name, e.target.value)}
              className={baseInputClasses}
              disabled={loading}
            >
              <option value="">{field.placeholder || `Select ${field.label.toLowerCase()}...`}</option>
              {field.options?.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
            {field.helperText && !error && <p className="text-sm text-gray-500 dark:text-gray-400">{field.helperText}</p>}
          </div>
        );

      case 'checkbox':
        return (
          <div key={field.name} className="space-y-1">
            <div className="flex items-center space-x-3">
              <input
                id={fieldId}
                type="checkbox"
                checked={!!value}
                onChange={(e) => handleFieldChange(field.name, e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                disabled={loading}
              />
              <label htmlFor={fieldId} className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </label>
            </div>
            {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
            {field.helperText && !error && <p className="text-sm text-gray-500 dark:text-gray-400">{field.helperText}</p>}
          </div>
        );

      default:
        return (
          <div key={field.name} className="space-y-1">
            <label htmlFor={fieldId} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
              id={fieldId}
              type={field.type}
              value={value}
              onChange={(e) => handleFieldChange(field.name, e.target.value)}
              placeholder={field.placeholder}
              className={baseInputClasses}
              disabled={loading}
            />
            {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
            {field.helperText && !error && <p className="text-sm text-gray-500 dark:text-gray-400">{field.helperText}</p>}
          </div>
        );
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`space-y-6 ${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {fields.map(renderField)}
      </div>
      
      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 transition-colors"
          >
            {cancelText}
          </button>
        )}
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50 transition-colors flex items-center space-x-2"
        >
          {loading && (
            <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          )}
          <span>{submitText}</span>
        </button>
      </div>
    </form>
  );
};

export default FormBuilder;
