import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { LayoutDashboard, Users, CreditCard, Mail } from 'lucide-react';
import { ParentOverview } from './ParentOverview';
import { ParentFees } from './ParentFees';
import { ParentCommunication } from './ParentCommunication';

type Tab = 'overview' | 'fees' | 'communication';

export const ParentDashboard = () => {
  const { user } = useAuth();
  const { students } = useData();
  const [activeTab, setActiveTab] = useState<Tab>('overview');

  // In a real app we would link parent to students properly
  // For mock data, let's assume parent is linked to students with same last name or just all students for demo
  // But better: use mockParents to find the logged in parent and get their children IDs
  const { parents } = useData();
  const currentParent = parents.find(p => p.id === user?.id);

  // Filter students where ID is in parent.childrenIds
  const myChildren = currentParent
    ? students.filter(s => currentParent.childrenIds.includes(s.id))
    : [];

  const tabs = [
    { id: 'overview' as Tab, label: 'Overview', icon: LayoutDashboard },
    { id: 'fees' as Tab, label: 'Fee Status', icon: CreditCard },
    { id: 'communication' as Tab, label: 'Communication', icon: Mail },
  ];

  if (!user || user.role !== 'parent') return <div>Access Denied</div>;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Mobile Header */}
      <div className="bg-white p-4 shadow-sm md:hidden flex justify-between items-center">
        <div className="font-bold text-lg text-emerald-600">Parent Portal</div>
        <div className="size-8 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 font-bold">
          {user?.name.charAt(0)}
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-md hidden md:flex flex-col z-10">
          <div className="p-6 border-b">
            <div className="flex items-center gap-3">
              <div className="size-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 font-bold text-xl">
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
                    ? 'bg-emerald-50 text-emerald-700 font-medium'
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

            {activeTab === 'overview' && <ParentOverview children={myChildren} />}
            {activeTab === 'fees' && <ParentFees children={myChildren} />}
            {activeTab === 'communication' && <ParentCommunication />}
          </div>
        </main>
      </div>
    </div>
  );
};
