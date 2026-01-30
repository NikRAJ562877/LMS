import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { mockStudents } from '../../data/mockData';
import { Calendar, Check, X, Edit2, Save } from 'lucide-react';

export const AttendanceTab = () => {
  const { attendance, updateAttendance, addAttendance } = useData();
  const [selectedClass, setSelectedClass] = useState<number>(10);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [editMode, setEditMode] = useState<{ [key: string]: boolean }>({});

  const classLevels = Array.from(
    new Set(mockStudents.map((s) => s.classLevel))
  ).sort((a, b) => a - b);

  const classStudents = mockStudents.filter((s) => s.classLevel === selectedClass);

  // Get or initialize attendance for the selected date
  const getAttendanceForStudent = (studentId: string) => {
    return attendance.find(
      (a) => a.studentId === studentId && a.date === selectedDate
    );
  };

  const handleAttendanceToggle = (studentId: string) => {
    const existingAttendance = getAttendanceForStudent(studentId);

    if (existingAttendance) {
      updateAttendance(existingAttendance.id, {
        status: existingAttendance.status === 'present' ? 'absent' : 'present',
      });
    } else {
      addAttendance({
        id: `att-${studentId}-${selectedDate}`,
        studentId,
        classLevel: selectedClass,
        date: selectedDate,
        status: 'present',
      });
    }
  };

  const markAllPresent = () => {
    classStudents.forEach((student) => {
      const existingAttendance = getAttendanceForStudent(student.id);
      if (existingAttendance) {
        if (existingAttendance.status !== 'present') {
          updateAttendance(existingAttendance.id, { status: 'present' });
        }
      } else {
        addAttendance({
          id: `att-${student.id}-${selectedDate}`,
          studentId: student.id,
          classLevel: selectedClass,
          date: selectedDate,
          status: 'present',
        });
      }
    });
  };

  // Calculate attendance summary
  const presentCount = classStudents.filter((s) => {
    const att = getAttendanceForStudent(s.id);
    return att?.status === 'present';
  }).length;

  const absentCount = classStudents.filter((s) => {
    const att = getAttendanceForStudent(s.id);
    return att?.status === 'absent';
  }).length;

  const notMarkedCount = classStudents.filter(
    (s) => !getAttendanceForStudent(s.id)
  ).length;

  // Student attendance history
  const [viewHistory, setViewHistory] = useState<string | null>(null);

  const getStudentAttendanceHistory = (studentId: string) => {
    const studentAttendance = attendance
      .filter((a) => a.studentId === studentId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 30);

    const totalDays = studentAttendance.length;
    const presentDays = studentAttendance.filter(
      (a) => a.status === 'present'
    ).length;
    const percentage = totalDays > 0 ? (presentDays / totalDays) * 100 : 0;

    return { records: studentAttendance, totalDays, presentDays, percentage };
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="size-6 text-purple-600" />
          <h2>Attendance Management</h2>
        </div>

        {/* Filters */}
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm mb-2">Select Class</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(Number(e.target.value))}
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
            <label className="block text-sm mb-2">Select Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={markAllPresent}
              className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              Mark All Present
            </button>
          </div>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="bg-green-50 rounded-lg p-3">
            <div className="text-2xl text-green-600">{presentCount}</div>
            <div className="text-sm text-gray-600">Present</div>
          </div>
          <div className="bg-red-50 rounded-lg p-3">
            <div className="text-2xl text-red-600">{absentCount}</div>
            <div className="text-sm text-gray-600">Absent</div>
          </div>
          <div className="bg-yellow-50 rounded-lg p-3">
            <div className="text-2xl text-yellow-600">{notMarkedCount}</div>
            <div className="text-sm text-gray-600">Not Marked</div>
          </div>
        </div>
      </div>

      {/* Attendance List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm">Student Name</th>
                <th className="px-6 py-3 text-left text-sm">Class</th>
                <th className="px-6 py-3 text-left text-sm">Status</th>
                <th className="px-6 py-3 text-left text-sm">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {classStudents.map((student) => {
                const attendanceRecord = getAttendanceForStudent(student.id);
                const status = attendanceRecord?.status;

                return (
                  <React.Fragment key={student.id}>
                    <tr className="hover:bg-gray-50">
                      <td className="px-6 py-4">{student.name}</td>
                      <td className="px-6 py-4">Class {student.classLevel}</td>
                      <td className="px-6 py-4">
                        {status ? (
                          <span
                            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm ${
                              status === 'present'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {status === 'present' ? (
                              <Check className="size-4" />
                            ) : (
                              <X className="size-4" />
                            )}
                            {status === 'present' ? 'Present' : 'Absent'}
                          </span>
                        ) : (
                          <span className="text-gray-400 text-sm">Not marked</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleAttendanceToggle(student.id)}
                            className={`px-3 py-1 rounded-md text-sm transition-colors ${
                              status === 'present'
                                ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                : 'bg-green-100 text-green-700 hover:bg-green-200'
                            }`}
                          >
                            Mark {status === 'present' ? 'Absent' : 'Present'}
                          </button>
                          <button
                            onClick={() =>
                              setViewHistory(
                                viewHistory === student.id ? null : student.id
                              )
                            }
                            className="px-3 py-1 bg-purple-100 text-purple-700 rounded-md text-sm hover:bg-purple-200 transition-colors"
                          >
                            {viewHistory === student.id ? 'Hide' : 'History'}
                          </button>
                        </div>
                      </td>
                    </tr>

                    {/* Attendance History Row */}
                    {viewHistory === student.id && (
                      <tr>
                        <td colSpan={4} className="px-6 py-4 bg-gray-50">
                          <div>
                            <h4 className="mb-2">
                              Attendance History - {student.name}
                            </h4>
                            {(() => {
                              const history =
                                getStudentAttendanceHistory(student.id);
                              return (
                                <div>
                                  <div className="mb-3 p-3 bg-white rounded-md">
                                    <div className="text-sm text-gray-600">
                                      Overall Attendance:{' '}
                                      <span className="text-lg text-purple-600">
                                        {Math.round(history.percentage)}%
                                      </span>{' '}
                                      ({history.presentDays}/{history.totalDays} days)
                                    </div>
                                  </div>
                                  <div className="flex flex-wrap gap-2">
                                    {history.records.map((record) => (
                                      <div
                                        key={record.id}
                                        className={`px-3 py-2 rounded-md text-sm ${
                                          record.status === 'present'
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-red-100 text-red-800'
                                        }`}
                                      >
                                        <div>
                                          {new Date(
                                            record.date
                                          ).toLocaleDateString()}
                                        </div>
                                        <div className="text-xs">
                                          {record.status}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              );
                            })()}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
