// ============================================================================
// SGP CONNECT DESKTOP SIDEBAR NAVIGATION
// Dynamically adjusts tabs based on active role (Student, Faculty, Admin)
// ============================================================================

import React from 'react';
import { useCampus } from '../context/CampusContext';
import {
  LayoutDashboard,
  QrCode,
  CalendarDays,
  Award,
  BookOpen,
  FileText,
  MessageSquare,
  Sparkles,
  PartyPopper,
  CreditCard,
  Users,
  CheckCircle,
  Upload,
  Settings,
  ShieldAlert,
  Building2,
  FileSpreadsheet
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab }) {
  const { currentUser } = useCampus();
  const role = currentUser?.role || 'student';

  const studentTabs = [
    { id: 'dashboard', label: 'Dashboard (My Day)', icon: LayoutDashboard },
    { id: 'attendance', label: 'Attendance & QR', icon: QrCode },
    { id: 'timetable', label: 'Timetable', icon: CalendarDays },
    { id: 'marks', label: 'Internal Marks', icon: Award },
    { id: 'materials', label: 'Study Materials', icon: BookOpen },
    { id: 'assignments', label: 'Assignments', icon: FileText },
    { id: 'questions', label: 'Q&A Discussions', icon: MessageSquare },
    { id: 'ai', label: 'AI Academic Advisor', icon: Sparkles },
    { id: 'idcard', label: 'Digital Student ID', icon: CreditCard },
    { id: 'events', label: 'Campus Events', icon: PartyPopper }
  ];

  const teacherTabs = [
    { id: 'teacher-dashboard', label: 'Faculty Dashboard', icon: LayoutDashboard },
    { id: 'qr-generator', label: 'Dynamic QR Session', icon: QrCode },
    { id: 'attendance-reports', label: 'Attendance & Corrections', icon: CheckCircle },
    { id: 'marks-entry', label: 'Internal Marks Entry', icon: Award },
    { id: 'materials-manager', label: 'Upload Materials', icon: Upload },
    { id: 'assignments-manager', label: 'Manage Assignments', icon: FileText },
    { id: 'student-questions', label: 'Student Inquiries', icon: MessageSquare }
  ];

  const adminTabs = [
    { id: 'admin-dashboard', label: 'Admin Command Center', icon: LayoutDashboard },
    { id: 'timetable-manager', label: 'Timetable & Conflicts', icon: CalendarDays },
    { id: 'geofence-rules', label: 'Geofencing & Fine Rules', icon: Settings },
    { id: 'academic-risk', label: 'Academic Risk Watch', icon: ShieldAlert },
    { id: 'audit-logs', label: 'System Audit Logs', icon: FileSpreadsheet }
  ];

  const currentTabs = role === 'student' ? studentTabs : role === 'teacher' ? teacherTabs : adminTabs;

  return (
    <aside className="sidebar">
      <div style={{ padding: '1.25rem 1.25rem 0.5rem' }}>
        <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          {role.toUpperCase()} PORTAL
        </div>
      </div>

      <nav className="sidebar-nav">
        {currentTabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              className={`sidebar-item ${isActive ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <Icon size={19} color={isActive ? 'var(--primary-light)' : 'currentColor'} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>

      {/* College Info Footer */}
      <div style={{ padding: '1rem', borderTop: '1px solid var(--border-light)', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
        <div style={{ fontWeight: 700, color: 'var(--text-secondary)' }}>SGP Bellary</div>
        <div>Academic Year 2026-2027</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.25rem' }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10B981', display: 'inline-block' }} />
          Campus Server Active
        </div>
      </div>
    </aside>
  );
}
