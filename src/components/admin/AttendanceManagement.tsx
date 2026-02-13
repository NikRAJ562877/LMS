import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { AttendanceRecord } from '../../types';
import { Calendar, Check, X, Search, Filter, MessageSquare, Save, ScanLine, Smartphone } from 'lucide-react';

export const AttendanceManagement = () => {
    const { students, attendance, addAttendance, updateAttendance } = useData();
    const [selectedClass, setSelectedClass] = useState<number>(10);
    const [selectedBatch, setSelectedBatch] = useState<string>('Batch-A');
    const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [markingMode, setMarkingMode] = useState(false);
    const [scannerMode, setScannerMode] = useState(false);
    const [scanInput, setScanInput] = useState('');
    const [lastScanned, setLastScanned] = useState<{ name: string, time: string } | null>(null);

    // Filter students for the selected class and batch
    const classStudents = students.filter(s =>
        s.classLevel === selectedClass && s.batch === selectedBatch
    );

    // Get existing attendance for the selected date
    const existingAttendance = attendance.filter(a =>
        a.date === selectedDate &&
        classStudents.some(s => s.id === a.studentId)
    );

    // State for local changes before saving
    const [attendanceState, setAttendanceState] = useState<Record<string, 'present' | 'absent'>>({});

    // Initialize state from existing records or default to present
    React.useEffect(() => {
        const initialState: Record<string, 'present' | 'absent'> = {};
        classStudents.forEach(student => {
            const record = existingAttendance.find(a => a.studentId === student.id);
            initialState[student.id] = record ? record.status : 'present';
        });
        setAttendanceState(initialState);
    }, [selectedClass, selectedBatch, selectedDate, students, attendance]); // Dependencies need care

    const handleToggleStatus = (studentId: string) => {
        setAttendanceState(prev => ({
            ...prev,
            [studentId]: prev[studentId] === 'present' ? 'absent' : 'present'
        }));
    };

    const handleScan = (e: React.FormEvent) => {
        e.preventDefault();
        const student = students.find(s =>
            s.id === scanInput ||
            s.registerNumber === scanInput ||
            s.enrollmentId === scanInput
        );

        if (student) {
            setAttendanceState(prev => ({ ...prev, [student.id]: 'present' }));
            setLastScanned({ name: student.name, time: new Date().toLocaleTimeString() });
            setScanInput('');
            // Optional: simulate success sound or visual pulse
        } else {
            alert('Student not found! Please check the ID.');
            setScanInput('');
        }
    };

    const saveAttendance = () => {
        classStudents.forEach(student => {
            const status = attendanceState[student.id];
            const existingRecord = existingAttendance.find(a => a.studentId === student.id);

            if (existingRecord) {
                if (existingRecord.status !== status) {
                    updateAttendance(existingRecord.id, { status });
                }
            } else {
                const newRecord: AttendanceRecord = {
                    id: `att_${Date.now()}_${student.id}`,
                    studentId: student.id,
                    classLevel: student.classLevel,
                    date: selectedDate,
                    status: status
                };
                addAttendance(newRecord);
            }
        });
        alert('Attendance records finalized and saved!');
        setMarkingMode(false);
        setScannerMode(false);
    };

    const getStats = () => {
        const total = classStudents.length;
        if (total === 0) return { present: 0, absent: 0, percentage: 0 };

        const present = Object.values(attendanceState).filter(s => s === 'present').length;
        const absent = total - present;
        return {
            present,
            absent,
            percentage: Math.round((present / total) * 100)
        };
    };

    const stats = getStats();

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                    <Calendar className="size-6 text-indigo-600" />
                    Attendance Management
                </h2>
                <div className="flex gap-2">
                    <button
                        onClick={() => { setScannerMode(!scannerMode); setMarkingMode(true); }}
                        className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${scannerMode ? 'bg-indigo-600 text-white ring-4 ring-indigo-100' : 'bg-white text-gray-700 border border-gray-200'}`}
                    >
                        <ScanLine className="size-4" />
                        {scannerMode ? 'Scanner Active' : 'Scanner Mode'}
                    </button>
                    {!markingMode ? (
                        <button
                            onClick={() => setMarkingMode(true)}
                            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center gap-2"
                        >
                            <Calendar className="size-4" />
                            Mark Attendance
                        </button>
                    ) : (
                        <div className="flex gap-2">
                            <button
                                onClick={() => { setMarkingMode(false); setScannerMode(false); }}
                                className="bg-gray-100 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-200"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={saveAttendance}
                                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
                            >
                                <Save className="size-4" />
                                Save & Finish
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Scanner Mode UI */}
            {scannerMode && (
                <div className="bg-slate-900 p-8 rounded-2xl shadow-xl border border-slate-800 animate-in zoom-in-95 duration-200">
                    <div className="max-w-md mx-auto text-center space-y-6">
                        <div className="bg-indigo-500/10 p-4 rounded-full w-fit mx-auto">
                            <Smartphone className="size-12 text-indigo-400 animate-pulse" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white">Scanner Simulation</h3>
                            <p className="text-slate-400 text-sm mt-1">Enter Student ID or Register Number to mark present</p>
                        </div>

                        <form onSubmit={handleScan} className="relative">
                            <input
                                type="text"
                                autoFocus
                                className="w-full bg-slate-800 border-2 border-slate-700 rounded-xl px-6 py-4 text-white text-xl text-center outline-none focus:border-indigo-500 transition-colors placeholder:text-slate-600"
                                placeholder="WAITING FOR SCAN..."
                                value={scanInput}
                                onChange={e => setScanInput(e.target.value)}
                            />
                            <div className="absolute inset-y-0 left-0 w-1 bg-indigo-500 animate-[scan_2s_infinite]"></div>
                        </form>

                        {lastScanned ? (
                            <div className="bg-green-500/10 border border-green-500/20 p-4 rounded-xl flex items-center justify-between text-green-400">
                                <div className="text-left">
                                    <div className="text-[10px] uppercase font-bold text-green-500/60">Last Scanned</div>
                                    <div className="font-bold">{lastScanned.name}</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-[10px] uppercase font-bold text-green-500/60">Status</div>
                                    <div className="bg-green-500 text-white text-[10px] px-2 py-0.5 rounded font-bold">PRESENT</div>
                                </div>
                            </div>
                        ) : (
                            <div className="h-[60px] border border-dashed border-slate-700 rounded-xl flex items-center justify-center text-slate-500 text-sm italic">
                                Ready to scan...
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Controls */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-wrap gap-4 items-end">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <input
                        type="date"
                        className="p-2 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                        value={selectedDate}
                        onChange={e => setSelectedDate(e.target.value)}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
                    <select
                        className="p-2 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 min-w-[120px] bg-white"
                        value={selectedClass}
                        onChange={e => setSelectedClass(Number(e.target.value))}
                    >
                        {[6, 7, 8, 9, 10, 11, 12].map(c => <option key={c} value={c}>Class {c}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Batch</label>
                    <select
                        className="p-2 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 min-w-[120px] bg-white"
                        value={selectedBatch}
                        onChange={e => setSelectedBatch(e.target.value)}
                    >
                        <option value="Batch-A">Batch-A</option>
                        <option value="Batch-B">Batch-B</option>
                        <option value="JEE-1">JEE-1</option>
                    </select>
                </div>

                <div className="ml-auto flex gap-4 text-sm font-medium">
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-green-500"></span>
                        Present: {stats.present}
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-red-500"></span>
                        Absent: {stats.absent}
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-gray-500">Rate:</span>
                        {stats.percentage}%
                    </div>
                </div>
            </div>

            {/* List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {classStudents.length > 0 ? (
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="text-left p-4 text-sm font-medium text-gray-500">Roll No</th>
                                <th className="text-left p-4 text-sm font-medium text-gray-500">Student Name</th>
                                <th className="text-left p-4 text-sm font-medium text-gray-500">Status</th>
                                <th className="text-left p-4 text-sm font-medium text-gray-500">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {classStudents.map(student => (
                                <tr key={student.id} className="hover:bg-gray-50">
                                    <td className="p-4 text-gray-600">{student.rollNumber || '-'}</td>
                                    <td className="p-4 font-medium">{student.name}</td>
                                    <td className="p-4">
                                        <button
                                            onClick={() => markingMode && handleToggleStatus(student.id)}
                                            disabled={!markingMode}
                                            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors font-medium text-sm
                                                ${(attendanceState[student.id] || 'present') === 'present'
                                                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                                    : 'bg-red-100 text-red-700 hover:bg-red-200'}
                                                ${!markingMode ? 'cursor-default opacity-80' : 'cursor-pointer'}
                                            `}
                                        >
                                            {(attendanceState[student.id] || 'present') === 'present' ? <Check className="size-4" /> : <X className="size-4" />}
                                            {(attendanceState[student.id] || 'present').charAt(0).toUpperCase() + (attendanceState[student.id] || 'present').slice(1)}
                                        </button>
                                    </td>
                                    <td className="p-4">
                                        <button
                                            className="text-gray-400 hover:text-indigo-600 transition-colors"
                                            title="Send Message"
                                            onClick={() => alert(`Message feature for ${student.name} coming soon!`)}
                                        >
                                            <MessageSquare className="size-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="text-center py-12 text-gray-500">
                        No students found in this class and batch.
                    </div>
                )}
            </div>
        </div>
    );
};
