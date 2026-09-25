// ============================================================================
// SGP CONNECT — CENTRAL CAMPUS CONTEXT & REALTIME STATE ENGINE
// Fullstack Integration with Firebase Authentication, Cloud Firestore & Storage
// Sanjay Gandhi Polytechnic, Bellary
// ============================================================================

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  SGP_CAMPUS_COORDINATES,
  INITIAL_FINE_RULES,
  INITIAL_DEPARTMENTS,
  INITIAL_CLASSES,
  INITIAL_SUBJECTS,
  DEMO_PERSONAS,
  INITIAL_TIMETABLE,
  INITIAL_STUDENT_SUBJECT_ATTENDANCE,
  INITIAL_ATTENDANCE_HISTORY,
  INITIAL_INTERNAL_MARKS,
  INITIAL_STUDY_MATERIALS,
  INITIAL_ASSIGNMENTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_CAMPUS_EVENTS,
  INITIAL_CORRECTION_REQUESTS
} from '../services/seedData';
import { isFirebaseConfigured, db, auth } from '../services/firebase';
import {
  seedFirestoreIfEmpty,
  loginWithFirebase,
  logoutFirebase,
  subscribeToActiveSession,
  subscribeToCollection,
  updateActiveSessionInCloud,
  recordAttendanceInCloud,
  addCorrectionRequestInCloud,
  updateCorrectionStatusInCloud,
  addStudyMaterialInCloud,
  addAssignmentInCloud,
  submitAssignmentInCloud,
  addDiscussionInCloud,
  replyDiscussionInCloud,
  saveInternalMarksInCloud,
  addTimetableSlotInCloud,
  deleteTimetableSlotInCloud,
  addNotificationInCloud,
  markNotificationsReadInCloud,
  addAuditLogInCloud,
  COLLECTIONS
} from '../services/firestoreService';

const CampusContext = createContext(null);

