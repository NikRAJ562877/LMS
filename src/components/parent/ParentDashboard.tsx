import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Parent } from '../../types';
import { mockStudents, mockSubjects } from '../../data/mockData';
import { Users, BookOpen, Calendar, Mail, TrendingUp, FileText } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';

export const ParentDashboard = () => {
  const { user } = useAuth();
  const { marks, assignments, attendance, messages } = useData();
  const parent = user as Parent;

  const [selectedChildId, setSelectedChildId] = useState(parent.childrenIds[0]);

  // Get children
  const children = mockStudents.filter((s) => parent.childrenIds.includes(s.id));
  const selectedChild = children.find((c) => c.id === selectedChildId);

  if (!selectedChild) return null;

  // Get child's data
  const childMarks = marks.filter((m) => m.studentId === selectedChild.id);
  const childSubjects = mockSubjects.filter(
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
  const submittedAssignments = childAssignments.filter(
    (a) => a.status === 'submitted'
  );
  const evaluatedAssignments = childAssignments.filter(
    (a) => a.status === 'evaluated'
  );

  // Calculate attendance
  const childAttendance = attendance.filter((a) => a.studentId === selectedChild.id);
  const totalDays = childAttendance.length;
  const presentDays = childAttendance.filter((a) => a.status === 'present').length;
  const attendancePercentage = totalDays > 0 ? (presentDays / totalDays) * 100 : 0;

  // Attendance trend (last 7 days)
  const last7Days = childAttendance.slice(0, 7).reverse();
  const attendanceTrend = last7Days.map((att) => ({
    date: new Date(att.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    status: att.status === 'present' ? 1 : 0,
  }));

  // Messages for parent
  const parentMessages = messages.filter((m) => m.to === parent.id);
  const unreadMessages = parentMessages.filter((m) => !m.read);

  // Overall performance
  const overallPercentage =
    subjectPerformance.length > 0
      ? Math.round(
          subjectPerformance.reduce((acc, s) => acc + s.percentage, 0) /
            subjectPerformance.length
        )
      : 0;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg p-6">
        <h2>Parent Dashboard</h2>
        <p className="text-green-100">Welcome, {parent.name}</p>

        {/* Child Selector */}
        {children.length > 1 && (
          <div className="mt-4">
            <label className="text-sm text-green-100 block mb-2">
              Select Child:
            </label>
            <select
              value={selectedChildId}
              onChange={(e) => setSelectedChildId(e.target.value)}
              className="px-4 py-2 rounded-md text-gray-900 bg-white"
            >
              {children.map((child) => (
                <option key={child.id} value={child.id}>
                  {child.name} - Class {child.classLevel}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Child Overview */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center gap-2 mb-4">
          <Users className="size-5 text-green-600" />
          <h3>{selectedChild.name}'s Overview</h3>
          <span className="text-sm text-gray-500">Class {selectedChild.classLevel}</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4">
            <div className="text-2xl text-indigo-600">{overallPercentage}%</div>
            <div className="text-sm text-gray-600">Overall Performance</div>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4">
            <div className="text-2xl text-green-600">
              {Math.round(attendancePercentage)}%
            </div>
            <div className="text-sm text-gray-600">Attendance</div>
          </div>
          <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-lg p-4">
            <div className="text-2xl text-yellow-600">
              {pendingAssignments.length}
            </div>
            <div className="text-sm text-gray-600">Pending Assignments</div>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-4">
            <div className="text-2xl text-purple-600">{unreadMessages.length}</div>
            <div className="text-sm text-gray-600">Unread Messages</div>
          </div>
        </div>
      </div>

      {/* Academic Performance */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="size-5 text-green-600" />
          <h3>Subject-wise Marks</h3>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={subjectPerformance}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="subject" />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Bar dataKey="percentage" fill="#10b981" />
          </BarChart>
        </ResponsiveContainer>

        {/* Detailed Marks Table */}
        <div className="mt-6">
          <h4 className="mb-3">Detailed Performance</h4>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-sm">Subject</th>
                  <th className="px-4 py-2 text-left text-sm">Exam Type</th>
                  <th className="px-4 py-2 text-left text-sm">Marks</th>
                  <th className="px-4 py-2 text-left text-sm">Percentage</th>
                  <th className="px-4 py-2 text-left text-sm">Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {childMarks.map((mark) => {
                  const subject = childSubjects.find((s) => s.id === mark.subjectId);
                  const percentage = (mark.marks / mark.maxMarks) * 100;
                  return (
                    <tr key={mark.id}>
                      <td className="px-4 py-2 text-sm">{subject?.name}</td>
                      <td className="px-4 py-2 text-sm">{mark.examType}</td>
                      <td className="px-4 py-2 text-sm">
                        {mark.marks}/{mark.maxMarks}
                      </td>
                      <td className="px-4 py-2 text-sm">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            percentage >= 80
                              ? 'bg-green-100 text-green-800'
                              : percentage >= 60
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {Math.round(percentage)}%
                        </span>
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-600">
                        {mark.remarks || '-'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Assignments */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="size-5 text-green-600" />
            <h3>Assignment Updates</h3>
          </div>
          <div className="space-y-3">
            {childAssignments.slice(0, 5).map((assignment) => {
              const subject = childSubjects.find((s) => s.id === assignment.subjectId);
              return (
                <div
                  key={assignment.id}
                  className="border rounded-lg p-3 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span>{assignment.title}</span>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${
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
                      <div className="text-sm text-gray-600 mt-1">
                        {subject?.name}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Due: {new Date(assignment.dueDate).toLocaleDateString()}
                      </div>
                      {assignment.grade && (
                        <div className="text-sm text-green-600 mt-1">
                          Grade: {assignment.grade}% - {assignment.remarks}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Attendance */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="size-5 text-green-600" />
            <h3>Attendance Records</h3>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg mb-4">
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

          <div className="mb-4">
            <div className="text-sm mb-2">Last 7 Days Trend</div>
            <ResponsiveContainer width="100%" height={120}>
              <LineChart data={attendanceTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                <YAxis domain={[0, 1]} ticks={[0, 1]} tick={{ fontSize: 10 }} />
                <Tooltip
                  formatter={(value) => (value === 1 ? 'Present' : 'Absent')}
                />
                <Line
                  type="monotone"
                  dataKey="status"
                  stroke="#10b981"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div>
            <div className="text-sm text-gray-600 mb-2">Recent Attendance</div>
            <div className="flex flex-wrap gap-1">
              {childAttendance
                .slice(0, 20)
                .reverse()
                .map((att, index) => (
                  <div
                    key={index}
                    className={`w-5 h-5 rounded ${
                      att.status === 'present' ? 'bg-green-500' : 'bg-red-500'
                    }`}
                    title={`${att.date}: ${att.status}`}
                  />
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      {parentMessages.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-2 mb-4">
            <Mail className="size-5 text-green-600" />
            <h3>Teacher Messages</h3>
          </div>
          <div className="space-y-3">
            {parentMessages.map((message) => (
              <div
                key={message.id}
                className={`p-4 rounded-lg border ${
                  message.read ? 'bg-gray-50' : 'bg-green-50 border-green-200'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span>{message.subject}</span>
                      {!message.read && (
                        <span className="text-xs bg-green-600 text-white px-2 py-0.5 rounded-full">
                          New
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-2">{message.content}</p>
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
