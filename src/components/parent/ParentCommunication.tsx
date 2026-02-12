import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Mail, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { Student } from '../../types';

interface ParentCommunicationProps {
    // We don't take children prop because messages are for the parent user
}

export const ParentCommunication: React.FC<ParentCommunicationProps> = () => {
    const { user } = useAuth();
    const { messages, addMessage, students } = useData(); // we might need teachers list?
    // For now, parent sends message to "Teacher". In a real app, we'd select which teacher.
    // Let's assume sending to "Class Teacher" of a selected child.

    const [subject, setSubject] = useState('');
    const [content, setContent] = useState('');
    const [showForm, setShowForm] = useState(false);

    // Messages sent TO this parent
    const myMessages = messages.filter(m => m.to === user?.id);

    // Messages sent FROM this parent
    const sentMessages = messages.filter(m => m.from === user?.id);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        // Mock sending to a teacher ID. 
        // In real app, we would pick a teacher from a dropdown (e.g. child's class teacher)
        const mockTeacherId = 'teacher1';

        addMessage({
            id: `msg${Date.now()}`,
            from: user.id,
            to: mockTeacherId,
            subject,
            content,
            date: new Date().toISOString().split('T')[0],
            read: false
        });

        setSubject('');
        setContent('');
        setShowForm(false);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-6 rounded-lg shadow">
                <div>
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <Mail className="text-emerald-600" />
                        Communication
                    </h2>
                    <p className="text-gray-500 text-sm">Messages from teachers and administration</p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700 transition flex items-center gap-2"
                >
                    <Send className="size-4" />
                    Compose Message
                </button>
            </div>

            {showForm && (
                <div className="bg-white rounded-lg shadow p-6 border border-emerald-100">
                    <h3 className="font-bold mb-4 text-gray-800">New Message to Teacher</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                            <input
                                type="text"
                                required
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                className="w-full px-3 py-2 border rounded-md focus:ring-emerald-500 focus:border-emerald-500"
                                placeholder="e.g. Leave Application, Question about homework"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                            <textarea
                                required
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                rows={4}
                                className="w-full px-3 py-2 border rounded-md focus:ring-emerald-500 focus:border-emerald-500"
                                placeholder="Type your message here..."
                            />
                        </div>
                        <div className="flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={() => setShowForm(false)}
                                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
                            >
                                Send
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="grid md:grid-cols-2 gap-6">
                {/* Inbox */}
                <div className="space-y-4">
                    <h3 className="font-bold text-gray-700 flex items-center gap-2">
                        <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded text-xs">{myMessages.length}</span>
                        Inbox
                    </h3>
                    {myMessages.length > 0 ? (
                        myMessages.map(msg => (
                            <div key={msg.id} className={`bg-white p-4 rounded-lg shadow-sm border ${!msg.read ? 'border-l-4 border-l-emerald-500' : ''}`}>
                                <div className="flex justify-between items-start mb-2">
                                    <span className="font-bold text-gray-800">{msg.subject}</span>
                                    <span className="text-xs text-gray-500">{new Date(msg.date).toLocaleDateString()}</span>
                                </div>
                                <p className="text-gray-600 text-sm mb-3">{msg.content}</p>
                                <div className="flex items-center text-xs text-gray-400 gap-1">
                                    From: Teacher
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="p-8 text-center bg-gray-50 rounded-lg text-gray-500 border border-dashed">
                            No messages received.
                        </div>
                    )}
                </div>

                {/* Sent */}
                <div className="space-y-4">
                    <h3 className="font-bold text-gray-700">Sent Messages</h3>
                    {sentMessages.length > 0 ? (
                        sentMessages.map(msg => (
                            <div key={msg.id} className="bg-white p-4 rounded-lg shadow-sm border opacity-75">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="font-medium text-gray-800">{msg.subject}</span>
                                    <span className="text-xs text-gray-500">{new Date(msg.date).toLocaleDateString()}</span>
                                </div>
                                <p className="text-gray-600 text-sm">{msg.content}</p>
                                <div className="mt-2 flex justify-end">
                                    <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded">Sent</span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="p-8 text-center bg-gray-50 rounded-lg text-gray-500 border border-dashed">
                            No sent messages.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
