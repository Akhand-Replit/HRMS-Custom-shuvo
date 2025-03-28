// src/components/ui/StatusIndicator.tsx
import React from 'react';

interface StatusIndicatorProps {
  status: 'active' | 'inactive' | 'completed' | 'pending' | 'in-progress';
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  className?: string;
}

const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  status,
  size = 'md',
  label,
  className = '',
}) => {
  const getStatusStyles = () => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'in-progress':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return 'text-xs px-2 py-0.5';
      case 'lg':
        return 'text-sm px-3 py-1';
      case 'md':
      default:
        return 'text-xs px-2.5 py-0.5';
    }
  };

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium ${getStatusStyles()} ${getSizeStyles()} ${className}`}
    >
      {label || status}
    </span>
  );
};

export default StatusIndicator;