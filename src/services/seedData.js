// ============================================================================
// SGP CONNECT SEED DATA & LOCAL DATASTORE
// Sanjay Gandhi Polytechnic, Bellary
// ============================================================================

export const SGP_CAMPUS_COORDINATES = {
  name: "Sanjay Gandhi Polytechnic, Bellary",
  latitude: 15.1394,
  longitude: 76.9214,
  defaultRadiusMeters: 100
};

export const INITIAL_FINE_RULES = [
  { id: 'f1', min: 75, max: 100, fine: 0, label: 'No Fine (Normal Standing)' },
  { id: 'f2', min: 70, max: 74.99, fine: 250, label: 'Warning Fine (₹250)' },
  { id: 'f3', min: 65, max: 69.99, fine: 500, label: 'Moderate Fine (₹500)' },
  { id: 'f4', min: 0, max: 64.99, fine: 1000, label: 'Critical Fine (₹1000 & Parent Meeting)' },
];

export const INITIAL_DEPARTMENTS = [
  { id: 'dept-cse', code: 'CSE', name: 'Computer Science & Engineering', hod: 'Prof. Anitha' },
  { id: 'dept-me', code: 'ME', name: 'Mechanical Engineering', hod: 'Prof. S. R. Patil' },
  { id: 'dept-eee', code: 'EEE', name: 'Electrical & Electronics Engineering', hod: 'Prof. Suresh V.' },
  { id: 'dept-ce', code: 'CE', name: 'Civil Engineering', hod: 'Prof. M. K. Rao' }
];

export const INITIAL_CLASSES = [
  { id: '3-CSE-A', name: '3rd Year CSE - Section A', semester: '5th Sem', departmentId: 'dept-cse', studentCount: 58 },
  { id: '3-CSE-B', name: '3rd Year CSE - Section B', semester: '5th Sem', departmentId: 'dept-cse', studentCount: 56 },
  { id: '2-CSE-A', name: '2nd Year CSE - Section A', semester: '3rd Sem', departmentId: 'dept-cse', studentCount: 62 },
];

export const INITIAL_SUBJECTS = [
  { id: '20CS31P', code: '20CS31P', name: 'Database Management Systems', shortName: 'DBMS', credits: 4, teacherId: 'teacher-anitha', teacherName: 'Prof. Anitha', classId: '3-CSE-A' },
  { id: '20CS32P', code: '20CS32P', name: 'Java Programming & OOP', shortName: 'Java', credits: 4, teacherId: 'teacher-ravi', teacherName: 'Prof. Ravi Kumar', classId: '3-CSE-A' },
  { id: '20SC31T', code: '20SC31T', name: 'Applied Mathematics III', shortName: 'Mathematics', credits: 4, teacherId: 'teacher-sunitha', teacherName: 'Prof. Sunitha', classId: '3-CSE-A' },
  { id: '20CS33P', code: '20CS33P', name: 'Computer Networks & Security', shortName: 'Networking', credits: 4, teacherId: 'teacher-chetan', teacherName: 'Prof. Chetan', classId: '3-CSE-A' }
];

