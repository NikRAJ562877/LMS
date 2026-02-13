import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import {
    LayoutDashboard, Users, BookOpen, UserPlus, CreditCard,
    FileText, Settings, LogOut, CheckCircle,
    TrendingUp
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { EnrollmentManagement } from './EnrollmentManagement';
import { StudentManagement } from './StudentManagement';
import { TeacherManagement } from './TeacherManagement';
import { PaymentManagement } from './PaymentManagement';
import { MarksManagement } from './MarksManagement';
import { NotesManagement } from './NotesManagement';
import { AttendanceManagement } from './AttendanceManagement';

// Placeholder sub-components (will be moved to separate files later if too large)
const Overview = () => {
    const { students, teachers, enrollments, payments, systemSettings } = useData();
    const pendingEnrollments = enrollments.filter(e => e.status === 'pending').length;

    // Payment Statistics
    const totalCollected = payments.reduce((sum, p) => sum + p.amount, 0);
    const totalDue = enrollments.reduce((sum, e) => sum + (e.totalFee - e.paidAmount), 0);

    // Mock Attendance Data for Summary
    const todayAttendance = 92; // Percent

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Dashboard Overview</h2>
                <div className="text-sm text-gray-500">Last updated: {new Date().toLocaleDateString()}</div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Users Summary */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="p-3 bg-indigo-50 rounded-lg">
                        <Users className="text-indigo-600 size-6" />
                    </div>
                    <div>
                        <div className="text-sm text-gray-500">Total Students</div>
                        <div className="text-2xl font-bold">{students.length}</div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="p-3 bg-green-50 rounded-lg">
                        <BookOpen className="text-green-600 size-6" />
                    </div>
                    <div>
                        <div className="text-sm text-gray-500">Total Teachers</div>
                        <div className="text-2xl font-bold">{teachers.length}</div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="p-3 bg-yellow-50 rounded-lg">
                        <UserPlus className="text-yellow-600 size-6" />
                    </div>
                    <div>
                        <div className="text-sm text-gray-500">Pending Enrollments</div>
                        <div className="text-2xl font-bold">{pendingEnrollments}</div>
                    </div>
                </div>

                {/* Payment Summary */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 col-span-1 md:col-span-2">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold flex items-center gap-2">
                            <CreditCard className="size-5 text-purple-600" />
                            Payment Summary
                        </h3>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-purple-50 rounded-lg">
                            <div className="text-sm text-purple-700">Total Collected</div>
                            <div className="text-xl font-bold text-purple-900">₹{totalCollected.toLocaleString()}</div>
                        </div>
                        <div className="p-4 bg-red-50 rounded-lg">
                            <div className="text-sm text-red-700">Total Pending</div>
                            <div className="text-xl font-bold text-red-900">₹{totalDue.toLocaleString()}</div>
                        </div>
                    </div>
                </div>

                {/* Attendance & Ranking Status */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-2">
                            <div className="text-sm text-gray-500">Avg. Attendance</div>
                            <CheckCircle className="text-emerald-600 size-5" />
                        </div>
                        <div className="text-2xl font-bold">{todayAttendance}%</div>
                        <div className="w-full bg-gray-100 h-2 rounded-full mt-2">
                            <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${todayAttendance}%` }}></div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-sm text-gray-500">Ranking System</div>
                                <div className={`text-lg font-bold ${systemSettings.rankingEnabled ? 'text-green-600' : 'text-gray-400'}`}>
                                    {systemSettings.rankingEnabled ? 'Active' : 'Disabled'}
                                </div>
                            </div>
                            <TrendingUp className={systemSettings.rankingEnabled ? 'text-green-600' : 'text-gray-400'} />
                        </div>
                    </div>
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
        { id: 'attendance', label: 'Attendance', icon: CheckCircle },
        { id: 'notes', label: 'Notes', icon: FileText },
        { id: 'payments', label: 'Payments', icon: CreditCard },
        { id: 'marks', label: 'Marks & Rankings', icon: TrendingUp },
        { id: 'settings', label: 'Settings', icon: Settings },
    ];

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Mobile Header */}
            <div className="bg-gray-900 p-4 shadow-sm md:hidden flex justify-between items-center">
                <div className="font-bold text-lg text-indigo-400">Admin Panel</div>
                <div className="size-8 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    A
                </div>
            </div>

            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar for Desktop */}
                <aside className="w-64 bg-gray-900 shadow-md hidden md:flex flex-col flex-shrink-0 min-h-0 z-10">
                    <div className="p-6 border-b border-gray-800">
                        <div className="flex items-center gap-3">
                            <div className="size-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                                A
                            </div>
                            <div>
                                <div className="font-bold text-white">Admin Panel</div>
                                <div className="text-xs text-gray-400 uppercase tracking-wider">Vidyastara</div>
                            </div>
                        </div>
                    </div>

                    <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                        {menuItems.map(item => {
                            const Icon = item.icon;
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveTab(item.id)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === item.id
                                        ? 'bg-indigo-600 text-white font-medium'
                                        : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
                                        }`}
                                >
                                    <Icon className="size-5" />
                                    {item.label}
                                </button>
                            );
                        })}
                    </nav>

                    <div className="p-4 border-t border-gray-800">
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-gray-800 transition-colors"
                        >
                            <LogOut className="size-5" />
                            Logout
                        </button>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto p-4 md:p-8">
                    <div className="max-w-7xl mx-auto">
                        {/* Mobile Navigation Dropdown */}
                        <div className="mb-6 md:hidden flex gap-2">
                            <select
                                value={activeTab}
                                onChange={(e) => setActiveTab(e.target.value)}
                                className="flex-1 p-3 border border-gray-200 rounded-lg bg-white text-gray-800 font-medium shadow-sm"
                            >
                                {menuItems.map(item => (
                                    <option key={item.id} value={item.id}>{item.label}</option>
                                ))}
                            </select>
                            <button
                                onClick={handleLogout}
                                className="px-3 py-2 text-red-500 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                                title="Logout"
                            >
                                <LogOut className="size-5" />
                            </button>
                        </div>

                        {activeTab === 'overview' && <Overview />}
                        {activeTab === 'enrollments' && <EnrollmentManagement />}
                        {activeTab === 'students' && <StudentManagement />}
                        {activeTab === 'teachers' && <TeacherManagement />}
                        {activeTab === 'attendance' && <AttendanceManagement />}
                        {activeTab === 'notes' && <NotesManagement />}
                        {activeTab === 'payments' && <PaymentManagement />}
                        {activeTab === 'marks' && <MarksManagement />}
                        {activeTab === 'settings' && (
                            <div className="bg-white p-12 rounded-xl text-center shadow-sm border border-gray-100">
                                <Settings className="size-12 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-gray-900">System Settings</h3>
                                <p className="text-gray-500 mt-2">Core system configuration and controls are coming soon.</p>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};
