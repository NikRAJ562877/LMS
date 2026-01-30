import { Student, Parent, Teacher, Subject, Assignment, Mark, AttendanceRecord, Message } from '../types';

// Users
export const mockStudents: Student[] = [
  {
    id: 's1',
    name: 'Alice Johnson',
    email: 'alice@student.com',
    password: 'student123',
    role: 'student',
    classLevel: 10,
    parentIds: ['p1']
  },
  {
    id: 's2',
    name: 'Bob Smith',
    email: 'bob@student.com',
    password: 'student123',
    role: 'student',
    classLevel: 10,
    parentIds: ['p2']
  },
  {
    id: 's3',
    name: 'Charlie Brown',
    email: 'charlie@student.com',
    password: 'student123',
    role: 'student',
    classLevel: 9,
    parentIds: ['p3']
  },
  {
    id: 's4',
    name: 'Diana Prince',
    email: 'diana@student.com',
    password: 'student123',
    role: 'student',
    classLevel: 11,
    parentIds: ['p4']
  },
  {
    id: 's5',
    name: 'Emma Watson',
    email: 'emma@student.com',
    password: 'student123',
    role: 'student',
    classLevel: 10,
    parentIds: ['p1']
  },
];

export const mockParents: Parent[] = [
  {
    id: 'p1',
    name: 'John Johnson',
    email: 'john@parent.com',
    password: 'parent123',
    role: 'parent',
    childrenIds: ['s1', 's5']
  },
  {
    id: 'p2',
    name: 'Mary Smith',
    email: 'mary@parent.com',
    password: 'parent123',
    role: 'parent',
    childrenIds: ['s2']
  },
  {
    id: 'p3',
    name: 'Robert Brown',
    email: 'robert@parent.com',
    password: 'parent123',
    role: 'parent',
    childrenIds: ['s3']
  },
  {
    id: 'p4',
    name: 'Sarah Prince',
    email: 'sarah@parent.com',
    password: 'parent123',
    role: 'parent',
    childrenIds: ['s4']
  },
];

export const mockTeachers: Teacher[] = [
  {
    id: 't1',
    name: 'Dr. Jane Williams',
    email: 'teacher@school.com',
    password: 'teacher123',
    role: 'teacher'
  },
];

// Subjects
export const mockSubjects: Subject[] = [
  // Class 9
  { id: 'sub1', name: 'Mathematics', classLevel: 9 },
  { id: 'sub2', name: 'Science', classLevel: 9 },
  { id: 'sub3', name: 'English', classLevel: 9 },
  { id: 'sub4', name: 'History', classLevel: 9 },
  { id: 'sub5', name: 'Geography', classLevel: 9 },
  // Class 10
  { id: 'sub6', name: 'Mathematics', classLevel: 10 },
  { id: 'sub7', name: 'Science', classLevel: 10 },
  { id: 'sub8', name: 'English', classLevel: 10 },
  { id: 'sub9', name: 'History', classLevel: 10 },
  { id: 'sub10', name: 'Geography', classLevel: 10 },
  // Class 11
  { id: 'sub11', name: 'Mathematics', classLevel: 11 },
  { id: 'sub12', name: 'Physics', classLevel: 11 },
  { id: 'sub13', name: 'Chemistry', classLevel: 11 },
  { id: 'sub14', name: 'English', classLevel: 11 },
  { id: 'sub15', name: 'Computer Science', classLevel: 11 },
];

