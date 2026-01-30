import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { mockStudents, mockParents } from '../../data/mockData';
import { Mail, Send, Plus } from 'lucide-react';

export const MessagingTab = () => {
  const { user } = useAuth();
  const { messages, addMessage } = useData();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    recipientType: 'student' as 'student' | 'parent',
    recipientId: '',
    subject: '',
    content: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) return;

    addMessage({
      id: `msg${Date.now()}`,
      from: user.id,
      to: formData.recipientId,
      subject: formData.subject,
      content: formData.content,
      date: new Date().toISOString().split('T')[0],
      read: false,
    });

    setFormData({
      recipientType: 'student',
      recipientId: '',
      subject: '',
      content: '',
    });
    setShowForm(false);
  };

  const recipients =
    formData.recipientType === 'student' ? mockStudents : mockParents;

  // Group messages by recipient
  const sentMessages = messages.filter((m) => m.from === user?.id);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Mail className="size-6 text-purple-600" />
            <h2>Messaging System</h2>
          </div>

          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
          >
            <Plus className="size-4" />
            New Message
          </button>
        </div>

        {/* Message Form */}
        {showForm && (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-1">Recipient Type*</label>
                <select
                  required
                  value={formData.recipientType}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      recipientType: e.target.value as 'student' | 'parent',
                      recipientId: '',
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="student">Student</option>
                  <option value="parent">Parent</option>
                </select>
              </div>

              <div>
                <label className="block text-sm mb-1">Recipient*</label>
                <select
                  required
                  value={formData.recipientId}
                  onChange={(e) =>
                    setFormData({ ...formData, recipientId: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Select Recipient</option>
                  {recipients.map((recipient) => (
                    <option key={recipient.id} value={recipient.id}>
                      {recipient.name}
                      {formData.recipientType === 'student' &&
                        ` - Class ${(recipient as any).classLevel}`}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm mb-1">Subject*</label>
              <input
                type="text"
                required
                value={formData.subject}
                onChange={(e) =>
                  setFormData({ ...formData, subject: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter message subject"
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Message*</label>
              <textarea
                required
                value={formData.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                rows={4}
                placeholder="Type your message here..."
              />
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
              >
                <Send className="size-4" />
                Send Message
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Sent Messages */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="mb-4">Sent Messages ({sentMessages.length})</h3>
        <div className="space-y-3">
          {sentMessages.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No messages sent yet</p>
          ) : (
            sentMessages
              .sort(
                (a, b) =>
                  new Date(b.date).getTime() - new Date(a.date).getTime()
              )
              .map((message) => {
                const recipient = [...mockStudents, ...mockParents].find(
                  (u) => u.id === message.to
                );
                const isStudent = mockStudents.some((s) => s.id === message.to);

                return (
                  <div
                    key={message.id}
                    className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm">
                              To: {recipient?.name}
                            </span>
                            <span
                              className={`text-xs px-2 py-0.5 rounded-full ${
                                isStudent
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-green-100 text-green-800'
                              }`}
                            >
                              {isStudent ? 'Student' : 'Parent'}
                            </span>
                          </div>
                          {isStudent && (
                            <div className="text-xs text-gray-500">
                              Class{' '}
                              {
                                mockStudents.find((s) => s.id === message.to)
                                  ?.classLevel
                              }
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${
                            message.read
                              ? 'bg-gray-100 text-gray-600'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {message.read ? 'Read' : 'Unread'}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(message.date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="mb-2">
                      <span className="text-sm">{message.subject}</span>
                    </div>
                    <p className="text-sm text-gray-600">{message.content}</p>
                  </div>
                );
              })
          )}
        </div>
      </div>

      {/* Quick Templates */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="mb-4">Quick Templates</h3>
        <div className="grid md:grid-cols-2 gap-3">
          <button
            onClick={() =>
              setFormData({
                ...formData,
                subject: 'Attendance Update',
                content:
                  'Dear Parent/Student, This is to inform you about the recent attendance record...',
              })
            }
            className="p-3 border rounded-lg text-left hover:bg-gray-50 transition-colors"
          >
            <div className="text-sm">Attendance Update</div>
            <div className="text-xs text-gray-500">
              Template for attendance notifications
            </div>
          </button>

          <button
            onClick={() =>
              setFormData({
                ...formData,
                subject: 'Assignment Reminder',
                content:
                  'This is a reminder about the upcoming assignment deadline...',
              })
            }
            className="p-3 border rounded-lg text-left hover:bg-gray-50 transition-colors"
          >
            <div className="text-sm">Assignment Reminder</div>
            <div className="text-xs text-gray-500">
              Remind about pending assignments
            </div>
          </button>

          <button
            onClick={() =>
              setFormData({
                ...formData,
                subject: 'Performance Update',
                content:
                  'I would like to share an update on the student\'s academic performance...',
              })
            }
            className="p-3 border rounded-lg text-left hover:bg-gray-50 transition-colors"
          >
            <div className="text-sm">Performance Update</div>
            <div className="text-xs text-gray-500">
              Share academic progress
            </div>
          </button>

          <button
            onClick={() =>
              setFormData({
                ...formData,
                subject: 'Parent-Teacher Meeting',
                content:
                  'We have scheduled a parent-teacher meeting to discuss...',
              })
            }
            className="p-3 border rounded-lg text-left hover:bg-gray-50 transition-colors"
          >
            <div className="text-sm">Meeting Invitation</div>
            <div className="text-xs text-gray-500">
              Schedule parent meetings
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
