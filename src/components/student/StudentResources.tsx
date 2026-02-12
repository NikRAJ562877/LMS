import React from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { FileText, Download, Folder } from 'lucide-react';

export const StudentResources = () => {
    const { notes } = useData();
    const { user } = useAuth();
    // In a real app we would filter by student's class
    // const student = user as Student;
    // const classNotes = notes.filter(n => n.classLevel === student.classLevel);

    // For now showing all notes since we don't have class data on notes yet in all mocks
    const displayNotes = notes;

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Folder className="text-purple-600" />
                    Learning Resources
                </h2>

                {displayNotes.length > 0 ? (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {displayNotes.map((note) => (
                            <div key={note.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow group bg-white">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="p-2 bg-indigo-50 rounded-lg group-hover:bg-indigo-100 transition-colors">
                                        <FileText className="size-6 text-indigo-600" />
                                    </div>
                                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full capitalize">
                                        {note.subjectId}
                                    </span>
                                </div>
                                <h3 className="font-bold text-gray-800 mb-1">{note.title}</h3>
                                <p className="text-sm text-gray-500 mb-3 line-clamp-2">{note.description}</p>
                                <div className="flex items-center justify-between pt-3 border-t">
                                    <div className="text-xs text-gray-400">
                                        {new Date(note.date).toLocaleDateString()}
                                    </div>
                                    <a
                                        href={note.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-1 text-sm text-purple-600 font-medium hover:text-purple-800"
                                    >
                                        <Download className="size-4" />
                                        Download
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 text-gray-500">
                        <Folder className="size-12 mx-auto mb-3 text-gray-300" />
                        <p>No resources available yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
};
