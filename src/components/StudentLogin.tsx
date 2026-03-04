import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { ArrowLeft, User, Lock, CheckCircle, Phone } from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { CLASS_OPTIONS } from '../utils/constants';

interface StudentLoginProps {
  onBack: () => void;
}

export const StudentLogin = ({ onBack }: StudentLoginProps) => {
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>('login');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [name, setName] = useState('');
  const [studentClass, setStudentClass] = useState('');
  const [selectedTeachers, setSelectedTeachers] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { teachers, addStudent, students } = useData();
  const { login } = useAuth();

  const handleSendOtp = () => {
    if (phone.length < 10) {
      setError('Please enter a valid phone number');
      return;
    }
    const newOtp = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(newOtp);
    setOtpSent(true);
    setError('');
    setSuccess(`OTP sent to ${phone}: ${newOtp} (Demo)`);
  };

  const handleSignup = () => {
    setError('');
    setSuccess('');

    if (otp !== generatedOtp) {
      setError('Invalid OTP');
      return;
    }

    if (!name || !studentClass || selectedTeachers.length === 0) {
      setError('Please fill all fields and select at least one teacher');
      return;
    }

    // Check if phone already exists
    const existingStudent = students.find(s => s.phone === phone);
    if (existingStudent) {
      setError('An account with this phone number already exists');
      return;
    }

    addStudent({
      name,
      phone,
      class: studentClass,
      selectedTeachers,
      password: 'default', // Not used in login flow currently
      messages: []
    });

    setSuccess('Registration successful! Please login.');
    setTimeout(() => {
      setMode('login');
      setPhone('');
      setOtp('');
      setOtpSent(false);
      setName('');
      setStudentClass('');
      setSelectedTeachers([]);
      setSuccess('');
    }, 2000);
  };

  const handleLogin = () => {
    setError('');
    
    const student = students.find(s => s.phone === phone);
    
    if (!student) {
      setError('No account found with this phone number');
      return;
    }

    if (student.status === 'pending') {
      setError('Your account is pending approval from teachers');
      return;
    }

    if (student.status === 'rejected') {
      setError('Your account request was rejected');
      return;
    }

    login('student', student.id, student.name);
  };

  const handleForgotPassword = () => {
    // Similar to signup, verify OTP then allow reset (simplified for demo)
    if (otp === generatedOtp) {
      setSuccess('Password reset link sent (Demo)');
    } else {
      setError('Invalid OTP');
    }
  };

  const toggleTeacherSelection = (teacherId: string) => {
    setSelectedTeachers(prev => 
      prev.includes(teacherId) 
        ? prev.filter(id => id !== teacherId)
        : [...prev, teacherId]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white py-8">
      <div className="container mx-auto px-4">
        <Button variant="ghost" onClick={onBack} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        <div className="max-w-md mx-auto">
          <Card className="shadow-xl">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <User className="w-8 h-8 text-indigo-600" />
              </div>
              <CardTitle className="text-2xl text-indigo-600">
                {mode === 'signup' ? 'Student Registration' : mode === 'forgot' ? 'Reset Password' : 'Student Login'}
              </CardTitle>
              <CardDescription>
                {mode === 'signup' ? 'Create your account' : mode === 'forgot' ? 'Recover your account' : 'Access your dashboard'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-lg text-sm">
                  {error}
                </div>
              )}
              {success && (
                <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-2 rounded-lg text-sm">
                  {success}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="flex gap-2">
                  <Input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter 10-digit number"
                    disabled={otpSent}
                  />
                  {!otpSent && (
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={handleSendOtp}
                      className="whitespace-nowrap"
                    >
                      Get OTP
                    </Button>
                  )}
                </div>
              </div>

              {otpSent && (
                <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                  <Label htmlFor="otp">Enter OTP</Label>
                  <Input
                    id="otp"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="4-digit OTP"
                    maxLength={4}
                  />
                </div>
              )}

              {mode === 'signup' && otpSent && (
                <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="class">Class</Label>
                    <select
                      id="class"
                      value={studentClass}
                      onChange={(e) => setStudentClass(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="">Select your class</option>
                      {CLASS_OPTIONS.map(cls => (
                        <option key={cls} value={cls}>{cls}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label>Select Teachers to Follow</Label>
                    <div className="space-y-2 max-h-40 overflow-y-auto border rounded-md p-2">
                      {teachers.map(teacher => (
                        <label key={teacher.id} className="flex items-center space-x-2 cursor-pointer p-2 hover:bg-gray-50 rounded">
                          <input
                            type="checkbox"
                            checked={selectedTeachers.includes(teacher.id)}
                            onChange={() => toggleTeacherSelection(teacher.id)}
                            className="rounded text-indigo-600 focus:ring-indigo-500"
                          />
                          <span className="text-sm">
                            {teacher.name} ({teacher.subject})
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <Button onClick={handleSignup} className="w-full bg-indigo-600 hover:bg-indigo-700">
                    <CheckCircle className="w-4 h-4 mr-2" />
                        Register
                  </Button>
                </div>
              )}

              {mode === 'login' && (
                <>
                  {otpSent && (
                    <Button onClick={handleLogin} className="w-full bg-indigo-600 hover:bg-indigo-700">
                      <Lock className="w-4 h-4 mr-2" />
                      Login with OTP
                    </Button>
                  )}
                  <div className="text-center text-sm">
                    <button 
                      onClick={() => setMode('forgot')}
                      className="text-indigo-600 hover:underline"
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <div className="text-center text-sm">
                    Don't have an account?{' '}
                    <button 
                      onClick={() => {
                        setMode('signup');
                        setOtpSent(false);
                        setOtp('');
                        setError('');
                      }}
                      className="text-indigo-600 hover:underline font-medium"
                    >
                      Sign Up
                    </button>
                  </div>
                </>
              )}

              {mode === 'forgot' && otpSent && (
                <>
                  <Button onClick={handleForgotPassword} className="w-full bg-indigo-600 hover:bg-indigo-700">
                    Reset Password
                  </Button>
                  <div className="text-center text-sm">
                    <button 
                      onClick={() => setMode('login')}
                      className="text-indigo-600 hover:underline"
                    >
                      Back to Login
                    </button>
                  </div>
                </>
              )}

              {mode === 'signup' && (
                <div className="text-center text-sm">
                  Already have an account?{' '}
                  <button 
                    onClick={() => {
                      setMode('login');
                      setOtpSent(false);
                      setOtp('');
                      setError('');
                    }}
                    className="text-indigo-600 hover:underline font-medium"
                  >
                    Login
                  </button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};