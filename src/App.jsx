// ============================================================================
// SGP CONNECT — MAIN APPLICATION ENTRY
// Sanjay Gandhi Polytechnic Digital Campus (Bellary)
// ============================================================================

import React, { useState, useEffect } from 'react';
import { CampusProvider, useCampus } from './context/CampusContext';
import DevBar from './components/DevBar';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import BottomNav from './components/BottomNav';
import UrgentAlertBanner from './components/UrgentAlertBanner';
import StudentPortal from './pages/student/StudentPortal';
import TeacherPortal from './pages/teacher/TeacherPortal';
import AdminPortal from './pages/admin/AdminPortal';
import LoginPage from './pages/auth/LoginPage';

function CampusApp() {
  const { currentUser, isAuthenticated } = useCampus();
  const role = currentUser?.role || 'student';

  // Default active tab based on active role
  const [activeTab, setActiveTab] = useState(() => {
    return role === 'student'
      ? 'dashboard'
      : role === 'teacher'
      ? 'teacher-dashboard'
      : 'admin-dashboard';
  });

  // Sync active tab whenever role changes
  useEffect(() => {
    if (role === 'student') {
      setActiveTab('dashboard');
    } else if (role === 'teacher') {
      setActiveTab('teacher-dashboard');
    } else if (role === 'admin') {
      setActiveTab('admin-dashboard');
    }
  }, [role]);

  // ─── NOT AUTHENTICATED: Show Login Page only ───────────────────────────
  // DevBar is shown only on the login page so evaluators can easily switch roles
  if (!isAuthenticated) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <DevBar />
        <LoginPage />
      </div>
    );
  }

  // ─── AUTHENTICATED: Show role-specific portal only ────────────────────
  // DevBar is hidden so users only see their own portal. Role switching is not
  // exposed to end-users; they must log out and log in with the correct role.
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Urgent Campus Alert Banner — sits at very top, above Navbar */}
      <UrgentAlertBanner />

      {/* Top Navigation */}
      <Navbar />

      {/* Body: Sidebar + Main Content */}
      <div className="app-container">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        <main className="main-content">
          <div className="page-content">
            {/* Each role sees ONLY their own portal */}
            {role === 'student' && (
              <StudentPortal activeTab={activeTab} setActiveTab={setActiveTab} />
            )}
            {role === 'teacher' && (
              <TeacherPortal activeTab={activeTab} setActiveTab={setActiveTab} />
            )}
            {role === 'admin' && (
              <AdminPortal activeTab={activeTab} setActiveTab={setActiveTab} />
            )}
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}

export default function App() {
  return (
    <CampusProvider>
      <CampusApp />
    </CampusProvider>
  );
}
