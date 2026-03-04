import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { LogOut, Key, Shield, Users, Check, AlertCircle } from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';

export const AdminDashboard = ({ onLogout }: { onLogout: () => void }) => {
  const { teachers, students, updateTeacherPassword, removeStudent } = useData();
  const { user, login } = useAuth();

  // Teacher Password Reset State
  const [selectedTeacherId, setSelectedTeacherId] = useState<string | null>(null);
  const [newTeacherPassword, setNewTeacherPassword] = useState('');
  const [teacherSuccessMsg, setTeacherSuccessMsg] = useState('');

  // Admin Password Change State
  const [currentAdminPass, setCurrentAdminPass] = useState('');
  const [newAdminPass, setNewAdminPass] = useState('');
  const [adminSuccessMsg, setAdminSuccessMsg] = useState('');
  const [adminErrorMsg, setAdminErrorMsg] = useState('');

  // Hardcoded Admin Credentials for this demo (In real app, store securely)
  // Default: admin / admin123
  const [adminCredentials, setAdminCredentials] = useState(() => {
    const stored = localStorage.getItem('adminCredentials');
    return stored ? JSON.parse(stored) : { username: 'admin', password: 'admin123' };
  });

  const handleResetTeacherPassword = () => {
    if (!selectedTeacherId || !newTeacherPassword) return;
    
    updateTeacherPassword(selectedTeacherId, newTeacherPassword);
    setTeacherSuccessMsg(`Password updated for ${teachers.find(t => t.id === selectedTeacherId)?.name}`);
    setNewTeacherPassword('');
    setSelectedTeacherId(null);
    
    setTimeout(() => setTeacherSuccessMsg(''), 3000);
  };

  const handleChangeAdminPassword = () => {
    setAdminErrorMsg('');
    setAdminSuccessMsg('');

    if (currentAdminPass !== adminCredentials.password) {
      setAdminErrorMsg('Current password is incorrect');
      return;
    }

    if (newAdminPass.length < 4) {
      setAdminErrorMsg('New password must be at least 4 characters');
      return;
    }

    const updatedCreds = { ...adminCredentials, password: newAdminPass };
    setAdminCredentials(updatedCreds);
    localStorage.setItem('adminCredentials', JSON.stringify(updatedCreds));
    
    setAdminSuccessMsg('Admin password changed successfully');
    setCurrentAdminPass('');
    setNewAdminPass('');
    
    setTimeout(() => setAdminSuccessMsg(''), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-slate-900 text-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <p className="text-sm text-slate-300">System Management</p>
          </div>
          <Button variant="outline" className="bg-white text-slate-900 hover:bg-slate-100" onClick={onLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 space-y-8">
        
        {/* Stats */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Teachers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{teachers.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{students.length}</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          
          {/* Reset Teacher Password */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center text-indigo-600">
                <Key className="w-5 h-5 mr-2" />
                Reset Teacher Password
              </CardTitle>
              <CardDescription>Select a teacher to reset their login password</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Select Teacher</Label>
                <select 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                  <Label htmlFor="new-teacher-pass">New Password</Label>
                  <Input
                    id="new-teacher-pass"
                    type="text"
                    value={newTeacherPassword}
                    onChange={(e) => setNewTeacherPassword(e.target.value)}
                    placeholder="Enter new password"
                  />
                  <Button onClick={handleResetTeacherPassword} className="w-full bg-indigo-600 hover:bg-indigo-700">
                    Update Password
                  </Button>
                </div>
              )}

              {teacherSuccessMsg && (
                <div className="bg-green-50 text-green-700 p-3 rounded-md flex items-center text-sm">
                  <Check className="w-4 h-4 mr-2" />
                  {teacherSuccessMsg}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Change Admin Password */}
          <Card className="shadow-lg border-slate-200">
            <CardHeader>
              <CardTitle className="flex items-center text-slate-700">
                <Shield className="w-5 h-5 mr-2" />
                Change Admin Password
              </CardTitle>
              <CardDescription>Update your own admin credentials</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-admin-pass">Current Password</Label>
                <Input
                  id="current-admin-pass"
                  type="password"
                  value={currentAdminPass}
                  onChange={(e) => setCurrentAdminPass(e.target.value)}
                  placeholder="Enter current password"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-admin-pass">New Password</Label>
                <Input
                  id="new-admin-pass"
                  type="password"
                  value={newAdminPass}
                  onChange={(e) => setNewAdminPass(e.target.value)}
                  placeholder="Enter new password"
                />
              </div>
              <Button onClick={handleChangeAdminPassword} className="w-full bg-slate-800 hover:bg-slate-900">
                Update Admin Password
              </Button>

              {adminSuccessMsg && (
                <div className="bg-green-50 text-green-700 p-3 rounded-md flex items-center text-sm">
                  <Check className="w-4 h-4 mr-2" />
                  {adminSuccessMsg}
                </div>
              )}
              {adminErrorMsg && (
                <div className="bg-red-50 text-red-700 p-3 rounded-md flex items-center text-sm">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  {adminErrorMsg}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Manage Students List */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Manage Students</CardTitle>
            <CardDescription>View and remove student accounts</CardDescription>
          </CardHeader>
          <CardContent>
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
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                        No students registered yet.
                      </td>
                    </tr>
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
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => {
                              if(confirm(`Are you sure you want to remove ${student.name}?`)) {
                                removeStudent(student.id);
                              }
                            }}
                          >
                            Remove
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
};