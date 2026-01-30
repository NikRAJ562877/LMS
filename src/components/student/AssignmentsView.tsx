import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Student } from '../../types';
import { mockSubjects } from '../../data/mockData';
import { FileText, Eye, ChevronDown, ChevronUp } from 'lucide-react';
import { AssignmentFileViewer } from '../AssignmentFileViewer';

export const AssignmentsView = () => {
  const { user } = useAuth();
  const { assignments } = useData();
  const student = user as Student;
  const [expandedAssignment, setExpandedAssignment] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'submitted' | 'evaluated'>('all');

  // Get student's assignments
  const studentAssignments = assignments.filter(
    (a) =>
      a.classLevel === student.classLevel &&
      (!a.studentId || a.studentId === student.id)
  );

  const filteredAssignments = studentAssignments.filter((a) => {
    if (filter === 'all') return true;
    return a.status === filter;
  });

  const toggleExpand = (id: string) => {
    setExpandedAssignment(expandedAssignment === id ? null : id);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="mb-4">My Assignments</h2>
        
        {/* Filter Tabs */}
        <div className="flex gap-2">
          {['all', 'pending', 'submitted', 'evaluated'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status as any)}
              className={`px-4 py-2 rounded-md transition-colors ${
                filter === status
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
              {status !== 'all' && (
                <span className="ml-2 text-xs">
                  ({studentAssignments.filter((a) => a.status === status).length})
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Assignments List */}
      <div className="space-y-4">
        {filteredAssignments.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <FileText className="size-12 mx-auto text-gray-400 mb-3" />
            <p className="text-gray-500">No {filter !== 'all' ? filter : ''} assignments found</p>
          </div>
        ) : (
          filteredAssignments.map((assignment) => {
            const subject = mockSubjects.find((s) => s.id === assignment.subjectId);
            const isExpanded = expandedAssignment === assignment.id;

            return (
              <div
                key={assignment.id}
                className="bg-white rounded-lg shadow overflow-hidden"
              >
                {/* Assignment Header */}
                <div
                  onClick={() => toggleExpand(assignment.id)}
                  className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3>{assignment.title}</h3>
                        <span
                          className={`text-xs px-3 py-1 rounded-full ${
                            assignment.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : assignment.status === 'submitted'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-green-100 text-green-800'
                          }`}
                        >
                          {assignment.status}
                        </span>
                        {assignment.files && assignment.files.length > 0 && (
                          <span className="text-xs px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full flex items-center gap-1">
                            <FileText className="size-3" />
                            {assignment.files.length} file(s)
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>{subject?.name}</span>
                        <span>•</span>
                        <span>Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                        {assignment.grade && (
                          <>
                            <span>•</span>
                            <span className="text-green-600">Grade: {assignment.grade}%</span>
                          </>
                        )}
                      </div>
                    </div>
                    <button className="text-gray-400 hover:text-gray-600">
                      {isExpanded ? (
                        <ChevronUp className="size-5" />
                      ) : (
                        <ChevronDown className="size-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="px-6 pb-6 border-t border-gray-200 pt-6 space-y-4">
                    {/* Description */}
                    <div>
                      <div className="text-sm mb-2">Description</div>
                      <p className="text-gray-600">{assignment.description}</p>
                    </div>

                    {/* Assignment Files */}
                    {assignment.files && assignment.files.length > 0 && (
                      <AssignmentFileViewer
                        files={assignment.files}
                        title="Teacher's Files"
                      />
                    )}

                    {/* Submitted Files */}
                    {assignment.submittedFiles && assignment.submittedFiles.length > 0 && (
                      <AssignmentFileViewer
                        files={assignment.submittedFiles}
                        title="Your Submitted Files"
                      />
                    )}

                    {/* Feedback */}
                    {assignment.status === 'evaluated' && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-sm">Evaluation</div>
                          <div className="text-2xl text-green-600">{assignment.grade}%</div>
                        </div>
                        {assignment.remarks && (
                          <div className="text-sm text-gray-600">
                            <span className="text-gray-900">Remarks:</span> {assignment.remarks}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Action Button */}
                    {assignment.status === 'pending' && (
                      <button className="w-full px-4 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
                        Submit Assignment
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
