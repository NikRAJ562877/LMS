import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Search, Filter, Mail, Phone, BookOpen, User } from 'lucide-react';

export const StudentManagement = () => {
    const { students } = useData();
    const [searchTerm, setSearchTerm] = useState('');
    const [classFilter, setClassFilter] = useState<number | 'all'>('all');
    const [batchFilter, setBatchFilter] = useState<'all' | string>('all');

    const filteredStudents = students.filter(student => {
        const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.registerNumber?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesClass = classFilter === 'all' || student.classLevel === classFilter;
        const matchesBatch = batchFilter === 'all' || student.batch === batchFilter;

        return matchesSearch && matchesClass && matchesBatch;
    });

    // Get unique classes and batches for filters
    const classes = Array.from(new Set(students.map(s => s.classLevel))).sort((a, b) => a - b);
    const batches = Array.from(new Set(students.map(s => s.batch).filter(Boolean))).sort();

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
                <User className="size-6 text-indigo-600" />
                Student Management
            </h2>

            {/* Filters */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 size-5" />
                    <input
                        type="text"
                        placeholder="Search by name, email, or register number..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="flex gap-4">
                    <div className="relative">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 size-4" />
                        <select
                            className="pl-10 pr-8 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none bg-white"
                            value={classFilter}
                            onChange={e => setClassFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                        >
                            <option value="all">All Classes</option>
                            {classes.map(c => <option key={c} value={c}>Class {c}</option>)}
                        </select>
                    </div>

                    <div className="relative">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 size-4" />
                        <select
                            className="pl-10 pr-8 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none bg-white"
                            value={batchFilter}
                            onChange={e => setBatchFilter(e.target.value)}
                        >
                            <option value="all">All Batches</option>
                            {batches.map(b => <option key={b} value={b}>{b}</option>)}
                        </select>
                    </div>
                </div>
            </div>

            {/* Student List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredStudents.map(student => (
                    <div key={student.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <h3 className="font-bold text-lg text-gray-900">{student.name}</h3>
                                <p className="text-sm text-gray-500">Reg: {student.registerNumber || 'N/A'}</p>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold uppercase ${student.category === 'slow_learner' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'
                                }`}>
                                {student.batch}
                            </span>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center gap-3 text-sm text-gray-600">
                                <BookOpen className="size-4 text-gray-400" />
                                Class {student.classLevel}
                            </div>
                            <div className="flex items-center gap-3 text-sm text-gray-600">
                                <Mail className="size-4 text-gray-400" />
                                <span className="truncate">{student.email}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-gray-600">
                                <Phone className="size-4 text-gray-400" />
                                {student.enrollmentId ? 'Phone linked' : 'No phone linked'}
                                {/* Note: Phone is usually in enrollment, but here we can just show placeholder or fetch from enrollment if we want, but keeping it simple for now */}
                            </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-gray-50 flex justify-between items-center text-sm">
                            <span className="text-gray-500">Roll: {student.rollNumber || '-'}</span>
                            {/* Placeholder for action buttons */}
                            <button className="text-indigo-600 hover:text-indigo-800 font-medium">View Details</button>
                        </div>
                    </div>
                ))}
            </div>

            {filteredStudents.length === 0 && (
                <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
                    <User className="size-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No students found matching your criteria.</p>
                </div>
            )}
        </div>
    );
};
