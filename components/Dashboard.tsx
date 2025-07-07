import React, { useMemo } from 'react';
import { Announcement } from '../types';
import Card from './ui/Card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area } from 'recharts';
import { Users, UserCheck, BookOpen, ArrowUp, ArrowDown, CalendarCheck, GraduationCap, TrendingUp, Award, MapPin, Calendar, Clock, User } from 'lucide-react';
import { formatMonthDayYear } from '../lib/dateUtils';

interface DashboardProps {
  announcements: Announcement[];
}

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ElementType; color: string; change?: number; }> = ({ title, value, icon: Icon, color, change }) => (
    <Card>
        <div className="flex justify-between items-start">
            <div className="flex flex-col">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase">{title}</p>
                <p className="text-3xl font-bold text-gray-800 dark:text-white mt-1">{value}</p>
            </div>
            <div className={`p-3 rounded-lg ${color}`}>
                <Icon className="w-6 h-6 text-white" />
            </div>
        </div>
        {change !== undefined && (
            <div className={`flex items-center mt-2 text-sm ${change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {change >= 0 ? <ArrowUp className="w-4 h-4 mr-1" /> : <ArrowDown className="w-4 h-4 mr-1" />}
                <span>{Math.abs(change)}% vs last month</span>
            </div>
        )}
    </Card>
);

const Dashboard: React.FC<DashboardProps> = ({ announcements }) => {
    
    const enrollmentData = useMemo(() => {
        // Simulate larger school data for 5,000 students by class level
        const simulatedData = [
            { name: 'S1', Students: 950, Males: 520, Females: 430 },
            { name: 'S2', Students: 890, Males: 480, Females: 410 },
            { name: 'S3', Students: 850, Males: 460, Females: 390 },
            { name: 'S4', Students: 820, Males: 440, Females: 380 },
            { name: 'S5', Students: 750, Males: 400, Females: 350 },
            { name: 'S6', Students: 740, Males: 380, Females: 360 },
        ];
        return simulatedData;
    }, []);

    const performanceData = useMemo(() => [
        { term: 'Term 1', Mathematics: 85, English: 82, Physics: 78, Chemistry: 80, Biology: 83 },
        { term: 'Term 2', Mathematics: 87, English: 84, Physics: 79, Chemistry: 82, Biology: 85 },
        { term: 'Term 3', Mathematics: 89, English: 86, Physics: 81, Chemistry: 84, Biology: 87 },
    ], []);

    const attendanceData = useMemo(() => [
        { day: 'Mon', Present: 4650, Absent: 350 },
        { day: 'Tue', Present: 4720, Absent: 280 },
        { day: 'Wed', Present: 4680, Absent: 320 },
        { day: 'Thu', Present: 4750, Absent: 250 },
        { day: 'Fri', Present: 4600, Absent: 400 },
    ], []);

    // Simulate realistic data for 5,000 students
    const totalStudents = 5000;
    const maleStudents = 2650;
    const femaleStudents = 2350;
    const totalTeachers = 150;
    const maleTeachers = 65;
    const femaleTeachers = 85;

    const genderData = [
      { name: 'Male Students', value: maleStudents, color: '#3b82f6' },
      { name: 'Female Students', value: femaleStudents, color: '#ec4899' },
    ];

    const teacherGenderData = [
      { name: 'Male Teachers', value: maleTeachers, color: '#059669' },
      { name: 'Female Teachers', value: femaleTeachers, color: '#7c3aed' },
    ];

    return (
    <div className="space-y-6">
        {/* Top Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-4">
            <StatCard title="Total Students" value={totalStudents.toLocaleString()} icon={Users} color="bg-blue-500" change={5}/>
            <StatCard title="Male Students" value={maleStudents.toLocaleString()} icon={User} color="bg-blue-600" change={3}/>
            <StatCard title="Female Students" value={femaleStudents.toLocaleString()} icon={User} color="bg-pink-500" change={7}/>
            <StatCard title="Total Teachers" value={totalTeachers} icon={UserCheck} color="bg-green-500" change={-2}/>
            <StatCard title="Classes" value={75} icon={BookOpen} color="bg-purple-500" change={10}/>
            <StatCard title="Attendance" value="94%" icon={CalendarCheck} color="bg-emerald-500" change={2}/>
        </div>

        {/* Main Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Students by Class with Gender Breakdown */}
            <Card>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                    <GraduationCap className="w-5 h-5 mr-2" />
                    Student Enrollment by Class (S1-S6)
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={enrollmentData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(128, 128, 128, 0.2)" />
                        <XAxis dataKey="name" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false}/>
                        <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', color: '#f9fafb', borderRadius: '0.5rem' }} cursor={{fill: 'rgba(128, 128, 128, 0.1)'}}/>
                        <Legend wrapperStyle={{fontSize: "14px"}}/>
                        <Bar dataKey="Males" fill="#3b82f6" radius={[2, 2, 0, 0]} />
                        <Bar dataKey="Females" fill="#ec4899" radius={[2, 2, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </Card>

            {/* Academic Performance Trends */}
            <Card>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2" />
                    Academic Performance Trends
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={performanceData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(128, 128, 128, 0.2)" />
                        <XAxis dataKey="term" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} domain={[70, 95]}/>
                        <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', color: '#f9fafb', borderRadius: '0.5rem' }}/>
                        <Legend wrapperStyle={{fontSize: "14px"}}/>
                        <Line type="monotone" dataKey="Mathematics" stroke="#3b82f6" strokeWidth={2} />
                        <Line type="monotone" dataKey="English" stroke="#10b981" strokeWidth={2} />
                        <Line type="monotone" dataKey="Physics" stroke="#f59e0b" strokeWidth={2} />
                        <Line type="monotone" dataKey="Chemistry" stroke="#ef4444" strokeWidth={2} />
                        <Line type="monotone" dataKey="Biology" stroke="#8b5cf6" strokeWidth={2} />
                    </LineChart>
                </ResponsiveContainer>
            </Card>
        </div>

        {/* Secondary Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Student Gender Distribution */}
            <Card>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Student Gender Distribution</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie 
                      data={genderData} 
                      cx="50%" 
                      cy="50%" 
                      innerRadius={60} 
                      outerRadius={90} 
                      fill="#8884d8"
                      dataKey="value"
                      paddingAngle={2}
                    >
                      {genderData.map((entry) => <Cell key={`cell-${entry.name}`} fill={entry.color} />)}
                    </Pie>
                     <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', color: '#f9fafb', borderRadius: '0.5rem' }}/>
                     <Legend />
                  </PieChart>
                </ResponsiveContainer>
                <div className="text-center mt-2">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Male: {((maleStudents/totalStudents)*100).toFixed(1)}% | Female: {((femaleStudents/totalStudents)*100).toFixed(1)}%
                    </p>
                </div>
            </Card>

            {/* Teacher Gender Distribution */}
            <Card>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Teacher Gender Distribution</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie 
                      data={teacherGenderData} 
                      cx="50%" 
                      cy="50%" 
                      innerRadius={60} 
                      outerRadius={90} 
                      fill="#8884d8"
                      dataKey="value"
                      paddingAngle={2}
                    >
                      {teacherGenderData.map((entry) => <Cell key={`cell-${entry.name}`} fill={entry.color} />)}
                    </Pie>
                     <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', color: '#f9fafb', borderRadius: '0.5rem' }}/>
                     <Legend />
                  </PieChart>
                </ResponsiveContainer>
                <div className="text-center mt-2">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Male: {((maleTeachers/totalTeachers)*100).toFixed(1)}% | Female: {((femaleTeachers/totalTeachers)*100).toFixed(1)}%
                    </p>
                </div>
            </Card>

            {/* Weekly Attendance */}
            <Card>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Weekly Attendance</h3>
                <ResponsiveContainer width="100%" height={250}>
                    <AreaChart data={attendanceData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(128, 128, 128, 0.2)" />
                        <XAxis dataKey="day" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false}/>
                        <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', color: '#f9fafb', borderRadius: '0.5rem' }}/>
                        <Area type="monotone" dataKey="Present" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
                        <Area type="monotone" dataKey="Absent" stackId="1" stroke="#ef4444" fill="#ef4444" fillOpacity={0.6} />
                    </AreaChart>
                </ResponsiveContainer>
            </Card>
        </div>

        {/* Bottom Row - Info Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Announcements */}
            <Card>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                    <Award className="w-5 h-5 mr-2" />
                    Recent Announcements
                </h3>
                <ul className="space-y-3">
                    {announcements.slice(0, 4).map(announcement => (
                        <li key={announcement.id} className="text-sm border-l-2 border-blue-500 pl-3">
                            <p className="font-semibold text-gray-700 dark:text-gray-200">{announcement.title}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{formatMonthDayYear(new Date(announcement.date))}</p>
                        </li>
                    ))}
                </ul>
            </Card>

            {/* Upcoming Events */}
            <Card>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                    <Calendar className="w-5 h-5 mr-2" />
                    Upcoming Events
                </h3>
                 <ul className="space-y-3">
                    <li className="flex items-center space-x-3">
                        <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg"><CalendarCheck className="h-5 w-5 text-red-600 dark:text-red-300"/></div>
                        <div>
                           <p className="font-semibold text-gray-700 dark:text-gray-200 text-sm">Parent-Teacher Meeting</p>
                           <p className="text-xs text-gray-500 dark:text-gray-400">{formatMonthDayYear(new Date(new Date().setDate(new Date().getDate() + 10)))}</p>
                        </div>
                    </li>
                     <li className="flex items-center space-x-3">
                        <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg"><GraduationCap className="h-5 w-5 text-yellow-600 dark:text-yellow-300"/></div>
                        <div>
                           <p className="font-semibold text-gray-700 dark:text-gray-200 text-sm">UNEB Mock Exams</p>
                           <p className="text-xs text-gray-500 dark:text-gray-400">{formatMonthDayYear(new Date(new Date().setDate(new Date().getDate() + 7)))}</p>
                        </div>
                    </li>
                    <li className="flex items-center space-x-3">
                        <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg"><Users className="h-5 w-5 text-green-600 dark:text-green-300"/></div>
                        <div>
                           <p className="font-semibold text-gray-700 dark:text-gray-200 text-sm">Staff Meeting</p>
                           <p className="text-xs text-gray-500 dark:text-gray-400">{formatMonthDayYear(new Date(new Date().setDate(new Date().getDate() + 14)))}</p>
                        </div>
                    </li>
                </ul>
            </Card>

            {/* Quick Stats */}
            <Card>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                    <MapPin className="w-5 h-5 mr-2" />
                    School Overview
                </h3>
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Student-Teacher Ratio</span>
                        <span className="font-semibold text-gray-800 dark:text-white">33:1</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Average Class Size</span>
                        <span className="font-semibold text-gray-800 dark:text-white">67 students</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Current Term</span>
                        <span className="font-semibold text-gray-800 dark:text-white">Term 1, 2025</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400">School Fee Collection</span>
                        <span className="font-semibold text-green-600 dark:text-green-400">87%</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Last Updated</span>
                        <span className="font-semibold text-gray-800 dark:text-white flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            Just now
                        </span>
                    </div>
                </div>
            </Card>
        </div>
    </div>
    );
};

export default Dashboard;