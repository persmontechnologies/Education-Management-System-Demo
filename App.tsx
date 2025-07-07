import React, { useState, useCallback } from 'react';
import { AppView, Student, Teacher, Staff, Course, Announcement, AttendanceRecord } from './types';
import { getInitialData } from './lib/mockData';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import StudentManagement from './components/StudentManagement';
import TeacherManagement from './components/TeacherManagement';
import StaffManagement from './components/StaffManagement';
import ClassManagement from './components/ClassManagement';
import GeminiHelper from './components/GeminiHelper';
import Announcements from './components/Announcements';
import Attendance from './components/Attendance';
import Finance from './components/Finance';
import ExamManagement from './components/ExamManagement';
import LibraryManagement from './components/LibraryManagement';
import Reports from './components/Reports';
import Payroll from './components/Payroll';
import Admissions from './components/Admissions';
import Inventory from './components/Inventory';
import Transport from './components/Transport';
import Cafeteria from './components/Cafeteria';
import Maintenance from './components/Maintenance';
import Security from './components/Security';
import Settings from './components/Settings';
import { motion, AnimatePresence } from 'framer-motion';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  
  const { 
    students: initialStudents, 
    teachers: initialTeachers, 
    staff: initialStaff,
    courses: initialCourses,
    announcements: initialAnnouncements,
    attendance: initialAttendance,
  } = getInitialData();

  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [teachers, setTeachers] = useState<Teacher[]>(initialTeachers);
  const [staff, setStaff] = useState<Staff[]>(initialStaff);
  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const [announcements, setAnnouncements] = useState<Announcement[]>(initialAnnouncements);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(initialAttendance);


  // Student handlers
  const addStudent = useCallback((student: Omit<Student, 'id' | 'avatarUrl'>) => {
    const newId = `s${Date.now()}`;
    setStudents(prev => [...prev, { ...student, id: newId, avatarUrl: `https://i.pravatar.cc/150?u=${newId}` }]);
  }, []);
  const updateStudent = useCallback((updatedStudent: Student) => setStudents(prev => prev.map(s => s.id === updatedStudent.id ? updatedStudent : s)), []);
  const deleteStudent = useCallback((studentId: string) => {
    setStudents(prev => prev.filter(s => s.id !== studentId));
    setCourses(prev => prev.map(c => {
      const updatedStudentIds = c.studentIds.filter(id => id !== studentId);
      return {...c, studentIds: updatedStudentIds};
    }));
    setAttendance(prev => prev.filter(a => a.studentId !== studentId));
  }, []);

  // Teacher handlers
  const addTeacher = useCallback((teacher: Omit<Teacher, 'id' | 'avatarUrl'>) => {
    const newId = `t${Date.now()}`;
    setTeachers(prev => [...prev, { ...teacher, id: newId, avatarUrl: `https://i.pravatar.cc/150?u=${newId}` }]);
  }, []);
  const updateTeacher = useCallback((updatedTeacher: Teacher) => setTeachers(prev => prev.map(t => t.id === updatedTeacher.id ? updatedTeacher : t)), []);
  const deleteTeacher = useCallback((teacherId: string) => {
    setTeachers(prev => prev.filter(t => t.id !== teacherId));
    setCourses(prev => prev.map(c => c.teacherId === teacherId ? { ...c, teacherId: null } : c));
  }, []);
  
  // Staff handlers
  const addStaff = useCallback((staff: Omit<Staff, 'id' | 'avatarUrl'>) => {
    const newId = `st${Date.now()}`;
    setStaff(prev => [...prev, { ...staff, id: newId, avatarUrl: `https://i.pravatar.cc/150?u=${newId}` }]);
  }, []);
  const updateStaff = useCallback((updatedStaff: Staff) => setStaff(prev => prev.map(s => s.id === updatedStaff.id ? updatedStaff : s)), []);
  const deleteStaff = useCallback((staffId: string) => setStaff(prev => prev.filter(s => s.id !== staffId)), []);
  
  // Course handlers
  const addCourse = useCallback((course: Omit<Course, 'id'>) => setCourses(prev => [...prev, { ...course, id: `c${Date.now()}` }]), []);
  const updateCourse = useCallback((updatedCourse: Course) => setCourses(prev => prev.map(c => c.id === updatedCourse.id ? updatedCourse : c)), []);
  const deleteCourse = useCallback((courseId: string) => setCourses(prev => prev.filter(c => c.id !== courseId)), []);

  // Announcement Handlers
  const addAnnouncement = useCallback((announcement: Omit<Announcement, 'id' | 'date'>) => {
    setAnnouncements(prev => [{ ...announcement, id: `a${Date.now()}`, date: new Date().toISOString() }, ...prev]);
  }, []);

  // Attendance Handlers
  const updateAttendance = useCallback((record: AttendanceRecord) => {
    setAttendance(prev => {
      const existingRecordIndex = prev.findIndex(r => r.studentId === record.studentId && r.date === record.date);
      if (existingRecordIndex > -1) {
        const newAttendance = [...prev];
        newAttendance[existingRecordIndex] = record;
        return newAttendance;
      }
      return [...prev, record];
    });
  }, []);

  const renderContent = () => {
    const key = currentView;
    const props = {
      dashboard: { students, teachers, courses, announcements, attendance },
      students: { students, onAdd: addStudent, onUpdate: updateStudent, onDelete: deleteStudent },
      teachers: { teachers, onAdd: addTeacher, onUpdate: updateTeacher, onDelete: deleteTeacher },
      staff: { staff, onAdd: addStaff, onUpdate: updateStaff, onDelete: deleteStaff },
      classes: { courses, teachers, students, onAdd: addCourse, onUpdate: updateCourse, onDelete: deleteCourse },
      announcements: { announcements, onAdd: addAnnouncement },
      attendance: { attendance, courses, students, onUpdate: updateAttendance },
    };

    let component;
    switch (currentView) {
      case 'dashboard': component = <Dashboard {...props.dashboard} />; break;
      case 'students': component = <StudentManagement {...props.students} />; break;
      case 'teachers': component = <TeacherManagement {...props.teachers} />; break;
      case 'staff': component = <StaffManagement {...props.staff} />; break;
      case 'classes': component = <ClassManagement {...props.classes} />; break;
      case 'announcements': component = <Announcements {...props.announcements} />; break;
      case 'attendance': component = <Attendance {...props.attendance} />; break;
      case 'finance': component = <Finance />; break;
      case 'exams': component = <ExamManagement />; break;
      case 'library': component = <LibraryManagement />; break;
      case 'reports': component = <Reports />; break;
      case 'payroll': component = <Payroll />; break;
      case 'admissions': component = <Admissions />; break;
      case 'inventory': component = <Inventory />; break;
      case 'transport': component = <Transport />; break;
      case 'cafeteria': component = <Cafeteria />; break;
      case 'maintenance': component = <Maintenance />; break;
      case 'security': component = <Security />; break;
      case 'settings': component = <Settings />; break;
      default: component = (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-white text-2xl font-bold">🚀</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Coming Soon!</h2>
            <p className="text-gray-600 dark:text-gray-400">This feature is under development.</p>
          </div>
        </div>
      );
    }

    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={key}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
        >
          {component}
        </motion.div>
      </AnimatePresence>
    );
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-950 text-gray-900 dark:text-gray-100 font-sans">
      <Sidebar 
        currentView={currentView} 
        setView={setCurrentView} 
        isCollapsed={isSidebarCollapsed}
        setCollapsed={setIsSidebarCollapsed}
      />
      <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-500 ${isSidebarCollapsed ? 'ml-20' : 'ml-72'}`}>
        <Header currentView={currentView} onToggleSidebar={() => setIsSidebarCollapsed(p => !p)} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
          {renderContent()}
        </main>
      </div>
      <GeminiHelper />
    </div>
  );
};

export default App;