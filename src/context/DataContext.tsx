import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Assignment, Mark, AttendanceRecord, Message } from '../types';
import { mockAssignments, mockMarks, mockAttendance, mockMessages } from '../data/mockData';

interface DataContextType {
  assignments: Assignment[];
  marks: Mark[];
  attendance: AttendanceRecord[];
  messages: Message[];
  updateAssignment: (id: string, updates: Partial<Assignment>) => void;
  addAssignment: (assignment: Assignment) => void;
  updateMark: (id: string, updates: Partial<Mark>) => void;
  addMark: (mark: Mark) => void;
  updateAttendance: (id: string, updates: Partial<AttendanceRecord>) => void;
  addAttendance: (record: AttendanceRecord) => void;
  addMessage: (message: Message) => void;
  markMessageAsRead: (id: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [assignments, setAssignments] = useState<Assignment[]>(mockAssignments);
  const [marks, setMarks] = useState<Mark[]>(mockMarks);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(mockAttendance);
  const [messages, setMessages] = useState<Message[]>(mockMessages);

  const updateAssignment = (id: string, updates: Partial<Assignment>) => {
    setAssignments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...updates } : a))
    );
  };

  const addAssignment = (assignment: Assignment) => {
    setAssignments((prev) => [...prev, assignment]);
  };

  const updateMark = (id: string, updates: Partial<Mark>) => {
    setMarks((prev) => prev.map((m) => (m.id === id ? { ...m, ...updates } : m)));
  };

  const addMark = (mark: Mark) => {
    setMarks((prev) => [...prev, mark]);
  };

  const updateAttendance = (id: string, updates: Partial<AttendanceRecord>) => {
    setAttendance((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...updates } : a))
    );
  };

  const addAttendance = (record: AttendanceRecord) => {
    setAttendance((prev) => [...prev, record]);
  };

  const addMessage = (message: Message) => {
    setMessages((prev) => [...prev, message]);
  };

  const markMessageAsRead = (id: string) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, read: true } : m))
    );
  };

  return (
    <DataContext.Provider
      value={{
        assignments,
        marks,
        attendance,
        messages,
        updateAssignment,
        addAssignment,
        updateMark,
        addMark,
        updateAttendance,
        addAttendance,
        addMessage,
        markMessageAsRead,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within DataProvider');
  }
  return context;
};
