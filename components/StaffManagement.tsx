import React, { useState } from 'react';
import { Staff } from '../types';
import Card from './ui/Card';
import Modal from './Modal';
import FormBuilder from './ui/FormBuilder';
import { 
  Plus, Edit, Trash2, Users, Mail, Phone, Calendar, 
  AlertTriangle, Badge, Clock, UserCog 
} from 'lucide-react';

interface StaffManagementProps {
  staff: Staff[];
  onAdd: (staff: Omit<Staff, 'id' | 'avatarUrl'>) => void;
  onUpdate: (staff: Staff) => void;
  onDelete: (staffId: string) => void;
}

const StaffManagement: React.FC<StaffManagementProps> = ({ staff, onAdd, onUpdate, onDelete }) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [departmentFilter, setDepartmentFilter] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleAddStaff = async (data: Record<string, any>) => {
    setLoading(true);
    try {
      onAdd(data as Omit<Staff, 'id' | 'avatarUrl'>);
      setIsAddModalOpen(false);
    } finally {
      setLoading(false);
    }
  };

  const handleEditStaff = async (data: Record<string, any>) => {
    if (!selectedStaff) return;
    
    setLoading(true);
    try {
      onUpdate({ ...data, id: selectedStaff.id, avatarUrl: selectedStaff.avatarUrl } as Staff);
      setIsEditModalOpen(false);
      setSelectedStaff(null);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteStaff = () => {
    if (!selectedStaff) return;
    onDelete(selectedStaff.id);
    setIsDeleteModalOpen(false);
    setSelectedStaff(null);
  };

  const openEditModal = (staff: Staff) => {
    setSelectedStaff(staff);
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (staff: Staff) => {
    setSelectedStaff(staff);
    setIsDeleteModalOpen(true);
  };

  const formatSalary = (amount: number) => `UGX ${amount.toLocaleString()}`;

  const filteredStaff = staff.filter(s => 
    !departmentFilter || s.department === departmentFilter
  );

  const getDepartmentStats = () => {
    const stats = staff.reduce((acc, s) => {
      acc[s.department] = (acc[s.department] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    return stats;
  };

  const departments = ['Kitchen', 'Security', 'Library', 'Maintenance', 'Administration', 'Cleaning', 'Transport', 'Health'];
  const departmentStats = getDepartmentStats();

  const staffFormFields = [
    {
      name: 'firstName',
      type: 'text' as const,
      label: 'First Name',
      placeholder: 'Enter first name',
      required: true
    },
    {
      name: 'lastName',
      type: 'text' as const,
      label: 'Last Name',
      placeholder: 'Enter last name',
      required: true
    },
    {
      name: 'department',
      type: 'select' as const,
      label: 'Department',
      required: true,
      options: departments.map(dept => ({ value: dept, label: dept }))
    },
    {
      name: 'position',
      type: 'text' as const,
      label: 'Position/Job Title',
      placeholder: 'e.g. Head Cook, Security Guard',
      required: true
    },
    {
      name: 'email',
      type: 'email' as const,
      label: 'Email Address',
      placeholder: 'staff@school.edu.ug',
      required: true
    },
    {
      name: 'phone',
      type: 'text' as const,
      label: 'Phone Number',
      placeholder: '+256 700 123 456',
      required: true
    },
    {
      name: 'gender',
      type: 'select' as const,
      label: 'Gender',
      required: true,
      options: [
        { value: 'male', label: 'Male' },
        { value: 'female', label: 'Female' }
      ]
    },
    {
      name: 'dateOfBirth',
      type: 'date' as const,
      label: 'Date of Birth',
      required: true
    },
    {
      name: 'hireDate',
      type: 'date' as const,
      label: 'Date of Hiring',
      required: true
    },
    {
      name: 'employmentType',
      type: 'select' as const,
      label: 'Employment Type',
      required: true,
      options: [
        { value: 'Full-time', label: 'Full-time' },
        { value: 'Part-time', label: 'Part-time' },
        { value: 'Contract', label: 'Contract' }
      ]
    },
    {
      name: 'shift',
      type: 'select' as const,
      label: 'Work Shift',
      options: [
        { value: 'Day', label: 'Day Shift' },
        { value: 'Night', label: 'Night Shift' },
        { value: 'Both', label: 'Both Shifts' }
      ]
    },
    {
      name: 'salary',
      type: 'number' as const,
      label: 'Monthly Salary (UGX)',
      placeholder: 'e.g. 800000',
      required: true
    },
    {
      name: 'address',
      type: 'textarea' as const,
      label: 'Home Address',
      placeholder: 'Enter complete address'
    },
    {
      name: 'nationalId',
      type: 'text' as const,
      label: 'National ID',
      placeholder: 'e.g. CM90001234567PE'
    },
    {
      name: 'emergencyContact',
      type: 'text' as const,
      label: 'Emergency Contact',
      placeholder: '+256 700 123 456'
    },
    {
      name: 'supervisor',
      type: 'text' as const,
      label: 'Supervisor',
      placeholder: 'Name of immediate supervisor'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Support Staff Management</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage non-teaching staff members</p>
        </div>
        <div className="flex space-x-2">
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Filter by department"
          >
            <option value="">All Departments</option>
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
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
            Add Staff Member
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center">
            <Users className="w-8 h-8 text-blue-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Staff</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{staff.length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center">
            <UserCog className="w-8 h-8 text-green-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Full-time</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {staff.filter(s => s.employmentType === 'Full-time').length}
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center">
            <Clock className="w-8 h-8 text-orange-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Part-time</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {staff.filter(s => s.employmentType === 'Part-time').length}
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center">
            <Badge className="w-8 h-8 text-purple-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Departments</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {Object.keys(departmentStats).length}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Department Statistics */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Staff by Department</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {departments.map(dept => (
            <div key={dept} className="text-center">
              <div className="text-2xl font-bold text-blue-600">{departmentStats[dept] || 0}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">{dept}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* Staff Display */}
      {viewMode === 'cards' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStaff.map(staffMember => (
            <Card key={staffMember.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <img 
                  className="h-16 w-16 rounded-full mr-4 ring-2 ring-gray-200 dark:ring-gray-700" 
                  src={staffMember.avatarUrl} 
                  alt={`${staffMember.firstName} ${staffMember.lastName}`} 
                />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {staffMember.firstName} {staffMember.lastName}
                  </h3>
                  <p className="text-blue-600 dark:text-blue-400 font-medium">{staffMember.position}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{staffMember.department}</p>
                </div>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <Mail className="w-4 h-4 mr-2" />
                  <span className="truncate">{staffMember.email}</span>
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <Phone className="w-4 h-4 mr-2" />
                  <span>{staffMember.phone}</span>
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>{staffMember.employmentType}</span>
                </div>
                {staffMember.shift && (
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <Clock className="w-4 h-4 mr-2" />
                    <span>{staffMember.shift} Shift</span>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <span className="text-sm font-medium text-green-600">
                  {formatSalary(staffMember.salary)}
                </span>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => openEditModal(staffMember)} 
                    className="p-2 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                    title="Edit staff member"
                    aria-label={`Edit staff member ${staffMember.firstName} ${staffMember.lastName}`}
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => openDeleteModal(staffMember)} 
                    className="p-2 text-gray-500 hover:text-red-600 dark:hover:text-red-400 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                    title="Delete staff member"
                    aria-label={`Delete staff member ${staffMember.firstName} ${staffMember.lastName}`}
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
                  <th scope="col" className="px-6 py-3">Staff Member</th>
                  <th scope="col" className="px-6 py-3">Department</th>
                  <th scope="col" className="px-6 py-3">Position</th>
                  <th scope="col" className="px-6 py-3">Employment Type</th>
                  <th scope="col" className="px-6 py-3">Salary</th>
                  <th scope="col" className="px-6 py-3">Contact</th>
                  <th scope="col" className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStaff.map(staffMember => (
                  <tr key={staffMember.id} className="bg-white dark:bg-gray-800/50 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                      <div className="flex items-center">
                        <img className="h-10 w-10 rounded-full mr-4" src={staffMember.avatarUrl} alt={`${staffMember.firstName} ${staffMember.lastName}`} />
                        <div>
                          <div className="font-semibold">{staffMember.firstName} {staffMember.lastName}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{staffMember.shift ? `${staffMember.shift} Shift` : ''}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">{staffMember.department}</td>
                    <td className="px-6 py-4">{staffMember.position}</td>
                    <td className="px-6 py-4">{staffMember.employmentType}</td>
                    <td className="px-6 py-4 font-medium text-green-600">
                      {formatSalary(staffMember.salary)}
                    </td>
                    <td className="px-6 py-4">
                      <div>{staffMember.email}</div>
                      <div className="text-xs text-gray-500">{staffMember.phone}</div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => openEditModal(staffMember)} 
                        className="p-2 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 mr-2"
                        title="Edit staff member"
                        aria-label={`Edit staff member ${staffMember.firstName} ${staffMember.lastName}`}
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => openDeleteModal(staffMember)} 
                        className="p-2 text-gray-500 hover:text-red-600 dark:hover:text-red-400 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                        title="Delete staff member"
                        aria-label={`Delete staff member ${staffMember.firstName} ${staffMember.lastName}`}
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
      
      {/* Add Staff Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Staff Member"
        size="lg"
      >
        <FormBuilder
          fields={staffFormFields}
          onSubmit={handleAddStaff}
          submitText="Add Staff Member"
          loading={loading}
        />
      </Modal>

      {/* Edit Staff Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedStaff(null);
        }}
        title="Edit Staff Member"
        size="lg"
      >
        {selectedStaff && (
          <FormBuilder
            fields={staffFormFields}
            onSubmit={handleEditStaff}
            initialData={{
              firstName: selectedStaff.firstName,
              lastName: selectedStaff.lastName,
              department: selectedStaff.department,
              position: selectedStaff.position,
              email: selectedStaff.email,
              phone: selectedStaff.phone,
              gender: selectedStaff.gender,
              dateOfBirth: selectedStaff.dateOfBirth,
              hireDate: selectedStaff.hireDate,
              employmentType: selectedStaff.employmentType,
              shift: selectedStaff.shift,
              salary: selectedStaff.salary,
              address: selectedStaff.address,
              nationalId: selectedStaff.nationalId,
              emergencyContact: selectedStaff.emergencyContact,
              supervisor: selectedStaff.supervisor
            }}
            submitText="Update Staff Member"
            loading={loading}
          />
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedStaff(null);
        }}
        title="Delete Staff Member"
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
                Delete Staff Member
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                This action cannot be undone.
              </p>
            </div>
          </div>
          
          {selectedStaff && (
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <img 
                  className="h-12 w-12 rounded-full" 
                  src={selectedStaff.avatarUrl} 
                  alt={`${selectedStaff.firstName} ${selectedStaff.lastName}`} 
                />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {selectedStaff.firstName} {selectedStaff.lastName}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {selectedStaff.position}, {selectedStaff.department}
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Are you sure you want to delete this staff member? This will permanently remove their profile 
            and all associated data from the system.
          </p>
          
          <div className="flex justify-end space-x-3 pt-4">
            <button
              onClick={() => {
                setIsDeleteModalOpen(false);
                setSelectedStaff(null);
              }}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteStaff}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Delete Staff Member
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default StaffManagement;