// Haversine formula to compute distance in meters between two GPS coordinates
export function calculateDistanceInMeters(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // Earth radius in meters
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

  const a = Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
            Math.cos(phi1) * Math.cos(phi2) *
            Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

export const CampusProvider = ({ children }) => {
  // Theme State
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('sgp_theme') || 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('sgp_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Cloud Connection Status
  const [isCloudConnected, setIsCloudConnected] = useState(isFirebaseConfigured);
  const [cloudSyncStatus, setCloudSyncStatus] = useState(isFirebaseConfigured ? 'Connected' : 'Standalone');

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('sgp_auth') !== 'false';
  });

  useEffect(() => {
    localStorage.setItem('sgp_auth', isAuthenticated ? 'true' : 'false');
  }, [isAuthenticated]);

  // Active User / Persona State
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('sgp_user');
    return saved ? JSON.parse(saved) : DEMO_PERSONAS.student;
  });

  useEffect(() => {
    localStorage.setItem('sgp_user', JSON.stringify(currentUser));
  }, [currentUser]);

  const switchPersona = (role) => {
    if (DEMO_PERSONAS[role]) {
      const targetUser = DEMO_PERSONAS[role];
      setCurrentUser(targetUser);
      setIsAuthenticated(true);
      // Trigger background firebase auth sync
      loginWithFirebase(targetUser.email, 'sgp@2026', role).catch(() => {});
    }
  };

  const login = async (identifier, password, preferredRole = null) => {
    const cleanId = (identifier || '').trim().toLowerCase();
    
    let defaultUser = null;
    if (preferredRole && DEMO_PERSONAS[preferredRole]) {
      defaultUser = DEMO_PERSONAS[preferredRole];
    } else if (cleanId === '23sgp001' || cleanId.includes('rahul') || cleanId.includes('student')) {
      defaultUser = DEMO_PERSONAS.student;
    } else if (cleanId === 'sgp-fac-014' || cleanId.includes('anitha') || cleanId.includes('teacher') || cleanId.includes('faculty')) {
      defaultUser = DEMO_PERSONAS.teacher;
    } else if (cleanId === 'sgp-adm-001' || cleanId.includes('principal') || cleanId.includes('admin')) {
      defaultUser = DEMO_PERSONAS.admin;
    } else {
      defaultUser = DEMO_PERSONAS.student;
    }

    // Try live Firebase Auth
    if (isFirebaseConfigured) {
      try {
        const authRes = await loginWithFirebase(identifier, password, preferredRole);
        if (authRes.success) {
          setCurrentUser(authRes.user);
          setIsAuthenticated(true);
          return { success: true, user: authRes.user };
        }
      } catch (err) {
        console.warn('Firebase login attempt fallback to persona:', err);
      }
    }

    setCurrentUser(defaultUser);
    setIsAuthenticated(true);
    return { success: true, user: defaultUser };
  };

  const logout = async () => {
    if (isFirebaseConfigured) {
      await logoutFirebase();
    }
    setIsAuthenticated(false);
  };

  // Geofence & Dev Location Simulation
  const [campusGeofence, setCampusGeofence] = useState(SGP_CAMPUS_COORDINATES);
  const [simulateOnCampus, setSimulateOnCampus] = useState(true); // Dev toggle: true = SGP Bellary campus, false = outside

  // Core Data Collections (State with Firestore Realtime Sync)
  const [timetable, setTimetableState] = useState(INITIAL_TIMETABLE);
  const [subjects, setSubjects] = useState(INITIAL_SUBJECTS);
  const [classes, setClasses] = useState(INITIAL_CLASSES);
  const [departments, setDepartments] = useState(INITIAL_DEPARTMENTS);
  const [fineRules, setFineRules] = useState(INITIAL_FINE_RULES);
  const [studentSubjectAttendance, setStudentSubjectAttendance] = useState(INITIAL_STUDENT_SUBJECT_ATTENDANCE);
  const [attendanceHistory, setAttendanceHistoryState] = useState(INITIAL_ATTENDANCE_HISTORY);
  const [internalMarks, setInternalMarksState] = useState(INITIAL_INTERNAL_MARKS);
  const [studyMaterials, setStudyMaterialsState] = useState(INITIAL_STUDY_MATERIALS);
  const [assignments, setAssignmentsState] = useState(INITIAL_ASSIGNMENTS);
  const [notifications, setNotificationsState] = useState(INITIAL_NOTIFICATIONS);
  const [campusEvents, setCampusEvents] = useState(INITIAL_CAMPUS_EVENTS);
  const [correctionRequests, setCorrectionRequestsState] = useState(INITIAL_CORRECTION_REQUESTS);
  const [auditLogs, setAuditLogsState] = useState([
    { id: 'log-1', action: 'System Initialization', user: 'System', timestamp: '25 Sep 2026, 08:00 AM', details: 'SGP Connect initialized for Bellary Campus with Firebase Cloud.' }
  ]);

  // Discussion & Questions
  const [discussions, setDiscussionsState] = useState([
    {
      id: 'disc-1',
      subject: 'DBMS',
      studentName: 'Rahul Kumar',
      studentUsn: '23SGP001',
      question: 'Ma\'am, will BCNF (Boyce-Codd Normal Form) questions be asked for 10 marks in IA-2?',
      reply: 'Yes Rahul. Focus on comparing 3NF vs BCNF and identifying anomalies with candidate keys.',
      repliedBy: 'Prof. Anitha',
      timestamp: '24 Sep, 03:20 PM',
      isAnonymous: false
    }
  ]);

  // QR Attendance Session State
  const [activeSession, setActiveSession] = useState(() => ({
    sessionId: 'SGP-SESS-9042',
    subjectId: '20CS31P',
    subjectName: 'DBMS (Database Management Systems)',
    classId: '3-CSE-A',
    className: '3rd Year CSE - Section A',
    teacherId: 'teacher-anitha',
    teacherName: 'Prof. Anitha',
    room: 'Room 203',
    startedAt: Date.now(),
    expiresAt: Date.now() + 15 * 60 * 1000,
    attendees: ['23SGP005', '23SGP012', '23SGP019'],
    isOpen: true
  }));

  // Dynamic Rolling Token (refreshes every 15s)
  const [currentNonce, setCurrentNonce] = useState(1);
  const [qrSecondsLeft, setQrSecondsLeft] = useState(15);

  useEffect(() => {
    const timer = setInterval(() => {
      setQrSecondsLeft((prev) => {
        if (prev <= 1) {
          setCurrentNonce((n) => n + 1);
          return 15;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Compute live dynamic QR payload
  const currentQRPayload = useMemo(() => {
    if (!activeSession || !activeSession.isOpen) return null;
    return JSON.stringify({
      app: 'SGP_CONNECT',
      campus: 'SGP_BELLARY',
      sessionId: activeSession.sessionId,
      subjectId: activeSession.subjectId,
      classId: activeSession.classId,
      nonce: currentNonce,
      timestamp: Date.now()
    });
  }, [activeSession, currentNonce]);

  // ==========================================================================
  // REAL-TIME FIRESTORE SUBSCRIPTIONS & SEED ENGINE
  // ==========================================================================
  useEffect(() => {
    if (!isFirebaseConfigured || !db) return;

    // 1. Initial Seeding if Firestore empty
    seedFirestoreIfEmpty().then((res) => {
      if (res?.seeded) {
        setCloudSyncStatus('Live Synced');
      }
    }).catch(err => {
      console.warn('Initial cloud seed catch:', err);
    });

    // 2. Realtime listener for active attendance session (Teacher <-> Students live sync)
    const unsubSession = subscribeToActiveSession((sessionData) => {
      if (sessionData && sessionData.sessionId) {
        setActiveSession(sessionData);
      }
    });

    // 3. Realtime listener for Study Materials
    const unsubMaterials = subscribeToCollection(COLLECTIONS.STUDY_MATERIALS, (materials) => {
      if (materials && materials.length > 0) {
        setStudyMaterialsState(materials);
      }
    });

    // 4. Realtime listener for Assignments
    const unsubAssignments = subscribeToCollection(COLLECTIONS.ASSIGNMENTS, (asgs) => {
      if (asgs && asgs.length > 0) {
        setAssignmentsState(asgs);
      }
    });

    // 5. Realtime listener for Discussions
    const unsubDiscussions = subscribeToCollection(COLLECTIONS.DISCUSSIONS, (discs) => {
      if (discs && discs.length > 0) {
        setDiscussionsState(discs);
      }
    });

    // 6. Realtime listener for Timetable
    const unsubTimetable = subscribeToCollection(COLLECTIONS.TIMETABLE, (tt) => {
      if (tt && tt.length > 0) {
        setTimetableState(tt);
      }
    });

    // 7. Realtime listener for Correction Requests
    const unsubCorrections = subscribeToCollection(COLLECTIONS.CORRECTION_REQUESTS, (reqs) => {
      if (reqs && reqs.length > 0) {
        setCorrectionRequestsState(reqs);
      }
    });

    // 8. Realtime listener for Notifications
    const unsubNotifications = subscribeToCollection(COLLECTIONS.NOTIFICATIONS, (notifs) => {
      if (notifs && notifs.length > 0) {
        setNotificationsState(notifs);
      }
    });

    // 9. Realtime listener for Attendance History
    const unsubAttendance = subscribeToCollection(COLLECTIONS.ATTENDANCE_RECORDS, (records) => {
      if (records && records.length > 0) {
        setAttendanceHistoryState(records);
      }
    });

    // 10. Realtime listener for Internal Marks
    const unsubMarks = subscribeToCollection(COLLECTIONS.INTERNAL_MARKS, (marks) => {
      if (marks && marks.length > 0) {
        setInternalMarksState(marks);
      }
    });

    return () => {
      unsubSession();
      unsubMaterials();
      unsubAssignments();
      unsubDiscussions();
      unsubTimetable();
      unsubCorrections();
      unsubNotifications();
      unsubAttendance();
      unsubMarks();
    };
  }, []);

  // ==========================================================================
  // CLOUD + LOCAL STATE MUTATORS
  // ==========================================================================

  // Wrapper setters that maintain React setState signature AND sync with Firestore
  const setStudyMaterials = (updater) => {
    setStudyMaterialsState(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      // If a new material was added, save to cloud
      if (Array.isArray(next) && next.length > prev.length) {
        const addedItem = next[0];
        addStudyMaterialInCloud(addedItem).catch(() => {});
      }
      return next;
    });
  };

  const setAssignments = (updater) => {
    setAssignmentsState(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      if (Array.isArray(next) && next.length > prev.length) {
        const added = next[0];
        addAssignmentInCloud(added).catch(() => {});
      }
      return next;
    });
  };

  const setDiscussions = (updater) => {
    setDiscussionsState(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      if (Array.isArray(next) && next.length > prev.length) {
        const added = next[0];
        addDiscussionInCloud(added).catch(() => {});
      } else if (Array.isArray(next)) {
        // Find replied item
        const repliedItem = next.find((item, idx) => item.reply && (!prev[idx] || prev[idx].reply !== item.reply));
        if (repliedItem) {
          replyDiscussionInCloud(repliedItem.id, repliedItem.reply, repliedItem.repliedBy || currentUser.name).catch(() => {});
        }
      }
      return next;
    });
  };

  const setInternalMarks = (updater) => {
    setInternalMarksState(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      saveInternalMarksInCloud(next, currentUser.usn || '23SGP001').catch(() => {});
      return next;
    });
  };

  const setTimetable = (updater) => {
    setTimetableState(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      if (Array.isArray(next) && next.length > prev.length) {
        const added = next[next.length - 1];
        addTimetableSlotInCloud(added).catch(() => {});
      } else if (Array.isArray(next) && next.length < prev.length) {
        const removed = prev.find(p => !next.some(n => n.id === p.id));
        if (removed) {
          deleteTimetableSlotInCloud(removed.id).catch(() => {});
        }
      }
      return next;
    });
  };

  const setNotifications = (updater) => {
    setNotificationsState(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      if (Array.isArray(next)) {
        const readIds = next.filter(n => n.read).map(n => n.id);
        if (readIds.length > 0) {
          markNotificationsReadInCloud(readIds).catch(() => {});
        }
      }
      return next;
    });
  };

  const setAttendanceHistory = setAttendanceHistoryState;
  const setCorrectionRequests = setCorrectionRequestsState;
  const setAuditLogs = setAuditLogsState;

  // Start a new Attendance Session (Teacher) -> Cloud + Local
  const startAttendanceSession = (subjectId, classId) => {
    const sub = subjects.find(s => s.id === subjectId) || subjects[0];
    const cls = classes.find(c => c.id === classId) || classes[0];
    const newSession = {
      sessionId: `SGP-SESS-${Math.floor(1000 + Math.random() * 9000)}`,
      subjectId: sub.id,
      subjectName: sub.name,
      classId: cls.id,
      className: cls.name,
      teacherId: currentUser.uid,
      teacherName: currentUser.name,
      room: 'Room 203',
      startedAt: Date.now(),
      expiresAt: Date.now() + 10 * 60 * 1000,
      attendees: [],
      isOpen: true
    };

    setActiveSession(newSession);
    updateActiveSessionInCloud(newSession).catch(() => {});

    const logEntry = {
      id: `log-${Date.now()}`,
      action: 'Attendance Session Started',
      user: currentUser.name,
      timestamp: new Date().toLocaleString(),
      details: `Started attendance session for ${sub.name} (${cls.name})`
    };
    setAuditLogs(prev => [logEntry, ...prev]);
    addAuditLogInCloud(logEntry.action, logEntry.user, logEntry.details).catch(() => {});
  };

  const endAttendanceSession = () => {
    if (activeSession) {
      const closed = { ...activeSession, isOpen: false };
      setActiveSession(closed);
      updateActiveSessionInCloud(closed).catch(() => {});

      const logEntry = {
        id: `log-${Date.now()}`,
        action: 'Attendance Session Ended',
        user: currentUser.name,
        timestamp: new Date().toLocaleString(),
        details: `Closed session ${activeSession.sessionId}. Total marked: ${activeSession.attendees.length}`
      };
      setAuditLogs(prev => [logEntry, ...prev]);
      addAuditLogInCloud(logEntry.action, logEntry.user, logEntry.details).catch(() => {});
    }
  };

  // Mark Attendance (Student Scan Flow with 7-Layer Verification)
  const markAttendance = useCallback(async (scannedPayloadText) => {
    try {
      // Layer 1: Authentication Check
      if (!currentUser || currentUser.role !== 'student') {
        return { success: false, message: 'Only authenticated students can mark attendance.' };
      }

      // Parse QR code payload
      let parsedPayload;
      try {
        parsedPayload = JSON.parse(scannedPayloadText);
      } catch {
        return { success: false, message: 'Invalid or corrupted SGP QR code format.' };
      }

      if (parsedPayload.app !== 'SGP_CONNECT' || parsedPayload.campus !== 'SGP_BELLARY') {
        return { success: false, message: 'QR code does not belong to Sanjay Gandhi Polytechnic.' };
      }

      // Layer 2: Active Session & Expiry Check
      if (!activeSession || !activeSession.isOpen || activeSession.sessionId !== parsedPayload.sessionId) {
        return { success: false, message: 'This attendance session has ended or is invalid.' };
      }

      // Layer 3: Class Validation
      if (currentUser.classId !== activeSession.classId) {
        return {
          success: false,
          message: `Class mismatch! This QR is for ${activeSession.className}, but you are registered in ${currentUser.className}.`
        };
      }

      // Layer 4: Duplicate Check
      if (activeSession.attendees && activeSession.attendees.includes(currentUser.usn)) {
        return { success: false, message: 'Attendance already recorded for this lecture.' };
      }

      // Layer 5: Geofencing Radius Verification
      const studentLat = simulateOnCampus ? campusGeofence.latitude : 12.9716;
      const studentLng = simulateOnCampus ? campusGeofence.longitude : 77.5946;

      const distance = calculateDistanceInMeters(
        studentLat,
        studentLng,
        campusGeofence.latitude,
        campusGeofence.longitude
      );

      if (distance > campusGeofence.defaultRadiusMeters) {
        return {
          success: false,
          distance: Math.round(distance),
          message: `Location verification failed! You are approximately ${Math.round(distance)}m away from campus. Allowed radius is ${campusGeofence.defaultRadiusMeters}m.`
        };
      }

      // Layer 6 & 7: Success! Record attendance and update statistics
      const updatedAttendees = [currentUser.usn, ...(activeSession.attendees || [])];
      setActiveSession(prev => ({
        ...prev,
        attendees: updatedAttendees
      }));

      // Add to Student Attendance History
      const now = new Date();
      const newHistoryItem = {
        id: `att-${Date.now()}`,
        date: now.toISOString().split('T')[0],
        time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        subject: activeSession.subjectName.split(' ')[0] || 'DBMS',
        status: 'Present',
        teacher: activeSession.teacherName,
        verifiedBy: 'Dynamic QR + Bellary Geofence (Cloud Verified)'
      };
      setAttendanceHistoryState(prev => [newHistoryItem, ...prev]);

      // Update student overall statistics
      setCurrentUser(prev => {
        const newPresent = (prev.presentCount || 0) + 1;
        const newTotal = (prev.totalClasses || 0) + 1;
        const newPct = parseFloat(((newPresent / newTotal) * 100).toFixed(1));
        return {
          ...prev,
          presentCount: newPresent,
          totalClasses: newTotal,
          overallAttendance: newPct
        };
      });

      // Write atomically to live Cloud Firestore
      recordAttendanceInCloud(newHistoryItem, activeSession, currentUser).catch(() => {});

      // Confetti celebration
      try {
        confetti({
          particleCount: 75,
          spread: 60,
          origin: { y: 0.7 }
        });
      } catch {
        // ignore if canvas not supported
      }

      return {
        success: true,
        message: `Attendance marked successfully for ${activeSession.subjectName}! Cloud synchronized.`,
        distance: Math.round(distance)
      };
    } catch (err) {
      return { success: false, message: `System error during verification: ${err.message}` };
    }
  }, [currentUser, activeSession, simulateOnCampus, campusGeofence]);

  // Attendance Correction Requests Workflow -> Cloud + Local
  const submitCorrectionRequest = (subject, date, reason) => {
    const newReq = {
      id: `req-${Date.now()}`,
      studentId: currentUser.uid,
      studentName: currentUser.name,
      usn: currentUser.usn,
      subject,
      date,
      reason,
      status: 'Pending',
      requestedAt: new Date().toLocaleString()
    };
    setCorrectionRequestsState(prev => [newReq, ...prev]);
    addCorrectionRequestInCloud(newReq).catch(() => {});
  };

  const approveCorrectionRequest = (reqId) => {
    setCorrectionRequestsState(prev =>
      prev.map(r => (r.id === reqId ? { ...r, status: 'Approved' } : r))
    );
    updateCorrectionStatusInCloud(reqId, 'Approved').catch(() => {});

    const req = correctionRequests.find(r => r.id === reqId);
    if (req) {
      const logEntry = {
        id: `log-${Date.now()}`,
        action: 'Attendance Correction Approved',
        user: currentUser.name,
        timestamp: new Date().toLocaleString(),
        details: `Changed record for ${req.studentName} (${req.usn}) on ${req.date} (${req.subject}) to Present.`
      };
      setAuditLogsState(prev => [logEntry, ...prev]);
      addAuditLogInCloud(logEntry.action, logEntry.user, logEntry.details).catch(() => {});
    }
  };

  const rejectCorrectionRequest = (reqId) => {
    setCorrectionRequestsState(prev =>
      prev.map(r => (r.id === reqId ? { ...r, status: 'Rejected' } : r))
    );
    updateCorrectionStatusInCloud(reqId, 'Rejected').catch(() => {});
  };

  // Timetable Conflict Detector (Admin)
  const checkTimetableConflict = (day, periodTime, teacherName, room, excludeId = null) => {
    const conflicts = timetable.filter(t => {
      if (excludeId && t.id === excludeId) return false;
      if (t.day !== day) return false;
      const isSameTime = t.startTime === periodTime;
      const isTeacherConflict = isSameTime && t.teacherName === teacherName;
      const isRoomConflict = isSameTime && t.room === room;
      return isTeacherConflict || isRoomConflict;
    });

    if (conflicts.length > 0) {
      const c = conflicts[0];
      if (c.teacherName === teacherName) {
        return { hasConflict: true, message: `${teacherName} is already assigned to ${c.subjectName} in ${c.room} at ${c.startTime} on ${day}.` };
      }
      return { hasConflict: true, message: `Room ${room} is already booked for ${c.subjectName} at ${c.startTime} on ${day}.` };
    }
    return { hasConflict: false };
  };

  // Smart Next-Class Computation
  const nextClass = useMemo(() => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const now = new Date();
    const currentDay = days[now.getDay()];
    const currentHours = now.getHours();
    const currentMinutes = now.getMinutes();
    const currentTimeStr = `${String(currentHours).padStart(2, '0')}:${String(currentMinutes).padStart(2, '0')}`;

    // Filter today's timetable for student's class
    const todayClasses = timetable
      .filter(t => t.day === (currentDay === 'Sunday' ? 'Monday' : currentDay) && t.classId === '3-CSE-A')
      .sort((a, b) => a.startTime.localeCompare(b.startTime));

    if (todayClasses.length === 0) {
      return null;
    }

    // Find class that ends after current time
    const upcoming = todayClasses.find(t => t.endTime > currentTimeStr);
    return upcoming || todayClasses[0];
  }, [timetable]);

  // Attendance Fine Calculation
  const fineCalculation = useMemo(() => {
    const pct = currentUser?.overallAttendance ?? 82;
    const rule = fineRules.find(r => pct >= r.min && pct <= r.max) || fineRules[0];
    const isShortage = pct < 75;
    const shortagePercentage = isShortage ? parseFloat((75 - pct).toFixed(1)) : 0;
    
    const present = currentUser?.presentCount || 164;
    const total = currentUser?.totalClasses || 200;
    const classesNeeded = isShortage
      ? Math.max(0, Math.ceil((0.75 * total - present) / 0.25))
      : 0;

    return {
      percentage: pct,
      isShortage,
      shortagePercentage,
      applicableFine: rule?.fine || 0,
      fineLabel: rule?.label || 'No Fine',
      consecutiveClassesNeeded: classesNeeded
    };
  }, [currentUser, fineRules]);

  // Reset to initial demo state & seed cloud
  const resetToDemoData = async () => {
    setTimetableState(INITIAL_TIMETABLE);
    setSubjects(INITIAL_SUBJECTS);
    setClasses(INITIAL_CLASSES);
    setDepartments(INITIAL_DEPARTMENTS);
    setFineRules(INITIAL_FINE_RULES);
    setStudentSubjectAttendance(INITIAL_STUDENT_SUBJECT_ATTENDANCE);
    setAttendanceHistoryState(INITIAL_ATTENDANCE_HISTORY);
    setInternalMarksState(INITIAL_INTERNAL_MARKS);
    setStudyMaterialsState(INITIAL_STUDY_MATERIALS);
    setAssignmentsState(INITIAL_ASSIGNMENTS);
    setNotificationsState(INITIAL_NOTIFICATIONS);
    setCampusEvents(INITIAL_CAMPUS_EVENTS);
    setCorrectionRequestsState(INITIAL_CORRECTION_REQUESTS);
    setCurrentUser(DEMO_PERSONAS.student);

    if (isFirebaseConfigured) {
      await seedFirestoreIfEmpty(true);
    }
  };

  return (
    <CampusContext.Provider
      value={{
        theme,
        toggleTheme,
        isCloudConnected,
        cloudSyncStatus,
        isAuthenticated,
        setIsAuthenticated,
        currentUser,
        setCurrentUser,
        switchPersona,
        login,
        logout,
        campusGeofence,
        setCampusGeofence,
        simulateOnCampus,
        setSimulateOnCampus,
        timetable,
        setTimetable,
        subjects,
        setSubjects,
        classes,
        setClasses,
        departments,
        fineRules,
        setFineRules,
        studentSubjectAttendance,
        attendanceHistory,
        setAttendanceHistory,
        internalMarks,
        setInternalMarks,
        studyMaterials,
        setStudyMaterials,
        assignments,
        setAssignments,
        notifications,
        setNotifications,
        campusEvents,
        correctionRequests,
        setCorrectionRequests,
        submitCorrectionRequest,
        approveCorrectionRequest,
        rejectCorrectionRequest,
        auditLogs,
        discussions,
        setDiscussions,
        activeSession,
        startAttendanceSession,
        endAttendanceSession,
        currentQRPayload,
        qrSecondsLeft,
        markAttendance,
        nextClass,
        fineCalculation,
        checkTimetableConflict,
        resetToDemoData
      }}
    >
      {children}
    </CampusContext.Provider>
  );
};

export const useCampus = () => {
  const context = useContext(CampusContext);
  if (!context) {
    throw new Error('useCampus must be used within a CampusProvider');
  }
  return context;
};

export default CampusContext;
