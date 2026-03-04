import { Teacher, Note, Schedule } from '../types';

export const INITIAL_TEACHERS: Teacher[] = [
  {
    id: 'teacher_1',
    name: 'Tousik sir',
    subject: 'Chemistry',
    username: '@tousik2468',
    password: '1234',
    students: [],
    messages: [],
    notifications: []
  },
  {
    id: 'teacher_2',
    name: 'Islam sir',
    subject: 'Physics',
    username: '@islam2468',
    password: '1234',
    students: [],
    messages: [],
    notifications: []
  },
  {
    id: 'teacher_3',
    name: 'Biswajit sir',
    subject: 'Math',
    username: '@biswajit2468',
    password: '1234',
    students: [],
    messages: [],
    notifications: []
  }
];

export const INITIAL_NOTES: Note[] = [];

export const INITIAL_SCHEDULES: Schedule[] = [];

// Added this constant to fix the error
export const CLASS_OPTIONS = [
  'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5',
  'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10',
  'Class 11', 'Class 12',
  'NEET', 'JEE', 'NEET Dropper', 'JEE Dropper'
];