// User types
export type UserRole = 'student' | 'parent' | 'teacher' | 'admin';

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
  batch: string; // e.g., 'A', 'B', 'JEE-1'
  parentIds: string[];
  category: 'normal' | 'slow_learner';
  registerNumber: string;
  rollNumber: string;
  enrollmentId: string;
}

export interface Parent extends User {
  role: 'parent';
  childrenIds: string[];
}

export interface Teacher extends User {
  role: 'teacher';
  assignedClasses: number[];
  assignedBatches: string[];
  assignedSubjects: string[];
}

export interface Admin extends User {
  role: 'admin';
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

// New Types for Full LMS

export interface Course {
  id: string;
  name: string; // e.g., "Class 10 CBSE", "JEE Main"
  classLevel: number;
  batch: string;
  description: string;
  duration: string;
  fee: number;
  type: 'classroom' | 'online';
}

export interface Enrollment {
  id: string;
  studentName: string;
  phone: string;
  email: string;
  classLevel: number;
  batch: string; // Selected batch
  mode: 'online' | 'offline';
  registerNumber?: string; // If existing student
  rollNumber?: string; // Assigned during enrollment
  category?: 'normal' | 'slow_learner';
  address?: string;
  status: 'pending' | 'confirmed' | 'rejected';
  submittedDate: string;
  paymentStatus: 'pending' | 'partial' | 'paid';
  totalFee: number;
  paidAmount: number;
}

export interface Note {
  id: string;
  title: string;
  description: string;
  url: string;
  classLevel: number;
  batch: string; // 'all' or specific batch
  uploadedDate: string;
  uploadedBy: string; // teacher/admin name
  subjectId?: string; // Optional linkage
}

export interface Payment {
  id: string;
  enrollmentId: string;
  amount: number;
  date: string;
  status: 'paid' | 'pending';
  method: 'online' | 'cash' | 'transfer';
  transactionId?: string;
  type: 'installment_1' | 'installment_2' | 'full_payment';
}

// Duplicate Note interface removed

export interface SystemSettings {
  rankingEnabled: boolean;
  rankingWeightage: Record<string, number>; // Subject ID -> Weightage check
}