import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { CreditCard, Search, Calendar, Filter } from 'lucide-react';

export const PaymentManagement = () => {
    const { payments, students, enrollments } = useData();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'paid' | 'pending'>('all');

    const filteredPayments = payments.filter(payment => {
        const enrollment = enrollments.find(e => e.id === payment.enrollmentId);
        if (!enrollment) return false;

        const matchesSearch = enrollment.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            enrollment.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const totalCollected = filteredPayments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0);

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
                <CreditCard className="size-6 text-purple-600" />
                Payment Management
            </h2>

            {/* Stats Card */}
            <div className="bg-purple-50 p-6 rounded-xl border border-purple-100">
                <div className="text-purple-600 text-sm font-semibold uppercase mb-1">Total Revenue (Filtered)</div>
                <div className="text-3xl font-bold text-purple-900">₹{totalCollected.toLocaleString()}</div>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 size-4" />
                    <input
                        type="text"
                        placeholder="Search by student name or email..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-purple-500"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="flex items-center gap-2 border-l pl-4">
                    <Filter className="text-gray-400 size-4" />
                    <select
                        className="outline-none bg-transparent"
                        value={statusFilter}
                        onChange={e => setStatusFilter(e.target.value as any)}
                    >
                        <option value="all">All Status</option>
                        <option value="paid">Paid</option>
                        <option value="pending">Pending</option>
                    </select>
                </div>
            </div>

            {/* Payments List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="text-left p-4 text-sm font-medium text-gray-500">Student & Enrollment</th>
                            <th className="text-left p-4 text-sm font-medium text-gray-500">Date</th>
                            <th className="text-left p-4 text-sm font-medium text-gray-500">Transaction Info</th>
                            <th className="text-left p-4 text-sm font-medium text-gray-500">Amount</th>
                            <th className="text-left p-4 text-sm font-medium text-gray-500">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredPayments.map(payment => {
                            const enrollment = enrollments.find(e => e.id === payment.enrollmentId);
                            return (
                                <tr key={payment.id} className="hover:bg-gray-50">
                                    <td className="p-4">
                                        <div className="font-medium">{enrollment?.studentName || 'Unknown'}</div>
                                        <div className="text-xs text-gray-500">Class {enrollment?.classLevel} - {enrollment?.batch}</div>
                                    </td>
                                    <td className="p-4 text-sm text-gray-600">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="size-3" />
                                            {payment.date}
                                        </div>
                                    </td>
                                    <td className="p-4 text-sm">
                                        <div className="font-medium text-gray-700 uppercase">{payment.method}</div>
                                        <div className="text-xs text-gray-400">{payment.transactionId || '-'}</div>
                                    </td>
                                    <td className="p-4 font-bold text-gray-900">₹{payment.amount.toLocaleString()}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium 
                                            ${payment.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                            {payment.status.toUpperCase()}
                                        </span>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                {filteredPayments.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        No payments found.
                    </div>
                )}
            </div>
        </div>
    );
};
