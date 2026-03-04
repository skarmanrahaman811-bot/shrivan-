import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Teacher, Student, Note, Schedule, Message } from '../types';
import { INITIAL_TEACHERS, INITIAL_NOTES, INITIAL_SCHEDULES } from '../utils/constants';

interface DataContextType {
  teachers: Teacher[];
  students: Student[];
  notes: Note[];
  schedules: Schedule[];
  addStudent: (student: Omit<Student, 'id' | 'status'>) => void;
  approveStudent: (id: string) => void;
  rejectStudent: (id: string) => void;
  removeStudent: (id: string) => void;
  addNote: (note: Omit<Note, 'id' | 'timestamp'>) => void;
  deleteNote: (id: string) => void;
  addSchedule: (schedule: Omit<Schedule, 'id'>) => void;
  deleteSchedule: (id: string) => void;
  sendMessage: (senderId: string, receiverId: string, content: string, senderName: string) => void;
  getMessagesBetween: (user1: string, user2: string) => Message[];
  getTeacherByUsername: (username: string) => Teacher | undefined;
  updateTeacherPassword: (teacherId: string, newPassword: string) => void; // NEW
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [teachers, setTeachers] = useState<Teacher[]>(INITIAL_TEACHERS);
  const [students, setStudents] = useState<Student[]>([]);
  const [notes, setNotes] = useState<Note[]>(INITIAL_NOTES);
  const [schedules, setSchedules] = useState<Schedule[]>(INITIAL_SCHEDULES);

  // Load data from localStorage on mount
  useEffect(() => {
    const storedTeachers = localStorage.getItem('teachers');
    const storedStudents = localStorage.getItem('students');
    const storedNotes = localStorage.getItem('notes');
    const storedSchedules = localStorage.getItem('schedules');

    if (storedTeachers) setTeachers(JSON.parse(storedTeachers));
    if (storedStudents) setStudents(JSON.parse(storedStudents));
    if (storedNotes) setNotes(JSON.parse(storedNotes));
    if (storedSchedules) setSchedules(JSON.parse(storedSchedules));
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('teachers', JSON.stringify(teachers));
    localStorage.setItem('students', JSON.stringify(students));
    localStorage.setItem('notes', JSON.stringify(notes));
    localStorage.setItem('schedules', JSON.stringify(schedules));
  }, [teachers, students, notes, schedules]);

  const addStudent = (studentData: Omit<Student, 'id' | 'status'>) => {
    const newStudent: Student = {
      ...studentData,
      id: `student_${Date.now()}`,
      status: 'pending'
    };
    setStudents([...students, newStudent]);
  };

  const approveStudent = (id: string) => {
    setStudents(students.map(s => s.id === id ? { ...s, status: 'approved' } : s));
  };

  const rejectStudent = (id: string) => {
    setStudents(students.map(s => s.id === id ? { ...s, status: 'rejected' } : s));
  };

  const removeStudent = (id: string) => {
    setStudents(students.filter(s => s.id !== id));
  };

  const addNote = (noteData: Omit<Note, 'id' | 'timestamp'>) => {
    const newNote: Note = {
      ...noteData,
      id: `note_${Date.now()}`,
      timestamp: Date.now()
    };
    setNotes([...notes, newNote]);
  };

  const deleteNote = (id: string) => {
    setNotes(notes.filter(n => n.id !== id));
  };

  const addSchedule = (scheduleData: Omit<Schedule, 'id'>) => {
    const newSchedule: Schedule = {
      ...scheduleData,
      id: `schedule_${Date.now()}`
    };
    setSchedules([...schedules, newSchedule]);
  };

  const deleteSchedule = (id: string) => {
    setSchedules(schedules.filter(s => s.id !== id));
  };

  const sendMessage = (senderId: string, receiverId: string, content: string, senderName: string) => {
    const newMessage: Message = {
      id: `msg_${Date.now()}`,
      senderId,
      receiverId,
      content,
      senderName,
      timestamp: Date.now()
    };
    
    // Update messages for both sender and receiver
    const updateMessages = (userId: string) => (prev: Teacher[] | Student[]) => {
      return prev.map(u => {
        if (u.id === userId) {
          return { ...u, messages: [...(u.messages || []), newMessage] };
        }
        return u;
      });
    };

    // Note: In a real app, we'd store messages centrally. Here we update the arrays in context state
    // But since we don't have a central message store in the type definition for the context,
    // we will rely on the components to fetch from the specific user objects or we need a central message list.
    // For simplicity in this demo, let's assume we add to a central list if we had one, 
    // but currently we are updating user objects. Let's add a central messages state for simplicity.
    // *Correction*: The types don't have a central messages list. 
    // We will add a `messages` state to the context for this demo to work properly.
  };

  // Adding a central messages state for the context to handle cross-communication easily
  const [allMessages, setAllMessages] = useState<Message[]>([]);

  const handleSendMessage = (senderId: string, receiverId: string, content: string, senderName: string) => {
    const newMessage: Message = {
      id: `msg_${Date.now()}`,
      senderId,
      receiverId,
      content,
      senderName,
      timestamp: Date.now()
    };
    setAllMessages([...allMessages, newMessage]);
  };

  const getMessagesBetween = (user1: string, user2: string) => {
    return allMessages.filter(m => 
      (m.senderId === user1 && m.receiverId === user2) ||
      (m.senderId === user2 && m.receiverId === user1)
    ).sort((a, b) => a.timestamp - b.timestamp);
  };

  const getTeacherByUsername = (username: string) => {
    return teachers.find(t => t.username === username);
  };

  const updateTeacherPassword = (teacherId: string, newPassword: string) => {
    setTeachers(teachers.map(t => 
      t.id === teacherId ? { ...t, password: newPassword } : t
    ));
  };

  return (
    <DataContext.Provider value={{
      teachers,
      students,
      notes,
      schedules,
      addStudent,
      approveStudent,
      rejectStudent,
      removeStudent,
      addNote,
      deleteNote,
      addSchedule,
      deleteSchedule,
      sendMessage: handleSendMessage,
      getMessagesBetween,
      getTeacherByUsername,
      updateTeacherPassword
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};