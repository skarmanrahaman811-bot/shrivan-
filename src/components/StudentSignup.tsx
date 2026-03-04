import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useData } from "../context/DataContext";
import { Button } from "/components/ui/button";
import { Input } from "/components/ui/input";
import { Label } from "/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "/components/ui/card";
import { ArrowLeft, Check } from "lucide-react";

export function StudentSignup({ onNavigate }: { onNavigate: (view: string) => void }) {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [studentClass, setStudentClass] = useState("");
  const [step, setStep] = useState(1); // 1: Details, 2: OTP, 3: Select Teachers
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [selectedTeachers, setSelectedTeachers] = useState<string[]>([]);
  const [error, setError] = useState("");
  
  const { signup } = useAuth();
  const { teachers, addStudent } = useData();

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length < 10) {
      setError("Please enter a valid phone number");
      return;
    }
    // Simulate OTP
    const newOtp = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(newOtp);
    console.log("OTP:", newOtp); // For demo purposes
    setStep(2);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp === generatedOtp) {
      setStep(3);
    } else {
      setError("Invalid OTP");
    }
  };

  const handleTeacherSelection = (teacherId: string) => {
    setSelectedTeachers((prev) =>
      prev.includes(teacherId)
        ? prev.filter((id) => id !== teacherId)
        : [...prev, teacherId]
    );
  };

  const handleFinalSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedTeachers.length === 0) {
      setError("Please select at least one teacher");
      return;
    }

    const newStudent = {
      id: `student-${Date.now()}`,
      name,
      phone,
      password,
      class: studentClass,
      teacherIds: selectedTeachers,
      role: "student" as const,
    };

    addStudent(newStudent);
    alert("Registration successful! Please login.");
    onNavigate("student-login");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Button
          variant="ghost"
          onClick={() => onNavigate("home")}
          className="mb-4 text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <Card className="border-slate-200 shadow-lg">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold text-slate-900">
              Student Registration
            </CardTitle>
            <CardDescription>
              {step === 1 && "Enter your details to get started"}
              {step === 2 && "Verify your phone number"}
              {step === 3 && "Select your teachers"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-4 p-3 text-sm text-red-600 bg-red-50 rounded-md border border-red-200">
                {error}
              </div>
            )}

            {step === 1 && (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="class">Class</Label>
                  <select
                    id="class"
                    value={studentClass}
                    onChange={(e) => setStudentClass(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    required
                  >
                    <option value="">Select Class</option>
                    {[...Array(12).keys()].map((i) => (
                      <option key={i + 1} value={`Class ${i + 1}`}>
                        Class {i + 1}
                      </option>
                    ))}
                    <option value="NEET">NEET</option>
                    <option value="JEE">JEE</option>
                    <option value="NEET Dropper">NEET Dropper</option>
                    <option value="JEE Dropper">JEE Dropper</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Enter 10-digit number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Create Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                  Send OTP
                </Button>
              </form>
            )}

            {step === 2 && (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="otp">Enter OTP</Label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder="Enter 4-digit OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                  />
                  <p className="text-xs text-slate-500">
                    (Check console for demo OTP)
                  </p>
                </div>
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                  Verify OTP
                </Button>
              </form>
            )}

            {step === 3 && (
              <form onSubmit={handleFinalSignup} className="space-y-4">
                <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                  <Label className="text-base font-semibold">Select Teachers</Label>
                  {teachers.map((teacher) => (
                    <div
                      key={teacher.id}
                      onClick={() => handleTeacherSelection(teacher.id)}
                      className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
                        selectedTeachers.includes(teacher.id)
                          ? "bg-blue-50 border-blue-500"
                          : "bg-white border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      <div>
                        <p className="font-medium text-slate-900">{teacher.name}</p>
                        <p className="text-xs text-slate-500">{teacher.subject}</p>
                      </div>
                      {selectedTeachers.includes(teacher.id) && (
                        <Check className="h-5 w-5 text-blue-600" />
                      )}
                    </div>
                  ))}
                </div>
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                  Complete Registration
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}