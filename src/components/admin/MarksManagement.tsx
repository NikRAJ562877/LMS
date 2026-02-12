import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { FileText, Trophy, BarChart2, Search, Filter } from 'lucide-react';

export const MarksManagement = () => {
    const { marks, students, subjects, courses } = useData();
    const [selectedClass, setSelectedClass] = useState<number>(10);
    const [selectedExam, setSelectedExam] = useState<string>('Mid-term');
    const [searchTerm, setSearchTerm] = useState('');

    const filteredMarks = marks.filter(mark => {
        const student = students.find(s => s.id === mark.studentId);
        if (!student) return false;

        const matchesClass = mark.classLevel === selectedClass;
        const matchesExam = mark.examType === selectedExam;
        const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase());

        return matchesClass && matchesExam && matchesSearch;
    });

    // Group marks by student
    const studentMarks = filteredMarks.reduce((acc, mark) => {
        if (!acc[mark.studentId]) {
            acc[mark.studentId] = {
                student: students.find(s => s.id === mark.studentId)!,
                marks: []
            };
        }
        acc[mark.studentId].marks.push(mark);
        return acc;
    }, {} as Record<string, { student: any, marks: any[] }>);

    const classSubjects = subjects.filter(s => s.classLevel === selectedClass);

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
                <Trophy className="size-6 text-yellow-600" />
                Marks & Ranking Management
            </h2>

            {/* Controls */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4">
                <div className="flex gap-4 flex-1">
                    <select
                        className="p-2 border rounded-lg bg-white outline-none focus:ring-2 focus:ring-indigo-500"
                        value={selectedClass}
                        onChange={e => setSelectedClass(Number(e.target.value))}
                    >
                        {[9, 10, 11, 12].map(c => <option key={c} value={c}>Class {c}</option>)}
                    </select>

                    <select
                        className="p-2 border rounded-lg bg-white outline-none focus:ring-2 focus:ring-indigo-500"
                        value={selectedExam}
                        onChange={e => setSelectedExam(e.target.value)}
                    >
                        <option value="Mid-term">Mid-term</option>
                        <option value="Final">Final</option>
                        <option value="Unit Test 1">Unit Test 1</option>
                    </select>
                </div>

                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 size-4" />
                    <input
                        type="text"
                        placeholder="Search student..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Marks Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-x-auto">
                <table className="w-full min-w-max">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="text-left p-4 text-sm font-medium text-gray-500 sticky left-0 bg-gray-50">Student</th>
                            {classSubjects.map(sub => (
                                <th key={sub.id} className="text-center p-4 text-sm font-medium text-gray-500">
                                    {sub.name}
                                </th>
                            ))}
                            <th className="text-center p-4 text-sm font-medium text-gray-500">Total</th>
                            <th className="text-center p-4 text-sm font-medium text-gray-500">Percentage</th>
                            <th className="text-center p-4 text-sm font-medium text-gray-500">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {Object.values(studentMarks).map(({ student, marks }) => {
                            const totalMarks = marks.reduce((sum, m) => sum + m.marks, 0);
                            const maxMarks = marks.reduce((sum, m) => sum + m.maxMarks, 0);
                            const percentage = maxMarks > 0 ? (totalMarks / maxMarks) * 100 : 0;

                            return (
                                <tr key={student.id} className="hover:bg-gray-50">
                                    <td className="p-4 sticky left-0 bg-white">
                                        <div className="font-medium text-gray-900">{student.name}</div>
                                        <div className="text-xs text-gray-500">{student.registerNumber}</div>
                                    </td>
                                    {classSubjects.map(sub => {
                                        const mark = marks.find(m => m.subjectId === sub.id);
                                        return (
                                            <td key={sub.id} className="p-4 text-center">
                                                {mark ? (
                                                    <span className={`font-medium ${mark.marks < 35 ? 'text-red-600' : 'text-gray-700'}`}>
                                                        {mark.marks}
                                                    </span>
                                                ) : (
                                                    <span className="text-gray-300">-</span>
                                                )}
                                            </td>
                                        );
                                    })}
                                    <td className="p-4 text-center font-bold text-indigo-600">{totalMarks}</td>
                                    <td className="p-4 text-center font-medium">{percentage.toFixed(1)}%</td>
                                    <td className="p-4 text-center">
                                        <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">Edit</button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                {Object.keys(studentMarks).length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        No marks found for the selected criteria.
                    </div>
                )}
            </div>

            <div className="flex justify-end">
                <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 flex items-center gap-2">
                    <FileText className="size-4" />
                    Upload Marks (CSV)
                </button>
            </div>
        </div>
    );
};