export const DEMO_PERSONAS = {
  student: {
    uid: 'student-rahul',
    name: 'Rahul Kumar',
    usn: '23SGP001',
    email: 'rahul.23sgp001@sgp.edu.in',
    role: 'student',
    phone: '+91 98450 12345',
    department: 'Computer Science & Engineering',
    departmentId: 'dept-cse',
    classId: '3-CSE-A',
    className: '3rd Year CSE - A',
    semester: '5th Semester',
    academicYear: '2026-2027',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=256',
    overallAttendance: 82.0,
    presentCount: 164,
    absentCount: 36,
    totalClasses: 200,
    shortage: 0,
    applicableFine: 0
  },
  teacher: {
    uid: 'teacher-anitha',
    name: 'Prof. Anitha M.Tech',
    staffId: 'SGP-FAC-014',
    email: 'anitha.cse@sgp.edu.in',
    role: 'teacher',
    phone: '+91 94481 98765',
    designation: 'Associate Professor & HOD',
    department: 'Computer Science & Engineering',
    departmentId: 'dept-cse',
    assignedSubjects: [
      { id: '20CS31P', name: 'Database Management Systems', classId: '3-CSE-A', className: '3rd Year CSE - A' },
      { id: '20CS31P-B', name: 'Database Management Systems', classId: '3-CSE-B', className: '3rd Year CSE - B' }
    ],
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=256',
    officeHours: 'Mon & Wed: 03:00 PM – 04:30 PM (Room 104, CSE Block)'
  },
  admin: {
    uid: 'admin-principal',
    name: 'Dr. B. Nagaraj Ph.D',
    staffId: 'SGP-ADM-001',
    email: 'principal@sgp.edu.in',
    role: 'admin',
    phone: '+91 94480 11223',
    designation: 'Principal & Academic Director',
    department: 'Central Administration',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256'
  }
};

export const INITIAL_TIMETABLE = [
  // Monday
  { id: 'tt-m1', day: 'Monday', startTime: '09:00', endTime: '10:00', subjectId: '20SC31T', subjectName: 'Mathematics', teacherName: 'Prof. Sunitha', room: 'Room 201', classId: '3-CSE-A' },
  { id: 'tt-m2', day: 'Monday', startTime: '10:00', endTime: '11:00', subjectId: '20CS32P', subjectName: 'Java Programming', teacherName: 'Prof. Ravi', room: 'Lab 2', classId: '3-CSE-A' },
  { id: 'tt-m3', day: 'Monday', startTime: '11:15', endTime: '12:15', subjectId: '20CS31P', subjectName: 'DBMS', teacherName: 'Prof. Anitha', room: 'Room 203', classId: '3-CSE-A' },
  { id: 'tt-m4', day: 'Monday', startTime: '12:15', endTime: '13:15', subjectId: '20CS33P', subjectName: 'Networking', teacherName: 'Prof. Chetan', room: 'Room 204', classId: '3-CSE-A' },
  { id: 'tt-m5', day: 'Monday', startTime: '14:00', endTime: '16:00', subjectId: '20CS31P', subjectName: 'DBMS Practical Lab', teacherName: 'Prof. Anitha', room: 'Lab 2', classId: '3-CSE-A' },

  // Tuesday
  { id: 'tt-t1', day: 'Tuesday', startTime: '09:00', endTime: '10:00', subjectId: '20CS31P', subjectName: 'DBMS', teacherName: 'Prof. Anitha', room: 'Room 203', classId: '3-CSE-A' },
  { id: 'tt-t2', day: 'Tuesday', startTime: '10:00', endTime: '11:00', subjectId: '20CS33P', subjectName: 'Networking', teacherName: 'Prof. Chetan', room: 'Room 204', classId: '3-CSE-A' },
  { id: 'tt-t3', day: 'Tuesday', startTime: '11:15', endTime: '12:15', subjectId: '20CS32P', subjectName: 'Java Programming', teacherName: 'Prof. Ravi', room: 'Lab 2', classId: '3-CSE-A' },
  { id: 'tt-t4', day: 'Tuesday', startTime: '14:00', endTime: '16:00', subjectId: '20CS32P', subjectName: 'Java OOP Lab', teacherName: 'Prof. Ravi', room: 'Lab 1', classId: '3-CSE-A' },

  // Wednesday
  { id: 'tt-w1', day: 'Wednesday', startTime: '09:00', endTime: '10:00', subjectId: '20SC31T', subjectName: 'Mathematics', teacherName: 'Prof. Sunitha', room: 'Room 201', classId: '3-CSE-A' },
  { id: 'tt-w2', day: 'Wednesday', startTime: '10:00', endTime: '11:00', subjectId: '20CS31P', subjectName: 'DBMS', teacherName: 'Prof. Anitha', room: 'Room 203', classId: '3-CSE-A' },
  { id: 'tt-w3', day: 'Wednesday', startTime: '11:15', endTime: '12:15', subjectId: '20CS33P', subjectName: 'Networking', teacherName: 'Prof. Chetan', room: 'Room 204', classId: '3-CSE-A' },

  // Thursday
  { id: 'tt-th1', day: 'Thursday', startTime: '09:00', endTime: '10:00', subjectId: '20CS32P', subjectName: 'Java Programming', teacherName: 'Prof. Ravi', room: 'Lab 2', classId: '3-CSE-A' },
  { id: 'tt-th2', day: 'Thursday', startTime: '10:00', endTime: '11:00', subjectId: '20SC31T', subjectName: 'Mathematics', teacherName: 'Prof. Sunitha', room: 'Room 201', classId: '3-CSE-A' },
  { id: 'tt-th3', day: 'Thursday', startTime: '11:15', endTime: '12:15', subjectId: '20CS31P', subjectName: 'DBMS', teacherName: 'Prof. Anitha', room: 'Room 203', classId: '3-CSE-A' },

  // Friday
  { id: 'tt-f1', day: 'Friday', startTime: '09:00', endTime: '10:00', subjectId: '20CS33P', subjectName: 'Networking', teacherName: 'Prof. Chetan', room: 'Room 204', classId: '3-CSE-A' },
  { id: 'tt-f2', day: 'Friday', startTime: '10:00', endTime: '11:00', subjectId: '20CS31P', subjectName: 'DBMS', teacherName: 'Prof. Anitha', room: 'Room 203', classId: '3-CSE-A' },
  { id: 'tt-f3', day: 'Friday', startTime: '11:15', endTime: '12:15', subjectId: '20CS32P', subjectName: 'Java Programming', teacherName: 'Prof. Ravi', room: 'Lab 2', classId: '3-CSE-A' },

  // Saturday
  { id: 'tt-s1', day: 'Saturday', startTime: '09:00', endTime: '10:00', subjectId: '20SC31T', subjectName: 'Mathematics', teacherName: 'Prof. Sunitha', room: 'Room 201', classId: '3-CSE-A' },
  { id: 'tt-s2', day: 'Saturday', startTime: '10:00', endTime: '11:00', subjectId: '20CS32P', subjectName: 'Java Programming', teacherName: 'Prof. Ravi', room: 'Lab 2', classId: '3-CSE-A' }
];

