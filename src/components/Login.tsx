import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { GraduationCap, AlertCircle } from 'lucide-react';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    const success = login(email, password);
    if (!success) {
      setError('Invalid credentials. Please try again.');
    }
  };

  const sampleCredentials = [
    { role: 'Student', email: 'alice@student.com', password: 'student123' },
    { role: 'Parent', email: 'john@parent.com', password: 'parent123' },
    { role: 'Teacher', email: 'teacher@school.com', password: 'teacher123' },
  ];

  const quickLogin = (email: string, password: string) => {
    setEmail(email);
    setPassword(password);
    login(email, password);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl overflow-hidden">
        <div className="grid md:grid-cols-2 gap-0">
          {/* Left Side - Login Form */}
          <div className="p-8">
            <div className="flex items-center gap-2 mb-6">
              <GraduationCap className="size-8 text-indigo-600" />
              <h1>EduTrack LMS</h1>
            </div>
            
            <h2 className="mb-6">Login to Your Account</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm mb-1">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm mb-1">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter your password"
                />
              </div>

              {error && (
                <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-md">
                  <AlertCircle className="size-4" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition-colors"
              >
                Login
              </button>
            </form>
          </div>

          {/* Right Side - Sample Credentials */}
          <div className="bg-indigo-600 text-white p-8">
            <h3 className="mb-4">Quick Login</h3>
            <p className="text-indigo-100 text-sm mb-6">
              Click any credential below to auto-fill and login
            </p>

            <div className="space-y-3">
              {sampleCredentials.map((cred, index) => (
                <div
                  key={index}
                  onClick={() => quickLogin(cred.email, cred.password)}
                  className="bg-white/10 backdrop-blur-sm p-4 rounded-md cursor-pointer hover:bg-white/20 transition-colors"
                >
                  <div className="text-indigo-200 text-sm mb-1">{cred.role}</div>
                  <div className="text-sm">Email: {cred.email}</div>
                  <div className="text-sm">Password: {cred.password}</div>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-indigo-500">
              <p className="text-sm text-indigo-100">
                This is a demo LMS system using mock data. No real student information is stored.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
