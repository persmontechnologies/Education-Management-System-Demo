import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  UserPlus, Users, Calendar, CheckCircle, 
  Clock, XCircle, FileText, Upload, 
  Search, Filter, Eye, Edit3, Trash2,
  Phone, Mail, MapPin, GraduationCap
} from 'lucide-react';
import Card from './ui/Card';
import Modal from './Modal';

interface AdmissionApplication {
  id: string;
  applicationNumber: string;
  studentName: string;
  dateOfBirth: string;
  grade: number;
  parentName: string;
  parentPhone: string;
  parentEmail: string;
  address: string;
  previousSchool?: string;
  applicationDate: string;
  status: 'pending' | 'approved' | 'rejected' | 'interview_scheduled' | 'documents_required';
  documents: {
    birthCertificate: boolean;
    reportCard: boolean;
    medicalForm: boolean;
    passport: boolean;
  };
  interviewDate?: string;
  notes?: string;
  gender: 'male' | 'female';
  nationality: string;
}

const Admissions: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | AdmissionApplication['status']>('all');
  const [gradeFilter, setGradeFilter] = useState<'all' | string>('all');
  const [selectedApplication, setSelectedApplication] = useState<AdmissionApplication | null>(null);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [showNewApplicationModal, setShowNewApplicationModal] = useState(false);

  // Mock admissions data
  const applications: AdmissionApplication[] = [
    {
      id: '1',
      applicationNumber: 'ADM-2024-001',
      studentName: 'Sarah Nalubega',
      dateOfBirth: '2010-03-15',
      grade: 8,
      parentName: 'John Nalubega',
      parentPhone: '+256 700 123456',
      parentEmail: 'john.nalubega@email.com',
      address: 'Kampala, Nakawa Division',
      previousSchool: 'Kampala Primary School',
      applicationDate: '2024-01-15',
      status: 'approved',
      documents: {
        birthCertificate: true,
        reportCard: true,
        medicalForm: true,
        passport: true
      },
      gender: 'female',
      nationality: 'Ugandan'
    },
    {
      id: '2',
      applicationNumber: 'ADM-2024-002',
      studentName: 'David Okello',
      dateOfBirth: '2009-07-22',
      grade: 9,
      parentName: 'Mary Okello',
      parentPhone: '+256 701 234567',
      parentEmail: 'mary.okello@email.com',
      address: 'Entebbe, Wakiso District',
      previousSchool: 'Entebbe Primary School',
      applicationDate: '2024-01-18',
      status: 'interview_scheduled',
      interviewDate: '2024-02-05',
      documents: {
        birthCertificate: true,
        reportCard: true,
        medicalForm: false,
        passport: true
      },
      gender: 'male',
      nationality: 'Ugandan'
    },
    {
      id: '3',
      applicationNumber: 'ADM-2024-003',
      studentName: 'Grace Namuleme',
      dateOfBirth: '2010-11-08',
      grade: 8,
      parentName: 'Peter Namuleme',
      parentPhone: '+256 702 345678',
      parentEmail: 'peter.namuleme@email.com',
      address: 'Mukono, Central Region',
      applicationDate: '2024-01-20',
      status: 'documents_required',
      documents: {
        birthCertificate: true,
        reportCard: false,
        medicalForm: false,
        passport: false
      },
      gender: 'female',
      nationality: 'Ugandan'
    },
    {
      id: '4',
      applicationNumber: 'ADM-2024-004',
      studentName: 'Michael Wanyama',
      dateOfBirth: '2008-12-03',
      grade: 10,
      parentName: 'Susan Wanyama',
      parentPhone: '+256 703 456789',
      parentEmail: 'susan.wanyama@email.com',
      address: 'Jinja, Eastern Region',
      previousSchool: 'Jinja College',
      applicationDate: '2024-01-22',
      status: 'pending',
      documents: {
        birthCertificate: true,
        reportCard: true,
        medicalForm: true,
        passport: true
      },
      gender: 'male',
      nationality: 'Ugandan'
    },
    {
      id: '5',
      applicationNumber: 'ADM-2024-005',
      studentName: 'Faith Nakigozi',
      dateOfBirth: '2009-05-17',
      grade: 9,
      parentName: 'Joseph Nakigozi',
      parentPhone: '+256 704 567890',
      parentEmail: 'joseph.nakigozi@email.com',
      address: 'Mbarara, Western Region',
      applicationDate: '2024-01-25',
      status: 'rejected',
      notes: 'Did not meet academic requirements',
      documents: {
        birthCertificate: true,
        reportCard: true,
        medicalForm: false,
        passport: true
      },
      gender: 'female',
      nationality: 'Ugandan'
    }
  ];

  // Calculate summary statistics
  const totalApplications = applications.length;
  const pendingApplications = applications.filter(app => app.status === 'pending').length;
  const approvedApplications = applications.filter(app => app.status === 'approved').length;
  const interviewsScheduled = applications.filter(app => app.status === 'interview_scheduled').length;

  // Filter applications
  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.applicationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.parentName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    const matchesGrade = gradeFilter === 'all' || app.grade.toString() === gradeFilter;
    return matchesSearch && matchesStatus && matchesGrade;
  });

  const getStatusColor = (status: AdmissionApplication['status']) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      case 'interview_scheduled': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'documents_required': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'pending': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: AdmissionApplication['status']) => {
    switch (status) {
      case 'approved': return CheckCircle;
      case 'rejected': return XCircle;
      case 'interview_scheduled': return Calendar;
      case 'documents_required': return FileText;
      case 'pending': return Clock;
      default: return Clock;
    }
  };

  const getStatusText = (status: AdmissionApplication['status']) => {
    switch (status) {
      case 'interview_scheduled': return 'Interview Scheduled';
      case 'documents_required': return 'Documents Required';
      default: return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  const viewApplication = (application: AdmissionApplication) => {
    setSelectedApplication(application);
    setShowApplicationModal(true);
  };

  const ApplicationDetailsModal = () => {
    if (!selectedApplication) return null;

    const completedDocuments = Object.values(selectedApplication.documents).filter(Boolean).length;
    const totalDocuments = Object.keys(selectedApplication.documents).length;

    return (
      <div className="p-6 max-w-3xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Student Information</h4>
            <div className="space-y-2 text-sm">
              <p><span className="font-medium">Application #:</span> {selectedApplication.applicationNumber}</p>
              <p><span className="font-medium">Name:</span> {selectedApplication.studentName}</p>
              <p><span className="font-medium">Date of Birth:</span> {selectedApplication.dateOfBirth}</p>
              <p><span className="font-medium">Grade:</span> Senior {selectedApplication.grade}</p>
              <p><span className="font-medium">Gender:</span> {selectedApplication.gender}</p>
              <p><span className="font-medium">Nationality:</span> {selectedApplication.nationality}</p>
              {selectedApplication.previousSchool && (
                <p><span className="font-medium">Previous School:</span> {selectedApplication.previousSchool}</p>
              )}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Parent/Guardian Information</h4>
            <div className="space-y-2 text-sm">
              <p className="flex items-center">
                <Users className="h-4 w-4 mr-2 text-gray-400" />
                <span className="font-medium">Name:</span> <span className="ml-1">{selectedApplication.parentName}</span>
              </p>
              <p className="flex items-center">
                <Phone className="h-4 w-4 mr-2 text-gray-400" />
                <span className="font-medium">Phone:</span> <span className="ml-1">{selectedApplication.parentPhone}</span>
              </p>
              <p className="flex items-center">
                <Mail className="h-4 w-4 mr-2 text-gray-400" />
                <span className="font-medium">Email:</span> <span className="ml-1">{selectedApplication.parentEmail}</span>
              </p>
              <p className="flex items-center">
                <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                <span className="font-medium">Address:</span> <span className="ml-1">{selectedApplication.address}</span>
              </p>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h4 className="font-semibold text-gray-900 mb-3">Application Status</h4>
          <div className="flex items-center space-x-4">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(selectedApplication.status)}`}>
              {React.createElement(getStatusIcon(selectedApplication.status), { className: "h-4 w-4 mr-2" })}
              {getStatusText(selectedApplication.status)}
            </span>
            <p className="text-sm text-gray-600">Applied on {selectedApplication.applicationDate}</p>
            {selectedApplication.interviewDate && (
              <p className="text-sm text-blue-600">Interview: {selectedApplication.interviewDate}</p>
            )}
          </div>
          {selectedApplication.notes && (
            <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800"><span className="font-medium">Notes:</span> {selectedApplication.notes}</p>
            </div>
          )}
        </div>

        <div className="mb-6">
          <h4 className="font-semibold text-gray-900 mb-3">Document Checklist</h4>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium">Progress</span>
              <span className="text-sm text-gray-600">{completedDocuments}/{totalDocuments} documents</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
              <div 
                className={`bg-blue-600 h-2 rounded-full transition-all duration-300`}
                style={{ width: `${(completedDocuments / totalDocuments) * 100}%` }}
              />
            </div>
            <div className="space-y-2">
              {Object.entries(selectedApplication.documents).map(([doc, completed]) => (
                <div key={doc} className="flex items-center justify-between">
                  <span className="text-sm capitalize">{doc.replace(/([A-Z])/g, ' $1').trim()}</span>
                  {completed ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-600" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            onClick={() => setShowApplicationModal(false)}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Close
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Edit Application
          </button>
          {selectedApplication.status === 'pending' && (
            <>
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                Approve
              </button>
              <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                Reject
              </button>
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admissions Management</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage student applications and enrollment
          </p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={() => setShowNewApplicationModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <UserPlus className="h-4 w-4" />
            <span>New Application</span>
          </button>
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2">
            <Upload className="h-4 w-4" />
            <span>Import Applications</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Applications</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{totalApplications}</p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
              <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending Review</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{pendingApplications}</p>
            </div>
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-full">
              <Clock className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Approved</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{approvedApplications}</p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
              <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Interviews Scheduled</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{interviewsScheduled}</p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full">
              <Calendar className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search applications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              aria-label="Filter by status"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="interview_scheduled">Interview Scheduled</option>
              <option value="documents_required">Documents Required</option>
            </select>

            <select
              value={gradeFilter}
              onChange={(e) => setGradeFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              aria-label="Filter by grade"
            >
              <option value="all">All Grades</option>
              {[8, 9, 10, 11, 12].map(grade => (
                <option key={grade} value={grade.toString()}>Senior {grade}</option>
              ))}
            </select>

            <button className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center space-x-2">
              <Filter className="h-4 w-4" />
              <span>More Filters</span>
            </button>
          </div>
        </div>
      </Card>

      {/* Applications Table */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Applications</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-700 dark:text-gray-400 uppercase bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th scope="col" className="px-6 py-3">Application</th>
                  <th scope="col" className="px-6 py-3">Student</th>
                  <th scope="col" className="px-6 py-3">Grade</th>
                  <th scope="col" className="px-6 py-3">Parent Contact</th>
                  <th scope="col" className="px-6 py-3">Documents</th>
                  <th scope="col" className="px-6 py-3">Status</th>
                  <th scope="col" className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredApplications.map((application) => {
                  const StatusIcon = getStatusIcon(application.status);
                  const completedDocs = Object.values(application.documents).filter(Boolean).length;
                  const totalDocs = Object.keys(application.documents).length;
                  
                  return (
                    <motion.tr
                      key={application.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="bg-white border-b dark:bg-gray-900 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">{application.applicationNumber}</div>
                          <div className="text-gray-500 dark:text-gray-400">{application.applicationDate}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">{application.studentName}</div>
                          <div className="text-gray-500 dark:text-gray-400">{application.dateOfBirth}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          <GraduationCap className="h-3 w-3 mr-1" />
                          Senior {application.grade}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">{application.parentName}</div>
                          <div className="text-gray-500 dark:text-gray-400">{application.parentPhone}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-2">
                            <span className="text-xs font-medium">{completedDocs}/{totalDocs}</span>
                          </div>
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div 
                              className={`bg-blue-600 h-2 rounded-full transition-all duration-300`}
                              style={{ width: `${(completedDocs / totalDocs) * 100}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(application.status)}`}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {getStatusText(application.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => viewApplication(application)}
                            className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900 rounded-lg transition-colors"
                            title="View Application"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            className="p-2 text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
                            title="Edit Application"
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>
                          <button
                            className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg transition-colors"
                            title="Delete Application"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </Card>

      {/* Application Details Modal */}
      <Modal
        isOpen={showApplicationModal}
        onClose={() => setShowApplicationModal(false)}
        title="Application Details"
        size="xl"
      >
        <ApplicationDetailsModal />
      </Modal>

      {/* New Application Modal */}
      <Modal
        isOpen={showNewApplicationModal}
        onClose={() => setShowNewApplicationModal(false)}
        title="New Application"
        size="lg"
      >
        <div className="p-6">
          <div className="text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
              <UserPlus className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">New Application Form</h3>
            <p className="text-gray-600 mb-6">This feature will open a comprehensive application form for new student admissions.</p>
            <div className="flex justify-center space-x-3">
              <button
                onClick={() => setShowNewApplicationModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Open Application Form
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Admissions;
