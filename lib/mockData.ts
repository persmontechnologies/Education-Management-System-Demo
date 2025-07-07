import { Student, Teacher, Staff, Course, Announcement, AttendanceRecord } from '../types';
import { formatYYYYMMDD } from './dateUtils';

const subDays = (date: Date, amount: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() - amount);
  return result;
};

export const getInitialData = (): { 
  students: Student[], 
  teachers: Teacher[], 
  staff: Staff[],
  courses: Course[],
  announcements: Announcement[],
  attendance: AttendanceRecord[]
} => {
  const students: Student[] = [
    { 
      id: 's1', 
      firstName: 'Nakato', 
      lastName: 'Grace', 
      dateOfBirth: '2008-05-15', 
      grade: 1, 
      emergencyContact: 'Namugga Faith - 0775-123-456', 
      avatarUrl: `https://i.pravatar.cc/150?u=s1`,
      gender: 'female',
      address: 'Kampala, Uganda',
      parentName: 'Namugga Faith',
      parentPhone: '0775-123-456',
      admissionDate: '2024-01-15',
      schoolFees: {
        tuition: 450000,
        transport: 50000,
        totalPaid: 400000,
        balance: 100000
      }
    },
    { 
      id: 's2', 
      firstName: 'Kato', 
      lastName: 'Michael', 
      dateOfBirth: '2007-08-22', 
      grade: 2, 
      emergencyContact: 'Ssemakula John - 0756-567-890', 
      avatarUrl: `https://i.pravatar.cc/150?u=s2`,
      gender: 'male',
      address: 'Entebbe, Uganda',
      parentName: 'Ssemakula John',
      parentPhone: '0756-567-890',
      admissionDate: '2023-01-15',
      schoolFees: {
        tuition: 450000,
        transport: 50000,
        boarding: 300000,
        totalPaid: 800000,
        balance: 0
      }
    },
    { 
      id: 's3', 
      firstName: 'Namugga', 
      lastName: 'Sarah', 
      dateOfBirth: '2008-02-10', 
      grade: 1, 
      emergencyContact: 'Mukasa David - 0701-876-543', 
      avatarUrl: `https://i.pravatar.cc/150?u=s3`,
      gender: 'female',
      address: 'Jinja, Uganda',
      parentName: 'Mukasa David',
      parentPhone: '0701-876-543',
      admissionDate: '2024-01-15',
      schoolFees: {
        tuition: 450000,
        totalPaid: 450000,
        balance: 0
      }
    },
    { 
      id: 's4', 
      firstName: 'Sserwadda', 
      lastName: 'Brian', 
      dateOfBirth: '2006-11-30', 
      grade: 3, 
      emergencyContact: 'Nakalembe Rose - 0773-432-109', 
      avatarUrl: `https://i.pravatar.cc/150?u=s4`,
      gender: 'male',
      address: 'Mbarara, Uganda',
      parentName: 'Nakalembe Rose',
      parentPhone: '0773-432-109',
      admissionDate: '2022-01-15',
      schoolFees: {
        tuition: 550000,
        transport: 75000,
        totalPaid: 300000,
        balance: 325000
      }
    },
    { 
      id: 's5', 
      firstName: 'Nalubega', 
      lastName: 'Joan', 
      dateOfBirth: '2007-09-05', 
      grade: 2, 
      emergencyContact: 'Kiiza Paul - 0782-999-876', 
      avatarUrl: `https://i.pravatar.cc/150?u=s5`,
      gender: 'female',
      address: 'Masaka, Uganda',
      parentName: 'Kiiza Paul',
      parentPhone: '0782-999-876',
      admissionDate: '2023-01-15',
      schoolFees: {
        tuition: 450000,
        boarding: 300000,
        totalPaid: 750000,
        balance: 0
      }
    }
  ];

  const teachers: Teacher[] = [
    { 
      id: 't1', 
      firstName: 'Ssemakula', 
      lastName: 'John', 
      subject: 'Mathematics', 
      email: 'j.ssemakula@school.edu.ug', 
      phone: '0774-111-222', 
      avatarUrl: `https://i.pravatar.cc/150?u=t1`,
      gender: 'male',
      dateOfBirth: '1985-03-15',
      hireDate: '2015-01-10',
      qualification: 'Bachelor of Education',
      experience: 10,
      salary: 1200000,
      address: 'Kampala, Uganda',
      emergencyContact: '0774-111-223',
      nationalId: 'CM85001234567PE',
      employmentType: 'Full-time',
      dateOfJoining: '2015-01-10'
    },
    { 
      id: 't2', 
      firstName: 'Namugga', 
      lastName: 'Faith', 
      subject: 'Physics', 
      email: 'f.namugga@school.edu.ug', 
      phone: '0756-333-444', 
      avatarUrl: `https://i.pravatar.cc/150?u=t2`,
      gender: 'female',
      dateOfBirth: '1988-07-22',
      hireDate: '2018-08-15',
      qualification: 'Bachelor of Science in Education',
      experience: 7,
      salary: 1100000,
      address: 'Entebbe, Uganda',
      emergencyContact: '0756-333-445',
      nationalId: 'CF88001234567PE',
      employmentType: 'Full-time',
      dateOfJoining: '2018-08-15'
    },
    { 
      id: 't3', 
      firstName: 'Mukasa', 
      lastName: 'David', 
      subject: 'History', 
      email: 'd.mukasa@school.edu.ug', 
      phone: '0701-555-666', 
      avatarUrl: `https://i.pravatar.cc/150?u=t3`,
      gender: 'male',
      dateOfBirth: '1982-11-08',
      hireDate: '2012-02-20',
      qualification: 'Master of Education',
      experience: 13,
      salary: 1400000,
      address: 'Jinja, Uganda',
      emergencyContact: '0701-555-667',
      nationalId: 'CM82001234567PE',
      employmentType: 'Full-time',
      dateOfJoining: '2012-02-20'
    }
  ];

  const staff: Staff[] = [
    {
      id: 'st1',
      firstName: 'Nakiwala',
      lastName: 'Sarah',
      department: 'Kitchen',
      position: 'Head Cook',
      email: 's.nakiwala@school.edu.ug',
      phone: '0772-123-456',
      avatarUrl: `https://i.pravatar.cc/150?u=st1`,
      gender: 'female',
      dateOfBirth: '1980-04-12',
      hireDate: '2020-01-15',
      salary: 700000,
      address: 'Kawempe, Kampala',
      emergencyContact: '0772-123-457',
      nationalId: 'CF80001234567PE',
      employmentType: 'Full-time',
      shift: 'Day',
      supervisor: 'Administration Manager'
    },
    {
      id: 'st2',
      firstName: 'Mubiru',
      lastName: 'James',
      department: 'Security',
      position: 'Security Guard',
      email: 'j.mubiru@school.edu.ug',
      phone: '0756-789-012',
      avatarUrl: `https://i.pravatar.cc/150?u=st2`,
      gender: 'male',
      dateOfBirth: '1975-09-20',
      hireDate: '2019-06-01',
      salary: 600000,
      address: 'Nansana, Kampala',
      emergencyContact: '0756-789-013',
      nationalId: 'CM75001234567PE',
      employmentType: 'Full-time',
      shift: 'Night',
      supervisor: 'Security Supervisor'
    },
    {
      id: 'st3',
      firstName: 'Nalwoga',
      lastName: 'Ruth',
      department: 'Library',
      position: 'Librarian',
      email: 'r.nalwoga@school.edu.ug',
      phone: '0701-345-678',
      avatarUrl: `https://i.pravatar.cc/150?u=st3`,
      gender: 'female',
      dateOfBirth: '1985-12-08',
      hireDate: '2021-03-10',
      salary: 900000,
      address: 'Mukono, Uganda',
      emergencyContact: '0701-345-679',
      nationalId: 'CF85001234567PE',
      employmentType: 'Full-time',
      shift: 'Day'
    },
    {
      id: 'st4',
      firstName: 'Ssegawa',
      lastName: 'Patrick',
      department: 'Maintenance',
      position: 'Maintenance Technician',
      email: 'p.ssegawa@school.edu.ug',
      phone: '0774-901-234',
      avatarUrl: `https://i.pravatar.cc/150?u=st4`,
      gender: 'male',
      dateOfBirth: '1978-06-15',
      hireDate: '2018-09-20',
      salary: 750000,
      address: 'Masaka, Uganda',
      emergencyContact: '0774-901-235',
      nationalId: 'CM78001234567PE',
      employmentType: 'Full-time',
      shift: 'Day',
      supervisor: 'Facilities Manager'
    },
    {
      id: 'st5',
      firstName: 'Namusoke',
      lastName: 'Agnes',
      department: 'Cleaning',
      position: 'Cleaner',
      email: 'a.namusoke@school.edu.ug',
      phone: '0756-567-890',
      avatarUrl: `https://i.pravatar.cc/150?u=st5`,
      gender: 'female',
      dateOfBirth: '1983-02-28',
      hireDate: '2022-01-05',
      salary: 500000,
      address: 'Ntinda, Kampala',
      emergencyContact: '0756-567-891',
      nationalId: 'CF83001234567PE',
      employmentType: 'Part-time',
      shift: 'Day'
    },
    {
      id: 'st6',
      firstName: 'Kiggundu',
      lastName: 'Moses',
      department: 'Transport',
      position: 'School Bus Driver',
      email: 'm.kiggundu@school.edu.ug',
      phone: '0772-234-567',
      avatarUrl: `https://i.pravatar.cc/150?u=st6`,
      gender: 'male',
      dateOfBirth: '1970-11-03',
      hireDate: '2017-04-12',
      salary: 800000,
      address: 'Mpigi, Uganda',
      emergencyContact: '0772-234-568',
      nationalId: 'CM70001234567PE',
      employmentType: 'Full-time',
      shift: 'Day',
      supervisor: 'Transport Coordinator'
    }
  ];

  const courses: Course[] = [
    { id: 'c1', name: 'S1 Mathematics', teacherId: 't1', studentIds: ['s1', 's3'], gradeLevel: 1, subject: 'Mathematics', schedule: [{ day: 'Monday', startTime: '09:00', endTime: '10:30', classroom: 'Room A1' }] },
    { id: 'c2', name: 'S2 Physics', teacherId: 't2', studentIds: ['s2', 's5'], gradeLevel: 2, subject: 'Physics', schedule: [{ day: 'Tuesday', startTime: '11:00', endTime: '12:30', classroom: 'Physics Lab' }] },
    { id: 'c3', name: 'S3 History', teacherId: 't3', studentIds: ['s4'], gradeLevel: 3, subject: 'History', schedule: [{ day: 'Wednesday', startTime: '14:00', endTime: '15:30', classroom: 'Room B2' }] },
  ];

  const announcements: Announcement[] = [
    { id: 'a1', title: 'Welcome Back to Term 1!', content: 'We warmly welcome all students back for Term 1, 2024. Please ensure all school fees are paid by January 20th. New students should report to the administration office for orientation.', date: new Date().toISOString(), priority: 'high', targetAudience: 'all' },
    { id: 'a2', title: 'Parent-Teacher Conference', content: 'The quarterly parent-teacher conference will be held on January 25th, 2024. Parents are encouraged to attend to discuss their children\'s progress. Appointment slots are available at the front office.', date: subDays(new Date(), 2).toISOString(), priority: 'medium', targetAudience: 'parents' },
    { id: 'a3', title: 'Inter-House Science Competition', content: 'The annual inter-house science competition is scheduled for February 15th. All S4, S5, and S6 students are encouraged to participate. Registration closes on February 1st.', date: subDays(new Date(), 5).toISOString(), priority: 'medium', targetAudience: 'students' },
    { id: 'a4', title: 'UNEB Examination Timetable', content: 'The UNEB examination timetable for 2024 has been released. S4 and S6 candidates should collect their examination cards from the administration office.', date: subDays(new Date(), 7).toISOString(), priority: 'high', targetAudience: 'students' },
  ];

  const today = formatYYYYMMDD(new Date());
  const yesterday = formatYYYYMMDD(subDays(new Date(), 1));

  const attendance: AttendanceRecord[] = [
    // Today's attendance for Grade 5 Math
    { studentId: 's1', date: today, status: 'present' },
    { studentId: 's3', date: today, status: 'present' },
    // Yesterday's attendance
    { studentId: 's1', date: yesterday, status: 'present' },
    { studentId: 's3', date: yesterday, status: 'absent' },
    { studentId: 's2', date: yesterday, status: 'late' },
  ];


  return { students, teachers, staff, courses, announcements, attendance };
};