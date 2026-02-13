import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { BookOpen, Search, Mail, Phone, Plus } from 'lucide-react';

export const TeacherManagement = () => {
    const { teachers, addTeacher } = useData();
    const [searchTerm, setSearchTerm] = useState('');
    const [isAdding, setIsAdding] = useState(false);
    const [newTeacher, setNewTeacher] = useState({
        name: '',
        email: '',
        password: 'teacher123',
        assignedClasses: [] as number[],
        assignedBatches: [] as string[],
        assignedSubjects: [] as string[]
    });

    const filteredTeachers = teachers.filter(teacher =>
        teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleAddTeacher = (e: React.FormEvent) => {
        e.preventDefault();
        // Basic validation
        if (!newTeacher.name || !newTeacher.email) return;

        addTeacher({
            id: `t${Date.now()}`,
            role: 'teacher',
            ...newTeacher
        });
        setIsAdding(false);
        setNewTeacher({
            name: '',
            email: '',
            password: 'teacher123',
            assignedClasses: [],
            assignedBatches: [],
            assignedSubjects: []
        });
        alert('Teacher added successfully!');
    };

    const toggleSelection = <T extends string | number>(
        field: 'assignedClasses' | 'assignedBatches' | 'assignedSubjects',
        value: T
    ) => {
        setNewTeacher(prev => {
            const current = prev[field] as T[];
            const updated = current.includes(value)
                ? current.filter(item => item !== value)
                : [...current, value];
            return { ...prev, [field]: updated };
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                    <BookOpen className="size-6 text-green-600" />
                    Teacher Management
                </h2>
                <button
                    onClick={() => setIsAdding(!isAdding)}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center gap-2"
                >
                    <Plus className="size-4" />
                    {isAdding ? 'Cancel' : 'Add Teacher'}
                </button>
            </div>

            {isAdding && (
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="font-bold text-lg mb-4">Add New Teacher</h3>
                    <form onSubmit={handleAddTeacher} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                                    value={newTeacher.name}
                                    onChange={e => setNewTeacher({ ...newTeacher, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    required
                                    className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                                    value={newTeacher.email}
                                    onChange={e => setNewTeacher({ ...newTeacher, email: e.target.value })}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Assign Responsibilities (Click to select)</label>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* Classes */}
                                <div className="p-3 border rounded-lg">
                                    <div className="text-xs font-bold text-gray-500 uppercase mb-2">Classes</div>
                                    <div className="flex flex-wrap gap-2">
                                        {[9, 10, 11, 12].map(cls => (
                                            <button
                                                key={cls}
                                                type="button"
                                                onClick={() => toggleSelection('assignedClasses', cls)}
                                                className={`px-3 py-1 text-sm rounded-full border ${newTeacher.assignedClasses.includes(cls)
                                                        ? 'bg-indigo-100 border-indigo-200 text-indigo-700'
                                                        : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                                                    }`}
                                            >
                                                Class {cls}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Batches */}
                                <div className="p-3 border rounded-lg">
                                    <div className="text-xs font-bold text-gray-500 uppercase mb-2">Batches</div>
                                    <div className="flex flex-wrap gap-2">
                                        {['Batch-A', 'Batch-B', 'JEE-1', 'NEET-1'].map(batch => (
                                            <button
                                                key={batch}
                                                type="button"
                                                onClick={() => toggleSelection('assignedBatches', batch)}
                                                className={`px-3 py-1 text-sm rounded-full border ${newTeacher.assignedBatches.includes(batch)
                                                        ? 'bg-green-100 border-green-200 text-green-700'
                                                        : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                                                    }`}
                                            >
                                                {batch}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Subjects */}
                                <div className="p-3 border rounded-lg">
                                    <div className="text-xs font-bold text-gray-500 uppercase mb-2">Subjects</div>
                                    <div className="flex flex-wrap gap-2">
                                        {['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English'].map(sub => (
                                            <button
                                                key={sub}
                                                type="button"
                                                onClick={() => toggleSelection('assignedSubjects', sub)}
                                                className={`px-3 py-1 text-sm rounded-full border ${newTeacher.assignedSubjects.includes(sub)
                                                        ? 'bg-blue-100 border-blue-200 text-blue-700'
                                                        : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                                                    }`}
                                            >
                                                {sub}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
                            >
                                Save Teacher
                            </button>
                        </div>
                    </form>
                </div>
            )}

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
