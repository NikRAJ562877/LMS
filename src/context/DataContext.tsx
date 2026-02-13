import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Assignment, Mark, AttendanceRecord, Message, Enrollment, Course, Payment, Note, SystemSettings, Student, Teacher, Parent, Subject } from '../types';
import {
  mockAssignments, mockMarks, mockAttendance, mockMessages,
  mockEnrollments, mockCourses, mockPayments, mockNotes, mockSystemSettings,
  mockStudents, mockTeachers, mockParents, mockSubjects
} from '../data/mockData';

interface DataContextType {
  // Data
  students: Student[];
  teachers: Teacher[];
  parents: Parent[];
  assignments: Assignment[];
  marks: Mark[];
  attendance: AttendanceRecord[];
  messages: Message[];
  enrollments: Enrollment[];
  courses: Course[];
  payments: Payment[];
  notes: Note[];
  subjects: Subject[];
  systemSettings: SystemSettings;

  // Assignments
  updateAssignment: (id: string, updates: Partial<Assignment>) => void;
  addAssignment: (assignment: Assignment) => void;

  // Marks
  updateMark: (id: string, updates: Partial<Mark>) => void;
  addMark: (mark: Mark) => void;

  // Attendance
  updateAttendance: (id: string, updates: Partial<AttendanceRecord>) => void;
  addAttendance: (record: AttendanceRecord) => void;

  // Messages
  addMessage: (message: Message) => void;
  markMessageAsRead: (id: string) => void;

  // Enrollments
  addEnrollment: (enrollment: Enrollment) => void;
  updateEnrollmentStatus: (id: string, status: Enrollment['status']) => void;

  // Payments
  addPayment: (payment: Payment) => void;

  // Notes
  addNote: (note: Note) => void;

  // Users (Simple add/update for admin)
  addStudent: (student: Student) => void;
  addTeacher: (teacher: Teacher) => void;

  // System Settings
  updateSystemSettings: (settings: Partial<SystemSettings>) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [students, setStudents] = useState<Student[]>(mockStudents);
  const [teachers, setTeachers] = useState<Teacher[]>(mockTeachers);
  const [parents, setParents] = useState<Parent[]>(mockParents);

  const [assignments, setAssignments] = useState<Assignment[]>(mockAssignments);
  const [marks, setMarks] = useState<Mark[]>(mockMarks);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(mockAttendance);
  const [messages, setMessages] = useState<Message[]>(mockMessages);

  const [enrollments, setEnrollments] = useState<Enrollment[]>(mockEnrollments);
  const [courses, setCourses] = useState<Course[]>(mockCourses);
  const [payments, setPayments] = useState<Payment[]>(mockPayments);
  const [notes, setNotes] = useState<Note[]>(mockNotes);
  const [subjects, setSubjects] = useState<Subject[]>(mockSubjects);
  const [systemSettings, setSystemSettings] = useState<SystemSettings>(mockSystemSettings);

  // Assignment Logic
  const updateAssignment = (id: string, updates: Partial<Assignment>) => {
    setAssignments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...updates } : a))
    );
  };

  const addAssignment = (assignment: Assignment) => {
    setAssignments((prev) => [...prev, assignment]);
  };

  // Mark Logic
  const updateMark = (id: string, updates: Partial<Mark>) => {
    setMarks((prev) => prev.map((m) => (m.id === id ? { ...m, ...updates } : m)));
  };

  const addMark = (mark: Mark) => {
    setMarks((prev) => [...prev, mark]);
  };

  // Attendance Logic
  const updateAttendance = (id: string, updates: Partial<AttendanceRecord>) => {
    setAttendance((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...updates } : a))
    );
  };

  const addAttendance = (record: AttendanceRecord) => {
    setAttendance((prev) => [...prev, record]);
  };

  const addMessage = (message: Message) => {
    setMessages((prev) => [...prev, message]);
  };

  const markMessageAsRead = (id: string) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, read: true } : m))
    );
  };

  // Enrollment Logic
  const addEnrollment = (enrollment: Enrollment) => {
    setEnrollments((prev) => [...prev, enrollment]);
  };

  const updateEnrollmentStatus = (id: string, status: Enrollment['status']) => {
    setEnrollments(prev => prev.map(e => e.id === id ? { ...e, status } : e));
  };

  // Payment Logic
  const addPayment = (payment: Payment) => {
    setPayments(prev => [...prev, payment]);
  };

  // Note Logic
  const addNote = (note: Note) => {
    setNotes(prev => [...prev, note]);
  };

  // User Logic
  const addStudent = (student: Student) => {
    setStudents(prev => [...prev, student]);
  };

  const addTeacher = (teacher: Teacher) => {
    setTeachers(prev => [...prev, teacher]);
  };

  const updateSystemSettings = (settings: Partial<SystemSettings>) => {
    setSystemSettings(prev => ({ ...prev, ...settings }));
  };

  return (
    <DataContext.Provider
      value={{
        students,
        teachers,
        parents,
        assignments,
        marks,
        attendance,
        messages,
        enrollments,
        courses,
        payments,
        notes,
        subjects,
        systemSettings,

        updateAssignment,
        addAssignment,
        updateMark,
        addMark,
        updateAttendance,
        addAttendance,
        addMessage,
        markMessageAsRead,

        addEnrollment,
        updateEnrollmentStatus,
        addPayment,
        addNote,
        addStudent,
        addTeacher,
        updateSystemSettings
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within DataProvider');
  }
  return context;
};
