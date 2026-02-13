import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Search, Filter, Mail, Phone, BookOpen, User } from 'lucide-react';

export const StudentManagement = () => {
    const { students } = useData();
    const [searchTerm, setSearchTerm] = useState('');
    const [classFilter, setClassFilter] = useState<number | 'all'>('all');
    const [batchFilter, setBatchFilter] = useState<'all' | string>('all');
    const [categoryFilter, setCategoryFilter] = useState<'all' | 'normal' | 'slow_learner'>('all');

    const filteredStudents = students.filter(student => {
        const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.registerNumber?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesClass = classFilter === 'all' || student.classLevel === classFilter;
        const matchesBatch = batchFilter === 'all' || student.batch === batchFilter;
        const matchesCategory = categoryFilter === 'all' || student.category === categoryFilter;

        return matchesSearch && matchesClass && matchesBatch && matchesCategory;
    });

    // Group filtered students: Batch -> Class -> Students
    const groupedStudents = filteredStudents.reduce((acc, student) => {
        const batch = student.batch || 'Unassigned';
        const classLevel = student.classLevel;

        if (!acc[batch]) acc[batch] = {};
        if (!acc[batch][classLevel]) acc[batch][classLevel] = [];

        acc[batch][classLevel].push(student);
        return acc;
    }, {} as Record<string, Record<number, typeof students>>);

    const sortedBatches = Object.keys(groupedStudents).sort();

    return (
        <div className="space-y-6 pb-20">
            <h2 className="text-2xl font-bold flex items-center gap-2">
                <User className="size-6 text-indigo-600" />
                Student Management
            </h2>

            {/* Filters */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 flex-wrap sticky top-20 z-10">
                <div className="flex-1 relative min-w-[200px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 size-5" />
                    <input
                        type="text"
                        placeholder="Search name, email, or Reg No..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="flex gap-4 flex-wrap">
                    <select
                        className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-sm"
                        value={categoryFilter}
                        onChange={e => setCategoryFilter(e.target.value as any)}
                    >
                        <option value="all">Every Category</option>
                        <option value="normal">Normal Students</option>
                        <option value="slow_learner">Slow Learners</option>
                    </select>
                </div>
            </div>

            {/* Grouped View */}
            <div className="space-y-8">
                {sortedBatches.map(batchName => (
                    <div key={batchName} className="space-y-4">
                        <div className="flex items-center gap-4">
                            <h3 className="text-lg font-bold text-gray-800 bg-gray-100 px-4 py-1 rounded-full uppercase tracking-wide">
                                {batchName}
                            </h3>
                            <div className="flex-1 h-px bg-gray-200"></div>
                        </div>

                        <div className="space-y-6 ml-4">
                            {Object.keys(groupedStudents[batchName]).sort((a, b) => Number(a) - Number(b)).map(lvl => {
                                const level = Number(lvl);
                                const studentsList = groupedStudents[batchName][level];

                                return (
                                    <div key={lvl} className="space-y-3">
                                        <h4 className="text-sm font-bold text-indigo-600 flex items-center gap-2">
                                            <div className="size-2 bg-indigo-600 rounded-full"></div>
                                            Class {level}
                                            <span className="text-gray-400 text-xs font-normal">({studentsList.length} Students)</span>
                                        </h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {studentsList.map(student => (
                                                <div key={student.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 border-l-4 border-l-indigo-500 hover:shadow-md transition-shadow group">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <div>
                                                            <div className="text-[10px] font-bold text-gray-400 uppercase">Reg: {student.registerNumber || '---'}</div>
                                                            <h5 className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{student.name}</h5>
                                                        </div>
                                                        {student.category === 'slow_learner' && (
                                                            <div className="bg-orange-100 text-orange-700 p-1 rounded-full" title="Slow Learner">
                                                                <Filter className="size-3" />
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="space-y-1 mt-2">
                                                        <div className="text-xs text-gray-500 flex items-center gap-2">
                                                            <Mail className="size-3" />
                                                            {student.email}
                                                        </div>
                                                        <div className="text-xs text-gray-500 flex items-center gap-2">
                                                            <Phone className="size-3" />
                                                            {student.enrollmentId ? 'Linked to Enrollment' : 'No record'}
                                                        </div>
                                                    </div>

                                                    <div className="mt-3 pt-3 border-t border-gray-50 flex justify-between items-center text-[10px] font-bold uppercase tracking-tight">
                                                        <span className="text-gray-400">Roll: {student.rollNumber || '--'}</span>
                                                        <button className="text-indigo-600 hover:scale-105 transition-transform">Profile &rarr;</button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}

                {sortedBatches.length === 0 && (
                    <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
                        <User className="size-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">No students found matching your filters.</p>
                    </div>
                )}
            </div>
        </div>
    );
};
