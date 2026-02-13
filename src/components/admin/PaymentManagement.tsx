import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { CreditCard, Search, Calendar, Filter, DollarSign, Clock, Download } from 'lucide-react';

export const PaymentManagement = () => {
    const { payments, students, enrollments } = useData();
    const [activeTab, setActiveTab] = useState<'overview' | 'history'>('overview');
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'paid' | 'pending'>('all');
    const [monthFilter, setMonthFilter] = useState<string>(new Date().toISOString().slice(0, 7)); // YYYY-MM

    // Filter Logic for History
    const filteredPayments = payments.filter(payment => {
        const enrollment = enrollments.find(e => e.id === payment.enrollmentId);
        if (!enrollment) return false;

        const matchesSearch = enrollment.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            enrollment.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
        const matchesMonth = monthFilter === 'all' || payment.date.startsWith(monthFilter);

        return matchesSearch && matchesStatus && matchesMonth;
    });

    const totalCollected = payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0);
    const totalPending = enrollments.reduce((sum, enr) => sum + (enr.totalFee - enr.paidAmount), 0);

    // Month-wise grouping for Transaction History
    const groupedPayments = filteredPayments.reduce((acc, p) => {
        const month = p.date.slice(0, 7);
        if (!acc[month]) acc[month] = [];
        acc[month].push(p);
        return acc;
    }, {} as Record<string, typeof payments>);

    // Enrollments with pending fees
    const pendingEnrollments = enrollments.filter(e => {
        const matchesSearch = e.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            e.email.toLowerCase().includes(searchTerm.toLowerCase());
        return e.paymentStatus !== 'paid' && matchesSearch;
    });

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                    <CreditCard className="size-6 text-purple-600" />
                    Payment Management
                </h2>
                <div className="flex bg-white rounded-lg p-1 border border-gray-200">
                    <button
                        onClick={() => setActiveTab('overview')}
                        className={`px-4 py-2 rounded-md transition-colors ${activeTab === 'overview' ? 'bg-purple-50 text-purple-700 font-medium' : 'text-gray-600 hover:text-gray-900'}`}
                    >
                        Pending & Overview
                    </button>
                    <button
                        onClick={() => setActiveTab('history')}
                        className={`px-4 py-2 rounded-md transition-colors ${activeTab === 'history' ? 'bg-purple-50 text-purple-700 font-medium' : 'text-gray-600 hover:text-gray-900'}`}
                    >
                        Transaction History
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
                    <div>
                        <div className="text-gray-500 text-sm font-semibold uppercase mb-1">Total Revenue Collected</div>
                        <div className="text-3xl font-bold text-green-600">₹{totalCollected.toLocaleString()}</div>
                    </div>
                    <div className="bg-green-100 p-3 rounded-full">
                        <DollarSign className="text-green-600 size-6" />
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
                    <div>
                        <div className="text-gray-500 text-sm font-semibold uppercase mb-1">Total Pending Fees</div>
                        <div className="text-3xl font-bold text-red-600">₹{totalPending.toLocaleString()}</div>
                    </div>
                    <div className="bg-red-100 p-3 rounded-full">
                        <Clock className="text-red-600 size-6" />
                    </div>
                </div>
            </div>

            {/* Content Based on Tab */}
            {activeTab === 'overview' ? (
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-bold text-gray-800">Pending Installments</h3>
                        <div className="relative w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 size-4" />
                            <input
                                type="text"
                                placeholder="Search student..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-purple-500"
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="text-left p-4 text-sm font-medium text-gray-500">Student Name</th>
                                    <th className="text-left p-4 text-sm font-medium text-gray-500">Course & Batch</th>
                                    <th className="text-left p-4 text-sm font-medium text-gray-500">Total Fee</th>
                                    <th className="text-left p-4 text-sm font-medium text-gray-500">Paid</th>
                                    <th className="text-left p-4 text-sm font-medium text-gray-500">Pending</th>
                                    <th className="text-left p-4 text-sm font-medium text-gray-500">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {pendingEnrollments.length > 0 ? pendingEnrollments.map(enr => (
                                    <tr key={enr.id} className="hover:bg-gray-50">
                                        <td className="p-4 font-medium text-gray-900">{enr.studentName}</td>
                                        <td className="p-4 text-gray-500 text-sm">Class {enr.classLevel} - {enr.batch}</td>
                                        <td className="p-4 text-gray-900">₹{enr.totalFee.toLocaleString()}</td>
                                        <td className="p-4 text-green-600">₹{enr.paidAmount.toLocaleString()}</td>
                                        <td className="p-4 text-red-600 font-bold">₹{(enr.totalFee - enr.paidAmount).toLocaleString()}</td>
                                        <td className="p-4">
                                            <button className="text-purple-600 hover:text-purple-800 text-sm font-medium">
                                                Record Payment
                                            </button>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={6} className="p-8 text-center text-gray-500">
                                            No pending payments found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="space-y-4">
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 size-4" />
                            <input
                                type="text"
                                placeholder="Search transaction..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-purple-500"
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-wrap items-center gap-4 border-l pl-4">
                            <div className="flex items-center gap-2">
                                <Calendar className="text-gray-400 size-4" />
                                <select
                                    className="outline-none bg-transparent text-sm font-medium"
                                    value={monthFilter}
                                    onChange={e => setMonthFilter(e.target.value)}
                                >
                                    <option value="all">All Months</option>
                                    {Array.from({ length: 12 }, (_, i) => {
                                        const date = new Date(2025, i, 1);
                                        const value = date.toISOString().slice(0, 7);
                                        const label = date.toLocaleString('default', { month: 'long', year: 'numeric' });
                                        return <option key={value} value={value}>{label}</option>;
                                    })}
                                </select>
                            </div>
                            <div className="flex items-center gap-2 border-l pl-4">
                                <Filter className="text-gray-400 size-4" />
                                <select
                                    className="outline-none bg-transparent text-sm font-medium"
                                    value={statusFilter}
                                    onChange={e => setStatusFilter(e.target.value as any)}
                                >
                                    <option value="all">All Status</option>
                                    <option value="paid">Paid</option>
                                    <option value="pending">Pending</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {Object.keys(groupedPayments).sort((a, b) => b.localeCompare(a)).map(month => (
                            <div key={month} className="space-y-2">
                                <div className="flex items-center gap-2 px-2">
                                    <span className="text-sm font-bold text-gray-900 uppercase tracking-widest">
                                        {new Date(month + '-01').toLocaleString('default', { month: 'long', year: 'numeric' })}
                                    </span>
                                    <div className="h-px flex-1 bg-gray-100"></div>
                                    <span className="text-[10px] font-bold text-gray-400 px-2 py-0.5 bg-gray-50 rounded border border-gray-100">
                                        {groupedPayments[month].length} TRANSACTIONS
                                    </span>
                                </div>
                                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                                    <table className="w-full">
                                        <thead className="bg-gray-50 border-b border-gray-100">
                                            <tr>
                                                <th className="text-left p-4 text-xs font-bold text-gray-500 uppercase">Student</th>
                                                <th className="text-left p-4 text-xs font-bold text-gray-500 uppercase">Date</th>
                                                <th className="text-left p-4 text-xs font-bold text-gray-500 uppercase">Method</th>
                                                <th className="text-left p-4 text-xs font-bold text-gray-500 uppercase">Amount</th>
                                                <th className="text-left p-4 text-xs font-bold text-gray-500 uppercase">Status</th>
                                                <th className="text-center p-4 text-xs font-bold text-gray-500 uppercase whitespace-nowrap">Receipt</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {groupedPayments[month].map(payment => {
                                                const enrollment = enrollments.find(e => e.id === payment.enrollmentId);
                                                return (
                                                    <tr key={payment.id} className="hover:bg-gray-50 transition-colors">
                                                        <td className="p-4">
                                                            <div className="font-bold text-gray-900">{enrollment?.studentName || 'Unknown'}</div>
                                                            <div className="text-[10px] text-gray-500 font-mono">{payment.transactionId || 'NO-ID'}</div>
                                                        </td>
                                                        <td className="p-4 text-sm text-gray-600 font-medium">{payment.date}</td>
                                                        <td className="p-4">
                                                            <span className="text-xs font-bold px-2 py-0.5 bg-gray-100 text-gray-600 rounded uppercase tracking-tighter">
                                                                {payment.method}
                                                            </span>
                                                        </td>
                                                        <td className="p-4 font-black text-gray-900 text-lg">₹{payment.amount.toLocaleString()}</td>
                                                        <td className="p-4">
                                                            <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-widest
                                                                ${payment.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                                                {payment.status}
                                                            </span>
                                                        </td>
                                                        <td className="p-4 text-center">
                                                            <button className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all">
                                                                <Download className="size-4" />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ))}

                        {Object.keys(groupedPayments).length === 0 && (
                            <div className="text-center py-20 bg-white rounded-xl border-2 border-dashed border-gray-100">
                                <Search className="size-12 mx-auto mb-4 text-gray-300 opacity-20" />
                                <p className="text-gray-400 italic">No transactions found for the selected criteria.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
