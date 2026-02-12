import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { LayoutDashboard, BookOpen, Calendar, FileText, User, CreditCard, Mail } from 'lucide-react';

// Components
import { StudentOverview, StudentAcademics, StudentSchedule, StudentResources } from './';
import { ParentFees } from '../parent/ParentFees';
import { ParentCommunication } from '../parent/ParentCommunication';

type Tab = 'overview' | 'academics' | 'schedule' | 'resources' | 'profile' | 'fees' | 'communication';

export const StudentDashboard = () => {
  const { user } = useAuth();
  const { students } = useData();
  const [activeTab, setActiveTab] = useState<Tab>('overview');

  // For reusing ParentFees, we need to pass an array of students.
  // Since this is the student dashboard, we pass the current student in an array.
  const currentStudent = students.find(s => s.id === user?.id);
  const studentArray = currentStudent ? [currentStudent] : [];

  const tabs = [
    { id: 'overview' as Tab, label: 'Overview', icon: LayoutDashboard },
    { id: 'academics' as Tab, label: 'Academics', icon: BookOpen },
    { id: 'schedule' as Tab, label: 'Schedule', icon: Calendar },
    { id: 'resources' as Tab, label: 'Resources', icon: FileText },
    { id: 'fees' as Tab, label: 'Fees', icon: CreditCard },
    { id: 'communication' as Tab, label: 'Message Teacher', icon: Mail },
    { id: 'profile' as Tab, label: 'Profile', icon: User },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Mobile Header */}
      <div className="bg-white p-4 shadow-sm md:hidden flex justify-between items-center">
        <div className="font-bold text-lg text-purple-600">Student Portal</div>
        <div className="size-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold">
          {user?.name.charAt(0)}
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar for Desktop */}
        <aside className="w-64 bg-white shadow-md hidden md:flex flex-col z-10">
          <div className="p-6 border-b">
            <div className="flex items-center gap-3">
              <div className="size-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold text-xl">
                {user?.name.charAt(0)}
              </div>
              <div>
                <div className="font-bold text-gray-800">{user?.name}</div>
                <div className="text-xs text-gray-500 capitalize">{user?.role}</div>
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
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-6xl mx-auto">
            <div className="mb-6 md:hidden">
              <select
                value={activeTab}
                onChange={(e) => setActiveTab(e.target.value as Tab)}
                className="w-full p-2 border rounded-md"
              >
                {tabs.map(tab => (
                  <option key={tab.id} value={tab.id}>{tab.label}</option>
                ))}
              </select>
            </div>

            {activeTab === 'overview' && <StudentOverview />}
            {activeTab === 'academics' && <StudentAcademics />}
            {activeTab === 'schedule' && <StudentSchedule />}
            {activeTab === 'resources' && <StudentResources />}
            {activeTab === 'fees' && <ParentFees children={studentArray} />}
            {activeTab === 'communication' && <ParentCommunication />}
            {activeTab === 'profile' && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold mb-4">Profile Settings</h2>
                <div className="space-y-4">
                  <div className="p-4 border rounded bg-gray-50">
                    <p><strong>Name:</strong> {user?.name}</p>
                    <p><strong>Email:</strong> {user?.email}</p>
                    <p><strong>Role:</strong> {user?.role}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};