import React from 'react';
import { Outlet, useLocation, Navigate } from 'react-router-dom';
import Sidebar from '../common/Sidebar';
import { useAuth } from '../../contexts/AuthContext';

const AsstManagerLayout: React.FC = () => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Navigation items specific to assistant manager role
  const navigationItems = [
    { label: 'Dashboard', path: '/asst-manager/dashboard', icon: '🏠' },
    { label: 'Employee Management', path: '/asst-manager/employee-management', icon: '👥' },
    { label: 'Task Management', path: '/asst-manager/task-management', icon: '📋' },
    { label: 'Reports', path: '/asst-manager/reports', icon: '📊' },
    { label: 'Messages', path: '/asst-manager/messages', icon: '✉️' },
    { label: 'Profile', path: '/asst-manager/profile', icon: '👤' }
  ];

  // If still loading, show loading indicator
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // If not authenticated or not an assistant manager, redirect to login
  if (!user || user.role !== 'asst_manager') {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 hidden md:block shadow-lg">
        <Sidebar 
          navigationItems={navigationItems} 
          user={user}
        />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <h1 className="text-2xl font-semibold text-gray-900">Assistant Manager Portal</h1>
              </div>

              {/* Mobile menu button */}
              <div className="md:hidden flex items-center">
                <button type="button" className="p-2 rounded-md text-gray-600 hover:text-gray-900 focus:outline-none">
                  <span className="sr-only">Open sidebar</span>
                  <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto bg-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AsstManagerLayout;