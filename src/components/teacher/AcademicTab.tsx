import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { BookOpen, Plus, Edit2, Save, X, Upload, FileText } from 'lucide-react';
import { AssignmentFile } from '../../types';
import { AssignmentFileViewer } from '../AssignmentFileViewer';

type View = 'assignments' | 'marks';

export const AcademicTab = () => {
  const { assignments, marks, addAssignment, updateAssignment, addMark, updateMark, students, subjects } =
    useData();
  const [view, setView] = useState<View>('assignments');

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <BookOpen className="size-6 text-purple-600" />
            <h2>Academic Management</h2>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setView('assignments')}
              className={`px-4 py-2 rounded-md transition-colors ${view === 'assignments'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              Assignments
            </button>
            <button
              onClick={() => setView('marks')}
              className={`px-4 py-2 rounded-md transition-colors ${view === 'marks'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              Marks & Grades
            </button>
          </div>
        </div>
      </div>

      {view === 'assignments' ? <AssignmentsView /> : <MarksView />}
    </div>
  );
};

const AssignmentsView = () => {
  const { assignments, addAssignment, updateAssignment, students, subjects } = useData();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<AssignmentFile[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    classLevel: 10,
    studentId: '',
    dueDate: '',
    subjectId: '',
  });

  const classLevels = Array.from(
    new Set(students.map((s) => s.classLevel))
  ).sort((a, b) => a - b);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newFiles: AssignmentFile[] = Array.from(files).map((file) => ({
      id: `file-${Date.now()}-${Math.random()}`,
      name: file.name,
      type: file.type.includes('pdf') ? 'pdf' : file.type.includes('image') ? 'image' : 'document',
      url: `mock://${file.name}`,
      size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
    }));

    setUploadedFiles([...uploadedFiles, ...newFiles]);
  };

  const removeFile = (fileId: string) => {
    setUploadedFiles(uploadedFiles.filter((f) => f.id !== fileId));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingId) {
      updateAssignment(editingId, {
        ...formData,
        studentId: formData.studentId || undefined,
        files: uploadedFiles.length > 0 ? uploadedFiles : undefined,
      });
      setEditingId(null);
    } else {
      addAssignment({
        id: `a${Date.now()}`,
        ...formData,
        status: 'pending',
        studentId: formData.studentId || undefined,
        files: uploadedFiles.length > 0 ? uploadedFiles : undefined,
      });
    }

    setFormData({
      title: '',
      description: '',
      classLevel: 10,
      studentId: '',
      dueDate: '',
      subjectId: '',
    });
    setUploadedFiles([]);
    setShowForm(false);
  };

  const handleEdit = (assignment: any) => {
    setFormData({
      title: assignment.title,
      description: assignment.description,
      classLevel: assignment.classLevel,
      studentId: assignment.studentId || '',
      dueDate: assignment.dueDate,
      subjectId: assignment.subjectId,
    });
    setUploadedFiles(assignment.files || []);
    setEditingId(assignment.id);
    setShowForm(true);
  };

  const handleEvaluate = (assignmentId: string) => {
    const grade = prompt('Enter grade (0-100):');
    const remarks = prompt('Enter remarks (optional):');

    if (grade !== null) {
      updateAssignment(assignmentId, {
        status: 'evaluated',
        grade: Number(grade),
        remarks: remarks || undefined,
      });
    }
  };

  const availableSubjects = subjects.filter(
    (s) => s.classLevel === formData.classLevel
  );

  return (
    <div className="space-y-6">
      {/* Create Assignment Button */}
      <div className="bg-white rounded-lg shadow p-6">
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditingId(null);
            setFormData({
              title: '',
              description: '',
              classLevel: 10,
              studentId: '',
              dueDate: '',
              subjectId: '',
            });
          }}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
        >
          <Plus className="size-4" />
          Create Assignment
        </button>

        {/* Assignment Form */}
        {showForm && (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-1">Title*</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm mb-1">Due Date*</label>
                <input
                  type="date"
                  required
                  value={formData.dueDate}
                  onChange={(e) =>
                    setFormData({ ...formData, dueDate: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm mb-1">Description*</label>
              <textarea
                required
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                rows={3}
              />
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm mb-1">Class*</label>
                <select
                  required
                  value={formData.classLevel}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      classLevel: Number(e.target.value),
                      subjectId: '',
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {classLevels.map((level) => (
                    <option key={level} value={level}>
                      Class {level}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm mb-1">Subject*</label>
                <select
                  required
                  value={formData.subjectId}
                  onChange={(e) =>
                    setFormData({ ...formData, subjectId: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Select Subject</option>
                  {availableSubjects.map((subject) => (
                    <option key={subject.id} value={subject.id}>
                      {subject.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm mb-1">
                  Individual Student (Optional)
                </label>
                <select
                  value={formData.studentId}
                  onChange={(e) =>
                    setFormData({ ...formData, studentId: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">All students in class</option>
                  {students
                    .filter((s) => s.classLevel === formData.classLevel)
                    .map((student) => (
                      <option key={student.id} value={student.id}>
                        {student.name}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            {/* File Upload Section */}
            <div>
              <label className="block text-sm mb-2">Upload Assignment Files (PDF, Images, Documents)</label>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-md hover:bg-indigo-100 cursor-pointer transition-colors border border-indigo-200">
                  <Upload className="size-4" />
                  <span>Choose Files</span>
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
                <span className="text-sm text-gray-600">
                  {uploadedFiles.length > 0
                    ? `${uploadedFiles.length} file(s) selected`
                    : 'No files selected'}
                </span>
              </div>

              {/* Display uploaded files */}
              {uploadedFiles.length > 0 && (
                <div className="mt-3 space-y-2">
                  {uploadedFiles.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded-md border border-gray-200"
                    >
                      <div className="flex items-center gap-2">
                        <FileText className="size-4 text-indigo-600" />
                        <span className="text-sm">{file.name}</span>
                        <span className="text-xs text-gray-500">({file.size})</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile(file.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <X className="size-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
              >
                {editingId ? 'Update' : 'Create'} Assignment
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                  setUploadedFiles([]);
                }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Assignments List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm">Title</th>
                <th className="px-6 py-3 text-left text-sm">Class</th>
                <th className="px-6 py-3 text-left text-sm">Subject</th>
                <th className="px-6 py-3 text-left text-sm">Due Date</th>
                <th className="px-6 py-3 text-left text-sm">Status</th>
                <th className="px-6 py-3 text-left text-sm">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {assignments.map((assignment) => {
                const subject = subjects.find(
                  (s) => s.id === assignment.subjectId
                );
                const student = assignment.studentId
                  ? students.find((s) => s.id === assignment.studentId)
                  : null;

                return (
                  <tr key={assignment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div>{assignment.title}</div>
                        {student && (
                          <div className="text-xs text-gray-500">
                            For: {student.name}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">Class {assignment.classLevel}</td>
                    <td className="px-6 py-4">{subject?.name}</td>
                    <td className="px-6 py-4">
                      {new Date(assignment.dueDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${assignment.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : assignment.status === 'submitted'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-green-100 text-green-800'
                          }`}
                      >
                        {assignment.status}
                        {assignment.grade && ` - ${assignment.grade}%`}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(assignment)}
                          className="text-purple-600 hover:text-purple-800"
                        >
                          <Edit2 className="size-4" />
                        </button>
                        {assignment.status === 'submitted' && (
                          <button
                            onClick={() => handleEvaluate(assignment.id)}
                            className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs hover:bg-green-200"
                          >
                            Evaluate
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const MarksView = () => {
  const { marks, addMark, updateMark, students, subjects } = useData();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedClass, setSelectedClass] = useState<number>(10);
  const [formData, setFormData] = useState({
    studentId: '',
    subjectId: '',
    marks: '',
    maxMarks: '100',
    examType: 'Mid-term',
    date: new Date().toISOString().split('T')[0],
    remarks: '',
  });

  const classLevels = Array.from(
    new Set(students.map((s) => s.classLevel))
  ).sort((a, b) => a - b);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const student = students.find((s) => s.id === formData.studentId);
    if (!student) return;

    if (editingId) {
      updateMark(editingId, {
        ...formData,
        marks: Number(formData.marks),
        maxMarks: Number(formData.maxMarks),
        remarks: formData.remarks || undefined,
      });
      setEditingId(null);
    } else {
      addMark({
        id: `m${Date.now()}`,
        studentId: formData.studentId,
        subjectId: formData.subjectId,
        classLevel: student.classLevel,
        marks: Number(formData.marks),
        maxMarks: Number(formData.maxMarks),
        examType: formData.examType,
        date: formData.date,
        remarks: formData.remarks || undefined,
      });
    }

    setFormData({
      studentId: '',
      subjectId: '',
      marks: '',
      maxMarks: '100',
      examType: 'Mid-term',
      date: new Date().toISOString().split('T')[0],
      remarks: '',
    });
    setShowForm(false);
  };

  const classStudents = students.filter((s) => s.classLevel === selectedClass);
  const classSubjects = subjects.filter((s) => s.classLevel === selectedClass);
  const classMarks = marks.filter((m) => m.classLevel === selectedClass);

  return (
    <div className="space-y-6">
      {/* Filter and Add */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <label className="block text-sm mb-2">Select Class</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(Number(e.target.value))}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {classLevels.map((level) => (
                <option key={level} value={level}>
                  Class {level}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => {
              setShowForm(!showForm);
              setEditingId(null);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
          >
            <Plus className="size-4" />
            Add Marks
          </button>
        </div>

        {/* Marks Form */}
        {showForm && (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-1">Student*</label>
                <select
                  required
                  value={formData.studentId}
                  onChange={(e) =>
                    setFormData({ ...formData, studentId: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Select Student</option>
                  {classStudents.map((student) => (
                    <option key={student.id} value={student.id}>
                      {student.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm mb-1">Subject*</label>
                <select
                  required
                  value={formData.subjectId}
                  onChange={(e) =>
                    setFormData({ ...formData, subjectId: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Select Subject</option>
                  {classSubjects.map((subject) => (
                    <option key={subject.id} value={subject.id}>
                      {subject.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm mb-1">Marks Obtained*</label>
                <input
                  type="number"
                  required
                  min="0"
                  value={formData.marks}
                  onChange={(e) =>
                    setFormData({ ...formData, marks: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm mb-1">Max Marks*</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={formData.maxMarks}
                  onChange={(e) =>
                    setFormData({ ...formData, maxMarks: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm mb-1">Exam Type*</label>
                <select
                  required
                  value={formData.examType}
                  onChange={(e) =>
                    setFormData({ ...formData, examType: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option>Mid-term</option>
                  <option>Final</option>
                  <option>Quiz</option>
                  <option>Assignment</option>
                </select>
              </div>

              <div>
                <label className="block text-sm mb-1">Date*</label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm mb-1">Remarks (Optional)</label>
              <input
                type="text"
                value={formData.remarks}
                onChange={(e) =>
                  setFormData({ ...formData, remarks: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
              >
                {editingId ? 'Update' : 'Add'} Marks
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Marks Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm">Student</th>
                <th className="px-6 py-3 text-left text-sm">Subject</th>
                <th className="px-6 py-3 text-left text-sm">Exam Type</th>
                <th className="px-6 py-3 text-left text-sm">Marks</th>
                <th className="px-6 py-3 text-left text-sm">Percentage</th>
                <th className="px-6 py-3 text-left text-sm">Date</th>
                <th className="px-6 py-3 text-left text-sm">Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {classMarks.map((mark) => {
                const student = students.find((s) => s.id === mark.studentId);
                const subject = subjects.find((s) => s.id === mark.subjectId);
                const percentage = (mark.marks / mark.maxMarks) * 100;

                return (
                  <tr key={mark.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">{student?.name}</td>
                    <td className="px-6 py-4">{subject?.name}</td>
                    <td className="px-6 py-4">{mark.examType}</td>
                    <td className="px-6 py-4">
                      {mark.marks}/{mark.maxMarks}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${percentage >= 80
                          ? 'bg-green-100 text-green-800'
                          : percentage >= 60
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                          }`}
                      >
                        {Math.round(percentage)}%
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {new Date(mark.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {mark.remarks || '-'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};