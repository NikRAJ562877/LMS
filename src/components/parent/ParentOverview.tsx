import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Student } from '../../types';
import { Users, BookOpen, Calendar, Mail, TrendingUp, FileText } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

interface ParentOverviewProps {
    children: Student[];
}

export const ParentOverview: React.FC<ParentOverviewProps> = ({ children }) => {
    const { marks, assignments, attendance, messages, subjects } = useData();
    const [selectedChildId, setSelectedChildId] = useState(children[0]?.id || '');

    const selectedChild = children.find(c => c.id === selectedChildId);

    if (!selectedChild) {
        return (
            <div className="text-center py-12">
                <Users className="size-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-600">No children linked to your account.</h3>
                <p className="text-gray-500">Please contact administration.</p>
            </div>
        );
    }

    // Get child's data
    const childMarks = marks.filter((m) => m.studentId === selectedChild.id);
    const childSubjects = subjects.filter(
        (sub) => sub.classLevel === selectedChild.classLevel
    );

    // Calculate subject-wise performance
    const subjectPerformance = childSubjects.map((subject) => {
        const subjectMarks = childMarks.filter((m) => m.subjectId === subject.id);
        const avg =
            subjectMarks.length > 0
                ? subjectMarks.reduce((acc, m) => acc + (m.marks / m.maxMarks) * 100, 0) /
                subjectMarks.length
                : 0;
        return {
            subject: subject.name,
            percentage: Math.round(avg),
        };
    });

    // Get child's assignments
    const childAssignments = assignments.filter(
        (a) =>
            a.classLevel === selectedChild.classLevel &&
            (!a.studentId || a.studentId === selectedChild.id)
    );

    const pendingAssignments = childAssignments.filter((a) => a.status === 'pending');

    // Calculate attendance
    const childAttendance = attendance.filter((a) => a.studentId === selectedChild.id);
    const totalDays = childAttendance.length;
    const presentDays = childAttendance.filter((a) => a.status === 'present').length;
    const attendancePercentage = totalDays > 0 ? (presentDays / totalDays) * 100 : 0;

    // Messages (assuming messages to student are visible to parent? Or messages to parent directly?)
    // In MessagingTab we send to PARENT or STUDENT.
    // Parent Dashboard should show messages sent to Parent.
    // BUT typically parents also want to see what is happening with their child. 
    // Let's show messages sent to THIS CHILD for now as "Child's Notifications"
    // AND messages sent to the PARENT in communication tab?
    // Let's show messages sent to the CHILD here.
    const childMessages = messages.filter((m) => m.to === selectedChild.id && !m.read);

    // Overall performance
    const overallPercentage =
        subjectPerformance.length > 0
            ? Math.round(
                subjectPerformance.reduce((acc, s) => acc + s.percentage, 0) /
                subjectPerformance.length
            )
            : 0;

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6 border-b-4 border-emerald-500">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Child Overview</h2>
                        <p className="text-gray-500">Monitoring progress for class {selectedChild.classLevel}</p>
                    </div>

                    {children.length > 1 && (
                        <div className="flex items-center gap-2">
                            <label className="text-sm font-medium text-gray-700">Select Child:</label>
                            <select
                                value={selectedChildId}
                                onChange={(e) => setSelectedChildId(e.target.value)}
                                className="px-3 py-2 border rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500"
                            >
                                {children.map(child => (
                                    <option key={child.id} value={child.id}>{child.name}</option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs text-gray-500 uppercase font-semibold">Overall Score</p>
                            <h3 className="text-2xl font-bold text-gray-800">{overallPercentage}%</h3>
                        </div>
                        <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                            <TrendingUp className="size-5" />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs text-gray-500 uppercase font-semibold">Attendance</p>
                            <h3 className="text-2xl font-bold text-gray-800">{Math.round(attendancePercentage)}%</h3>
                            <p className="text-xs text-gray-500 mt-1">{presentDays}/{totalDays} Days</p>
                        </div>
                        <div className="p-2 bg-green-50 rounded-lg text-green-600">
                            <Calendar className="size-5" />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow p-4 border-l-4 border-yellow-500">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs text-gray-500 uppercase font-semibold">Pending Tasks</p>
                            <h3 className="text-2xl font-bold text-gray-800">{pendingAssignments.length}</h3>
                        </div>
                        <div className="p-2 bg-yellow-50 rounded-lg text-yellow-600">
                            <FileText className="size-5" />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow p-4 border-l-4 border-purple-500">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs text-gray-500 uppercase font-semibold">Notifications</p>
                            <h3 className="text-2xl font-bold text-gray-800">{childMessages.length}</h3>
                        </div>
                        <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
                            <Mail className="size-5" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Academic Performance Chart */}
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <BookOpen className="size-5 text-emerald-600" />
                        <h3 className="font-bold text-gray-800">Academic Performance</h3>
                    </div>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={subjectPerformance}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="subject" tick={{ fontSize: 12 }} />
                                <YAxis domain={[0, 100]} />
                                <Tooltip cursor={{ fill: '#f0fdf4' }} />
                                <Bar dataKey="percentage" fill="#10b981" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Recent Assignments */}
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <FileText className="size-5 text-emerald-600" />
                        <h3 className="font-bold text-gray-800">Recent Assignments</h3>
                    </div>
                    <div className="space-y-3">
                        {childAssignments.slice(0, 4).map(assignment => (
                            <div key={assignment.id} className="p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                                <div className="flex justify-between items-start mb-1">
                                    <h4 className="font-medium text-gray-800">{assignment.title}</h4>
                                    <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${assignment.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                            assignment.status === 'submitted' ? 'bg-blue-100 text-blue-700' :
                                                'bg-green-100 text-green-700'
                                        }`}>
                                        {assignment.status}
                                    </span>
                                </div>
                                <div className="flex justify-between text-xs text-gray-500">
                                    <span>{childSubjects.find(s => s.id === assignment.subjectId)?.name}</span>
                                    <span>Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                                </div>
                            </div>
                        ))}
                        {childAssignments.length === 0 && (
                            <p className="text-gray-500 text-center py-4">No assignments found.</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Recent Grades Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-4 border-b bg-gray-50 flex items-center gap-2">
                    <TrendingUp className="size-5 text-emerald-600" />
                    <h3 className="font-bold text-gray-800">Recent Exam Results</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                            <tr>
                                <th className="px-6 py-3">Subject</th>
                                <th className="px-6 py-3">Exam</th>
                                <th className="px-6 py-3">Date</th>
                                <th className="px-6 py-3">Score</th>
                                <th className="px-6 py-3">Grade</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {childMarks.slice(0, 5).map(mark => {
                                const subject = childSubjects.find(s => s.id === mark.subjectId);
                                const pct = (mark.marks / mark.maxMarks) * 100;
                                let grade = 'F';
                                if (pct >= 90) grade = 'A+';
                                else if (pct >= 80) grade = 'A';
                                else if (pct >= 70) grade = 'B';
                                else if (pct >= 60) grade = 'C';
                                else if (pct >= 50) grade = 'D';

                                return (
                                    <tr key={mark.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 font-medium">{subject?.name}</td>
                                        <td className="px-6 py-4 capitalize">{mark.examType}</td>
                                        <td className="px-6 py-4 text-gray-500">{new Date(mark.date).toLocaleDateString()}</td>
                                        <td className="px-6 py-4">
                                            <span className="font-bold text-gray-800">{mark.marks}</span>
                                            <span className="text-gray-500 text-xs"> /{mark.maxMarks}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded text-xs font-bold ${grade.startsWith('A') ? 'bg-green-100 text-green-700' :
                                                    grade === 'B' ? 'bg-blue-100 text-blue-700' :
                                                        grade === 'C' ? 'bg-yellow-100 text-yellow-700' :
                                                            'bg-red-100 text-red-700'
                                                }`}>
                                                {grade}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                            {childMarks.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">No marks recorded yet.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
