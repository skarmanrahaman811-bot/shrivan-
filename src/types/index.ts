export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: Date;
}

export interface Notification {
  id: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

export interface Teacher {
  id: string;
  name: string;
  subject: string;
  username: string;
  password: string;
  students: string[];
  messages: Message[];
  notifications: Notification[];
}

export interface Student {
  id: string;
  name: string;
  phone: string;
  password: string;
  class: string;
  selectedTeachers: string[];
  status: 'pending' | 'approved' | 'rejected';
  messages: Message[];
  notifications: Notification[];
}

export interface Note {
  id: string;
  teacherId: string;
  teacherName: string;
  title: string;
  content: string;
  timestamp: Date;
  targetClass: string;
}

export interface Schedule {
  id: string;
  teacherId: string;
  teacherName: string;
  subject: string;
  day: string;
  time: string;
  class: string;
}