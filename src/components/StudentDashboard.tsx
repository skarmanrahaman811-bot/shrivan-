import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { LogOut, BookOpen, Calendar, MessageSquare, FileText } from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';

interface StudentDashboardProps {
  onLogout: () => void;
}

export const StudentDashboard = ({ onLogout }: StudentDashboardProps) => {
  const { user } = useAuth();
  const { students, notes, schedules, teachers, sendMessage, getMessagesBetween } = useData();
  
  const [activeTab, setActiveTab] = useState<'schedule' | 'notes' | 'messages'>('schedule');
  const [selectedTeacherId, setSelectedTeacherId] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState('');

  const currentStudent = students.find(s => s.id === user?.id);

  if (!currentStudent) return null;

  // Filter notes relevant to student's class
  const myNotes = notes.filter(n => n.targetClass === currentStudent.class);
  
  // Filter schedules relevant to student's class
  const mySchedules = schedules.filter(s => s.class === currentStudent.class);

  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedTeacherId) return;
    sendMessage(user?.id || '', selectedTeacherId, messageInput, user?.name || '');
    setMessageInput('');
  };

  const chatMessages = selectedTeacherId 
    ? getMessagesBetween(user?.id || '', selectedTeacherId)
    : [];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Student Dashboard</h1>
            <p className="text-sm text-gray-500">Welcome, {currentStudent.name} | Class: {currentStudent.class}</p>
          </div>
          <Button variant="outline" onClick={onLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Tab Navigation */}
        <div className="flex space-x-2 mb-6 bg-white p-2 rounded-lg shadow-sm w-fit">
          <button
            onClick={() => setActiveTab('schedule')}
            className={`px-6 py-2 rounded-md font-medium transition-colors ${
              activeTab === 'schedule' 
                ? 'bg-indigo-600 text-white' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Calendar className="w-4 h-4 inline mr-2" />
            Schedule
          </button>
          <button
            onClick={() => setActiveTab('notes')}
            className={`px-6 py-2 rounded-md font-medium transition-colors ${
              activeTab === 'notes' 
                ? 'bg-indigo-600 text-white' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <BookOpen className="w-4 h-4 inline mr-2" />
            Notes
          </button>
          <button
            onClick={() => setActiveTab('messages')}
            className={`px-6 py-2 rounded-md font-medium transition-colors ${
              activeTab === 'messages' 
                ? 'bg-indigo-600 text-white' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <MessageSquare className="w-4 h-4 inline mr-2" />
            Messages
          </button>
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          {activeTab === 'schedule' && (
            <div>
              <h2 className="text-xl font-bold mb-4">Class Schedule</h2>
              {mySchedules.length === 0 ? (
                <p className="text-gray-500">No schedules available for your class yet.</p>
              ) : (
                <div className="grid gap-4">
                  {mySchedules.map(schedule => (
                    <Card key={schedule.id}>
                      <CardContent className="pt-6">
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="font-semibold text-lg">{schedule.subject}</h3>
                            <p className="text-gray-600">{schedule.teacherName}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-indigo-600">{schedule.day}</p>
                            <p className="text-gray-500">{schedule.time}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'notes' && (
            <div>
              <h2 className="text-xl font-bold mb-4">Study Materials</h2>
              {myNotes.length === 0 ? (
                <p className="text-gray-500">No notes uploaded for your class yet.</p>
              ) : (
                <div className="grid gap-4">
                  {myNotes.map(note => (
                    <Card key={note.id}>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="flex items-center">
                              <FileText className="w-5 h-5 mr-2 text-indigo-600" />
                              {note.title}
                            </CardTitle>
                            <CardDescription>
                              By {note.teacherName} • {new Date(note.timestamp).toLocaleDateString()}
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="whitespace-pre-wrap text-gray-700">{note.content}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'messages' && (
            <div className="flex h-[600px] gap-4">
              {/* Teacher List */}
              <div className="w-1/3 border-r pr-4">
                <h3 className="font-semibold mb-4">Your Teachers</h3>
                <div className="space-y-2">
                  {teachers.filter(t => currentStudent.selectedTeachers.includes(t.id)).map(teacher => (
                    <button
                      key={teacher.id}
                      onClick={() => setSelectedTeacherId(teacher.id)}
                      className={`w-full text-left p-3 rounded-lg transition-colors ${
                        selectedTeacherId === teacher.id 
                          ? 'bg-indigo-100 border border-indigo-200' 
                          : 'hover:bg-gray-50 border border-transparent'
                      }`}
                    >
                      <p className="font-medium">{teacher.name}</p>
                      <p className="text-sm text-gray-500">{teacher.subject}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Chat Area */}
              <div className="flex-1 flex flex-col">
                {selectedTeacherId ? (
                  <>
                    <div className="flex-1 overflow-y-auto space-y-4 mb-4 p-4 bg-gray-50 rounded-lg">
                      {chatMessages.map(msg => (
                        <div
                          key={msg.id}
                          className={`flex ${msg.senderId === user?.id ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[70%] p-3 rounded-lg ${
                              msg.senderId === user?.id 
                                ? 'bg-indigo-600 text-white' 
                                : 'bg-white border'
                            }`}
                          >
                            <p className="text-sm font-medium mb-1">{msg.senderName}</p>
                            <p>{msg.content}</p>
                          </div>
                        </div>
                      ))}
                      {chatMessages.length === 0 && (
                        <p className="text-center text-gray-500 mt-10">No messages yet. Start the conversation!</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      />
                      <Button onClick={handleSendMessage} className="bg-indigo-600 hover:bg-indigo-700">
                        Send
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    Select a teacher to start messaging
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};