import { Button } from "/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "/components/ui/card";
import { BookOpen, User, Shield } from "lucide-react";

interface HomeProps {
  onNavigate: (view: "student-login" | "teacher-login" | "admin-login") => void;
}

export function Home({ onNavigate }: HomeProps) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 py-6">
        <div className="container mx-auto px-4 flex items-center justify-center">
          <div className="flex items-center space-x-4">
            <div className="bg-blue-600 p-3 rounded-lg">
              <BookOpen className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Shrivan Science Academy</h1>
              <p className="text-sm text-slate-500">Excellence in Education</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Welcome</h2>
            <p className="text-slate-600">Please select your portal to continue</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Student Login Card */}
            <Card className="border-slate-200 hover:shadow-lg transition-shadow cursor-pointer group">
              <CardHeader className="text-center">
                <div className="mx-auto bg-blue-100 p-4 rounded-full mb-4 group-hover:bg-blue-200 transition-colors">
                  <User className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle>Student Portal</CardTitle>
                <CardDescription>Access schedules, notes, and messages</CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={() => onNavigate("student-login")}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  Login as Student
                </Button>
              </CardContent>
            </Card>

            {/* Teacher Login Card */}
            <Card className="border-slate-200 hover:shadow-lg transition-shadow cursor-pointer group">
              <CardHeader className="text-center">
                <div className="mx-auto bg-green-100 p-4 rounded-full mb-4 group-hover:bg-green-200 transition-colors">
                  <BookOpen className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle>Teacher Portal</CardTitle>
                <CardDescription>Upload notes and manage classes</CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={() => onNavigate("teacher-login")}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  Login as Teacher
                </Button>
              </CardContent>
            </Card>

            {/* Admin Login Card */}
            <Card className="border-slate-200 hover:shadow-lg transition-shadow cursor-pointer group">
              <CardHeader className="text-center">
                <div className="mx-auto bg-slate-800 p-4 rounded-full mb-4 group-hover:bg-slate-700 transition-colors">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <CardTitle>Admin Portal</CardTitle>
                <CardDescription>Manage teachers and accounts</CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={() => onNavigate("admin-login")}
                  className="w-full bg-slate-800 hover:bg-slate-900"
                >
                  Login as Admin
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6">
        <div className="container mx-auto px-4 text-center text-slate-500 text-sm">
          <p>&copy; {new Date().getFullYear()} Shrivan Science Academy. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}