export const INITIAL_STUDENT_SUBJECT_ATTENDANCE = [
  { subjectId: '20SC31T', subjectName: 'Mathematics', present: 35, total: 40, percentage: 87.5, shortage: 0 },
  { subjectId: '20CS32P', subjectName: 'Java', present: 30, total: 40, percentage: 75.0, shortage: 0 },
  { subjectId: '20CS31P', subjectName: 'DBMS', present: 38, total: 42, percentage: 90.5, shortage: 0 },
  { subjectId: '20CS33P', subjectName: 'Networking', present: 28, total: 38, percentage: 73.7, shortage: 1.3 }
];

export const INITIAL_ATTENDANCE_HISTORY = [
  { id: 'att-1', date: '2026-09-25', time: '11:15 AM', subject: 'DBMS', status: 'Present', teacher: 'Prof. Anitha', verifiedBy: 'QR + Geofence' },
  { id: 'att-2', date: '2026-09-25', time: '10:00 AM', subject: 'Java', status: 'Present', teacher: 'Prof. Ravi', verifiedBy: 'QR + Geofence' },
  { id: 'att-3', date: '2026-09-25', time: '09:00 AM', subject: 'Mathematics', status: 'Present', teacher: 'Prof. Sunitha', verifiedBy: 'QR + Geofence' },
  { id: 'att-4', date: '2026-09-24', time: '11:15 AM', subject: 'DBMS', status: 'Present', teacher: 'Prof. Anitha', verifiedBy: 'QR + Geofence' },
  { id: 'att-5', date: '2026-09-23', time: '11:15 AM', subject: 'DBMS', status: 'Absent', teacher: 'Prof. Anitha', verifiedBy: 'Unmarked' },
  { id: 'att-6', date: '2026-09-22', time: '11:15 AM', subject: 'DBMS', status: 'Present', teacher: 'Prof. Anitha', verifiedBy: 'QR + Geofence' },
  { id: 'att-7', date: '2026-09-22', time: '10:00 AM', subject: 'Networking', status: 'Absent', teacher: 'Prof. Chetan', verifiedBy: 'Unmarked' }
];

