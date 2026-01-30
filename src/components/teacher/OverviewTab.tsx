import React from 'react';
import { useData } from '../../context/DataContext';
import { mockStudents, mockSubjects } from '../../data/mockData';
import { Users, Calendar, FileText, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';

export const OverviewTab = () => {
  const { marks, assignments, attendance } = useData();

  // Calculate class-wise statistics
  const classLevels = Array.from(new Set(mockStudents.map((s) => s.classLevel))).sort(
    (a, b) => a - b
  );

  const classStats = classLevels.map((classLevel) => {
    const classStudents = mockStudents.filter((s) => s.classLevel === classLevel);
    const studentIds = classStudents.map((s) => s.id);

    // Attendance
    const classAttendance = attendance.filter((a) =>
      studentIds.includes(a.studentId)
    );
    const presentCount = classAttendance.filter((a) => a.status === 'present').length;
    const attendancePercentage =
      classAttendance.length > 0
        ? Math.round((presentCount / classAttendance.length) * 100)
        : 0;

    // Performance
    const classMarks = marks.filter((m) => studentIds.includes(m.studentId));
    const avgPerformance =
      classMarks.length > 0
        ? Math.round(
            classMarks.reduce((acc, m) => acc + (m.marks / m.maxMarks) * 100, 0) /
              classMarks.length
          )
        : 0;

    // Assignments
    const classAssignments = assignments.filter((a) => a.classLevel === classLevel);
    const pendingAssignments = classAssignments.filter(
      (a) => a.status === 'pending'
    ).length;

    return {
      class: `Class ${classLevel}`,
      students: classStudents.length,
      attendance: attendancePercentage,
      performance: avgPerformance,
      pendingAssignments,
    };
  });

  // Recent activity trends (last 7 days)
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return date.toISOString().split('T')[0];
  });

  const dailyAttendance = last7Days.map((date) => {
    const dayAttendance = attendance.filter((a) => a.date === date);
    const presentCount = dayAttendance.filter((a) => a.status === 'present').length;
    const percentage =
      dayAttendance.length > 0
        ? Math.round((presentCount / dayAttendance.length) * 100)
        : 0;

    return {
      date: new Date(date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      }),
      attendance: percentage,
    };
  });

  const totalStudents = mockStudents.length;
  const totalAssignments = assignments.length;
  const pendingAssignments = assignments.filter((a) => a.status === 'pending').length;
  const totalClasses = classLevels.length;

  // Overall attendance
  const overallAttendance = attendance.filter((a) => a.status === 'present').length;
  const overallAttendancePercentage =
    attendance.length > 0
      ? Math.round((overallAttendance / attendance.length) * 100)
      : 0;

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg p-6">
        <h2>Teacher Dashboard</h2>
        <p className="text-purple-100">Manage students, attendance, and academic records</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-3 rounded-lg">
              <Users className="size-6 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl">{totalStudents}</div>
              <div className="text-sm text-gray-600">Total Students</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center gap-3">
            <div className="bg-green-100 p-3 rounded-lg">
              <Calendar className="size-6 text-green-600" />
            </div>
            <div>
              <div className="text-2xl">{overallAttendancePercentage}%</div>
              <div className="text-sm text-gray-600">Avg Attendance</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center gap-3">
            <div className="bg-purple-100 p-3 rounded-lg">
              <FileText className="size-6 text-purple-600" />
            </div>
            <div>
              <div className="text-2xl">{pendingAssignments}</div>
              <div className="text-sm text-gray-600">Pending Tasks</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center gap-3">
            <div className="bg-orange-100 p-3 rounded-lg">
              <TrendingUp className="size-6 text-orange-600" />
            </div>
            <div>
              <div className="text-2xl">{totalClasses}</div>
              <div className="text-sm text-gray-600">Classes</div>
            </div>
          </div>
        </div>
      </div>

      {/* Attendance Trend */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="mb-4">Attendance Trend (Last 7 Days)</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={dailyAttendance}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="attendance"
              stroke="#8b5cf6"
              strokeWidth={2}
              name="Attendance %"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Class-wise Performance */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="mb-4">Class-wise Overview</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm">Class</th>
                <th className="px-4 py-3 text-left text-sm">Students</th>
                <th className="px-4 py-3 text-left text-sm">Attendance</th>
                <th className="px-4 py-3 text-left text-sm">Avg Performance</th>
                <th className="px-4 py-3 text-left text-sm">Pending Assignments</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {classStats.map((stat) => (
                <tr key={stat.class} className="hover:bg-gray-50">
                  <td className="px-4 py-3">{stat.class}</td>
                  <td className="px-4 py-3">{stat.students}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[100px]">
                        <div
                          className={`h-2 rounded-full ${
                            stat.attendance >= 80
                              ? 'bg-green-500'
                              : stat.attendance >= 60
                              ? 'bg-yellow-500'
                              : 'bg-red-500'
                          }`}
                          style={{ width: `${stat.attendance}%` }}
                        />
                      </div>
                      <span className="text-sm">{stat.attendance}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        stat.performance >= 80
                          ? 'bg-green-100 text-green-800'
                          : stat.performance >= 60
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {stat.performance}%
                    </span>
                  </td>
                  <td className="px-4 py-3">{stat.pendingAssignments}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Performance Analytics */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="mb-4">Class Performance Comparison</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={classStats}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="class" />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Legend />
            <Bar dataKey="attendance" fill="#10b981" name="Attendance %" />
            <Bar dataKey="performance" fill="#6366f1" name="Performance %" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
