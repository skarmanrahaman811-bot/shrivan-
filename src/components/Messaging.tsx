import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ArrowLeft, Send } from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';

interface MessagingProps {
  userType: 'student' | 'teacher';
  onBack: () => void;
}

export const Messaging = ({ userType, onBack }: MessagingProps) => {
  const { user } = useAuth();
  const { teachers, students, messages, addMessage } = useData();
  const [selectedRecipient, setSelectedRecipient] = useState<string>('');
  const [newMessage, setNewMessage] = useState('');
  const [conversation, setConversation] = useState<typeof messages>([]);

  const recipients = userType === 'student' 
    ? teachers.filter(t => students.find(s => s.id === user?.id)?.approvedTeachers.includes(t.id))
    : students.filter(s => teachers.find(t => t.id === user?.id)?.students.includes(s.id));

  useEffect(() => {
    if (selectedRecipient) {
      const conv = messages.filter(
        m => (m.senderId === user?.id && m.receiverId === selectedRecipient) ||
             (m.senderId === selectedRecipient && m.receiverId === user?.id)
      ).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
      setConversation(conv);
    }
  }, [selectedRecipient, messages, user]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedRecipient || !user) return;

    const recipientName = recipients.find(r => r.id === selectedRecipient)?.name || 'Unknown';

    addMessage({
      id: `msg_${Date.now()}`,
      senderId: user.id,
      senderName: user.name,
      receiverId: selectedRecipient,
      content: newMessage,
      timestamp: new Date(),
      read: false
    });

    setNewMessage('');
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" onClick={onBack} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Contacts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {recipients.length === 0 ? (
                  <p className="text-gray-500 text-sm">No contacts available</p>
                ) : (
                  recipients.map(recipient => (
                    <button
                      key={recipient.id}
                      onClick={() => setSelectedRecipient(recipient.id)}
                      className={`w-full text-left p-3 rounded-lg transition-colors ${
                        selectedRecipient === recipient.id
                          ? 'bg-indigo-100 border-2 border-indigo-500'
                          : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                      }`}
                    >
                      <p className="font-medium text-gray-900">{recipient.name}</p>
                      <p className="text-sm text-gray-600">
                        {userType === 'student' 
                          ? (recipient as any).subject 
                          : `Class: ${(recipient as any).class}`}
                      </p>
                    </button>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>
                {selectedRecipient 
                  ? `Chat with ${recipients.find(r => r.id === selectedRecipient)?.name}`
                  : 'Select a contact to start messaging'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedRecipient ? (
                <div className="flex flex-col h-96">
                  <div className="flex-1 overflow-y-auto space-y-3 mb-4">
                    {conversation.length === 0 ? (
                      <p className="text-gray-500 text-center py-8">No messages yet. Start the conversation!</p>
                    ) : (
                      conversation.map(msg => (
                        <div
                          key={msg.id}
                          className={`flex ${msg.senderId === user?.id ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-xs px-4 py-2 rounded-lg ${
                              msg.senderId === user?.id
                                ? 'bg-indigo-600 text-white'
                                : 'bg-gray-200 text-gray-900'
                            }`}
                          >
                            <p className="text-sm">{msg.content}</p>
                            <p className={`text-xs mt-1 ${
                              msg.senderId === user?.id ? 'text-indigo-200' : 'text-gray-500'
                            }`}>
                              {formatTime(msg.timestamp)}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your message..."
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    />
                    <Button onClick={handleSendMessage} className="bg-indigo-600 hover:bg-indigo-700">
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-96 text-gray-500">
                  <p>Select a contact from the left panel</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};