export const INITIAL_INTERNAL_MARKS = [
  { subjectCode: '20CS31P', subjectName: 'DBMS', ia1: 18, ia2: 20, ia3: 17, maxMarks: 20, average: 18.3, status: 'Distinction' },
  { subjectCode: '20CS32P', subjectName: 'Java Programming', ia1: 16, ia2: 18, ia3: 19, maxMarks: 20, average: 17.6, status: 'Distinction' },
  { subjectCode: '20SC31T', subjectName: 'Mathematics', ia1: 14, ia2: 17, ia3: 16, maxMarks: 20, average: 15.6, status: 'First Class' },
  { subjectCode: '20CS33P', subjectName: 'Networking', ia1: 15, ia2: 16, ia3: 14, maxMarks: 20, average: 15.0, status: 'First Class' }
];

export const INITIAL_STUDY_MATERIALS = [
  {
    id: 'mat-1',
    subject: 'DBMS',
    subjectCode: '20CS31P',
    title: 'Unit 1: Relational Database Architecture & ER Diagrams',
    unit: 'Unit 1',
    type: 'PDF',
    size: '4.2 MB',
    uploadedBy: 'Prof. Anitha',
    uploadDate: '12 Sep 2026',
    downloadUrl: '#'
  },
  {
    id: 'mat-2',
    subject: 'DBMS',
    subjectCode: '20CS31P',
    title: 'Unit 2: SQL Commands, Joins, Nested Subqueries & Views',
    unit: 'Unit 2',
    type: 'PDF',
    size: '5.8 MB',
    uploadedBy: 'Prof. Anitha',
    uploadDate: '18 Sep 2026',
    downloadUrl: '#'
  },
  {
    id: 'mat-3',
    subject: 'DBMS',
    subjectCode: '20CS31P',
    title: 'Unit 3: Normalization Techniques (1NF, 2NF, 3NF & BCNF)',
    unit: 'Unit 3',
    type: 'PDF',
    size: '3.6 MB',
    uploadedBy: 'Prof. Anitha',
    uploadDate: '24 Sep 2026',
    downloadUrl: '#'
  },
  {
    id: 'mat-4',
    subject: 'DBMS',
    subjectCode: '20CS31P',
    title: 'DBMS Model Question Papers with Answer Key (2022-2025)',
    unit: 'Important Questions',
    type: 'PDF',
    size: '8.1 MB',
    uploadedBy: 'Prof. Anitha',
    uploadDate: '20 Sep 2026',
    downloadUrl: '#'
  },
  {
    id: 'mat-5',
    subject: 'Java',
    subjectCode: '20CS32P',
    title: 'Java Unit 2: OOP Principles, Inheritance & Interfaces',
    unit: 'Unit 2',
    type: 'PPT',
    size: '12.4 MB',
    uploadedBy: 'Prof. Ravi',
    uploadDate: '15 Sep 2026',
    downloadUrl: '#'
  }
];

