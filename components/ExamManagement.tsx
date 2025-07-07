import React, { useState, useMemo } from 'react';
import { Exam, ExamResult, Student, Course } from '../types';
import Modal from './Modal';
import Card from './ui/Card';
import { 
  Plus, 
  Calendar, 
  Clock, 
  FileText, 
  Users, 
  TrendingUp,
  Download,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';

interface ExamManagementProps {
  students?: Student[];
  courses?: Course[];
  exams?: Exam[];
  examResults?: ExamResult[];
  onAddExam?: (exam: Omit<Exam, 'id'>) => void;
  onUpdateExam?: (exam: Exam) => void;
  onDeleteExam?: (examId: string) => void;
  onAddResult?: (result: Omit<ExamResult, 'id'>) => void;
}

const mockExams: Exam[] = [
  {
    id: 'e1',
    name: 'Term 1 Mathematics Exam',
    subject: 'Mathematics',
    gradeLevel: 1,
    date: '2025-03-15',
    duration: 120,
    totalMarks: 100,
    passingMarks: 50,
    venue: 'Main Hall',
    instructions: 'Calculators are not allowed. Show all working clearly.'
  },
  {
    id: 'e2',
    name: 'English Literature Assessment',
    subject: 'English',
    gradeLevel: 2,
    date: '2025-03-18',
    duration: 180,
    totalMarks: 100,
    passingMarks: 50,
    venue: 'Library',
    instructions: 'Reference materials allowed. Write clearly.'
  },
  {
    id: 'e3',
    name: 'Physics Practical Exam',
    subject: 'Physics',
    gradeLevel: 4,
    date: '2025-03-20',
    duration: 150,
    totalMarks: 80,
    passingMarks: 40,
    venue: 'Physics Lab',
    instructions: 'Safety equipment mandatory. Follow lab protocols.'
  }
];

const mockExamResults: ExamResult[] = [
  { id: 'r1', examId: 'e1', studentId: 's1', marksObtained: 85, grade: 'A', remarks: 'Excellent performance' },
  { id: 'r2', examId: 'e1', studentId: 's2', marksObtained: 62, grade: 'B', remarks: 'Good work' },
  { id: 'r3', examId: 'e1', studentId: 's3', marksObtained: 45, grade: 'D', remarks: 'Needs improvement' },
  { id: 'r4', examId: 'e2', studentId: 's1', marksObtained: 78, grade: 'B+', remarks: 'Very good' },
  { id: 'r5', examId: 'e2', studentId: 's2', marksObtained: 91, grade: 'A', remarks: 'Outstanding' }
];

const emptyExam: Omit<Exam, 'id'> = {
  name: '',
  subject: '',
  gradeLevel: 1,
  date: new Date().toISOString().split('T')[0],
  duration: 120,
  totalMarks: 100,
  passingMarks: 50,
  venue: '',
  instructions: ''
};

const gradeCalculation = (marks: number, totalMarks: number): string => {
  const percentage = (marks / totalMarks) * 100;
  if (percentage >= 90) return 'A';
  if (percentage >= 80) return 'B+';
  if (percentage >= 70) return 'B';
  if (percentage >= 60) return 'C+';
  if (percentage >= 50) return 'C';
  if (percentage >= 40) return 'D';
  return 'F';
};

const ExamManagement: React.FC<ExamManagementProps> = ({
  students = [],
  courses = [],
  exams = mockExams,
  examResults = mockExamResults,
  onAddExam,
  onUpdateExam,
  onDeleteExam,
  onAddResult
}) => {
  const [isExamModalOpen, setIsExamModalOpen] = useState(false);
  const [isResultModalOpen, setIsResultModalOpen] = useState(false);
  const [editingExam, setEditingExam] = useState<Exam | Omit<Exam, 'id'>>(emptyExam);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedExam, setSelectedExam] = useState<string>('');
  const [viewMode, setViewMode] = useState<'exams' | 'results'>('exams');

  const examStats = useMemo(() => {
    const totalExams = exams.length;
    const upcomingExams = exams.filter(exam => new Date(exam.date) > new Date()).length;
    const completedExams = exams.filter(exam => new Date(exam.date) <= new Date()).length;
    const totalStudentResults = examResults.length;
    
    return { totalExams, upcomingExams, completedExams, totalStudentResults };
  }, [exams, examResults]);

  const examResultsWithDetails = useMemo(() => {
    return examResults.map(result => {
      const exam = exams.find(e => e.id === result.examId);
      const student = students.find(s => s.id === result.studentId);
      return {
        ...result,
        examName: exam?.name || 'Unknown Exam',
        studentName: student ? `${student.firstName} ${student.lastName}` : 'Unknown Student',
        percentage: exam ? ((result.marksObtained / exam.totalMarks) * 100).toFixed(1) : '0'
      };
    });
  }, [examResults, exams, students]);

  const openAddExamModal = () => {
    setEditingExam(emptyExam);
    setIsEditMode(false);
    setIsExamModalOpen(true);
  };

  const openEditExamModal = (exam: Exam) => {
    setEditingExam(exam);
    setIsEditMode(true);
    setIsExamModalOpen(true);
  };

  const openResultModal = () => {
    setIsResultModalOpen(true);
  };

  const closeModals = () => {
    setIsExamModalOpen(false);
    setIsResultModalOpen(false);
  };

  const handleExamChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const numericFields = ['gradeLevel', 'duration', 'totalMarks', 'passingMarks'];
    setEditingExam(prev => ({
      ...prev,
      [name]: numericFields.includes(name) ? parseInt(value) || 0 : value
    }));
  };

  const handleExamSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditMode && onUpdateExam) {
      onUpdateExam(editingExam as Exam);
    } else if (onAddExam) {
      onAddExam(editingExam as Omit<Exam, 'id'>);
    }
    closeModals();
  };

  const subjects = ['Mathematics', 'English', 'Physics', 'Chemistry', 'Biology', 'History', 'Geography', 'Computer Science'];
  const venues = ['Main Hall', 'Library', 'Physics Lab', 'Chemistry Lab', 'Computer Lab', 'Classroom A', 'Classroom B', 'Assembly Hall'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Examination Management</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage exams, schedules, and results</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setViewMode(viewMode === 'exams' ? 'results' : 'exams')}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200"
          >
            {viewMode === 'exams' ? 'View Results' : 'View Exams'}
          </button>
          {viewMode === 'results' ? (
            <button 
              onClick={openResultModal}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Result
            </button>
          ) : (
            <button 
              onClick={openAddExamModal}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Schedule Exam
            </button>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Exams</p>
              <p className="text-2xl font-bold text-blue-600">{examStats.totalExams}</p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-full">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Upcoming</p>
              <p className="text-2xl font-bold text-orange-600">{examStats.upcomingExams}</p>
            </div>
            <div className="p-3 bg-orange-100 dark:bg-orange-900/20 rounded-full">
              <Calendar className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Completed</p>
              <p className="text-2xl font-bold text-green-600">{examStats.completedExams}</p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-full">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Results Recorded</p>
              <p className="text-2xl font-bold text-purple-600">{examStats.totalStudentResults}</p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-full">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Content based on view mode */}
      {viewMode === 'exams' ? (
        /* Exams List */
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Scheduled Exams</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700/50 dark:text-gray-400">
                <tr>
                  <th className="px-6 py-3">Exam Name</th>
                  <th className="px-6 py-3">Subject</th>
                  <th className="px-6 py-3">Grade</th>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Duration</th>
                  <th className="px-6 py-3">Venue</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {exams.map(exam => {
                  const isUpcoming = new Date(exam.date) > new Date();
                  return (
                    <tr key={exam.id} className="bg-white dark:bg-gray-800/50 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{exam.name}</td>
                      <td className="px-6 py-4">{exam.subject}</td>
                      <td className="px-6 py-4">S{exam.gradeLevel}</td>
                      <td className="px-6 py-4">{new Date(exam.date).toLocaleDateString()}</td>
                      <td className="px-6 py-4">{exam.duration} min</td>
                      <td className="px-6 py-4">{exam.venue}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          isUpcoming 
                            ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400'
                            : 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                        }`}>
                          {isUpcoming ? 'Upcoming' : 'Completed'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => openEditExamModal(exam)}
                          className="p-2 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 mr-2"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => onDeleteExam && onDeleteExam(exam.id)}
                          className="p-2 text-gray-500 hover:text-red-600 dark:hover:text-red-400 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      ) : (
        /* Results List */
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Exam Results</h3>
            <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <Download className="w-4 h-4 mr-2" />
              Export Results
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700/50 dark:text-gray-400">
                <tr>
                  <th className="px-6 py-3">Student</th>
                  <th className="px-6 py-3">Exam</th>
                  <th className="px-6 py-3">Marks</th>
                  <th className="px-6 py-3">Percentage</th>
                  <th className="px-6 py-3">Grade</th>
                  <th className="px-6 py-3">Remarks</th>
                </tr>
              </thead>
              <tbody>
                {examResultsWithDetails.map(result => (
                  <tr key={result.id} className="bg-white dark:bg-gray-800/50 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{result.studentName}</td>
                    <td className="px-6 py-4">{result.examName}</td>
                    <td className="px-6 py-4">{result.marksObtained}</td>
                    <td className="px-6 py-4">{result.percentage}%</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        result.grade === 'A' || result.grade === 'B+' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                          : result.grade === 'B' || result.grade === 'C+'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                          : result.grade === 'C' || result.grade === 'D'
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                          : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                      }`}>
                        {result.grade}
                      </span>
                    </td>
                    <td className="px-6 py-4">{result.remarks}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Add/Edit Exam Modal */}
      <Modal isOpen={isExamModalOpen} onClose={closeModals} title={isEditMode ? 'Edit Exam' : 'Schedule New Exam'}>
        <form onSubmit={handleExamSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Exam Name</label>
            <input
              type="text"
              name="name"
              value={editingExam.name}
              onChange={handleExamChange}
              className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md"
              required
              placeholder="e.g. Term 1 Mathematics Exam"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Subject</label>
              <select
                name="subject"
                value={editingExam.subject}
                onChange={handleExamChange}
                className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md"
                required
              >
                <option value="">Select Subject</option>
                {subjects.map(subject => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Grade Level</label>
              <select
                name="gradeLevel"
                value={editingExam.gradeLevel}
                onChange={handleExamChange}
                className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md"
                required
              >
                {[1, 2, 3, 4, 5, 6].map(grade => (
                  <option key={grade} value={grade}>S{grade}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Date</label>
              <input
                type="date"
                name="date"
                value={editingExam.date}
                onChange={handleExamChange}
                className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Duration (minutes)</label>
              <input
                type="number"
                name="duration"
                value={editingExam.duration}
                onChange={handleExamChange}
                min="30"
                max="300"
                className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Total Marks</label>
              <input
                type="number"
                name="totalMarks"
                value={editingExam.totalMarks}
                onChange={handleExamChange}
                min="1"
                className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Passing Marks</label>
              <input
                type="number"
                name="passingMarks"
                value={editingExam.passingMarks}
                onChange={handleExamChange}
                min="1"
                max={editingExam.totalMarks}
                className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Venue</label>
            <select
              name="venue"
              value={editingExam.venue}
              onChange={handleExamChange}
              className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md"
              required
            >
              <option value="">Select Venue</option>
              {venues.map(venue => (
                <option key={venue} value={venue}>{venue}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Instructions</label>
            <textarea
              name="instructions"
              value={editingExam.instructions}
              onChange={handleExamChange}
              rows={3}
              className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md"
              placeholder="Special instructions for students..."
            />
          </div>

          <div className="flex justify-end pt-4 space-x-2">
            <button
              type="button"
              onClick={closeModals}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {isEditMode ? 'Update Exam' : 'Schedule Exam'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ExamManagement;
