import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { Login } from './components/Login';
import { Header } from './components/Header';
import { StudentDashboard } from './components/student/StudentDashboard';
import { ParentDashboard } from './components/parent/ParentDashboard';
import { TeacherDashboard } from './components/teacher/TeacherDashboard';
import { LandingPage } from './components/landing/LandingPage';
import { BottomNav } from './components/ui/bottom-nav';

const AppContent = () => {
  const { user } = useAuth();
  const [showLogin, setShowLogin] = useState(false);

  if (!user && !showLogin) {
    return <LandingPage onGetStarted={() => setShowLogin(true)} />;
  }

  if (!user) {
    return <Login />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main>
        {user.role === 'student' && <StudentDashboard />}
        {user.role === 'parent' && <ParentDashboard />}
        {user.role === 'teacher' && <TeacherDashboard />}
      </main>
      <BottomNav />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <AppContent />
      </DataProvider>
    </AuthProvider>
  );
}