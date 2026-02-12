import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useNavigate } from 'react-router-dom';
import { Course, Enrollment } from '../../types';
import { BookOpen, CheckCircle, Clock, DollarSign, GraduationCap } from 'lucide-react';

export const EnrollmentPage = () => {
    const { courses, addEnrollment } = useData();
    const navigate = useNavigate();
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        mode: 'offline' as 'online' | 'offline',
        registerNumber: ''
    });
    const [submitted, setSubmitted] = useState(false);

    // Group courses by class level
    const coursesByClass = courses.reduce((acc, course) => {
        const level = course.classLevel;
        if (!acc[level]) acc[level] = [];
        acc[level].push(course);
        return acc;
    }, {} as Record<number, Course[]>);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedCourse) return;

        const newEnrollment: Enrollment = {
            id: `enr_${Date.now()}`,
            studentName: formData.name,
            phone: formData.phone,
            email: formData.email,
            classLevel: selectedCourse.classLevel,
            batch: selectedCourse.batch,
            mode: formData.mode,
            registerNumber: formData.registerNumber || undefined,
            status: 'pending',
            submittedDate: new Date().toISOString().split('T')[0],
            paymentStatus: 'pending',
            totalFee: selectedCourse.fee,
            paidAmount: 0
        };

        addEnrollment(newEnrollment);
        setSubmitted(true);
    };

    if (submitted) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
                    <div className="mx-auto bg-green-100 p-4 rounded-full w-20 h-20 flex items-center justify-center mb-6">
                        <CheckCircle className="size-10 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-bold mb-4">Enrollment Submitted!</h2>
                    <p className="text-gray-600 mb-8">
                        Thank you for enrolling in <strong>{selectedCourse?.name}</strong>.
                        Your application ID is generated and sent to the admin.
                        We will contact you shortly for confirmation.
                    </p>
                    <button
                        onClick={() => navigate('/')}
                        className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                        Return to Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <GraduationCap className="size-10 text-indigo-600" />
                        <span className="text-2xl font-bold">Vidyastara Tuitions</span>
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Enroll in a Course</h1>
                    <p className="text-xl text-gray-600">Select a course and start your journey to success</p>
                </div>

                <div className="grid lg:grid-cols-2 gap-12">
                    {/* Course Selection */}
                    <div className="space-y-6">
                        <h2 className="text-2xl font-semibold mb-6">1. Select a Course</h2>
                        {Object.entries(coursesByClass).map(([level, classCourses]) => (
                            <div key={level} className="space-y-4">
                                <h3 className="text-lg font-medium text-gray-500">Class {level}</h3>
                                <div className="grid gap-4">
                                    {classCourses.map(course => (
                                        <div
                                            key={course.id}
                                            onClick={() => setSelectedCourse(course)}
                                            className={`p-6 rounded-xl border-2 cursor-pointer transition-all ${selectedCourse?.id === course.id
                                                    ? 'border-indigo-600 bg-indigo-50 shadow-md'
                                                    : 'border-gray-200 bg-white hover:border-indigo-300'
                                                }`}
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <h4 className="text-lg font-bold">{course.name}</h4>
                                                <span className="bg-indigo-100 text-indigo-700 text-xs px-2 py-1 rounded-full uppercase">
                                                    {course.batch}
                                                </span>
                                            </div>
                                            <p className="text-gray-600 text-sm mb-4">{course.description}</p>
                                            <div className="flex items-center gap-4 text-sm text-gray-500">
                                                <div className="flex items-center gap-1">
                                                    <Clock className="size-4" />
                                                    {course.duration}
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <DollarSign className="size-4" />
                                                    ₹{course.fee.toLocaleString()}
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <BookOpen className="size-4" />
                                                    {course.type === 'classroom' ? 'Offline' : 'Online'}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Enrollment Form */}
                    <div className="lg:pl-8">
                        <div className={`sticky top-8 bg-white p-8 rounded-2xl shadow-lg border border-gray-100 transition-opacity ${selectedCourse ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
                            <h2 className="text-2xl font-semibold mb-6">2. Student Details</h2>
                            {selectedCourse ? (
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="bg-indigo-50 p-4 rounded-lg mb-6">
                                        <p className="text-sm text-gray-600 mb-1">Selected Course:</p>
                                        <p className="font-semibold text-indigo-900">{selectedCourse.name}</p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                        <input
                                            required
                                            type="text"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                            value={formData.name}
                                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                            <input
                                                required
                                                type="tel"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                                value={formData.phone}
                                                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                            <input
                                                required
                                                type="email"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                                value={formData.email}
                                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Learning Mode</label>
                                        <select
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                            value={formData.mode}
                                            onChange={e => setFormData({ ...formData, mode: e.target.value as 'online' | 'offline' })}
                                        >
                                            <option value="offline">Offline (Classroom)</option>
                                            <option value="online">Online</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Register Number <span className="text-gray-400 font-normal">(Optional, if existing student)</span>
                                        </label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                            value={formData.registerNumber}
                                            onChange={e => setFormData({ ...formData, registerNumber: e.target.value })}
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full mt-4 bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors font-medium text-lg"
                                    >
                                        Submit Enrollment
                                    </button>
                                </form>
                            ) : (
                                <div className="text-center py-12 text-gray-500">
                                    <p>Please select a course from the left to proceed with enrollment.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
