import React from 'react';

interface PageTitleProps {
  title: string;
  description?: string;
  icon?: string;
}

const PageTitle: React.FC<PageTitleProps> = ({ title, description, icon }) => {
  return (
    <div className="mb-6">
      <div className="flex items-center">
        {icon && <span className="text-2xl mr-2">{icon}</span>}
        <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
      </div>
      {description && (
        <p className="mt-1 text-sm text-gray-600">{description}</p>
      )}
      <div className="mt-4 border-b border-gray-200"></div>
    </div>
  );
};

export default PageTitle;