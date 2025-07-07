import React, { useState, useMemo } from 'react';
import { Course, Student, AttendanceRecord, AttendanceStatus } from '../types';
import Card from './ui/Card';
import { formatYYYYMMDD } from '../lib/dateUtils';

interface AttendanceProps {
  attendance: AttendanceRecord[];
  courses: Course[];
  students: Student[];
  onUpdate: (record: AttendanceRecord) => void;
}

const Attendance: React.FC<AttendanceProps> = ({ attendance, courses, students, onUpdate }) => {
  const [selectedCourseId, setSelectedCourseId] = useState<string>(courses[0]?.id || '');
  const [selectedDate, setSelectedDate] = useState<string>(formatYYYYMMDD(new Date()));

  const studentsInClass = useMemo(() => {
    const course = courses.find(c => c.id === selectedCourseId);
    if (!course) return [];
    return course.studentIds.map(studentId => students.find(s => s.id === studentId)).filter(Boolean) as Student[];
  }, [selectedCourseId, courses, students]);

  const getStatusForStudent = (studentId: string): AttendanceStatus => {
    const record = attendance.find(a => a.studentId === studentId && a.date === selectedDate);
    return record ? record.status : 'present';
  };

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    onUpdate({ studentId, date: selectedDate, status });
  };

  const statusColors: { [key in AttendanceStatus]: string } = {
    present: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
    absent: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
    late: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
  };

  return (
    <div>
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Attendance Tracking</h1>
        </div>

        <Card>
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4 border-b border-gray-200 dark:border-gray-700">
                <div>
                    <label htmlFor="course-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Select Class</label>
                    <select
                        id="course-select"
                        value={selectedCourseId}
                        onChange={e => setSelectedCourseId(e.target.value)}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    >
                        {courses.map(course => (
                            <option key={course.id} value={course.id}>{course.name}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="date-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Select Date</label>
                    <input
                        type="date"
                        id="date-select"
                        value={selectedDate}
                        onChange={e => setSelectedDate(e.target.value)}
                        className="mt-1 block w-full pl-3 pr-4 py-2 text-base border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    />
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700/50 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">Student</th>
                            <th scope="col" className="px-6 py-3 text-center">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {studentsInClass.map(student => (
                            <tr key={student.id} className="bg-white dark:bg-gray-800/50 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                                    <div className="flex items-center">
                                        <img className="h-10 w-10 rounded-full mr-4" src={student.avatarUrl} alt={student.firstName} />
                                        <div>
                                            <div className="font-semibold">{student.firstName} {student.lastName}</div>
                                            <div className="text-xs text-gray-500">Grade {student.grade}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex justify-center space-x-2">
                                        {(['present', 'absent', 'late'] as AttendanceStatus[]).map(status => (
                                            <button
                                                key={status}
                                                onClick={() => handleStatusChange(student.id, status)}
                                                className={`px-3 py-1 text-xs font-semibold rounded-full capitalize transition-all duration-200 ${
                                                    getStatusForStudent(student.id) === status
                                                        ? `${statusColors[status]} ring-2 ring-offset-2 ring-offset-white dark:ring-offset-gray-800 ring-blue-500`
                                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                                                }`}
                                            >
                                                {status}
                                            </button>
                                        ))}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                 {studentsInClass.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        <p>No students in this class.</p>
                        <p className="text-sm">Select a different class or enroll students.</p>
                    </div>
                )}
            </div>
        </Card>
    </div>
  );
};

export default Attendance;