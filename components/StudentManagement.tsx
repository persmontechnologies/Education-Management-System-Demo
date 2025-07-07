import React, { useState } from 'react';
import { Student } from '../types';
import StudentModal from './modals/StudentModal';
import { ConfirmationModal } from './Modal';
import { Plus, Edit, Trash2, User, Phone, MapPin, Heart, DollarSign, Search, Filter, Grid, List } from 'lucide-react';

interface StudentManagementProps {
  students: Student[];
  onAdd: (student: Omit<Student, 'id' | 'avatarUrl'>) => void;
  onUpdate: (student: Student) => void;
  onDelete: (studentId: string) => void;
}

const StudentManagement: React.FC<StudentManagementProps> = ({ students, onAdd, onUpdate, onDelete }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [searchTerm, setSearchTerm] = useState('');
  const [gradeFilter, setGradeFilter] = useState<number | null>(null);

  const openAddModal = () => {
    setEditingStudent(null);
    setIsModalOpen(true);
  };
  
  const openEditModal = (student: Student) => {
    setEditingStudent(student);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingStudent(null);
  };

  const openDeleteModal = (student: Student) => {
    setStudentToDelete(student);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setStudentToDelete(null);
  };

  const handleDelete = () => {
    if (studentToDelete) {
      onDelete(studentToDelete.id);
      closeDeleteModal();
    }
  };

  const handleStudentSubmit = (studentData: Omit<Student, 'id' | 'avatarUrl'>) => {
    if (editingStudent) {
      onUpdate({ ...studentData, id: editingStudent.id, avatarUrl: editingStudent.avatarUrl });
    } else {
      onAdd(studentData);
    }
    closeModal();
  };

  // Filter students based on search and grade
  const filteredStudents = students.filter(student => {
    const matchesSearch = `${student.firstName} ${student.lastName}`.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGrade = gradeFilter === null || student.grade === gradeFilter;
    return matchesSearch && matchesGrade;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-UG', {
      style: 'currency',
      currency: 'UGX',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Student Management</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Manage all students in the school system
            </p>
          </div>
          <button
            onClick={openAddModal}
            className="mt-4 sm:mt-0 flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Student
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <select
            value={gradeFilter || ''}
            onChange={(e) => setGradeFilter(e.target.value ? parseInt(e.target.value) : null)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Grades</option>
            <option value="1">S1</option>
            <option value="2">S2</option>
            <option value="3">S3</option>
            <option value="4">S4</option>
            <option value="5">S5</option>
            <option value="6">S6</option>
          </select>
          <div className="flex border border-gray-300 dark:border-gray-600 rounded-lg">
            <button
              onClick={() => setViewMode('cards')}
              className={`p-2 ${viewMode === 'cards' ? 'bg-blue-600 text-white' : 'text-gray-600 dark:text-gray-400'} rounded-l-lg transition-colors`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 ${viewMode === 'table' ? 'bg-blue-600 text-white' : 'text-gray-600 dark:text-gray-400'} rounded-r-lg transition-colors`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">Total Students</p>
              <p className="text-3xl font-bold">{students.length}</p>
            </div>
            <User className="w-8 h-8 text-blue-200" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100">Male Students</p>
              <p className="text-3xl font-bold">{students.filter(s => s.gender === 'male').length}</p>
            </div>
            <User className="w-8 h-8 text-green-200" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-pink-500 to-pink-600 p-6 rounded-xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-pink-100">Female Students</p>
              <p className="text-3xl font-bold">{students.filter(s => s.gender === 'female').length}</p>
            </div>
            <User className="w-8 h-8 text-pink-200" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100">Grade Range</p>
              <p className="text-3xl font-bold">S1 - S6</p>
            </div>
            <Filter className="w-8 h-8 text-purple-200" />
          </div>
        </div>
      </div>

      {/* Students Display */}
      {viewMode === 'cards' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStudents.map(student => (
            <div key={student.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-200 dark:border-gray-700">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <img
                      src={student.avatarUrl}
                      alt={`${student.firstName} ${student.lastName}`}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="ml-3">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {student.firstName} {student.lastName}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Grade S{student.grade}</p>
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    <button
                      onClick={() => openEditModal(student)}
                      className="p-2 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                      title="Edit student"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => openDeleteModal(student)}
                      className="p-2 text-gray-500 hover:text-red-600 dark:hover:text-red-400 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                      title="Delete student"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <Phone className="w-4 h-4 mr-2" />
                    <span>{student.parentPhone}</span>
                  </div>
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span className="truncate">{student.address}</span>
                  </div>
                  {student.bloodGroup && (
                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                      <Heart className="w-4 h-4 mr-2" />
                      <span>Blood Group: {student.bloodGroup}</span>
                    </div>
                  )}
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <DollarSign className="w-4 h-4 mr-2" />
                    <span>Balance: {formatCurrency(student.schoolFees.balance)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Grade
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Parent
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Fees Balance
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredStudents.map(student => (
                  <tr key={student.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img
                          src={student.avatarUrl}
                          alt={`${student.firstName} ${student.lastName}`}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {student.firstName} {student.lastName}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {student.gender === 'male' ? 'Male' : 'Female'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      S{student.grade}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      <div>{student.parentName}</div>
                      <div className="text-gray-500 dark:text-gray-400">{student.parentPhone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`${student.schoolFees.balance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {formatCurrency(student.schoolFees.balance)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => openEditModal(student)}
                          className="p-2 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                          title="Edit student"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openDeleteModal(student)}
                          className="p-2 text-gray-500 hover:text-red-600 dark:hover:text-red-400 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                          title="Delete student"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredStudents.length === 0 && (
        <div className="text-center py-12">
          <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No students found</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {searchTerm || gradeFilter ? 'Try adjusting your filters' : 'Get started by adding your first student'}
          </p>
          <button
            onClick={openAddModal}
            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Student
          </button>
        </div>
      )}

      {/* Student Modal */}
      <StudentModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={handleStudentSubmit}
        student={editingStudent ?? undefined}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={handleDelete}
        title="Delete Student"
        message={`Are you sure you want to delete ${studentToDelete?.firstName} ${studentToDelete?.lastName}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />
    </div>
  );
};

export default StudentManagement;