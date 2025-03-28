// src/components/ui/StatCard.tsx
import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: string;
  description?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  onClick?: () => void;
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  description,
  trend,
  trendValue,
  onClick,
  className = '',
}) => {
  const getTrendStyles = () => {
    switch (trend) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      case 'neutral':
      default:
        return 'text-gray-600';
    }
  };

  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return '↑';
      case 'down':
        return '↓';
      case 'neutral':
      default:
        return '→';
    }
  };

  return (
    <div
      className={`bg-white shadow-md rounded-lg p-4 border border-gray-200 ${
        onClick ? 'cursor-pointer hover:shadow-lg transition-shadow' : ''
      } ${className}`}
      onClick={onClick}
    >
      <div className="flex justify-between items-start">
        <div>
          <div className="text-sm text-gray-500">{title}</div>
          <div className="text-2xl font-semibold">{value}</div>
          {description && <div className="text-xs text-gray-500 mt-1">{description}</div>}
          {trend && trendValue && (
            <div className={`text-xs mt-2 ${getTrendStyles()}`}>
              {getTrendIcon()} {trendValue}
            </div>
          )}
        </div>
        {icon && <div className="text-2xl text-gray-400">{icon}</div>}
      </div>
    </div>
  );
};

export default StatCard;