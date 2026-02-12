import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Student } from '../../types';
import { BookOpen, AlertCircle } from 'lucide-react';

export const StudentAcademics = () => {
    const { user } = useAuth();
    const { marks, subjects } = useData();
    const student = user as Student;

    const studentSubjects = subjects.filter(
        (sub) => sub.classLevel === student.classLevel
    );

    const studentMarks = marks.filter((m) => m.studentId === student.id);

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <BookOpen className="text-purple-600" />
                    Academic Performance
                </h2>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="p-4 border-b">Subject</th>
                                <th className="p-4 border-b">Exam Type</th>
                                <th className="p-4 border-b">Marks Obtained</th>
                                <th className="p-4 border-b">Percentage</th>
                                <th className="p-4 border-b">Grade</th>
                                <th className="p-4 border-b">Remarks</th>
                            </tr>
                        </thead>
                        <tbody>
                            {studentMarks.length > 0 ? (
                                studentMarks.map((mark) => {
                                    const subject = subjects.find(s => s.id === mark.subjectId);
                                    const percentage = (mark.marks / mark.maxMarks) * 100;
                                    let grade = 'F';
                                    if (percentage >= 90) grade = 'A+';
                                    else if (percentage >= 80) grade = 'A';
                                    else if (percentage >= 70) grade = 'B';
                                    else if (percentage >= 60) grade = 'C';
                                    else if (percentage >= 50) grade = 'D';

                                    return (
                                        <tr key={mark.id} className="hover:bg-gray-50">
                                            <td className="p-4 border-b font-medium">{subject?.name}</td>
                                            <td className="p-4 border-b capitalize">{mark.examType}</td>
                                            <td className="p-4 border-b">
                                                <span className="font-bold">{mark.marks}</span>
                                                <span className="text-gray-500 text-sm"> / {mark.maxMarks}</span>
                                            </td>
                                            <td className="p-4 border-b">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                                                        <div
                                                            className={`h-full rounded-full ${percentage >= 80 ? 'bg-green-500' :
                                                                    percentage >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                                                                }`}
                                                            style={{ width: `${percentage}%` }}
                                                        />
                                                    </div>
                                                    <span>{Math.round(percentage)}%</span>
                                                </div>
                                            </td>
                                            <td className="p-4 border-b">
                                                <span className={`px-2 py-1 rounded text-sm font-bold ${grade.startsWith('A') ? 'bg-green-100 text-green-700' :
                                                        grade === 'B' ? 'bg-blue-100 text-blue-700' :
                                                            grade === 'C' ? 'bg-yellow-100 text-yellow-700' :
                                                                'bg-red-100 text-red-700'
                                                    }`}>
                                                    {grade}
                                                </span>
                                            </td>
                                            <td className="p-4 border-b text-gray-500 text-sm">{mark.remarks || '-'}</td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-gray-500">
                                        <div className="flex flex-col items-center gap-2">
                                            <AlertCircle className="size-8 text-gray-300" />
                                            <p>No academic records found yet.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
