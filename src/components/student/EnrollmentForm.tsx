import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { GraduationCap, ArrowLeft, CheckCircle } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { Enrollment } from '../../types';

export const EnrollmentForm = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { addEnrollment } = useData();

    const [formData, setFormData] = useState({
        studentName: '',
        parentName: '',
        email: '',
        phone: '',
        classLevel: 10,
        batch: 'Batch-A', // Default, logic can be added to fetch available batches 
        course: '',
        address: ''
    });

    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        if (location.state?.course) {
            setFormData(prev => ({ ...prev, course: location.state.course }));
        }
    }, [location.state]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Create new enrollment object
        const newEnrollment: Enrollment = {
            id: `enr_${Date.now()}`,
            studentName: formData.studentName,
            email: formData.email,
            phone: formData.phone,
            classLevel: Number(formData.classLevel),
            batch: formData.batch, // Initially unassigned or default? going with default for now
            mode: 'offline', // Defaulting to offline for classroom courses
            status: 'pending',
            paymentStatus: 'pending',
            submittedDate: new Date().toISOString().split('T')[0],
            totalFee: 25000, // Example fee, should come from course details
            paidAmount: 0
        };

        addEnrollment(newEnrollment);
        setSubmitted(true);
    };

    if (submitted) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="size-8 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Enrollment Submitted!</h2>
                    <p className="text-gray-600 mb-6">
                        Thank you for enrolling in <strong>{formData.course}</strong>.
                        Our admin team will review your application and contact you shortly.
                    </p>
                    <button
                        onClick={() => navigate('/')}
                        className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 w-full"
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <button
                    onClick={() => navigate('/')}
                    className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 mb-6 transition-colors"
                >
                    <ArrowLeft className="size-4" />
                    Back to Home
                </button>

                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="bg-indigo-600 p-8 text-white">
                        <div className="flex items-center gap-3 mb-4">
                            <GraduationCap className="size-8 text-indigo-200" />
                            <h1 className="text-2xl font-bold">Student Enrollment Form</h1>
                        </div>
                        <p className="text-indigo-100">
                            Join Vidyastara Tuitions and start your journey towards academic excellence.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Personal Details */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Student Details</h3>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                        value={formData.studentName}
                                        onChange={e => setFormData({ ...formData, studentName: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                    <input
                                        type="email"
                                        required
                                        className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                        value={formData.email}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                    <input
                                        type="tel"
                                        required
                                        className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                        value={formData.phone}
                                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                </div>
                            </div>

                            {/* Academic Details */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Academic Interests</h3>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Course Interested In</label>
                                    <input
                                        type="text"
                                        readOnly={!!location.state?.course}
                                        className={`w-full p-2.5 border border-gray-300 rounded-lg outline-none ${location.state?.course ? 'bg-gray-100' : 'focus:ring-2 focus:ring-indigo-500'}`}
                                        value={formData.course}
                                        onChange={e => setFormData({ ...formData, course: e.target.value })}
                                        placeholder="e.g. JEE, Class 10, etc."
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Current Class/Grade</label>
                                    <select
                                        className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                                        value={formData.classLevel}
                                        onChange={e => setFormData({ ...formData, classLevel: Number(e.target.value) })}
                                    >
                                        {[6, 7, 8, 9, 10, 11, 12].map(c => (
                                            <option key={c} value={c}>Class {c}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Parent's Name</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                        value={formData.parentName}
                                        onChange={e => setFormData({ ...formData, parentName: e.target.value })}
                                    />
                                </div>
                            </div>

                            {/* Full Width Address */}
                            <div className="md:col-span-2 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Residential Address</label>
                                    <textarea
                                        rows={3}
                                        className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                        value={formData.address}
                                        onChange={e => setFormData({ ...formData, address: e.target.value })}
                                    ></textarea>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 pt-4 border-t">
                            <button
                                type="submit"
                                className="flex-1 bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors font-semibold shadow-lg shadow-indigo-200"
                            >
                                Submit Application
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
