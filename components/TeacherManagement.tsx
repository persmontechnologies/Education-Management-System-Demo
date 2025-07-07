import React, { useState } from 'react';
import { Teacher } from '../types';
import Card from './ui/Card';
import TeacherModal from './modals/TeacherModal';
import Modal from './Modal';
import { Plus, Edit, Trash2, User, Mail, Phone, Calendar, GraduationCap, MapPin, AlertTriangle } from 'lucide-react';

interface TeacherManagementProps {
  teachers: Teacher[];
  onAdd: (teacher: Omit<Teacher, 'id' | 'avatarUrl'>) => void;
  onUpdate: (teacher: Teacher) => void;
  onDelete: (teacherId: string) => void;
}

const TeacherManagement: React.FC<TeacherManagementProps> = ({ teachers, onAdd, onUpdate, onDelete }) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [loading, setLoading] = useState(false);

  const handleAddTeacher = async (teacherData: Omit<Teacher, 'id' | 'avatarUrl'>) => {
    setLoading(true);
    try {
      onAdd(teacherData);
      setIsAddModalOpen(false);
    } finally {
      setLoading(false);
    }
  };

  const handleEditTeacher = async (teacherData: Omit<Teacher, 'id' | 'avatarUrl'>) => {
    if (!selectedTeacher) return;
    
    setLoading(true);
    try {
      onUpdate({ ...teacherData, id: selectedTeacher.id, avatarUrl: selectedTeacher.avatarUrl });
      setIsEditModalOpen(false);
      setSelectedTeacher(null);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTeacher = () => {
    if (!selectedTeacher) return;
    
    onDelete(selectedTeacher.id);
    setIsDeleteModalOpen(false);
    setSelectedTeacher(null);
  };

  const openEditModal = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setIsDeleteModalOpen(true);
  };

  const formatSalary = (amount: number) => `UGX ${amount.toLocaleString()}`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Teaching Staff Directory</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage teacher profiles and information</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setViewMode(viewMode === 'cards' ? 'table' : 'cards')}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200"
          >
            {viewMode === 'cards' ? 'Table View' : 'Card View'}
          </button>
          <button 
            onClick={() => setIsAddModalOpen(true)} 
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 shadow-md transition-transform hover:scale-105"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Teacher
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center">
            <User className="w-8 h-8 text-blue-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Teachers</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{teachers.length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center">
            <User className="w-8 h-8 text-pink-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Female Teachers</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {teachers.filter(t => t.gender === 'female').length}
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center">
            <User className="w-8 h-8 text-blue-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Male Teachers</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {teachers.filter(t => t.gender === 'male').length}
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center">
            <GraduationCap className="w-8 h-8 text-green-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Avg Experience</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {teachers.length > 0 ? Math.round(teachers.reduce((sum, t) => sum + (t.experience ?? 0), 0) / teachers.length) : 0} years
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Teachers Display */}
      {viewMode === 'cards' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teachers.map(teacher => (
            <Card key={teacher.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <img className="h-16 w-16 rounded-full mr-4 ring-2 ring-gray-200 dark:ring-gray-700" src={teacher.avatarUrl} alt={`${teacher.firstName} ${teacher.lastName}`} />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{teacher.firstName} {teacher.lastName}</h3>
                  <p className="text-blue-600 dark:text-blue-400 font-medium">{teacher.subject}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{teacher.qualification}</p>
                </div>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <Mail className="w-4 h-4 mr-2" />
                  <span className="truncate">{teacher.email}</span>
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <Phone className="w-4 h-4 mr-2" />
                  <span>{teacher.phone}</span>
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>{teacher.experience ?? 0} years experience</span>
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span className="truncate">{teacher.address ?? 'Not specified'}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <span className="text-sm font-medium text-green-600">
                  {teacher.salary ? formatSalary(teacher.salary) : 'Salary not set'}
                </span>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => openEditModal(teacher)} 
                    className="p-2 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                    title="Edit teacher"
                    aria-label={`Edit teacher ${teacher.firstName} ${teacher.lastName}`}
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => openDeleteModal(teacher)} 
                    className="p-2 text-gray-500 hover:text-red-600 dark:hover:text-red-400 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                    title="Delete teacher"
                    aria-label={`Delete teacher ${teacher.firstName} ${teacher.lastName}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700/50 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3">Teacher</th>
                  <th scope="col" className="px-6 py-3">Subject</th>
                  <th scope="col" className="px-6 py-3">Qualification</th>
                  <th scope="col" className="px-6 py-3">Experience</th>
                  <th scope="col" className="px-6 py-3">Salary</th>
                  <th scope="col" className="px-6 py-3">Contact</th>
                  <th scope="col" className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {teachers.map(teacher => (
                  <tr key={teacher.id} className="bg-white dark:bg-gray-800/50 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                      <div className="flex items-center">
                        <img className="h-10 w-10 rounded-full mr-4" src={teacher.avatarUrl} alt={`${teacher.firstName} ${teacher.lastName}`} />
                        <div>
                          <div className="font-semibold">{teacher.firstName} {teacher.lastName}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">ID: {teacher.nationalId ?? 'Not provided'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">{teacher.subject}</td>
                    <td className="px-6 py-4">{teacher.qualification}</td>
                    <td className="px-6 py-4">{teacher.experience ?? 0} years</td>
                    <td className="px-6 py-4 font-medium text-green-600">
                      {teacher.salary ? formatSalary(teacher.salary) : 'Not set'}
                    </td>
                    <td className="px-6 py-4">
                      <div>{teacher.email}</div>
                      <div className="text-xs text-gray-500">{teacher.phone}</div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => openEditModal(teacher)} 
                        className="p-2 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 mr-2"
                        title="Edit teacher"
                        aria-label={`Edit teacher ${teacher.firstName} ${teacher.lastName}`}
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => openDeleteModal(teacher)} 
                        className="p-2 text-gray-500 hover:text-red-600 dark:hover:text-red-400 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                        title="Delete teacher"
                        aria-label={`Delete teacher ${teacher.firstName} ${teacher.lastName}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
      
      {/* Add Teacher Modal */}
      <TeacherModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddTeacher}
        loading={loading}
      />

      {/* Edit Teacher Modal */}
      <TeacherModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedTeacher(null);
        }}
        onSubmit={handleEditTeacher}
        teacher={selectedTeacher ?? undefined}
        loading={loading}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedTeacher(null);
        }}
        title="Delete Teacher"
        variant="danger"
      >
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Delete Teacher
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                This action cannot be undone.
              </p>
            </div>
          </div>
          
          {selectedTeacher && (
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <img 
                  className="h-12 w-12 rounded-full" 
                  src={selectedTeacher.avatarUrl} 
                  alt={`${selectedTeacher.firstName} ${selectedTeacher.lastName}`} 
                />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {selectedTeacher.firstName} {selectedTeacher.lastName}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {selectedTeacher.subject} Teacher
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Are you sure you want to delete this teacher? This will permanently remove their profile 
            and all associated data from the system.
          </p>
          
          <div className="flex justify-end space-x-3 pt-4">
            <button
              onClick={() => {
                setIsDeleteModalOpen(false);
                setSelectedTeacher(null);
              }}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteTeacher}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Delete Teacher
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default TeacherManagement;