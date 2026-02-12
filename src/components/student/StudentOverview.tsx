import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Student } from '../../types';
import { BookOpen, FileText, Calendar, TrendingUp, Mail } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export const StudentOverview = () => {
    const { user } = useAuth();
    const { marks, assignments, attendance, messages, subjects } = useData();
    const student = user as Student;

    // Get student's subjects
    const studentSubjects = subjects.filter(
        (sub) => sub.classLevel === student.classLevel
    );

    // Get student's marks
    const studentMarks = marks.filter((m) => m.studentId === student.id);

    // Calculate subject-wise performance
    const subjectPerformance = studentSubjects.map((subject) => {
        const subjectMarks = studentMarks.filter((m) => m.subjectId === subject.id);
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

    // Get student's assignments
    const studentAssignments = assignments.filter(
        (a) =>
            a.classLevel === student.classLevel &&
            (!a.studentId || a.studentId === student.id)
    );

    const pendingAssignments = studentAssignments.filter(
        (a) => a.status === 'pending'
    );
    const submittedAssignments = studentAssignments.filter(
        (a) => a.status === 'submitted'
    );
    const evaluatedAssignments = studentAssignments.filter(
        (a) => a.status === 'evaluated'
    );

    // Calculate attendance
    const studentAttendance = attendance.filter(
        (a) => a.studentId === student.id
    );
    const totalDays = studentAttendance.length;
    const presentDays = studentAttendance.filter(
        (a) => a.status === 'present'
    ).length;
    const attendancePercentage = totalDays > 0 ? (presentDays / totalDays) * 100 : 0;

    // Messages for student
    const studentMessages = messages.filter((m) => m.to === student.id);
    const unreadMessages = studentMessages.filter((m) => !m.read);

    // Overall performance
    const overallPercentage =
        subjectPerformance.length > 0
            ? Math.round(
                subjectPerformance.reduce((acc, s) => acc + s.percentage, 0) /
                subjectPerformance.length
            )
            : 0;

    const assignmentStatusData = [
        { name: 'Pending', value: pendingAssignments.length, color: '#fbbf24' },
        { name: 'Submitted', value: submittedAssignments.length, color: '#60a5fa' },
        { name: 'Evaluated', value: evaluatedAssignments.length, color: '#34d399' },
    ];

    return (
        <div className="space-y-6">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg p-6 shadow-lg">
                <h2 className="text-2xl font-bold mb-2">Welcome back, {student.name}!</h2>
                <p className="text-indigo-100 mb-6">Class {student.classLevel} • {student.email}</p>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                        <div className="text-3xl font-bold">{overallPercentage}%</div>
                        <div className="text-sm text-indigo-100 flex items-center gap-1">
                            <TrendingUp className="size-4" /> Overall Performance
                        </div>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                        <div className="text-3xl font-bold">{Math.round(attendancePercentage)}%</div>
                        <div className="text-sm text-indigo-100 flex items-center gap-1">
                            <Calendar className="size-4" /> Attendance
                        </div>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                        <div className="text-3xl font-bold">{pendingAssignments.length}</div>
                        <div className="text-sm text-indigo-100 flex items-center gap-1">
                            <FileText className="size-4" /> Pending Tasks
                        </div>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                        <div className="text-3xl font-bold">{unreadMessages.length}</div>
                        <div className="text-sm text-indigo-100 flex items-center gap-1">
                            <Mail className="size-4" /> New Messages
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Subject-wise Marks */}
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <BookOpen className="size-5 text-indigo-600" />
                        <h3 className="font-bold text-gray-800">Subject Performance</h3>
                    </div>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={subjectPerformance}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="subject" tick={{ fontSize: 12 }} />
                                <YAxis domain={[0, 100]} />
                                <Tooltip cursor={{ fill: '#f3f4f6' }} />
                                <Bar dataKey="percentage" fill="#6366f1" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Assignments Overview */}
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <FileText className="size-5 text-indigo-600" />
                        <h3 className="font-bold text-gray-800">Assignments</h3>
                    </div>
                    <div className="flex flex-col md:flex-row items-center">
                        <div className="h-48 w-full md:w-1/2">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={assignmentStatusData}
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {assignmentStatusData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="w-full md:w-1/2 space-y-3 mt-4 md:mt-0">
                            {assignmentStatusData.map((item, index) => (
                                <div key={index} className="flex items-center justify-between p-2 rounded bg-gray-50">
                                    <div className="flex items-center gap-2">
                                        <div className="size-3 rounded-full" style={{ backgroundColor: item.color }} />
                                        <span className="text-sm text-gray-600">{item.name}</span>
                                    </div>
                                    <span className="font-bold">{item.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
