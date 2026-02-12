import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Users, Search, TrendingUp, Calendar } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const StudentsTab = () => {
  const { marks, attendance, students, subjects } = useData();
  const [selectedClass, setSelectedClass] = useState<number>(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);

  const classLevels = Array.from(
    new Set(students.map((s) => s.classLevel))
  ).sort((a, b) => a - b);


  // Filter students
  const filteredStudents = students
    .filter((s) => s.classLevel === selectedClass)
    .filter((s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

  // Get student details
  const getStudentDetails = (studentId: string) => {
    const student = students.find((s) => s.id === studentId);
    if (!student) return null;

    const studentMarks = marks.filter((m) => m.studentId === studentId);
    const studentAttendance = attendance.filter((a) => a.studentId === studentId);

    const studentSubjects = subjects.filter(
      (sub) => sub.classLevel === student.classLevel
    );

    // Subject-wise performance
    const subjectPerformance = subjects.map((subject) => {
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

    // Attendance
    const totalDays = studentAttendance.length;
    const presentDays = studentAttendance.filter(
      (a) => a.status === 'present'
    ).length;
    const attendancePercentage =
      totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0;

    // Overall performance
    const overallPercentage =
      subjectPerformance.length > 0
        ? Math.round(
          subjectPerformance.reduce((acc, s) => acc + s.percentage, 0) /
          subjectPerformance.length
        )
        : 0;

    return {
      student,
      subjectPerformance,
      attendancePercentage,
      presentDays,
      totalDays,
      overallPercentage,
    };
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center gap-2 mb-4">
          <Users className="size-6 text-purple-600" />
          <h2>Student Management</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-2">Select Class</label>
            <select
              value={selectedClass}
              onChange={(e) => {
                setSelectedClass(Number(e.target.value));
                setSelectedStudent(null);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {classLevels.map((level) => (
                <option key={level} value={level}>
                  Class {level}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm mb-2">Search Student</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name..."
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Students List */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* List */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b">
            <h3>Class {selectedClass} Students ({filteredStudents.length})</h3>
          </div>
          <div className="divide-y max-h-[600px] overflow-y-auto">
            {filteredStudents.map((student) => {
              const details = getStudentDetails(student.id);
              if (!details) return null;

              return (
                <div
                  key={student.id}
                  onClick={() => setSelectedStudent(student.id)}
                  className={`p-4 cursor-pointer transition-colors ${selectedStudent === student.id
                    ? 'bg-purple-50 border-l-4 border-purple-600'
                    : 'hover:bg-gray-50'
                    }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div>{student.name}</div>
                      <div className="text-sm text-gray-600">
                        Class {student.classLevel}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-600">
                        Performance: {details.overallPercentage}%
                      </div>
                      <div className="text-sm text-gray-600">
                        Attendance: {details.attendancePercentage}%
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Details */}
        <div className="bg-white rounded-lg shadow p-6">
          {selectedStudent ? (
            (() => {
              const details = getStudentDetails(selectedStudent);
              if (!details) return null;

              return (
                <div className="space-y-6">
                  <div>
                    <h3 className="mb-2">{details.student.name}</h3>
                    <p className="text-gray-600">
                      Class {details.student.classLevel}
                    </p>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-1">
                        <TrendingUp className="size-4 text-indigo-600" />
                        <div className="text-sm text-gray-600">
                          Overall Performance
                        </div>
                      </div>
                      <div className="text-2xl text-indigo-600">
                        {details.overallPercentage}%
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-1">
                        <Calendar className="size-4 text-green-600" />
                        <div className="text-sm text-gray-600">Attendance</div>
                      </div>
                      <div className="text-2xl text-green-600">
                        {details.attendancePercentage}%
                      </div>
                      <div className="text-xs text-gray-600">
                        {details.presentDays}/{details.totalDays} days
                      </div>
                    </div>
                  </div>

                  {/* Subject Performance */}
                  <div>
                    <h4 className="mb-3">Subject-wise Performance</h4>
                    <ResponsiveContainer width="100%" height={250}>
                      <BarChart data={details.subjectPerformance}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="subject" tick={{ fontSize: 11 }} />
                        <YAxis domain={[0, 100]} />
                        <Tooltip />
                        <Bar dataKey="percentage" fill="#8b5cf6" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Detailed Marks */}
                  <div>
                    <h4 className="mb-3">Detailed Performance</h4>
                    <div className="space-y-2">
                      {details.subjectPerformance.map((perf) => (
                        <div
                          key={perf.subject}
                          className="flex items-center justify-between p-2 bg-gray-50 rounded"
                        >
                          <span className="text-sm">{perf.subject}</span>
                          <span
                            className={`text-sm px-3 py-1 rounded-full ${perf.percentage >= 80
                              ? 'bg-green-100 text-green-800'
                              : perf.percentage >= 60
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                              }`}
                          >
                            {perf.percentage}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })()
          ) : (
            <div className="text-center text-gray-500 py-12">
              <Users className="size-12 mx-auto mb-3 text-gray-400" />
              <p>Select a student to view details</p>
            </div>
          )}
        </div>
      </div>

      {/* Class Summary */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="mb-4">Class {selectedClass} Summary</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="text-sm text-gray-600 mb-1">Total Students</div>
            <div className="text-2xl text-blue-600">
              {filteredStudents.length}
            </div>
          </div>

          <div className="bg-green-50 rounded-lg p-4">
            <div className="text-sm text-gray-600 mb-1">
              Avg Class Performance
            </div>
            <div className="text-2xl text-green-600">
              {Math.round(
                filteredStudents.reduce((acc, student) => {
                  const details = getStudentDetails(student.id);
                  return acc + (details?.overallPercentage || 0);
                }, 0) / filteredStudents.length
              )}
              %
            </div>
          </div>

          <div className="bg-purple-50 rounded-lg p-4">
            <div className="text-sm text-gray-600 mb-1">Avg Attendance</div>
            <div className="text-2xl text-purple-600">
              {Math.round(
                filteredStudents.reduce((acc, student) => {
                  const details = getStudentDetails(student.id);
                  return acc + (details?.attendancePercentage || 0);
                }, 0) / filteredStudents.length
              )}
              %
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
