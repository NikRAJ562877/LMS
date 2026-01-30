import React, { useState } from 'react';
import { LayoutDashboard, Calendar, BookOpen, Mail, Users } from 'lucide-react';
import { OverviewTab } from './OverviewTab';
import { AttendanceTab } from './AttendanceTab';
import { AcademicTab } from './AcademicTab';
import { MessagingTab } from './MessagingTab';
import { StudentsTab } from './StudentsTab';

type Tab = 'overview' | 'attendance' | 'academic' | 'messaging' | 'students';

export const TeacherDashboard = () => {
  const [activeTab, setActiveTab] = useState<Tab>('overview');

  const tabs = [
    { id: 'overview' as Tab, label: 'Overview', icon: LayoutDashboard },
    { id: 'attendance' as Tab, label: 'Attendance', icon: Calendar },
    { id: 'academic' as Tab, label: 'Academic', icon: BookOpen },
    { id: 'messaging' as Tab, label: 'Messaging', icon: Mail },
    { id: 'students' as Tab, label: 'Students', icon: Users },
  ];

  return (
    <div className="flex flex-col h-screen">
      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-4 md:px-6">
          {/* Mobile: select dropdown for tabs */}
          <div className="md:hidden py-2">
            <select
              value={activeTab}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setActiveTab(e.target.value as Tab)}
              className="w-full p-2 border rounded-md"
            >
              {tabs.map((tab) => (
                <option key={tab.id} value={tab.id}>
                  {tab.label}
                </option>
              ))}
            </select>
          </div>

          {/* Desktop: tab bar */}
          <div className="hidden md:flex space-x-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`inline-flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-purple-600 text-purple-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Icon className="size-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto bg-gray-50">
        {activeTab === 'overview' && <OverviewTab />}
        {activeTab === 'attendance' && <AttendanceTab />}
        {activeTab === 'academic' && <AcademicTab />}
        {activeTab === 'messaging' && <MessagingTab />}
        {activeTab === 'students' && <StudentsTab />}
      </div>
    </div>
  );
};
