// ============================================================================
// SGP CONNECT MOBILE BOTTOM NAVIGATION BAR
// Provides touch-first navigation on mobile/tablet viewports
// ============================================================================

import React from 'react';
import { useCampus } from '../context/CampusContext';
import {
  LayoutDashboard,
  QrCode,
  CalendarDays,
  Sparkles,
  CreditCard,
  CheckCircle,
  FileSpreadsheet
} from 'lucide-react';

export default function BottomNav({ activeTab, setActiveTab }) {
  const { currentUser } = useCampus();
  const role = currentUser?.role || 'student';

  const studentItems = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
    { id: 'attendance', label: 'Attendance', icon: QrCode },
    { id: 'timetable', label: 'Timetable', icon: CalendarDays },
    { id: 'ai', label: 'AI Advisor', icon: Sparkles },
    { id: 'idcard', label: 'ID Card', icon: CreditCard }
  ];

  const teacherItems = [
    { id: 'teacher-dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'qr-generator', label: 'Live QR', icon: QrCode },
    { id: 'attendance-reports', label: 'Reports', icon: CheckCircle },
    { id: 'student-questions', label: 'Inquiries', icon: Sparkles }
  ];

  const adminItems = [
    { id: 'admin-dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'timetable-manager', label: 'Timetable', icon: CalendarDays },
    { id: 'academic-risk', label: 'Risk Watch', icon: CheckCircle },
    { id: 'audit-logs', label: 'Audit Logs', icon: FileSpreadsheet }
  ];

  const items = role === 'student' ? studentItems : role === 'teacher' ? teacherItems : adminItems;

  return (
    <nav className="bottom-nav">
      {items.map(item => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            type="button"
            className={`bottom-nav-item ${isActive ? 'active' : ''}`}
            onClick={() => setActiveTab(item.id)}
          >
            <Icon size={20} color={isActive ? 'var(--primary-light)' : 'var(--text-muted)'} />
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
