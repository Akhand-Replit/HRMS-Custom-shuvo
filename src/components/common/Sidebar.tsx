import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { UserAuth } from "../../types/models";

interface NavigationItem {
  label: string;
  path: string;
  icon: string;
}

interface SidebarProps {
  navigationItems: NavigationItem[];
  user: UserAuth;
}

const Sidebar: React.FC<SidebarProps> = ({ navigationItems, user }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-200">
      {/* User profile section */}
      <div className="px-4 py-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          {user?.profile_pic ? (
            <img
              src={user.profile_pic}
              alt={user.username}
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-lg">
              {user?.username.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <div className="font-semibold text-gray-900">{user?.username}</div>
            <div className="text-sm text-gray-500 capitalize">
              {user?.role.replace("_", " ")}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation menu */}
      <div className="flex-1 py-4 overflow-y-auto">
        <nav className="px-2 space-y-1">
          {navigationItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                  isActive
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-700 hover:bg-gray-50"
                }`
              }
            >
              <span className="mr-3">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Logout button */}
      <div className="px-4 py-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
        >
          <span className="mr-2">🚪</span>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
