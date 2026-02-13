import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Enrollment } from '../../types';
import { Check, X, Search, Plus, Filter, Info } from 'lucide-react';

export const EnrollmentManagement = () => {
    const { enrollments, updateEnrollmentStatus, addEnrollment } = useData();
    const [activeSection, setActiveSection] = useState<'all' | 'new'>('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddForm, setShowAddForm] = useState(false);

    // New Enrollment Form State
    const [newEnrollment, setNewEnrollment] = useState({
        studentName: '',
        phone: '',
        parentName: '',
        email: '',
        classLevel: 10,
        batch: 'Batch-A',
        totalFee: 15000,
        paidAmount: 0,
        category: 'normal' as 'normal' | 'slow_learner',
        registerNumber: '',
        rollNumber: '',
        address: '',
        installmentType: 'full' as 'full' | 'installment'
    });

    const generateUniqueId = () => {
        const datePart = new Date().toISOString().slice(2, 10).replace(/-/g, '');
        const randomPart = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        return `STU${datePart}${randomPart}`;
    };

    const filteredEnrollments = enrollments.filter(e => {
        const matchesSection = activeSection === 'all' || (activeSection === 'new' && e.status === 'pending');
        const matchesSearch = e.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            e.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (e.registerNumber && e.registerNumber.toLowerCase().includes(searchTerm.toLowerCase()));
        return matchesSection && matchesSearch;
    });

    const pendingCount = enrollments.filter(e => e.status === 'pending').length;

    const handleAddSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const uniqueId = generateUniqueId();

        const enrollment: Enrollment = {
            id: `enr_${Date.now()}`,
            ...newEnrollment,
            registerNumber: newEnrollment.registerNumber || uniqueId,
            mode: 'offline',
            status: 'confirmed',
            paymentStatus: newEnrollment.paidAmount >= newEnrollment.totalFee ? 'paid' : (newEnrollment.paidAmount > 0 ? 'partial' : 'pending'),
            submittedDate: new Date().toISOString().split('T')[0]
        };
        addEnrollment(enrollment);
        setShowAddForm(false);
        setNewEnrollment({
            studentName: '',
            phone: '',
            parentName: '',
            email: '',
            classLevel: 10,
            batch: 'Batch-A',
            totalFee: 15000,
            paidAmount: 0,
            category: 'normal',
            registerNumber: '',
            rollNumber: '',
            address: '',
            installmentType: 'full'
        });
        alert(`Student enrolled successfully. Unique ID: ${uniqueId}`);
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
                    Offline Enrollment
                </button>
            </div>

            {/* Add Form */}
            {showAddForm && (
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 animate-in slide-in-from-top-4">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold">Offline Enrollment Form</h3>
                        <div className="text-sm text-gray-500 flex items-center gap-1">
                            <Info className="size-4" />
                            Auto-ID: {generateUniqueId()}
                        </div>
                    </div>

                    <form onSubmit={handleAddSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {/* Personal Info */}
                        <div className="md:col-span-4 font-bold text-gray-800 border-b pb-1 mt-2 text-sm uppercase tracking-wider">Student Personal Details</div>
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-gray-500">Full Name</label>
                            <input type="text" required className="w-full p-2 border rounded" value={newEnrollment.studentName} onChange={e => setNewEnrollment({ ...newEnrollment, studentName: e.target.value })} />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-gray-500">Email Address</label>
                            <input type="email" required className="w-full p-2 border rounded" value={newEnrollment.email} onChange={e => setNewEnrollment({ ...newEnrollment, email: e.target.value })} />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-gray-500">Phone Number</label>
                            <input type="tel" required className="w-full p-2 border rounded" value={newEnrollment.phone} onChange={e => setNewEnrollment({ ...newEnrollment, phone: e.target.value })} />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-gray-500">Parent/Guardian Name</label>
                            <input type="text" className="w-full p-2 border rounded" value={newEnrollment.parentName} onChange={e => setNewEnrollment({ ...newEnrollment, parentName: e.target.value })} />
                        </div>
                        <div className="md:col-span-4 space-y-1">
                            <label className="text-xs font-medium text-gray-500">Residential Address</label>
                            <input type="text" className="w-full p-2 border rounded" value={newEnrollment.address} onChange={e => setNewEnrollment({ ...newEnrollment, address: e.target.value })} />
                        </div>

                        {/* Academic Info */}
                        <div className="md:col-span-4 font-bold text-gray-800 border-b pb-1 mt-4 text-sm uppercase tracking-wider">Academic Placement</div>
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-gray-500">Class Level</label>
                            <select className="w-full p-2 border rounded" value={newEnrollment.classLevel} onChange={e => setNewEnrollment({ ...newEnrollment, classLevel: Number(e.target.value) })}>
                                {[6, 7, 8, 9, 10, 11, 12].map(c => <option key={c} value={c}>Class {c}</option>)}
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-gray-500">Assigned Batch</label>
                            <select className="w-full p-2 border rounded" value={newEnrollment.batch} onChange={e => setNewEnrollment({ ...newEnrollment, batch: e.target.value })}>
                                <option value="Batch-A">Batch A</option>
                                <option value="Batch-B">Batch B</option>
                                <option value="Weekend">Weekend Batch</option>
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-gray-500">Register Number (Manual)</label>
                            <input type="text" className="w-full p-2 border rounded" placeholder="Leave empty for Auto" value={newEnrollment.registerNumber} onChange={e => setNewEnrollment({ ...newEnrollment, registerNumber: e.target.value })} />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-gray-500">Roll Number</label>
                            <input type="text" required className="w-full p-2 border rounded" value={newEnrollment.rollNumber} onChange={e => setNewEnrollment({ ...newEnrollment, rollNumber: e.target.value })} />
                        </div>
                        <div className="space-y-1 md:col-span-2">
                            <label className="text-xs font-medium text-gray-500">Student Category</label>
                            <div className="flex gap-4 p-2 border rounded bg-gray-50 h-[42px] items-center">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="radio" name="category" checked={newEnrollment.category === 'normal'} onChange={() => setNewEnrollment({ ...newEnrollment, category: 'normal' })} />
                                    <span className="text-sm">Normal</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer text-orange-600">
                                    <input type="radio" name="category" checked={newEnrollment.category === 'slow_learner'} onChange={() => setNewEnrollment({ ...newEnrollment, category: 'slow_learner' })} />
                                    <span className="text-sm font-medium">Slow Learner</span>
                                </label>
                            </div>
                        </div>

                        {/* Payment Info */}
                        <div className="md:col-span-4 font-bold text-gray-800 border-b pb-1 mt-4 text-sm uppercase tracking-wider">Fee & Payment Plan</div>
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-gray-500">Total Course Fee</label>
                            <input type="number" required className="w-full p-2 border rounded font-bold text-indigo-600" value={newEnrollment.totalFee} onChange={e => setNewEnrollment({ ...newEnrollment, totalFee: Number(e.target.value) })} />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-gray-500">Initial Payment</label>
                            <input type="number" required className="w-full p-2 border rounded" value={newEnrollment.paidAmount} onChange={e => setNewEnrollment({ ...newEnrollment, paidAmount: Number(e.target.value) })} />
                        </div>
                        <div className="md:col-span-2 space-y-1">
                            <label className="text-xs font-medium text-gray-500">Payment Plan</label>
                            <div className="flex gap-4 p-2 border rounded bg-gray-50 h-[42px] items-center">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="radio" name="payplan" checked={newEnrollment.installmentType === 'full'} onChange={() => setNewEnrollment({ ...newEnrollment, installmentType: 'full', paidAmount: newEnrollment.totalFee })} />
                                    <span className="text-sm">One Shot (Full)</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="radio" name="payplan" checked={newEnrollment.installmentType === 'installment'} onChange={() => setNewEnrollment({ ...newEnrollment, installmentType: 'installment' })} />
                                    <span className="text-sm">Two Installments</span>
                                </label>
                            </div>
                        </div>

                        <div className="md:col-span-4 flex justify-end gap-4 mt-6 pt-6 border-t">
                            <button type="button" onClick={() => setShowAddForm(false)} className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium">Cancel</button>
                            <button type="submit" className="bg-indigo-600 text-white px-8 py-2 rounded-lg hover:bg-indigo-700 font-bold shadow-md shadow-indigo-100">Confirm Enrollment</button>
                        </div>
                    </form>
                </div>
            )}

            {/* View Tabs */}
            <div className="flex items-center gap-6 border-b border-gray-200">
                <button
                    onClick={() => setActiveSection('all')}
                    className={`pb-4 text-sm font-medium transition-colors relative ${activeSection === 'all' ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    All Enrollments
                    {activeSection === 'all' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600" />}
                </button>
                <button
                    onClick={() => setActiveSection('new')}
                    className={`pb-4 text-sm font-medium transition-colors relative ${activeSection === 'new' ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    New Requests (Pending)
                    {pendingCount > 0 && <span className="ml-2 bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full text-[10px] font-bold">{pendingCount}</span>}
                    {activeSection === 'new' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600" />}
                </button>
            </div>

            {/* Search & Filters */}
            <div className="flex gap-4 items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <Search className="text-gray-400 size-5" />
                <input
                    type="text"
                    placeholder="Search by name, email, or Reg No..."
                    className="flex-1 outline-none"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                />
            </div>

            {/* List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="text-left p-4 text-sm font-medium text-gray-500">Unique ID / Student</th>
                            <th className="text-left p-4 text-sm font-medium text-gray-500">Placement</th>
                            <th className="text-left p-4 text-sm font-medium text-gray-500">Payment Status</th>
                            <th className="text-left p-4 text-sm font-medium text-gray-500">Submission</th>
                            <th className="text-left p-4 text-sm font-medium text-gray-500">Status</th>
                            <th className="text-left p-4 text-sm font-medium text-gray-500 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredEnrollments.map(enrollment => (
                            <tr key={enrollment.id} className="hover:bg-gray-50">
                                <td className="p-4">
                                    <div className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded w-fit mb-1">{enrollment.registerNumber || enrollment.id}</div>
                                    <div className="font-medium text-gray-900">{enrollment.studentName}</div>
                                    <div className="text-xs text-gray-500">{enrollment.email}</div>
                                </td>
                                <td className="p-4">
                                    <div className="text-sm font-medium">Class {enrollment.classLevel}</div>
                                    <div className="text-xs text-gray-500">{enrollment.batch}</div>
                                    <div className="flex gap-1 mt-1">
                                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${enrollment.category === 'slow_learner' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'}`}>
                                            {enrollment.category === 'slow_learner' ? 'Slow Learner' : 'Normal'}
                                        </span>
                                        {enrollment.rollNumber && (
                                            <span className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded font-bold">Roll: {enrollment.rollNumber}</span>
                                        )}
                                    </div>
                                </td>
                                <td className="p-4">
                                    <div className="text-xs font-bold text-gray-700 mb-1">
                                        ₹{enrollment.paidAmount.toLocaleString()} / ₹{enrollment.totalFee.toLocaleString()}
                                    </div>
                                    <div className={`text-[10px] font-bold uppercase rounded px-2 py-0.5 w-fit
                                        ${enrollment.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' :
                                            enrollment.paymentStatus === 'partial' ? 'bg-yellow-100 text-yellow-700' :
                                                'bg-red-100 text-red-700'}`}>
                                        {enrollment.paymentStatus}
                                    </div>
                                </td>
                                <td className="p-4 text-xs text-gray-600">
                                    <span className="capitalize font-medium">{enrollment.mode}</span>
                                    <div className="text-[10px] text-gray-400 mt-1">{enrollment.submittedDate}</div>
                                </td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase
                                        ${enrollment.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                                            enrollment.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                                'bg-red-100 text-red-700'}`}>
                                        {enrollment.status}
                                    </span>
                                </td>
                                <td className="p-4">
                                    <div className="flex justify-center gap-2">
                                        {enrollment.status === 'pending' ? (
                                            <>
                                                <button
                                                    onClick={() => updateEnrollmentStatus(enrollment.id, 'confirmed')}
                                                    className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors"
                                                    title="Approve Enrollment"
                                                >
                                                    <Check className="size-4" />
                                                </button>
                                                <button
                                                    onClick={() => updateEnrollmentStatus(enrollment.id, 'rejected')}
                                                    className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                                                    title="Reject Enrollment"
                                                >
                                                    <X className="size-4" />
                                                </button>
                                            </>
                                        ) : (
                                            <button className="text-indigo-600 hover:text-indigo-800 text-xs font-bold uppercase">View Profile</button>
                                        )}
                                    </div>
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

