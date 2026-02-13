import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Note } from '../../types';
import { Book, Upload, Trash2, Filter, Search, FileText } from 'lucide-react';

export const NotesManagement = () => {
    const { notes, addNote } = useData(); // we might need deleteNote later
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedClass, setSelectedClass] = useState<number | 'all'>('all');

    // New Note State
    const [newNote, setNewNote] = useState({
        title: '',
        description: '',
        url: '',
        classLevel: 10,
        batch: 'all',
    });

    const filteredNotes = notes.filter(note => {
        const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            note.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesClass = selectedClass === 'all' || note.classLevel === selectedClass;

        return matchesSearch && matchesClass;
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const note: Note = {
            id: `note_${Date.now()}`,
            ...newNote,
            uploadedDate: new Date().toISOString().split('T')[0],
            uploadedBy: 'Admin'
        };
        addNote(note);
        setNewNote({
            title: '',
            description: '',
            url: '',
            classLevel: 10,
            batch: 'all',
        });
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
                <Book className="size-6 text-indigo-600" />
                Notes Management
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Upload Form */}
                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                            <Upload className="size-5 text-gray-500" />
                            Upload New Note
                        </h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                    value={newNote.title}
                                    onChange={e => setNewNote({ ...newNote, title: e.target.value })}
                                    placeholder="Chapter 1: Integration"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                    rows={3}
                                    value={newNote.description}
                                    onChange={e => setNewNote({ ...newNote, description: e.target.value })}
                                    placeholder="Brief description of the content..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">File URL</label>
                                <input
                                    type="url"
                                    required
                                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                    value={newNote.url}
                                    onChange={e => setNewNote({ ...newNote, url: e.target.value })}
                                    placeholder="https://drive.google.com/..."
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
                                    <select
                                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                        value={newNote.classLevel}
                                        onChange={e => setNewNote({ ...newNote, classLevel: Number(e.target.value) })}
                                    >
                                        {[6, 7, 8, 9, 10, 11, 12].map(c => <option key={c} value={c}>Class {c}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Batch</label>
                                    <select
                                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                        value={newNote.batch}
                                        onChange={e => setNewNote({ ...newNote, batch: e.target.value })}
                                    >
                                        <option value="all">All Batches</option>
                                        <option value="Batch-A">Batch-A</option>
                                        <option value="Batch-B">Batch-B</option>
                                        <option value="JEE-1">JEE-1</option>
                                    </select>
                                </div>
                            </div>

                            <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors">
                                Add Note
                            </button>
                        </form>
                    </div>
                </div>

                {/* Notes List */}
                <div className="lg:col-span-2 space-y-4">
                    {/* Filters */}
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 size-5" />
                            <input
                                type="text"
                                placeholder="Search notes..."
                                className="w-full pl-10Pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none"
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="relative min-w-[140px]">
                            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 size-4" />
                            <select
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none appearance-none bg-white"
                                value={selectedClass}
                                onChange={e => setSelectedClass(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                            >
                                <option value="all">All Classes</option>
                                {[6, 7, 8, 9, 10, 11, 12].map(c => <option key={c} value={c}>Class {c}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {filteredNotes.length === 0 ? (
                            <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
                                <FileText className="size-12 text-gray-300 mx-auto mb-4" />
                                <p className="text-gray-500">No notes found.</p>
                            </div>
                        ) : (
                            filteredNotes.map(note => (
                                <div key={note.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-start justify-between">
                                    <div className="flex gap-4">
                                        <div className="p-3 bg-indigo-50 rounded-lg h-fit">
                                            <FileText className="size-6 text-indigo-600" />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900">{note.title}</h4>
                                            <p className="text-sm text-gray-500 mb-2">{note.description}</p>
                                            <div className="flex gap-2 text-xs text-gray-500">
                                                <span className="bg-gray-100 px-2 py-0.5 rounded">Class {note.classLevel}</span>
                                                <span className="bg-gray-100 px-2 py-0.5 rounded capitalize">{note.batch === 'all' ? 'All Batches' : note.batch}</span>
                                                <span className="bg-gray-100 px-2 py-0.5 rounded">{note.uploadedDate}</span>
                                            </div>
                                            <a href={note.url} target="_blank" rel="noopener noreferrer" className="text-indigo-600 text-sm hover:underline mt-2 inline-block">
                                                View Document
                                            </a>
                                        </div>
                                    </div>
                                    <button className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors">
                                        <Trash2 className="size-4" />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
