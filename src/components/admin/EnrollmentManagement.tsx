import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Enrollment } from '../../types';
import { Check, X, Search, Plus, Filter } from 'lucide-react';

export const EnrollmentManagement = () => {
    const { enrollments, updateEnrollmentStatus, addEnrollment } = useData();
    const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'confirmed' | 'rejected'>('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddForm, setShowAddForm] = useState(false);

    // New Enrollment Form State
    const [newEnrollment, setNewEnrollment] = useState({
        studentName: '',
        phone: '',
        email: '',
        classLevel: 10,
        batch: 'Batch-A',
        totalFee: 0,
        paidAmount: 0
    });

    const filteredEnrollments = enrollments.filter(e => {
        const matchesStatus = filterStatus === 'all' || e.status === filterStatus;
        const matchesSearch = e.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            e.email.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    const handleAddSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const enrollment: Enrollment = {
            id: `enr_${Date.now()}`,
            ...newEnrollment,
            mode: 'offline',
            status: 'confirmed',
            paymentStatus: newEnrollment.paidAmount >= newEnrollment.totalFee ? 'paid' : 'partial',
            submittedDate: new Date().toISOString().split('T')[0]
        };
        addEnrollment(enrollment);
        setShowAddForm(false);
        setNewEnrollment({
            studentName: '',
            phone: '',
            email: '',
            classLevel: 10,
            batch: 'Batch-A',
            totalFee: 0,
            paidAmount: 0
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Enrollment Management</h2>
                <button
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center gap-2"
                >
                    <Plus className="size-4" />
                    Add Offline Student
                </button>
            </div>

            {/* Add Form */}
            {showAddForm && (
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 animate-in slide-in-from-top-4">
                    <h3 className="text-lg font-semibold mb-4">New Offline Enrollment</h3>
                    <form onSubmit={handleAddSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                            type="text"
                            placeholder="Student Name"
                            required
                            className="p-2 border rounded"
                            value={newEnrollment.studentName}
                            onChange={e => setNewEnrollment({ ...newEnrollment, studentName: e.target.value })}
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            required
                            className="p-2 border rounded"
                            value={newEnrollment.email}
                            onChange={e => setNewEnrollment({ ...newEnrollment, email: e.target.value })}
                        />
                        <input
                            type="tel"
                            placeholder="Phone"
                            required
                            className="p-2 border rounded"
                            value={newEnrollment.phone}
                            onChange={e => setNewEnrollment({ ...newEnrollment, phone: e.target.value })}
                        />
                        <div className="flex gap-2">
                            <select
                                className="p-2 border rounded flex-1"
                                value={newEnrollment.classLevel}
                                onChange={e => setNewEnrollment({ ...newEnrollment, classLevel: Number(e.target.value) })}
                            >
                                {[9, 10, 11, 12].map(c => <option key={c} value={c}>Class {c}</option>)}
                            </select>
                            <input
                                type="text"
                                placeholder="Batch"
                                className="p-2 border rounded flex-1"
                                value={newEnrollment.batch}
                                onChange={e => setNewEnrollment({ ...newEnrollment, batch: e.target.value })}
                            />
                        </div>
                        <input
                            type="number"
                            placeholder="Total Fee"
                            required
                            className="p-2 border rounded"
                            value={newEnrollment.totalFee}
                            onChange={e => setNewEnrollment({ ...newEnrollment, totalFee: Number(e.target.value) })}
                        />
                        <input
                            type="number"
                            placeholder="Paid Amount"
                            required
                            className="p-2 border rounded"
                            value={newEnrollment.paidAmount}
                            onChange={e => setNewEnrollment({ ...newEnrollment, paidAmount: Number(e.target.value) })}
                        />
                        <button type="submit" className="col-span-2 bg-green-600 text-white py-2 rounded">
                            Confirm Enrollment
                        </button>
                    </form>
                </div>
            )}

            {/* Filters */}
            <div className="flex gap-4 items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <Search className="text-gray-400 size-5" />
                <input
                    type="text"
                    placeholder="Search by name or email..."
                    className="flex-1 outline-none"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                />
                <div className="flex items-center gap-2 border-l pl-4">
                    <Filter className="text-gray-400 size-4" />
                    <select
                        className="outline-none bg-transparent"
                        value={filterStatus}
                        onChange={e => setFilterStatus(e.target.value as any)}
                    >
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="rejected">Rejected</option>
                    </select>
                </div>
            </div>

            {/* List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="text-left p-4 text-sm font-medium text-gray-500">Student</th>
                            <th className="text-left p-4 text-sm font-medium text-gray-500">Class/Batch</th>
                            <th className="text-left p-4 text-sm font-medium text-gray-500">Fee Status</th>
                            <th className="text-left p-4 text-sm font-medium text-gray-500">Date</th>
                            <th className="text-left p-4 text-sm font-medium text-gray-500">Status</th>
                            <th className="text-left p-4 text-sm font-medium text-gray-500">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredEnrollments.map(enrollment => (
                            <tr key={enrollment.id} className="hover:bg-gray-50">
                                <div className="p-4">
                                    <div className="font-medium">{enrollment.studentName}</div>
                                    <div className="text-sm text-gray-500">{enrollment.email}</div>
                                    <div className="text-xs text-gray-400">{enrollment.phone}</div>
                                </div>
                                <td className="p-4">
                                    <div className="text-sm">Class {enrollment.classLevel}</div>
                                    <div className="text-xs bg-gray-100 inline-block px-2 py-0.5 rounded text-gray-600">{enrollment.batch}</div>
                                </td>
                                <td className="p-4">
                                    <div className="text-sm">
                                        ₹{enrollment.paidAmount} / ₹{enrollment.totalFee}
                                    </div>
                                    <div className={`text-xs inline-block px-2 py-0.5 rounded
                                        ${enrollment.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' :
                                            enrollment.paymentStatus === 'partial' ? 'bg-yellow-100 text-yellow-700' :
                                                'bg-red-100 text-red-700'}`}>
                                        {enrollment.paymentStatus}
                                    </div>
                                </td>
                                <td className="p-4 text-sm text-gray-600">
                                    {enrollment.submittedDate}
                                    <div className="text-xs text-gray-400">{enrollment.mode}</div>
                                </td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium 
                                        ${enrollment.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                                            enrollment.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                                'bg-red-100 text-red-700'}`}>
                                        {enrollment.status.charAt(0).toUpperCase() + enrollment.status.slice(1)}
                                    </span>
                                </td>
                                <td className="p-4">
                                    {enrollment.status === 'pending' && (
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => updateEnrollmentStatus(enrollment.id, 'confirmed')}
                                                className="p-1.5 bg-green-100 text-green-600 rounded-lg hover:bg-green-200"
                                                title="Approve"
                                            >
                                                <Check className="size-4" />
                                            </button>
                                            <button
                                                onClick={() => updateEnrollmentStatus(enrollment.id, 'rejected')}
                                                className="p-1.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                                                title="Reject"
                                            >
                                                <X className="size-4" />
                                            </button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredEnrollments.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        No enrollments found matching your filters.
                    </div>
                )}
            </div>
        </div>
    );
};
