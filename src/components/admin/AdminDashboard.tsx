import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import {
    LayoutDashboard, Users, BookOpen, UserPlus, CreditCard,
    FileText, Settings, LogOut, CheckCircle, Smartphone
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { EnrollmentManagement } from './EnrollmentManagement';
import { StudentManagement } from './StudentManagement';
import { TeacherManagement } from './TeacherManagement';
import { PaymentManagement } from './PaymentManagement';
import { MarksManagement } from './MarksManagement';

// Placeholder sub-components (will be moved to separate files later if too large)
const Overview = () => {
    const { students, teachers, enrollments, payments } = useData();
    const pendingEnrollments = enrollments.filter(e => e.status === 'pending').length;
    const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">Dashboard Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <div className="text-gray-500">Total Students</div>
                        <Users className="text-indigo-600 size-6" />
                    </div>
                    <div className="text-3xl font-bold">{students.length}</div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <div className="text-gray-500">Total Teachers</div>
                        <BookOpen className="text-green-600 size-6" />
                    </div>
                    <div className="text-3xl font-bold">{teachers.length}</div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <div className="text-gray-500">Pending Enrollments</div>
                        <UserPlus className="text-yellow-600 size-6" />
                    </div>
                    <div className="text-3xl font-bold">{pendingEnrollments}</div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <div className="text-gray-500">Total Revenue</div>
                        <CreditCard className="text-purple-600 size-6" />
                    </div>
                    <div className="text-3xl font-bold">₹{totalRevenue.toLocaleString()}</div>
                </div>
            </div>
        </div>
    );
};

export const AdminDashboard = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('overview');

    const menuItems = [
        { id: 'overview', label: 'Overview', icon: LayoutDashboard },
        { id: 'enrollments', label: 'Enrollments', icon: UserPlus },
        { id: 'students', label: 'Students', icon: Users },
        { id: 'teachers', label: 'Teachers', icon: BookOpen },
        { id: 'payments', label: 'Payments', icon: CreditCard },
        { id: 'marks', label: 'Marks & Rankings', icon: FileText },
        { id: 'settings', label: 'Settings', icon: Settings },
    ];

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-900 text-white fixed h-full z-20 overflow-y-auto hidden md:block">
                <div className="p-6 border-b border-slate-800">
                    <h1 className="text-xl font-bold">Admin Panel</h1>
                    <p className="text-slate-400 text-sm">Vidyastara Tuitions</p>
                </div>
                <nav className="p-4 space-y-2">
                    {menuItems.map(item => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === item.id
                                ? 'bg-indigo-600 text-white'
                                : 'text-slate-300 hover:bg-slate-800'
                                }`}
                        >
                            <item.icon className="size-5" />
                            {item.label}
                        </button>
                    ))}
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-slate-800 mt-8 transition-colors"
                    >
                        <LogOut className="size-5" />
                        Logout
                    </button>
                </nav>
            </aside>

            {/* Mobile Header / Layout */}
            <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
                <header className="bg-white border-b border-gray-200 p-4 md:hidden flex justify-between items-center sticky top-0 z-30">
                    <h1 className="font-bold">Admin Panel</h1>
                    <button onClick={handleLogout} className="text-red-500">
                        <LogOut className="size-5" />
                    </button>
                </header>

                <main className="p-6 flex-1 overflow-x-hidden">
                    {activeTab === 'overview' && <Overview />}
                    {activeTab === 'enrollments' && <EnrollmentManagement />}
                    {activeTab === 'students' && <StudentManagement />}
                    {activeTab === 'teachers' && <TeacherManagement />}
                    {activeTab === 'payments' && <PaymentManagement />}
                    {activeTab === 'marks' && <MarksManagement />}
                    {activeTab === 'settings' && <div className="text-center py-20">Settings Component (Coming Soon)</div>}
                </main>
            </div>

            {/* Mobile Bottom Nav for Admin? No, standard layout is better for Admin. */}
        </div>
    );
};
