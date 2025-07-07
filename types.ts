export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  grade: number;
  emergencyContact: string;
  avatarUrl: string;
  gender: 'male' | 'female';
  address: string;
  parentName: string;
  parentPhone: string;
  admissionDate: string;
  bloodGroup?: string;
  medicalConditions?: string;
  schoolFees: {
    tuition: number;
    transport?: number;
    boarding?: number;
    totalPaid: number;
    balance: number;
  };
}

export interface Teacher {
  id: string;
  firstName: string;
  lastName: string;
  subject: string;
  email: string;
  phone: string;
  avatarUrl: string;
  gender: 'male' | 'female';
  dateOfBirth: string;
  hireDate: string;
  qualification: string;
  experience: number;
  salary: number;
  address: string;
  emergencyContact: string;
  nationalId: string;
  employmentType: 'Full-time' | 'Part-time' | 'Contract' | 'Volunteer';
  dateOfJoining: string;
}

export interface Course {
  id: string;
  name: string;
  teacherId: string | null;
  studentIds: string[];
  gradeLevel: number;
  subject: string;
  schedule: {
    day: string;
    startTime: string;
    endTime: string;
    classroom: string;
  }[];
  syllabus?: string;
  textbooks?: string[];
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  priority: 'low' | 'medium' | 'high';
  targetAudience: 'all' | 'students' | 'teachers' | 'parents';
}

export type AttendanceStatus = 'present' | 'absent' | 'late';

export interface AttendanceRecord {
  studentId: string;
  date: string; // YYYY-MM-DD
  status: AttendanceStatus;
}

export interface Exam {
  id: string;
  name: string;
  subject: string;
  gradeLevel: number;
  date: string;
  duration: number; // in minutes
  totalMarks: number;
  passingMarks: number;
  venue: string;
  instructions?: string;
}

export interface ExamResult {
  id: string;
  examId: string;
  studentId: string;
  marksObtained: number;
  grade: string;
  remarks?: string;
}

export interface FinanceRecord {
  id: string;
  type: 'income' | 'expense';
  category: string;
  description: string;
  amount: number;
  date: string;
  paymentMethod: 'cash' | 'bank_transfer' | 'mobile_money' | 'cheque';
  reference?: string;
  studentId?: string; // for fee payments
}

export interface Staff {
  id: string;
  firstName: string;
  lastName: string;
  department: 'Kitchen' | 'Security' | 'Library' | 'Maintenance' | 'Administration' | 'Cleaning' | 'Transport' | 'Health';
  position: string;
  email: string;
  phone: string;
  avatarUrl: string;
  gender: 'male' | 'female';
  dateOfBirth: string;
  hireDate: string;
  salary: number;
  address: string;
  emergencyContact: string;
  nationalId: string;
  employmentType: 'Full-time' | 'Part-time' | 'Contract';
  shift?: 'Day' | 'Night' | 'Both';
  supervisor?: string;
}

export type AppView = 'dashboard' | 'students' | 'teachers' | 'staff' | 'classes' | 'attendance' | 'announcements' | 'finance' | 'exams' | 'settings' | 'payroll' | 'admissions' | 'reports' | 'inventory' | 'library' | 'transport' | 'cafeteria' | 'maintenance' | 'security';