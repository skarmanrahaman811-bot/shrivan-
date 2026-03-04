import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { LogOut, Upload, MessageSquare, Calendar, FileText, Check, X, Users, Bell, Key, Trash2, AlertCircle } from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { CLASS_OPTIONS } from '../utils/constants';

interface TeacherDashboardProps {
  onLogout: () => void;
}

export const TeacherDashboard = ({ onLogout }: TeacherDashboardProps) => {
  const { user } = useAuth();
  const { 
    students, 
    teachers, 
    notes, 
    schedules, 
    addNote, 
    deleteNote, 
    addSchedule, 
    deleteSchedule,
    sendMessage,
    getMessagesBetween,
    approveStudent,
    rejectStudent,
    removeStudent,
    updateTeacherPassword
  } = useData();

  const [newNote, setNewNote] = useState({ title: '', content: '', targetClass: '' });
  const [newSchedule, setNewSchedule] = useState({ day: '', time: '', class: '' });
  const [selectedChatStudent, setSelectedChatStudent] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState('');
  
  // Admin State
  const [selectedTeacherId, setSelectedTeacherId] = useState<string | null>(null);
  const [newTeacherPassword, setNewTeacherPassword] = useState('');

  const isAdmin = user?.role === 'admin';
  
  // Tab State
  type TabType = 'overview' | 'approvals' | 'notes' | 'schedule' | 'messages' | 'manage-students' | 'manage-teachers';
  const [activeTab, setActiveTab] = useState<TabType>(isAdmin ? 'manage-students' : 'overview');

  // --- TEACHER LOGIC ---

  // Filter students who requested this teacher and are pending
  const pendingStudents = students.filter(s => 
    s.selectedTeachers.includes(user?.id || '') && s.status === 'pending'
  );

  // Filter approved students for this teacher
  const myStudents = students.filter(s => 
    s.selectedTeachers.includes(user?.id || '') && s.status === 'approved'
  );

  const handleUploadNote = () => {
    if (!newNote.title || !newNote.content || !newNote.targetClass) return;
    addNote({
      teacherId: user?.id || '',
      teacherName: user?.name || '',
      title: newNote.title,
      content: newNote.content,
      targetClass: newNote.targetClass
    });
    setNewNote({ title: '', content: '', targetClass: '' });
  };

  const handleAddSchedule = () => {
    if (!newSchedule.day || !newSchedule.time || !newSchedule.class) return;
    addSchedule({
      teacherId: user?.id || '',
      teacherName: user?.name || '',
      subject: 'Subject',
      day: newSchedule.day,
      time: newSchedule.time,
      class: newSchedule.class
    });
    setNewSchedule({ day: '', time: '', class: '' });
  };

  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedChatStudent) return;
    sendMessage(user?.id || '', selectedChatStudent, messageInput, user?.name || '');
    setMessageInput('');
  };

  const handleApprove = (studentId: string) => {
    approveStudent(studentId);
  };

  const handleReject = (studentId: string) => {
    rejectStudent(studentId);
  };

  const chatMessages = selectedChatStudent 
    ? getMessagesBetween(user?.id || '', selectedChatStudent)
    : [];

  // --- ADMIN LOGIC ---

  const handleRemoveStudent = (id: string) => {
    if(confirm('Are you sure you want to remove this student?')) {
      removeStudent(id);
    }
  };

  const handleResetTeacherPassword = () => {
    if (!selectedTeacherId || !newTeacherPassword) return;
    updateTeacherPassword(selectedTeacherId, newTeacherPassword);
    setNewTeacherPassword('');
    setSelectedTeacherId(null);
    alert('Password updated successfully');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isAdmin ? 'Admin Dashboard' : 'Teacher Dashboard'}
            </h1>
            <p className="text-sm text-gray-500">Welcome, {user?.name}</p>
          </div>
          <Button variant="outline" onClick={onLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-6 bg-white p-2 rounded-lg shadow-sm">
          {isAdmin ? (
            // Admin Tabs
            <>
              <button
                onClick={() => setActiveTab('manage-students')}
                className={`px-4 py-2 rounded-md font-medium transition-colors flex items-center ${
                  activeTab === 'manage-students' 
                    ? 'bg-slate-800 text-white' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Users className="w-4 h-4 mr-2" />
                Manage Students
              </button>
              <button
                onClick={() => setActiveTab('manage-teachers')}
                className={`px-4 py-2 rounded-md font-medium transition-colors flex items-center ${
                  activeTab === 'manage-teachers' 
                    ? 'bg-slate-800 text-white' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Key className="w-4 h-4 mr-2" />
                Manage Teachers
              </button>
            </>
          ) : (
            // Teacher Tabs
            <>
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-4 py-2 rounded-md font-medium transition-colors flex items-center ${
                  activeTab === 'overview' 
                    ? 'bg-emerald-600 text-white' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Users className="w-4 h-4 mr-2" />
                Overview
              </button>
              <button
                onClick={() => setActiveTab('approvals')}
                className={`px-4 py-2 rounded-md font-medium transition-colors flex items-center ${
                  activeTab === 'approvals' 
                    ? 'bg-emerald-600 text-white' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Bell className="w-4 h-4 mr-2" />
                Approvals
                {pendingStudents.length > 0 && (
                  <span className="ml-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                    {pendingStudents.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveTab('notes')}
                className={`px-4 py-2 rounded-md font-medium transition-colors flex items-center ${
                  activeTab === 'notes' 
                    ? 'bg-emerald-600 text-white' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <FileText className="w-4 h-4 mr-2" />
                Notes
              </button>
              <button
                onClick={() => setActiveTab('schedule')}
                className={`px-4 py-2 rounded-md font-medium transition-colors flex items-center ${
                  activeTab === 'schedule' 
                    ? 'bg-emerald-600 text-white' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Calendar className="w-4 h-4 mr-2" />
                Schedule
              </button>
              <button
                onClick={() => setActiveTab('messages')}
                className={`px-4 py-2 rounded-md font-medium transition-colors flex items-center ${
                  activeTab === 'messages' 
                    ? 'bg-emerald-600 text-white' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Messages
              </button>
            </>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          
          {/* --- ADMIN VIEWS --- */}
          {isAdmin && activeTab === 'manage-students' && (
            <div>
              <h2 className="text-xl font-bold mb-4">All Students</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-100 text-gray-700">
                    <tr>
                      <th className="px-4 py-3 rounded-l-lg">Name</th>
                      <th className="px-4 py-3">Class</th>
                      <th className="px-4 py-3">Phone</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3 rounded-r-lg">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.length === 0 ? (
                      <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-500">No students found.</td></tr>
                    ) : (
                      students.map(student => (
                        <tr key={student.id} className="border-b hover:bg-gray-50">
                          <td className="px-4 py-3 font-medium">{student.name}</td>
                          <td className="px-4 py-3">{student.class}</td>
                          <td className="px-4 py-3">{student.phone}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              student.status === 'approved' ? 'bg-green-100 text-green-700' :
                              student.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              {student.status}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <Button variant="destructive" size="sm" onClick={() => handleRemoveStudent(student.id)}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {isAdmin && activeTab === 'manage-teachers' && (
            <div>
              <h2 className="text-xl font-bold mb-4">Manage Teachers</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-slate-800">Reset Password</CardTitle>
                    <CardDescription>Change a teacher's login credentials</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Select Teacher</Label>
                      <select 
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        value={selectedTeacherId || ''}
                        onChange={(e) => setSelectedTeacherId(e.target.value)}
                      >
                        <option value="">-- Choose a Teacher --</option>
                        {teachers.map(t => (
                          <option key={t.id} value={t.id}>{t.name} ({t.subject})</option>
                        ))}
                      </select>
                    </div>
                    {selectedTeacherId && (
                      <div className="space-y-2">
                        <Label>New Password</Label>
                        <Input
                          type="text"
                          value={newTeacherPassword}
                          onChange={(e) => setNewTeacherPassword(e.target.value)}
                          placeholder="Enter new password"
                        />
                        <Button onClick={handleResetTeacherPassword} className="w-full bg-slate-800 hover:bg-slate-900">
                          Update Password
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Teacher List</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {teachers.map(t => (
                        <div key={t.id} className="flex justify-between items-center p-2 border rounded">
                          <div>
                            <p className="font-medium">{t.name}</p>
                            <p className="text-xs text-gray-500">{t.username}</p>
                          </div>
                          <span className="text-xs bg-slate-100 px-2 py-1 rounded">{t.subject}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* --- TEACHER VIEWS --- */}
          {!isAdmin && activeTab === 'overview' && (
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{myStudents.length}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
                  <Bell className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-amber-600">{pendingStudents.length}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Notes Uploaded</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{notes.filter(n => n.teacherId === user?.id).length}</div>
                </CardContent>
              </Card>
            </div>
          )}

          {!isAdmin && activeTab === 'approvals' && (
            <div>
              <h2 className="text-xl font-bold mb-4">Student Approval Requests</h2>
              {pendingStudents.length === 0 ? (
                <p className="text-center text-gray-500 py-8">No pending requests</p>
              ) : (
                <div className="space-y-4">
                  {pendingStudents.map(student => (
                    <div key={student.id} className="flex items-center justify-between p-4 border rounded-lg bg-gray-50">
                      <div>
                        <h4 className="font-semibold">{student.name}</h4>
                        <p className="text-sm text-gray-600">Class: {student.class}</p>
                        <p className="text-sm text-gray-600">Phone: {student.phone}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => handleApprove(student.id)} className="bg-green-600 hover:bg-green-700">
                          <Check className="w-4 h-4 mr-1" />
                          Approve
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleReject(student.id)}>
                          <X className="w-4 h-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {!isAdmin && activeTab === 'notes' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Upload Notes</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="note-title">Title</Label>
                    <Input id="note-title" value={newNote.title} onChange={(e) => setNewNote({ ...newNote, title: e.target.value })} placeholder="Note title" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="note-class">Target Class</Label>
                    <select id="note-class" value={newNote.targetClass} onChange={(e) => setNewNote({ ...newNote, targetClass: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                      <option value="">Select class</option>
                      {CLASS_OPTIONS.map(cls => <option key={cls} value={cls}>{cls}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="note-content">Content</Label>
                    <Textarea id="note-content" value={newNote.content} onChange={(e) => setNewNote({ ...newNote, content: e.target.value })} placeholder="Write your notes here..." rows={6} />
                  </div>
                  <Button onClick={handleUploadNote} className="w-full bg-emerald-600 hover:bg-emerald-700">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Note
                  </Button>
                </CardContent>
              </Card>
              <div>
                <h3 className="text-lg font-semibold mb-4">Your Notes</h3>
                <div className="space-y-4">
                  {notes.filter(n => n.teacherId === user?.id).map(note => (
                    <Card key={note.id}>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle>{note.title}</CardTitle>
                            <CardDescription>{note.targetClass} • {new Date(note.timestamp).toLocaleDateString()}</CardDescription>
                          </div>
                          <Button variant="destructive" size="sm" onClick={() => deleteNote(note.id)}>Delete</Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="whitespace-pre-wrap">{note.content}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          )}

          {!isAdmin && activeTab === 'schedule' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Add Class Schedule</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="schedule-day">Day</Label>
                      <select id="schedule-day" value={newSchedule.day} onChange={(e) => setNewSchedule({ ...newSchedule, day: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md">
                        <option value="">Select day</option>
                        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => <option key={day} value={day}>{day}</option>)}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="schedule-time">Time</Label>
                      <Input id="schedule-time" type="time" value={newSchedule.time} onChange={(e) => setNewSchedule({ ...newSchedule, time: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="schedule-class">Class</Label>
                      <select id="schedule-class" value={newSchedule.class} onChange={(e) => setNewSchedule({ ...newSchedule, class: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md">
                        <option value="">Select class</option>
                        {CLASS_OPTIONS.map(cls => <option key={cls} value={cls}>{cls}</option>)}
                      </select>
                    </div>
                  </div>
                  <Button onClick={handleAddSchedule} className="w-full bg-emerald-600 hover:bg-emerald-700">Add Schedule</Button>
                </CardContent>
              </Card>
              <div>
                <h3 className="text-lg font-semibold mb-4">Your Schedules</h3>
                <div className="space-y-4">
                  {schedules.filter(s => s.teacherId === user?.id).map(schedule => (
                    <Card key={schedule.id}>
                      <CardContent className="pt-6">
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-semibold text-lg">{schedule.class}</h4>
                            <p className="text-gray-600">{schedule.day}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-emerald-600">{schedule.time}</p>
                            <Button variant="destructive" size="sm" onClick={() => deleteSchedule(schedule.id)} className="mt-2">Delete</Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          )}

          {!isAdmin && activeTab === 'messages' && (
            <div className="flex h-[600px] gap-4">
              <div className="w-1/3 border-r pr-4">
                <h3 className="font-semibold mb-4">Your Students</h3>
                <div className="space-y-2">
                  {myStudents.map(student => (
                    <button key={student.id} onClick={() => setSelectedChatStudent(student.id)} className={`w-full text-left p-3 rounded-lg transition-colors ${selectedChatStudent === student.id ? 'bg-emerald-100 border border-emerald-200' : 'hover:bg-gray-50 border border-transparent'}`}>
                      <p className="font-medium">{student.name}</p>
                      <p className="text-sm text-gray-500">{student.class}</p>
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex-1 flex flex-col">
                {selectedChatStudent ? (
                  <>
                    <div className="flex-1 overflow-y-auto space-y-4 mb-4 p-4 bg-gray-50 rounded-lg">
                      {chatMessages.map(msg => (
                        <div key={msg.id} className={`flex ${msg.senderId === user?.id ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[70%] p-3 rounded-lg ${msg.senderId === user?.id ? 'bg-emerald-600 text-white' : 'bg-white border'}`}>
                            <p className="text-sm font-medium mb-1">{msg.senderName}</p>
                            <p>{msg.content}</p>
                          </div>
                        </div>
                      ))}
                      {chatMessages.length === 0 && <p className="text-center text-gray-500 mt-10">No messages yet. Start the conversation!</p>}
                    </div>
                    <div className="flex gap-2">
                      <input type="text" value={messageInput} onChange={(e) => setMessageInput(e.target.value)} placeholder="Type a message..." className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()} />
                      <Button onClick={handleSendMessage} className="bg-emerald-600 hover:bg-emerald-700">Send</Button>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">Select a student to start messaging</div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};