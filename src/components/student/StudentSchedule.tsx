import React from 'react';
import { Calendar, Clock, MapPin } from 'lucide-react';

export const StudentSchedule = () => {
    // Mock schedule data (since we don't have a schedule entity yet)
    const schedule = [
        {
            day: 'Monday', periods: [
                { time: '09:00 - 10:00', subject: 'Mathematics', teacher: 'Mrs. Sarah Wilson', room: 'Room 101' },
                { time: '10:00 - 11:00', subject: 'Physics', teacher: 'Mr. David Chen', room: 'Lab A' },
                { time: '11:00 - 11:30', subject: 'Break', type: 'break' },
                { time: '11:30 - 12:30', subject: 'Chemistry', teacher: 'Ms. Emily Brown', room: 'Lab B' },
            ]
        },
        {
            day: 'Tuesday', periods: [
                { time: '09:00 - 10:00', subject: 'English', teacher: 'Mr. James Wilson', room: 'Room 102' },
                { time: '10:00 - 11:00', subject: 'Biology', teacher: 'Dr. Michael Ross', room: 'Lab C' },
                { time: '11:00 - 11:30', subject: 'Break', type: 'break' },
                { time: '11:30 - 12:30', subject: 'History', teacher: 'Mrs. Maria Garcia', room: 'Room 103' },
            ]
        },
        {
            day: 'Wednesday', periods: [
                { time: '09:00 - 10:00', subject: 'Computer Science', teacher: 'Mr. Robert Taylor', room: 'Comp Lab' },
                { time: '10:00 - 11:00', subject: 'Mathematics', teacher: 'Mrs. Sarah Wilson', room: 'Room 101' },
                { time: '11:00 - 11:30', subject: 'Break', type: 'break' },
                { time: '11:30 - 12:30', subject: 'Physics', teacher: 'Mr. David Chen', room: 'Lab A' },
            ]
        },
        {
            day: 'Thursday', periods: [
                { time: '09:00 - 10:00', subject: 'Chemistry', teacher: 'Ms. Emily Brown', room: 'Lab B' },
                { time: '10:00 - 11:00', subject: 'English', teacher: 'Mr. James Wilson', room: 'Room 102' },
                { time: '11:00 - 11:30', subject: 'Break', type: 'break' },
                { time: '11:30 - 12:30', subject: 'Physical Education', teacher: 'Coach Smith', room: 'Field' },
            ]
        },
        {
            day: 'Friday', periods: [
                { time: '09:00 - 10:00', subject: 'Biology', teacher: 'Dr. Michael Ross', room: 'Lab C' },
                { time: '10:00 - 11:00', subject: 'Computer Science', teacher: 'Mr. Robert Taylor', room: 'Comp Lab' },
                { time: '11:00 - 11:30', subject: 'Break', type: 'break' },
                { time: '11:30 - 12:30', subject: 'Library', teacher: 'Mrs. Johnson', room: 'Library' },
            ]
        },
    ];

    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold flex items-center gap-2">
                    <Calendar className="text-purple-600" />
                    Class Schedule
                </h2>
                <div className="text-sm text-gray-500 bg-white px-3 py-1 rounded-full shadow-sm border border-gray-100">
                    Today is <span className="font-bold text-purple-600">{today}</span>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {schedule.map((daySchedule, index) => (
                    <div key={index} className={`bg-white rounded-lg shadow-sm border overflow-hidden ${daySchedule.day === today ? 'ring-2 ring-purple-500 ring-offset-2' : ''}`}>
                        <div className="bg-gray-50 px-4 py-3 border-b font-bold text-gray-700 flex justify-between items-center">
                            {daySchedule.day}
                            {daySchedule.day === today && <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">Today</span>}
                        </div>
                        <div className="divide-y">
                            {daySchedule.periods.map((period, pIndex) => (
                                <div key={pIndex} className={`p-4 ${period.type === 'break' ? 'bg-gray-50/50' : ''}`}>
                                    <div className="flex items-start justify-between mb-1">
                                        <div className="font-bold text-gray-800">{period.subject}</div>
                                        <div className="flex items-center text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                            <Clock className="size-3 mr-1" />
                                            {period.time}
                                        </div>
                                    </div>
                                    {period.teacher && (
                                        <div className="text-sm text-gray-600 mb-1">{period.teacher}</div>
                                    )}
                                    {period.room && (
                                        <div className="flex items-center text-xs text-gray-400">
                                            <MapPin className="size-3 mr-1" />
                                            {period.room}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
