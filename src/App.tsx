import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { Login } from './components/Login';
import { Header } from './components/Header';
import { StudentDashboard } from './components/student/StudentDashboard';
import { TeacherDashboard } from './components/teacher/TeacherDashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { LandingPage } from './components/landing/LandingPage';
import { BottomNav } from './components/ui/bottom-nav';

// Placeholder components for new routes
const EnrollmentPage = () => <div className="pt-20 text-center">Enrollment Page (Coming Soon)</div>;
const ResultPage = () => <div className="pt-20 text-center">Result Page (Coming Soon)</div>;


const PrivateRoute = ({ children, allowedRoles }: { children: React.ReactNode, allowedRoles: string[] }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const DashboardRedirect = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;

  switch (user.role) {
    case 'admin': return <Navigate to="/admin" replace />;
    case 'teacher': return <Navigate to="/teacher" replace />;
    case 'student': return <Navigate to="/student" replace />;
    case 'parent': return <Navigate to="/student" replace />;
    default: return <Navigate to="/" replace />;
  }
};


const AppContent = () => {
  const { user } = useAuth();
  // Using location check for displaying Header/BottomNav conditionally if needed
  // For now, simple logic: show header if user is logged in

  return (
    <div className="min-h-screen bg-gray-50">
      {user && <Header />}
      <main>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={!user ? <LandingPage /> : <Navigate to="/dashboard" replace />} />
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" replace />} />
          <Route path="/enroll" element={<EnrollmentPage />} />
          <Route path="/results" element={<ResultPage />} />

          {/* Protected Routes */}
          <Route path="/dashboard" element={<DashboardRedirect />} />

          <Route path="/student/*" element={
            <PrivateRoute allowedRoles={['student', 'parent']}>
              <StudentDashboard />
            </PrivateRoute>
          } />

          <Route path="/teacher/*" element={
            <PrivateRoute allowedRoles={['teacher', 'admin']}> {/* Admin can view teacher view potentially, but strictly strictly teacher role here */}
              <TeacherDashboard />
            </PrivateRoute>
          } />

          <Route path="/admin/*" element={
            <PrivateRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </PrivateRoute>
          } />

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      {user && <BottomNav />}
    </div>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <DataProvider>
          <AppContent />
        </DataProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}