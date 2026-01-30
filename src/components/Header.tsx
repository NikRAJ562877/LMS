import React from 'react';
import { useAuth } from '../context/AuthContext';
import { GraduationCap, LogOut, User } from 'lucide-react';

export const Header = () => {
  const { user, logout } = useAuth();

  const getRoleBadgeColor = () => {
    switch (user?.role) {
      case 'student':
        return 'bg-blue-100 text-blue-800';
      case 'parent':
        return 'bg-green-100 text-green-800';
      case 'teacher':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <GraduationCap className="size-8 text-indigo-600" />
          <div>
            <h1 className="text-xl">EduTrack LMS</h1>
            <p className="text-sm text-gray-600">Learning Management System</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="flex items-center gap-2">
                <User className="size-4 text-gray-600" />
                <span>{user?.name}</span>
              </div>
              <div className="flex items-center gap-2 justify-end mt-1">
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${getRoleBadgeColor()}`}
                >
                  {user?.role.charAt(0).toUpperCase() + user?.role.slice(1)}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={logout}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
          >
            <LogOut className="size-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};