// Assignments
export const mockAssignments: Assignment[] = [
  {
    id: 'a1',
    title: 'Quadratic Equations Problem Set',
    description: 'Solve all problems in Chapter 4',
    classLevel: 10,
    dueDate: '2026-02-05',
    status: 'pending',
    subjectId: 'sub6',
    files: [
      {
        id: 'f1',
        name: 'Quadratic_Equations_Problems.pdf',
        type: 'pdf',
        url: 'mock://quadratic-equations.pdf',
        size: '2.4 MB'
      },
      {
        id: 'f2',
        name: 'Formula_Sheet.pdf',
        type: 'pdf',
        url: 'mock://formula-sheet.pdf',
        size: '1.2 MB'
      }
    ]
  },
  {
    id: 'a2',
    title: 'Chemical Reactions Lab Report',
    description: 'Write a detailed lab report on the experiment conducted',
    classLevel: 10,
    dueDate: '2026-02-10',
    status: 'submitted',
    submittedDate: '2026-01-28',
    subjectId: 'sub7',
    studentId: 's1',
    files: [
      {
        id: 'f3',
        name: 'Lab_Instructions.pdf',
        type: 'pdf',
        url: 'mock://lab-instructions.pdf',
        size: '3.1 MB'
      }
    ],
    submittedFiles: [
      {
        id: 'f4',
        name: 'My_Lab_Report.pdf',
        type: 'pdf',
        url: 'mock://student-lab-report.pdf',
        size: '1.8 MB'
      }
    ]
  },
  {
    id: 'a3',
    title: 'Essay on Climate Change',
    description: 'Write a 500-word essay',
    classLevel: 10,
    dueDate: '2026-02-01',
    status: 'evaluated',
    submittedDate: '2026-01-27',
    grade: 85,
    remarks: 'Well written!',
    subjectId: 'sub8',
    studentId: 's1',
    files: [
      {
        id: 'f5',
        name: 'Essay_Guidelines.pdf',
        type: 'pdf',
        url: 'mock://essay-guidelines.pdf',
        size: '856 KB'
      }
    ],
    submittedFiles: [
      {
        id: 'f6',
        name: 'Climate_Change_Essay.docx',
        type: 'document',
        url: 'mock://climate-essay.docx',
        size: '124 KB'
      }
    ]
  },
  {
    id: 'a4',
    title: 'Geometry Worksheet',
    description: 'Complete all triangle problems',
    classLevel: 9,
    dueDate: '2026-02-08',
    status: 'pending',
    subjectId: 'sub1',
    files: [
      {
        id: 'f7',
        name: 'Geometry_Worksheet.pdf',
        type: 'pdf',
        url: 'mock://geometry-worksheet.pdf',
        size: '1.5 MB'
      },
      {
        id: 'f8',
        name: 'Triangle_Examples.png',
        type: 'image',
        url: 'mock://triangle-examples.png',
        size: '645 KB'
      }
    ]
  },
  {
    id: 'a5',
    title: 'Physics Problems',
    description: 'Newton\'s Laws problems',
    classLevel: 11,
    dueDate: '2026-02-12',
    status: 'pending',
    subjectId: 'sub12',
    files: [
      {
        id: 'f9',
        name: 'Newtons_Laws_Problems.pdf',
        type: 'pdf',
        url: 'mock://newton-laws.pdf',
        size: '2.8 MB'
      }
    ]
  },
];

