import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { FileText, Trophy, BarChart2, Search, Filter, Settings, Save } from 'lucide-react';

export const MarksManagement = () => {
    const { marks, students, subjects, systemSettings, updateSystemSettings } = useData();
    const [activeTab, setActiveTab] = useState<'marks' | 'settings'>('marks');
    const [selectedClass, setSelectedClass] = useState<number>(10);
    const [selectedExam, setSelectedExam] = useState<string>('Mid-term');
    const [searchTerm, setSearchTerm] = useState('');

    // Settings State
    const [localSettings, setLocalSettings] = useState(systemSettings);

    const filteredMarks = marks.filter(mark => {
        const student = students.find(s => s.id === mark.studentId);
        if (!student) return false;

        const matchesClass = mark.classLevel === selectedClass;
        const matchesExam = mark.examType === selectedExam;
        const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase());

        return matchesClass && matchesExam && matchesSearch;
    });

    // Group marks by student
    const studentMarks = filteredMarks.reduce((acc, mark) => {
        if (!acc[mark.studentId]) {
            acc[mark.studentId] = {
                student: students.find(s => s.id === mark.studentId)!,
                marks: []
            };
        }
        acc[mark.studentId].marks.push(mark);
        return acc;
    }, {} as Record<string, { student: any, marks: any[] }>);

    const classSubjects = subjects.filter(s => s.classLevel === selectedClass);

    const handleSaveSettings = () => {
        updateSystemSettings(localSettings);
        alert('Ranking settings updated successfully!');
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                    <Trophy className="size-6 text-yellow-600" />
                    Marks & Ranking Management
                </h2>
                <div className="flex bg-white rounded-lg p-1 border border-gray-200">
                    <button
                        onClick={() => setActiveTab('marks')}
                        className={`px-4 py-2 rounded-md transition-colors ${activeTab === 'marks' ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-gray-600 hover:text-gray-900'}`}
                    >
                        Marks Entry
                    </button>
                    <button
                        onClick={() => setActiveTab('settings')}
                        className={`px-4 py-2 rounded-md transition-colors ${activeTab === 'settings' ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-gray-600 hover:text-gray-900'}`}
                    >
                        Ranking Settings
                    </button>
                </div>
            </div>

            {activeTab === 'marks' ? (
                <div className="space-y-6">
                    {/* Controls */}
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 sticky top-20 z-10">
                        <div className="flex gap-4 flex-1">
                            <select
                                className="p-2 border rounded-lg bg-white outline-none focus:ring-2 focus:ring-indigo-500 font-bold"
                                value={selectedClass}
                                onChange={e => setSelectedClass(Number(e.target.value))}
                            >
                                {[6, 7, 8, 9, 10, 11, 12].map(c => <option key={c} value={c}>Class {c}</option>)}
                            </select>

                            <select
                                className="p-2 border rounded-lg bg-white outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                                value={selectedExam}
                                onChange={e => setSelectedExam(e.target.value)}
                            >
                                <option value="Mid-term">Mid-term Exam</option>
                                <option value="Final">Final Exam</option>
                                <option value="Unit Test 1">Unit Test 1</option>
                                <option value="Unit Test 2">Unit Test 2</option>
                            </select>
                        </div>

                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 size-4" />
                            <input
                                type="text"
                                placeholder="Filter by Name or ID..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Rankings Preview Link */}
                    {systemSettings.rankingEnabled && (
                        <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg flex items-center gap-3 text-amber-800 text-sm">
                            < Trophy className="size-4" />
                            <span><strong>Rankings are enabled.</strong> Students can see their position based on these marks.</span>
                        </div>
                    )}

                    {/* Marks Table */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-x-auto">
                        <table className="w-full min-w-max border-collapse">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="text-left p-4 text-xs font-bold text-gray-500 uppercase tracking-wider sticky left-0 bg-gray-50 z-10 shadow-[2px_0_5px_rgba(0,0,0,0.05)]">Student Information</th>
                                    {classSubjects.map(sub => {
                                        const weight = systemSettings.rankingWeightage[sub.id] || 1;
                                        return (
                                            <th key={sub.id} className="text-center p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                                                <div className="max-w-[100px] truncate mx-auto" title={sub.name}>{sub.name}</div>
                                                {weight !== 1 && <div className="text-[10px] text-indigo-500 font-medium">x{weight}</div>}
                                            </th>
                                        );
                                    })}
                                    <th className="text-center p-4 text-xs font-bold text-indigo-600 uppercase tracking-wider border-l">Weighted Total</th>
                                    <th className="text-center p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Rank</th>
                                    <th className="text-center p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {Object.values(studentMarks).map(({ student, marks: mList }) => {
                                    const totalMarks = mList.reduce((sum, m) => {
                                        const weight = systemSettings.rankingWeightage[m.subjectId] || 1;
                                        return sum + (m.marks * weight);
                                    }, 0);

                                    const rawTotal = mList.reduce((sum, m) => sum + m.marks, 0);
                                    const hasAnyFail = mList.some(m => m.marks < 35);

                                    return (
                                        <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="p-4 sticky left-0 bg-white z-10 shadow-[2px_0_5px_rgba(0,0,0,0.05)]">
                                                <div className="font-bold text-gray-900">{student.name}</div>
                                                <div className="text-[10px] font-medium text-gray-400 uppercase">{student.registerNumber || student.id}</div>
                                            </td>
                                            {classSubjects.map(sub => {
                                                const mark = mList.find(m => m.subjectId === sub.id);
                                                return (
                                                    <td key={sub.id} className="p-4 text-center">
                                                        {mark ? (
                                                            <div className="space-y-0.5">
                                                                <div className={`font-bold ${mark.marks < 35 ? 'text-red-500' : 'text-gray-700'}`}>
                                                                    {mark.marks}
                                                                </div>
                                                                <div className="text-[8px] text-gray-400">/{mark.maxMarks}</div>
                                                            </div>
                                                        ) : (
                                                            <span className="text-gray-200">--</span>
                                                        )}
                                                    </td>
                                                );
                                            })}
                                            <td className="p-4 text-center">
                                                <div className="font-bold text-indigo-600">{totalMarks}</div>
                                                <div className="text-[10px] text-gray-400">Raw: {rawTotal}</div>
                                            </td>
                                            <td className="p-4 text-center">
                                                <div className="inline-flex items-center justify-center size-8 rounded-full bg-indigo-50 text-indigo-700 font-bold text-sm">
                                                    -
                                                </div>
                                            </td>
                                            <td className="p-4 text-center">
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${hasAnyFail ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                                                    {hasAnyFail ? 'Failed' : 'Passed'}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                        {Object.keys(studentMarks).length === 0 && (
                            <div className="text-center py-20 text-gray-400 italic">
                                <Search className="size-10 mx-auto mb-3 opacity-20" />
                                No results found for Class {selectedClass} - {selectedExam}
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 max-w-2xl">
                    <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                        <Settings className="size-5 text-gray-600" />
                        Ranking Configuration
                    </h3>

                    <div className="space-y-6">
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div>
                                <h4 className="font-medium text-gray-900">Show Ranking to Students</h4>
                                <p className="text-sm text-gray-500">Enable or disable ranking visibility on student dashboard</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={localSettings.rankingEnabled}
                                    onChange={e => setLocalSettings({ ...localSettings, rankingEnabled: e.target.checked })}
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                            </label>
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <div>
                                    <h4 className="font-medium text-gray-900">Ranking Weightage & Mapping</h4>
                                    <p className="text-sm text-gray-500">Set subject priorities for Class {selectedClass} rankings</p>
                                </div>
                                <select
                                    className="p-1 text-xs border rounded bg-white outline-none"
                                    value={selectedClass}
                                    onChange={e => setSelectedClass(Number(e.target.value))}
                                >
                                    {[6, 7, 8, 9, 10, 11, 12].map(c => <option key={c} value={c}>View Class {c}</option>)}
                                </select>
                            </div>

                            <div className="space-y-3 bg-gray-50 p-4 rounded-xl border border-gray-100">
                                {classSubjects.length > 0 ? classSubjects.map(sub => (
                                    <div key={sub.id} className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-gray-800 text-sm">{sub.name}</span>
                                            <span className="text-[10px] text-gray-400 uppercase font-medium">{sub.id}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs text-gray-400">Weight:</span>
                                            <input
                                                type="number"
                                                step="0.1"
                                                min="0"
                                                className="w-16 p-1.5 border rounded text-center text-sm font-bold text-indigo-600 outline-none focus:ring-1 focus:ring-indigo-500"
                                                value={localSettings.rankingWeightage[sub.id] || 1}
                                                onChange={e => setLocalSettings({
                                                    ...localSettings,
                                                    rankingWeightage: {
                                                        ...localSettings.rankingWeightage,
                                                        [sub.id]: Number(e.target.value)
                                                    }
                                                })}
                                            />
                                        </div>
                                    </div>
                                )) : (
                                    <div className="text-center py-4 text-sm text-gray-500 italic">No subjects registered for Class {selectedClass}</div>
                                )}
                            </div>
                        </div>

                        <div className="pt-4 border-t flex justify-end">
                            <button
                                onClick={handleSaveSettings}
                                className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 flex items-center gap-2"
                            >
                                <Save className="size-4" />
                                Save Configuration
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
