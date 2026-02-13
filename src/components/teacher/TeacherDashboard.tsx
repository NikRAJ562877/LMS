import React, { useState } from 'react';
import { LayoutDashboard, Calendar, BookOpen, Mail, Users, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { OverviewTab } from './OverviewTab';
import { AttendanceTab } from './AttendanceTab';
import { AcademicTab } from './AcademicTab';
import { MessagingTab } from './MessagingTab';
import { StudentsTab } from './StudentsTab';

type Tab = 'overview' | 'attendance' | 'academic' | 'messaging' | 'students';

export const TeacherDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('overview');

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const tabs = [
    { id: 'overview' as Tab, label: 'Overview', icon: LayoutDashboard },
    { id: 'attendance' as Tab, label: 'Attendance', icon: Calendar },
    { id: 'academic' as Tab, label: 'Academic', icon: BookOpen },
    { id: 'messaging' as Tab, label: 'Messaging', icon: Mail },
    { id: 'students' as Tab, label: 'Students', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Mobile Header */}
      <div className="bg-white p-4 shadow-sm md:hidden flex justify-between items-center">
        <div className="font-bold text-lg text-purple-600">Teacher Portal</div>
        <div className="size-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold text-sm">
          {user?.name?.charAt(0) || 'T'}
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar for Desktop */}
        <aside className="w-64 bg-white shadow-md hidden md:flex flex-col flex-shrink-0 z-10">
          <div className="p-6 border-b">
            <div className="flex items-center gap-3">
              <div className="size-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold text-xl">
                {user?.name?.charAt(0) || 'T'}
              </div>
              <div>
                <div className="font-bold text-gray-800">{user?.name || 'Teacher'}</div>
                <div className="text-xs text-gray-500 capitalize">Teacher</div>
              </div>
            </div>
          </div>

          <nav className="flex-1 p-4 space-y-1">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === tab.id
                    ? 'bg-purple-50 text-purple-700 font-medium'
                    : 'text-gray-600 hover:bg-gray-50'
                    }`}
                >
                  <Icon className="size-5" />
                  {tab.label}
                </button>
              );
            })}
          </nav>

          <div className="p-4 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
            >
              <LogOut className="size-5" />
              Logout
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-6xl mx-auto">
            {/* Mobile Navigation Dropdown */}
            <div className="mb-6 md:hidden flex gap-2">
              <select
                value={activeTab}
                onChange={(e) => setActiveTab(e.target.value as Tab)}
                className="flex-1 p-2 border rounded-md"
              >
                {tabs.map(tab => (
                  <option key={tab.id} value={tab.id}>{tab.label}</option>
                ))}
              </select>
              <button
                onClick={handleLogout}
                className="px-3 py-2 text-red-500 border border-red-200 rounded-md hover:bg-red-50 transition-colors"
                title="Logout"
              >
                <LogOut className="size-5" />
              </button>
            </div>

            {activeTab === 'overview' && <OverviewTab />}
            {activeTab === 'attendance' && <AttendanceTab />}
            {activeTab === 'academic' && <AcademicTab />}
            {activeTab === 'messaging' && <MessagingTab />}
            {activeTab === 'students' && <StudentsTab />}
          </div>
        </main>
      </div>
    </div>
  );
};
