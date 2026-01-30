import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Student } from '../../types';
import { mockSubjects } from '../../data/mockData';
import { BookOpen, FileText, Calendar, TrendingUp, Mail, Eye } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { AssignmentFileViewer } from '../AssignmentFileViewer';

export const StudentDashboard = () => {
  const { user } = useAuth();
  const { marks, assignments, attendance, messages } = useData();
  const student = user as Student;
  const [expandedAssignment, setExpandedAssignment] = useState<string | null>(null);

  // Get student's subjects
  const studentSubjects = mockSubjects.filter(
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

  // Monthly attendance
  const currentMonth = new Date().getMonth();
  const monthlyAttendance = studentAttendance.filter((a) => {
    const month = new Date(a.date).getMonth();
    return month === currentMonth;
  });
  const monthlyPresentDays = monthlyAttendance.filter(
    (a) => a.status === 'present'
  ).length;
  const monthlyPercentage =
    monthlyAttendance.length > 0
      ? (monthlyPresentDays / monthlyAttendance.length) * 100
      : 0;

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
    <div className="p-6 space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg p-6">
        <h2>Welcome back, {student.name}!</h2>
        <p className="text-indigo-100">Class {student.classLevel}</p>
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white/20 rounded-lg p-3">
            <div className="text-2xl">{overallPercentage}%</div>
            <div className="text-sm text-indigo-100">Overall Performance</div>
          </div>
          <div className="bg-white/20 rounded-lg p-3">
            <div className="text-2xl">{Math.round(attendancePercentage)}%</div>
            <div className="text-sm text-indigo-100">Attendance</div>
          </div>
          <div className="bg-white/20 rounded-lg p-3">
            <div className="text-2xl">{pendingAssignments.length}</div>
            <div className="text-sm text-indigo-100">Pending Tasks</div>
          </div>
          <div className="bg-white/20 rounded-lg p-3">
            <div className="text-2xl">{unreadMessages.length}</div>
            <div className="text-sm text-indigo-100">New Messages</div>
          </div>
        </div>
      </div>

      {/* Subject-wise Marks */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="size-5 text-indigo-600" />
          <h3>Subject-wise Performance</h3>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={subjectPerformance}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="subject" />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Bar dataKey="percentage" fill="#6366f1" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Assignments */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="size-5 text-indigo-600" />
            <h3>Assignments Overview</h3>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={assignmentStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {assignmentStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {studentAssignments.slice(0, 3).map((assignment) => (
              <div
                key={assignment.id}
                className="flex items-center justify-between p-2 bg-gray-50 rounded"
              >
                <div className="flex-1">
                  <div className="text-sm">{assignment.title}</div>
                  <div className="text-xs text-gray-500">
                    Due: {new Date(assignment.dueDate).toLocaleDateString()}
                  </div>
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    assignment.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : assignment.status === 'submitted'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-green-100 text-green-800'
                  }`}
                >
                  {assignment.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Attendance Summary */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="size-5 text-indigo-600" />
            <h3>Attendance Summary</h3>
          </div>
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">Overall Attendance</div>
              <div className="flex items-baseline gap-2">
                <div className="text-3xl text-green-600">
                  {Math.round(attendancePercentage)}%
                </div>
                <div className="text-sm text-gray-600">
                  ({presentDays}/{totalDays} days)
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">This Month</div>
              <div className="flex items-baseline gap-2">
                <div className="text-3xl text-blue-600">
                  {Math.round(monthlyPercentage)}%
                </div>
                <div className="text-sm text-gray-600">
                  ({monthlyPresentDays}/{monthlyAttendance.length} days)
                </div>
              </div>
            </div>
            <div className="pt-2 border-t">
              <div className="text-sm text-gray-600 mb-2">Recent Attendance</div>
              <div className="flex gap-1">
                {studentAttendance
                  .slice(0, 14)
                  .reverse()
                  .map((att, index) => (
                    <div
                      key={index}
                      className={`w-6 h-6 rounded ${
                        att.status === 'present' ? 'bg-green-500' : 'bg-red-500'
                      }`}
                      title={`${att.date}: ${att.status}`}
                    />
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Messages */}
      {studentMessages.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-2 mb-4">
            <Mail className="size-5 text-indigo-600" />
            <h3>Recent Messages</h3>
          </div>
          <div className="space-y-2">
            {studentMessages.slice(0, 3).map((message) => (
              <div
                key={message.id}
                className={`p-3 rounded-lg border ${
                  message.read ? 'bg-gray-50' : 'bg-blue-50 border-blue-200'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span>{message.subject}</span>
                      {!message.read && (
                        <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full">
                          New
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{message.content}</p>
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(message.date).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};