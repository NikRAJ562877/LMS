# Vidyastara Tuitions - Learning Management System

A comprehensive Learning Management System built with React and TypeScript, featuring role-based dashboards for Students, Parents, and Teachers, with a modern animated landing page.

## 🎯 Features

### 🌐 Landing Page
- Modern, animated homepage with smooth transitions
- Feature showcase with hover effects
- Testimonials section
- Contact form
- Responsive design with Motion animations
- Call-to-action buttons leading to login

### 👨‍🎓 Student Dashboard
- Personal overview with overall performance and attendance statistics
- Subject-wise marks and performance charts
- Assignment tracking with file viewing (pending, submitted, evaluated)
- View and download teacher-uploaded files (PDF, images, documents)
- Attendance summary (monthly and overall)
- Progress reports with interactive visualizations
- Message inbox from teachers

### 👨‍👩‍👧 Parent Dashboard
- Multi-child support (switch between children)
- Read-only access to child's academic data
- Subject-wise marks with detailed breakdowns
- Assignment updates with file access
- Attendance records and trends
- Teacher messages and announcements

### 👨‍🏫 Teacher Dashboard (Admin)
- **Overview Tab**
  - Class-wise performance analytics
  - Attendance trends
  - Quick statistics and insights
  
- **Attendance Management**
  - Daily attendance marking
  - Class-wise attendance entry
  - Student-wise attendance history
  - Edit and correct attendance records
  - Mark all present functionality
  
- **Academic Management**
  - Create and assign assignments (class-wide or individual)
  - **File Upload System**: Upload multiple files (PDF, images, documents) with assignments
  - File management (add, remove, preview)
  - Enter and update marks/grades
  - Subject-wise performance tracking
  - Assignment evaluation system
  
- **Messaging System**
  - Send messages to students and parents
  - Quick message templates
  - Track message read status
  
- **Student Management**
  - View all students by class
  - Individual student performance tracking
  - Detailed analytics per student
  - Class summary statistics

## 🔐 Sample Login Credentials

### Student Account
- **Email:** alice@student.com
- **Password:** student123
- **Access:** Class 10, view personal data only

### Parent Account
- **Email:** john@parent.com
- **Password:** parent123
- **Access:** View data for Alice Johnson and Emma Watson

### Teacher Account
- **Email:** teacher@school.com
- **Password:** teacher123
- **Access:** Full admin access to all features

## 🏗️ System Architecture

### Technology Stack
- **Frontend:** React 18 with TypeScript
- **State Management:** React Context API
- **Data Storage:** In-memory (mock data)
- **Charts:** Recharts
- **Icons:** Lucide React
- **Styling:** Tailwind CSS v4

### Data Structure
The system manages:
- **Users:** Students (5), Parents (4), Teachers (1)
- **Classes:** 1-12 (currently populated: 9, 10, 11)
- **Subjects:** Subject mapping per class level
- **Assignments:** With lifecycle (assigned → submitted → evaluated)
- **Marks:** Subject-wise with exam types (Mid-term, Final, Quiz)
- **Attendance:** 30 days of mock data per student
- **Messages:** Teacher-initiated communication

### Key Components

```
/
├── types/index.ts          # TypeScript interfaces
├── data/mockData.ts        # Mock data generation
├── context/
│   ├── AuthContext.tsx     # Authentication state
│   └── DataContext.tsx     # Application data state
├── components/
│   ├── Login.tsx           # Login page
│   ├── Header.tsx          # App header
│   ├── student/
│   │   └── StudentDashboard.tsx
│   ├── parent/
│   │   └── ParentDashboard.tsx
│   └── teacher/
│       ├── TeacherDashboard.tsx
│       ├── OverviewTab.tsx
│       ├── AttendanceTab.tsx
│       ├── AcademicTab.tsx
│       ├── MessagingTab.tsx
│       └── StudentsTab.tsx
└── App.tsx                 # Main application
```

## 📊 Data Flow

1. **Authentication:** Context-based auth with role detection
2. **Data Management:** Centralized state with CRUD operations
3. **Role-Based Access:** Automatic dashboard routing based on user role
4. **Real-time Updates:** State changes reflect immediately across all components

## 🎨 Design Patterns

- **Role-based UI:** Different dashboards for each user type
- **Tabbed Interface:** Teacher dashboard uses tabs for better organization
- **Responsive Design:** Works on desktop and mobile devices
- **Color Coding:** Visual indicators for performance levels
- **Interactive Charts:** Recharts for data visualization

## 🔒 Security & Privacy

- No real student data
- Mock authentication (demo purposes only)
- No external API calls
- No data persistence
- All data resets on page refresh

## 🚀 Usage

The application is ready to use immediately. Simply:

1. Click on any sample credential on the login page
2. Explore the role-specific dashboard
3. Test CRUD operations (for teacher account)
4. Switch between different user roles to see different views

## 📝 Notes

- This is a **demonstration system** using mock data
- Not intended for production use or storing real student information
- All data is stored in browser memory and resets on refresh
- Perfect for understanding LMS architecture and UI/UX patterns

## 🎓 Educational Purpose

This LMS is designed to showcase:
- Role-based access control
- Complex dashboard design
- Data visualization
- CRUD operations
- State management patterns
- Responsive UI design
- Component architecture

---

**Built with React, TypeScript, and Tailwind CSS**