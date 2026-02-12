import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { GraduationCap, Search, AlertCircle, Trophy, FileText, User, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ResultPage = () => {
    const { students, marks, subjects, systemSettings } = useData();
    const navigate = useNavigate();

    const [searchParams, setSearchParams] = useState({
        registerNumber: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [result, setResult] = useState<any | null>(null);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setResult(null);

        // Find student
        const student = students.find(s =>
            s.registerNumber === searchParams.registerNumber &&
            s.password === searchParams.password
        );

        if (!student) {
            setError('Invalid Register Number or Password');
            return;
        }

        // Get student marks
        const studentMarks = marks.filter(m => m.studentId === student.id);

        if (studentMarks.length === 0) {
            setResult({ student, published: false });
            return;
        }

        // Calculate totals and rank (simplified ranking)
        const totalMarks = studentMarks.reduce((sum, m) => sum + m.marks, 0);
        const maxMarks = studentMarks.reduce((sum, m) => sum + m.maxMarks, 0);
        const percentage = (totalMarks / maxMarks) * 100;

        // Get subject details
        const subjectDetails = studentMarks.map(mark => {
            const subject = subjects.find(s => s.id === mark.subjectId);
            return {
                ...mark,
                subjectName: subject?.name || 'Unknown Subject'
            };
        });

        setResult({
            student,
            published: true,
            marks: subjectDetails,
            totalMarks,
            maxMarks,
            percentage,
            rank: 'Top 10%' // Placeholder for complex ranking logic
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 py-4 px-6 mb-8">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
                        <GraduationCap className="size-8 text-indigo-600" />
                        <span className="text-xl font-bold">Vidyastara Tuitions</span>
                    </div>
                    <button onClick={() => navigate('/')} className="text-gray-600 hover:text-indigo-600">
                        Back to Home
                    </button>
                </div>
            </header>

            <main className="flex-grow flex items-center justify-center p-4">
                {!result ? (
                    <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full">
                        <h1 className="text-2xl font-bold text-center mb-6">Check Your Results</h1>
                        <form onSubmit={handleSearch} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Register Number</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
                                    <input
                                        type="text"
                                        required
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                        placeholder="Enter Register Number"
                                        value={searchParams.registerNumber}
                                        onChange={e => setSearchParams({ ...searchParams, registerNumber: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                <div className="relative">
                                    <FileText className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
                                    <input
                                        type="password"
                                        required
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                        placeholder="Enter Password"
                                        value={searchParams.password}
                                        onChange={e => setSearchParams({ ...searchParams, password: e.target.value })}
                                    />
                                </div>
                            </div>

                            {error && (
                                <div className="bg-red-50 text-red-600 p-3 rounded-lg flex items-center gap-2 text-sm">
                                    <AlertCircle className="size-4" />
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
                            >
                                <Search className="size-4" />
                                View Result
                            </button>
                        </form>
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="bg-indigo-600 p-6 text-white flex justify-between items-center">
                            <div>
                                <h2 className="text-2xl font-bold">{result.student.name}</h2>
                                <p className="text-indigo-100">Class {result.student.classLevel} | Reg: {result.student.registerNumber}</p>
                            </div>
                            <button
                                onClick={() => setResult(null)}
                                className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg text-sm transition-colors"
                            >
                                Check Another
                            </button>
                        </div>

                        <div className="p-8">
                            {!result.published ? (
                                <div className="text-center py-12">
                                    <div className="bg-yellow-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Clock className="size-10 text-yellow-600" />
                                    </div>
                                    <h3 className="text-xl font-semibold mb-2">Result Not Published</h3>
                                    <p className="text-gray-600">Marks for this student have not been uploaded yet.</p>
                                </div>
                            ) : (
                                <div className="space-y-8">
                                    {/* Overview Cards */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="bg-blue-50 p-6 rounded-xl text-center">
                                            <div className="text-blue-600 text-sm font-semibold uppercase mb-1">Total Marks</div>
                                            <div className="text-3xl font-bold text-blue-900">
                                                {result.totalMarks} <span className="text-lg text-blue-400 font-normal">/ {result.maxMarks}</span>
                                            </div>
                                        </div>
                                        <div className="bg-purple-50 p-6 rounded-xl text-center">
                                            <div className="text-purple-600 text-sm font-semibold uppercase mb-1">Percentage</div>
                                            <div className="text-3xl font-bold text-purple-900">{result.percentage.toFixed(1)}%</div>
                                        </div>
                                        <div className="bg-yellow-50 p-6 rounded-xl text-center">
                                            <div className="text-yellow-600 text-sm font-semibold uppercase mb-1">Rank</div>
                                            <div className="text-3xl font-bold text-yellow-900 flex items-center justify-center gap-2">
                                                <Trophy className="size-6" />
                                                {result.rank}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Subject Table */}
                                    <div>
                                        <h3 className="text-lg font-semibold mb-4">Subject-wise Performance</h3>
                                        <div className="overflow-x-auto">
                                            <table className="w-full">
                                                <thead className="bg-gray-50 border-b border-gray-200">
                                                    <tr>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Exam Type</th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Marks Obtained</th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Max Marks</th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Remarks</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white divide-y divide-gray-200">
                                                    {result.marks.map((mark: any) => (
                                                        <tr key={mark.id}>
                                                            <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{mark.subjectName}</td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-gray-500">{mark.examType}</td>
                                                            <td className="px-6 py-4 whitespace-nowrap font-bold text-gray-900">{mark.marks}</td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-gray-500">{mark.maxMarks}</td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{mark.remarks || '-'}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};
