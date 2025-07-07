import React from 'react';
import Modal from '../Modal';
import FormBuilder from '../ui/FormBuilder';
import { Teacher } from '../../types';

interface TeacherModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (teacher: Omit<Teacher, 'id' | 'avatarUrl'>) => void;
  teacher?: Teacher;
  loading?: boolean;
}

const TeacherModal: React.FC<TeacherModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  teacher,
  loading = false
}) => {
  const isEditing = !!teacher;

  const ugandanSubjects = [
    'Mathematics', 'English Language', 'Physics', 'Chemistry', 'Biology',
    'History', 'Geography', 'Literature in English', 'Religious Education',
    'Fine Art', 'Music', 'Physical Education', 'Computer Studies',
    'Economics', 'Commerce', 'Accounting', 'Agriculture',
    'Luganda', 'French', 'Latin', 'Entrepreneurship',
    'Technical Drawing', 'Food and Nutrition', 'Home Economics'
  ];

  const formFields = [
    {
      name: 'firstName',
      type: 'text' as const,
      label: 'First Name',
      placeholder: 'Enter first name',
      required: true,
      validation: (value: string) => {
        if (value.length < 2) return 'First name must be at least 2 characters';
        if (!/^[A-Za-z\s]+$/.test(value)) return 'First name must contain only letters';
        return null;
      }
    },
    {
      name: 'lastName',
      type: 'text' as const,
      label: 'Last Name',
      placeholder: 'Enter last name',
      required: true,
      validation: (value: string) => {
        if (value.length < 2) return 'Last name must be at least 2 characters';
        if (!/^[A-Za-z\s]+$/.test(value)) return 'Last name must contain only letters';
        return null;
      }
    },
    {
      name: 'email',
      type: 'email' as const,
      label: 'Email Address',
      placeholder: 'teacher@school.edu.ug',
      required: true,
      validation: (value: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) return 'Please enter a valid email address';
        return null;
      }
    },
    {
      name: 'phone',
      type: 'text' as const,
      label: 'Phone Number',
      placeholder: '+256 700 000 000',
      required: true,
      validation: (value: string) => {
        const phoneRegex = /^\+256\s?\d{3}\s?\d{3}\s?\d{3}$/;
        if (!phoneRegex.test(value)) return 'Please enter a valid Ugandan phone number (+256 XXX XXX XXX)';
        return null;
      }
    },
    {
      name: 'subject',
      type: 'select' as const,
      label: 'Primary Subject',
      required: true,
      options: ugandanSubjects.map(subject => ({ value: subject, label: subject })),
      helperText: 'Main subject this teacher specializes in'
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
      required: true,
      validation: (value: string) => {
        const birthDate = new Date(value);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        if (age < 18 || age > 70) return 'Age must be between 18 and 70 years';
        return null;
      }
    },
    {
      name: 'nationalId',
      type: 'text' as const,
      label: 'National ID',
      placeholder: 'CF1234567890123',
      required: true,
      validation: (value: string) => {
        if (value.length !== 14) return 'National ID must be 14 characters';
        if (!/^[A-Z]{2}\d{12}$/.test(value)) return 'Invalid National ID format (e.g., CF1234567890123)';
        return null;
      },
      helperText: 'Ugandan National ID (14 characters)'
    },
    {
      name: 'qualification',
      type: 'select' as const,
      label: 'Highest Qualification',
      required: true,
      options: [
        { value: 'Diploma', label: 'Diploma in Education' },
        { value: 'Bachelor', label: "Bachelor's Degree" },
        { value: 'Masters', label: "Master's Degree" },
        { value: 'PhD', label: 'PhD/Doctorate' },
        { value: 'Certificate', label: 'Teaching Certificate' }
      ]
    },
    {
      name: 'experience',
      type: 'number' as const,
      label: 'Years of Experience',
      placeholder: '0',
      required: true,
      validation: (value: string) => {
        const num = parseInt(value);
        if (isNaN(num) || num < 0) return 'Experience must be a valid number';
        if (num > 50) return 'Experience cannot exceed 50 years';
        return null;
      }
    },
    {
      name: 'employmentType',
      type: 'select' as const,
      label: 'Employment Type',
      required: true,
      options: [
        { value: 'Full-time', label: 'Full-time' },
        { value: 'Part-time', label: 'Part-time' },
        { value: 'Contract', label: 'Contract' },
        { value: 'Volunteer', label: 'Volunteer' }
      ]
    },
    {
      name: 'dateOfJoining',
      type: 'date' as const,
      label: 'Date of Joining',
      required: true,
      validation: (value: string) => {
        const joinDate = new Date(value);
        const today = new Date();
        if (joinDate > today) return 'Joining date cannot be in the future';
        return null;
      }
    },
    {
      name: 'address',
      type: 'textarea' as const,
      label: 'Address',
      placeholder: 'Enter complete address',
      required: true
    },
    {
      name: 'emergencyContact',
      type: 'text' as const,
      label: 'Emergency Contact',
      placeholder: '+256 700 000 000',
      required: true,
      validation: (value: string) => {
        const phoneRegex = /^\+256\s?\d{3}\s?\d{3}\s?\d{3}$/;
        if (!phoneRegex.test(value)) return 'Please enter a valid Ugandan phone number (+256 XXX XXX XXX)';
        return null;
      }
    },
    {
      name: 'salary',
      type: 'number' as const,
      label: 'Monthly Salary (UGX)',
      placeholder: '800000',
      required: true,
      validation: (value: string) => {
        const num = parseInt(value);
        if (isNaN(num) || num < 0) return 'Salary must be a valid amount';
        if (num < 200000) return 'Salary should be at least UGX 200,000';
        if (num > 5000000) return 'Salary cannot exceed UGX 5,000,000';
        return null;
      },
      helperText: 'Monthly gross salary in Ugandan Shillings'
    }
  ];

  const initialData = teacher ? {
    firstName: teacher.firstName,
    lastName: teacher.lastName,
    email: teacher.email,
    phone: teacher.phone,
    subject: teacher.subject,
    gender: teacher.gender,
    dateOfBirth: teacher.dateOfBirth,
    nationalId: teacher.nationalId,
    qualification: teacher.qualification,
    experience: teacher.experience?.toString() || '0',
    employmentType: teacher.employmentType,
    dateOfJoining: teacher.dateOfJoining || teacher.hireDate,
    address: teacher.address,
    emergencyContact: teacher.emergencyContact,
    salary: teacher.salary?.toString() || '800000'
  } : {
    salary: '800000' // Default salary
  };

  const handleSubmit = (data: Record<string, any>) => {
    const teacherData: Omit<Teacher, 'id' | 'avatarUrl'> = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      subject: data.subject,
      gender: data.gender,
      dateOfBirth: data.dateOfBirth,
      nationalId: data.nationalId,
      qualification: data.qualification,
      experience: parseInt(data.experience),
      employmentType: data.employmentType,
      dateOfJoining: data.dateOfJoining,
      hireDate: data.dateOfJoining, // Use same date for hireDate
      address: data.address,
      emergencyContact: data.emergencyContact,
      salary: parseInt(data.salary)
    };

    onSubmit(teacherData);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Teacher' : 'Add New Teacher'}
      size="2xl"
      variant="default"
    >
      <div className="max-h-96 overflow-y-auto">
        <FormBuilder
          fields={formFields}
          onSubmit={handleSubmit}
          initialData={initialData}
          submitText={isEditing ? 'Update Teacher' : 'Add Teacher'}
          cancelText="Cancel"
          onCancel={onClose}
          loading={loading}
        />
      </div>
    </Modal>
  );
};

export default TeacherModal;
