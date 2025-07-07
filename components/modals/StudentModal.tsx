import React from 'react';
import Modal from '../Modal';
import FormBuilder from '../ui/FormBuilder';
import { Student } from '../../types';

interface StudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (student: Omit<Student, 'id' | 'avatarUrl'>) => void;
  student?: Student;
  loading?: boolean;
}

const StudentModal: React.FC<StudentModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  student,
  loading = false
}) => {
  const isEditing = !!student;

  const formFields = [
    {
      name: 'firstName',
      type: 'text' as const,
      label: 'First Name',
      placeholder: 'Enter first name',
      required: true,
      validation: (value: string) => {
        if (value.length < 2) return 'First name must be at least 2 characters';
        if (!/^[A-Za-z]+$/.test(value)) return 'First name must contain only letters';
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
        if (!/^[A-Za-z]+$/.test(value)) return 'Last name must contain only letters';
        return null;
      }
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
        if (age < 12 || age > 20) return 'Age must be between 12 and 20 years';
        return null;
      }
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
      name: 'grade',
      type: 'select' as const,
      label: 'Grade/Form',
      required: true,
      options: [
        { value: '1', label: 'S1 (Senior 1)' },
        { value: '2', label: 'S2 (Senior 2)' },
        { value: '3', label: 'S3 (Senior 3)' },
        { value: '4', label: 'S4 (Senior 4)' },
        { value: '5', label: 'S5 (Senior 5)' },
        { value: '6', label: 'S6 (Senior 6)' }
      ],
      helperText: 'Select the current academic level'
    },
    {
      name: 'address',
      type: 'textarea' as const,
      label: 'Home Address',
      placeholder: 'Enter complete home address',
      required: true
    },
    {
      name: 'parentName',
      type: 'text' as const,
      label: 'Parent/Guardian Name',
      placeholder: 'Enter parent or guardian full name',
      required: true
    },
    {
      name: 'parentPhone',
      type: 'text' as const,
      label: 'Parent Phone Number',
      placeholder: '+256 700 000 000',
      required: true,
      validation: (value: string) => {
        const phoneRegex = /^\+256\s?\d{3}\s?\d{3}\s?\d{3}$/;
        if (!phoneRegex.test(value)) return 'Please enter a valid Ugandan phone number (+256 XXX XXX XXX)';
        return null;
      }
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
      name: 'bloodGroup',
      type: 'select' as const,
      label: 'Blood Group',
      options: [
        { value: 'A+', label: 'A+' },
        { value: 'A-', label: 'A-' },
        { value: 'B+', label: 'B+' },
        { value: 'B-', label: 'B-' },
        { value: 'AB+', label: 'AB+' },
        { value: 'AB-', label: 'AB-' },
        { value: 'O+', label: 'O+' },
        { value: 'O-', label: 'O-' }
      ],
      helperText: 'Optional: Medical information'
    },
    {
      name: 'medicalConditions',
      type: 'textarea' as const,
      label: 'Medical Conditions',
      placeholder: 'Any known medical conditions, allergies, or special needs',
      helperText: 'Optional: Important for school health records'
    }
  ];

  const initialData = student ? {
    firstName: student.firstName,
    lastName: student.lastName,
    dateOfBirth: student.dateOfBirth,
    gender: student.gender,
    grade: student.grade.toString(),
    address: student.address,
    parentName: student.parentName,
    parentPhone: student.parentPhone,
    emergencyContact: student.emergencyContact,
    bloodGroup: student.bloodGroup || '',
    medicalConditions: student.medicalConditions || ''
  } : {};

  const handleSubmit = (data: Record<string, any>) => {
    const studentData: Omit<Student, 'id' | 'avatarUrl'> = {
      firstName: data.firstName,
      lastName: data.lastName,
      dateOfBirth: data.dateOfBirth,
      gender: data.gender,
      grade: parseInt(data.grade),
      address: data.address,
      parentName: data.parentName,
      parentPhone: data.parentPhone,
      emergencyContact: data.emergencyContact,
      admissionDate: student?.admissionDate || new Date().toISOString().split('T')[0],
      bloodGroup: data.bloodGroup || undefined,
      medicalConditions: data.medicalConditions || undefined,
      schoolFees: student?.schoolFees || {
        tuition: 500000, // UGX 500,000 per term
        transport: 150000, // UGX 150,000 per term  
        boarding: 300000, // UGX 300,000 per term
        totalPaid: 0,
        balance: 950000
      }
    };

    onSubmit(studentData);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Student' : 'Add New Student'}
      size="2xl"
      variant="default"
    >
      <div className="max-h-96 overflow-y-auto">
        <FormBuilder
          fields={formFields}
          onSubmit={handleSubmit}
          initialData={initialData}
          submitText={isEditing ? 'Update Student' : 'Add Student'}
          cancelText="Cancel"
          onCancel={onClose}
          loading={loading}
        />
      </div>
    </Modal>
  );
};

export default StudentModal;
