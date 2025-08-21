import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LogOut, User, BarChart3 } from 'lucide-react';
import { useAuthStore } from '../../features/auth/store';

export const Header: React.FC = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isAdminPage = location.pathname.startsWith('/admin');

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-8 w-8 text-blue-600" />
              <h1 className="text-xl font-bold text-gray-900">Climate Dashboard</h1>
            </div>

            {user?.role === 'admin' && (
              <nav className="flex space-x-4">
                <button
                  onClick={() => navigate('/dashboard')}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${!isAdminPage
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900'
                    }`}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => navigate('/admin')}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isAdminPage
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900'
                    }`}
                >
                  Admin Panel
                </button>
              </nav>
            )}
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4 text-gray-500" />
              <span>{user?.username}</span>
              {user?.role === 'user' && (<span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-purple-800">
                User
              </span>)}
              {user?.role === 'admin' && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  Admin
                </span>
              )}
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center space-x-1 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};