export const INITIAL_ASSIGNMENTS = [
  {
    id: 'asg-1',
    subject: 'DBMS',
    title: 'Normalization Case Study (Library Management Schema)',
    deadline: '28 Sep 2026',
    description: 'Convert given unnormalized library tables into 1NF, 2NF and 3NF. Submit relational schema diagram.',
    totalPoints: 20,
    submissionsCount: 46,
    totalStudents: 58,
    status: 'Pending Submission',
    isSubmitted: false
  },
  {
    id: 'asg-2',
    subject: 'Java',
    title: 'Multithreading & Exception Handling Mini Project',
    deadline: '02 Oct 2026',
    description: 'Implement a producer-consumer simulation using Java Threads and custom BankException classes.',
    totalPoints: 20,
    submissionsCount: 22,
    totalStudents: 58,
    status: 'Pending Submission',
    isSubmitted: false
  },
  {
    id: 'asg-3',
    subject: 'Mathematics',
    title: 'Laplace Transforms Problem Sheet 2',
    deadline: '22 Sep 2026',
    description: 'Solve problems 1 through 15 on inverse Laplace transforms.',
    totalPoints: 15,
    submissionsCount: 55,
    totalStudents: 58,
    status: 'Submitted',
    isSubmitted: true,
    grade: '14/15'
  }
];

export const INITIAL_NOTIFICATIONS = [
  {
    id: 'notif-1',
    category: 'Exams',
    title: 'IA-2 Internal Assessment Timetable Released',
    message: 'The second internal test for 5th semester CSE will commence from 05 October 2026. Hall tickets available on portal.',
    sender: 'Academic Cell / Prof. Anitha',
    timestamp: 'Today at 08:30 AM',
    pinned: true,
    read: false
  },
  {
    id: 'notif-2',
    category: 'Academic',
    title: 'DBMS Unit 3 Normalization Notes Uploaded',
    message: 'Complete notes for 1NF, 2NF, 3NF and BCNF are now available in the Study Materials section. Please review before Monday test.',
    sender: 'Prof. Anitha',
    timestamp: 'Yesterday at 04:15 PM',
    pinned: false,
    read: false
  },
  {
    id: 'notif-3',
    category: 'Attendance',
    title: 'Attendance Shortage Alert — Computer Networks',
    message: 'Your attendance in Computer Networks is currently 73.7%, which is below the required 75% threshold. Please attend upcoming periods.',
    sender: 'SGP Academic Warning System',
    timestamp: '23 Sep 2026',
    pinned: false,
    read: true
  },
  {
    id: 'notif-4',
    category: 'Events',
    title: 'TECHNO-SGP 2026 Annual Tech Fest Registrations Open',
    message: 'Coding Marathon, Robo-Race, and Technical Paper Presentation registrations are now live for all diploma branches.',
    sender: 'Student Activity Council',
    timestamp: '21 Sep 2026',
    pinned: true,
    read: true
  }
];

export const INITIAL_CAMPUS_EVENTS = [
  {
    id: 'evt-1',
    title: 'TECHNO-SGP 2026',
    date: '25 October 2026',
    time: '09:00 AM - 05:00 PM',
    venue: 'Main Auditorium & CS Labs',
    category: 'Technical Fest',
    organizer: 'CSE & Robotics Club',
    banner: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=600',
    description: 'Annual inter-polytechnic technology festival featuring web design hackathons, circuit debugging, and robotics.'
  },
  {
    id: 'evt-2',
    title: 'Inter-Department Cricket Championship',
    date: '10 November 2026',
    time: '08:30 AM',
    venue: 'SGP Sports Ground',
    category: 'Sports',
    organizer: 'Physical Education Dept',
    banner: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&q=80&w=600',
    description: 'Annual college sports tournament. CSE vs Mechanical opening match on 10th Nov.'
  }
];

export const INITIAL_CORRECTION_REQUESTS = [
  {
    id: 'req-1',
    studentId: 'student-rahul',
    studentName: 'Rahul Kumar',
    usn: '23SGP001',
    subject: 'DBMS',
    date: '2026-09-23',
    reason: 'I was present during the 11:15 AM class, but my GPS had an indoor location error and timed out.',
    status: 'Pending',
    requestedAt: '23 Sep 2026, 02:40 PM'
  }
];