// Marks
export const mockMarks: Mark[] = [
  // Student s1 (Alice - Class 10)
  { id: 'm1', studentId: 's1', subjectId: 'sub6', classLevel: 10, marks: 85, maxMarks: 100, examType: 'Mid-term', date: '2026-01-15', remarks: 'Good work' },
  { id: 'm2', studentId: 's1', subjectId: 'sub7', classLevel: 10, marks: 78, maxMarks: 100, examType: 'Mid-term', date: '2026-01-16' },
  { id: 'm3', studentId: 's1', subjectId: 'sub8', classLevel: 10, marks: 92, maxMarks: 100, examType: 'Mid-term', date: '2026-01-17', remarks: 'Excellent' },
  { id: 'm4', studentId: 's1', subjectId: 'sub9', classLevel: 10, marks: 88, maxMarks: 100, examType: 'Mid-term', date: '2026-01-18' },
  { id: 'm5', studentId: 's1', subjectId: 'sub10', classLevel: 10, marks: 75, maxMarks: 100, examType: 'Mid-term', date: '2026-01-19' },
  
  // Student s2 (Bob - Class 10)
  { id: 'm6', studentId: 's2', subjectId: 'sub6', classLevel: 10, marks: 72, maxMarks: 100, examType: 'Mid-term', date: '2026-01-15' },
  { id: 'm7', studentId: 's2', subjectId: 'sub7', classLevel: 10, marks: 68, maxMarks: 100, examType: 'Mid-term', date: '2026-01-16' },
  { id: 'm8', studentId: 's2', subjectId: 'sub8', classLevel: 10, marks: 80, maxMarks: 100, examType: 'Mid-term', date: '2026-01-17' },
  { id: 'm9', studentId: 's2', subjectId: 'sub9', classLevel: 10, marks: 76, maxMarks: 100, examType: 'Mid-term', date: '2026-01-18' },
  { id: 'm10', studentId: 's2', subjectId: 'sub10', classLevel: 10, marks: 82, maxMarks: 100, examType: 'Mid-term', date: '2026-01-19' },
  
  // Student s3 (Charlie - Class 9)
  { id: 'm11', studentId: 's3', subjectId: 'sub1', classLevel: 9, marks: 90, maxMarks: 100, examType: 'Mid-term', date: '2026-01-15' },
  { id: 'm12', studentId: 's3', subjectId: 'sub2', classLevel: 9, marks: 88, maxMarks: 100, examType: 'Mid-term', date: '2026-01-16' },
  { id: 'm13', studentId: 's3', subjectId: 'sub3', classLevel: 9, marks: 85, maxMarks: 100, examType: 'Mid-term', date: '2026-01-17' },
  
  // Student s4 (Diana - Class 11)
  { id: 'm14', studentId: 's4', subjectId: 'sub11', classLevel: 11, marks: 95, maxMarks: 100, examType: 'Mid-term', date: '2026-01-15' },
  { id: 'm15', studentId: 's4', subjectId: 'sub12', classLevel: 11, marks: 92, maxMarks: 100, examType: 'Mid-term', date: '2026-01-16' },
  { id: 'm16', studentId: 's4', subjectId: 'sub13', classLevel: 11, marks: 89, maxMarks: 100, examType: 'Mid-term', date: '2026-01-17' },
  
  // Student s5 (Emma - Class 10)
  { id: 'm17', studentId: 's5', subjectId: 'sub6', classLevel: 10, marks: 88, maxMarks: 100, examType: 'Mid-term', date: '2026-01-15' },
  { id: 'm18', studentId: 's5', subjectId: 'sub7', classLevel: 10, marks: 91, maxMarks: 100, examType: 'Mid-term', date: '2026-01-16' },
  { id: 'm19', studentId: 's5', subjectId: 'sub8', classLevel: 10, marks: 87, maxMarks: 100, examType: 'Mid-term', date: '2026-01-17' },
];

// Attendance Records (Last 30 days)
const generateAttendanceRecords = (): AttendanceRecord[] => {
  const records: AttendanceRecord[] = [];
  const students = mockStudents;
  const today = new Date('2026-01-29');
  
  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    students.forEach((student) => {
      // Random attendance with 85% present rate
      const isPresent = Math.random() > 0.15;
      records.push({
        id: `att-${student.id}-${dateStr}`,
        studentId: student.id,
        classLevel: student.classLevel,
        date: dateStr,
        status: isPresent ? 'present' : 'absent'
      });
    });
  }
  
  return records;
};

export const mockAttendance: AttendanceRecord[] = generateAttendanceRecords();

// Messages
export const mockMessages: Message[] = [
  {
    id: 'msg1',
    from: 't1',
    to: 's1',
    subject: 'Great Progress!',
    content: 'Alice, you\'re doing excellent work in Mathematics. Keep it up!',
    date: '2026-01-28',
    read: false
  },
  {
    id: 'msg2',
    from: 't1',
    to: 'p1',
    subject: 'Parent-Teacher Meeting',
    content: 'Dear Parent, we have scheduled a parent-teacher meeting on Feb 5th.',
    date: '2026-01-27',
    read: false
  },
  {
    id: 'msg3',
    from: 't1',
    to: 's2',
    subject: 'Assignment Reminder',
    content: 'Bob, please submit your Chemistry lab report by Feb 10th.',
    date: '2026-01-26',
    read: true
  },
  {
    id: 'msg4',
    from: 't1',
    to: 'p2',
    subject: 'Attendance Update',
    content: 'Please note that Bob was absent on Jan 25th.',
    date: '2026-01-25',
    read: true
  },
];