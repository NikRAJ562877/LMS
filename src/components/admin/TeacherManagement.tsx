import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { BookOpen, Search, Mail, Phone, Plus } from 'lucide-react';

export const TeacherManagement = () => {
    const { teachers } = useData();
    const [searchTerm, setSearchTerm] = useState('');

    const filteredTeachers = teachers.filter(teacher =>
        teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                    <BookOpen className="size-6 text-green-600" />
                    Teacher Management
                </h2>
                <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center gap-2">
                    <Plus className="size-4" />
                    Add Teacher
                </button>
            </div>

            {/* Search */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 size-4" />
                    <input
                        type="text"
                        placeholder="Search teacher by name or email..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-green-500"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Teacher Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTeachers.map(teacher => (
                    <div key={teacher.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold text-xl">
                                {teacher.name.charAt(0)}
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">{teacher.name}</h3>
                                <p className="text-gray-500 text-sm">ID: {teacher.id}</p>
                            </div>
                        </div>

                        <div className="space-y-3 mb-6">
                            <div className="flex items-center gap-3 text-sm text-gray-600">
                                <Mail className="size-4 text-gray-400" />
                                {teacher.email}
                            </div>
                            {/* Phone placeholder if needed */}
                        </div>

                        <div className="border-t border-gray-100 pt-4">
                            <h4 className="text-xs font-semibold text-gray-400 uppercase mb-2">Assigned Responsibilities</h4>
                            <div className="flex flex-wrap gap-2 mb-2">
                                {teacher.assignedSubjects?.map(sub => (
                                    <span key={sub} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-md border border-blue-100">
                                        {sub}
                                    </span>
                                ))}
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {teacher.assignedBatches?.map(batch => (
                                    <span key={batch} className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded-md border border-green-100">
                                        {batch}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {filteredTeachers.length === 0 && (
                <div className="text-center py-20">
                    <p className="text-gray-500">No teachers found.</p>
                </div>
            )}
        </div>
    );
};
