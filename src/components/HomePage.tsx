import { Button } from './ui/button';
import { GraduationCap, BookOpen, Users, Shield } from 'lucide-react';

interface HomePageProps {
  onStudentLogin: () => void;
  onTeacherLogin: () => void;
  onAdminLogin: () => void; // Added
}

export const HomePage = ({ onStudentLogin, onTeacherLogin, onAdminLogin }: HomePageProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-indigo-100">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
              S
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Shrivan Science Academy</h1>
              <p className="text-sm text-gray-500">Excellence in Education</p>
            </div>
          </div>
          <Button variant="outline" onClick={onAdminLogin} className="text-slate-600 border-slate-300 hover:bg-slate-50">
            <Shield className="w-4 h-4 mr-2" />
            Admin
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-grow container mx-auto px-4 py-16 flex flex-col items-center justify-center">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">Welcome to Our Portal</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Connect with teachers, access study materials, view schedules, and stay updated with your academic journey.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 w-full max-w-4xl mb-12">
          {/* Student Portal Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-indigo-100 hover:shadow-2xl transition-shadow">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-6">
                <GraduationCap className="w-8 h-8 text-indigo-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Student Portal</h3>
              <p className="text-gray-600 mb-6">
                Access your class schedules, download notes, and communicate with your teachers.
              </p>
              <Button 
                onClick={onStudentLogin}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-6 text-lg"
              >
                Enter Student Portal
              </Button>
            </div>
          </div>

          {/* Teacher Portal Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-emerald-100 hover:shadow-2xl transition-shadow">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
                <Users className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Teacher Portal</h3>
              <p className="text-gray-600 mb-6">
                Manage your classes, upload study materials, approve students, and send announcements.
              </p>
              <Button 
                onClick={onTeacherLogin}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-6 text-lg"
              >
                Enter Teacher Portal
              </Button>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 w-full max-w-5xl">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-blue-600" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Study Materials</h4>
            <p className="text-sm text-gray-600">Access notes and resources uploaded by your teachers.</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Direct Messaging</h4>
            <p className="text-sm text-gray-600">Communicate directly with teachers and classmates.</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-orange-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-orange-600" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Class Schedules</h4>
            <p className="text-sm text-gray-600">Stay updated with your class timings and routines.</p>
          </div>
        </div>
      </main>
    </div>
  );
};