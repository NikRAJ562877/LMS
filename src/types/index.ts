// User types
export type UserRole = 'student' | 'parent' | 'teacher';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface Student extends User {
  role: 'student';
  classLevel: number; // 1-12
  parentIds: string[];
}

export interface Parent extends User {
  role: 'parent';
  childrenIds: string[];
}

export interface Teacher extends User {
  role: 'teacher';
}

// Academic types
export interface Subject {
  id: string;
  name: string;
  classLevel: number;
}

export interface AssignmentFile {
  id: string;
  name: string;
  type: string; // 'pdf', 'image', 'document'
  url: string;
  size: string;
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  classLevel: number;
  studentId?: string; // if assigned to individual student
  dueDate: string;
  status: 'pending' | 'submitted' | 'evaluated';
  submittedDate?: string;
  grade?: number;
  remarks?: string;
  subjectId: string;
  files?: AssignmentFile[]; // Files attached by teacher
  submittedFiles?: AssignmentFile[]; // Files submitted by student
}

export interface Mark {
  id: string;
  studentId: string;
  subjectId: string;
  classLevel: number;
  marks: number;
  maxMarks: number;
  examType: string; // 'Mid-term', 'Final', 'Quiz', etc.
  date: string;
  remarks?: string;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  classLevel: number;
  date: string;
  status: 'present' | 'absent';
}

export interface Message {
  id: string;
  from: string; // teacher id
  to: string; // student or parent id
  subject: string;
  content: string;
  date: string;
  read: boolean;
}