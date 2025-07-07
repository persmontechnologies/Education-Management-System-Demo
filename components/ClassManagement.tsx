import React, { useState, useMemo } from 'react';
import { Course, Teacher, Student } from '../types';
import Modal from './Modal';
import Card from './ui/Card';
import { Plus, Edit, Trash2 } from 'lucide-react';

interface ClassManagementProps {
  courses: Course[];
  teachers: Teacher[];
  students: Student[];
  onAdd: (course: Omit<Course, 'id'>) => void;
  onUpdate: (course: Course) => void;
  onDelete: (courseId: string) => void;
}

const emptyCourse: Omit<Course, 'id'> = {
  name: '',
  teacherId: null,
  studentIds: [],
  gradeLevel: 0,
};

const ClassManagement: React.FC<ClassManagementProps> = ({ courses, teachers, students, onAdd, onUpdate, onDelete }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | Omit<Course, 'id'>>(emptyCourse);
  const [isEditMode, setIsEditMode] = useState(false);

  const openAddModal = () => {
    setEditingCourse(emptyCourse);
    setIsEditMode(false);
    setIsModalOpen(true);
  };

  const openEditModal = (course: Course) => {
    setEditingCourse(course);
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const isNumber = name === 'gradeLevel';
    const parsedValue = isNumber ? parseInt(value) || 0 : value;
    
    setEditingCourse(prev => {
      const updatedCourse = { ...prev, [name]: parsedValue };
      // if grade level changes, reset studentIds
      if(name === 'gradeLevel') {
        updatedCourse.studentIds = [];
      }
      return updatedCourse;
    });
  };

  const handleStudentSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedIds = Array.from(e.target.selectedOptions, option => option.value);
    setEditingCourse(prev => ({...prev, studentIds: selectedIds}));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditMode) {
      onUpdate(editingCourse as Course);
    } else {
      onAdd(editingCourse as Omit<Course, 'id'>);
    }
    closeModal();
  };
  
  const getTeacherName = (teacherId: string | null) => {
    if (!teacherId) return <span className="text-gray-400 italic">Unassigned</span>;
    const teacher = teachers.find(t => t.id === teacherId);
    return teacher ? `${teacher.firstName} ${teacher.lastName}` : 'Unknown';
  };

  const studentsForGrade = useMemo(() => {
    if(!editingCourse.gradeLevel) return [];
    return students.filter(s => s.grade === editingCourse.gradeLevel)
  }, [students, editingCourse.gradeLevel]);

  return (
    <Card>
      <div className="p-4 flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">Class Schedule</h2>
        <button onClick={openAddModal} className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 shadow-md transition-transform hover:scale-105">
          <Plus className="w-5 h-5 mr-2" />
          Add Class
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700/50 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">Class Name</th>
              <th scope="col" className="px-6 py-3">Teacher</th>
              <th scope="col" className="px-6 py-3">Grade</th>
              <th scope="col" className="px-6 py-3">Enrolled</th>
              <th scope="col" className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.map(course => (
              <tr key={course.id} className="bg-white dark:bg-gray-800/50 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{course.name}</td>
                <td className="px-6 py-4">{getTeacherName(course.teacherId)}</td>
                <td className="px-6 py-4">{course.gradeLevel}</td>
                <td className="px-6 py-4">{course.studentIds.length}</td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => openEditModal(course)} className="p-2 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 mr-2"><Edit className="w-4 h-4" /></button>
                  <button onClick={() => onDelete(course.id)} className="p-2 text-gray-500 hover:text-red-600 dark:hover:text-red-400 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"><Trash2 className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal} title={isEditMode ? 'Edit Class' : 'Add Class'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Class Name</label>
            <input type="text" name="name" value={editingCourse.name} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm" required />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Grade Level</label>
              <input type="number" name="gradeLevel" value={editingCourse.gradeLevel || ''} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Assign Teacher</label>
              <select name="teacherId" value={editingCourse.teacherId || ''} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm">
                <option value="">Unassigned</option>
                {teachers.map(t => <option key={t.id} value={t.id}>{t.firstName} {t.lastName}</option>)}
              </select>
            </div>
          </div>
           <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Enroll Students</label>
            <select multiple name="studentIds" value={editingCourse.studentIds} onChange={handleStudentSelect} className="mt-1 block w-full h-40 px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm" disabled={!editingCourse.gradeLevel}>
              {studentsForGrade.map(s => <option key={s.id} value={s.id}>{s.firstName} {s.lastName}</option>)}
            </select>
             <p className="text-xs text-gray-500 mt-1">
              {editingCourse.gradeLevel ? `Showing students for grade ${editingCourse.gradeLevel}. Hold Ctrl/Cmd to select multiple.` : 'Please select a grade level to see available students.'}
            </p>
          </div>
          <div className="flex justify-end pt-4 space-x-2">
            <button type="button" onClick={closeModal} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">{isEditMode ? 'Save Changes' : 'Add Class'}</button>
          </div>
        </form>
      </Modal>
    </Card>
  );
};

export default ClassManagement;