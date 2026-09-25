// ============================================================================
// SGP CONNECT — URGENT CAMPUS ALERT BANNER
// Displays pinned, urgent notifications (holidays, exams) at the very top
// Dismissible per session. Shows first unread urgent alert.
// ============================================================================

import React, { useState, useEffect } from 'react';
import { X, ChevronRight } from 'lucide-react';

const URGENT_ALERT_KEY = 'sgp_dismissed_alerts';

// Curated urgent alerts for demo (holiday / internal exam warnings)
export const URGENT_ALERTS = [
  {
    id: 'ua-1',
    type: 'holiday',
    icon: '🏖️',
    badge: 'HOLIDAY',
    badgeColor: '#10B981',
    bgGradient: 'linear-gradient(135deg, rgba(16,185,129,0.18) 0%, rgba(6,78,59,0.28) 100%)',
    borderColor: 'rgba(16, 185, 129, 0.55)',
    title: 'Tomorrow is a College Holiday',
    message: '26th September 2026 (Saturday) — Dasara Festival Holiday. All classes, labs and exams stand cancelled. Stay safe!'
  },
  {
    id: 'ua-2',
    type: 'exam',
    icon: '📝',
    badge: 'EXAM ALERT',
    badgeColor: '#F59E0B',
    bgGradient: 'linear-gradient(135deg, rgba(245,158,11,0.18) 0%, rgba(120,53,15,0.28) 100%)',
    borderColor: 'rgba(245, 158, 11, 0.55)',
    title: 'IA-2 Internal Assessment — Starts 5th October',
    message: 'Second Internal Tests begin from 05 October 2026 for all 5th Semester CSE students. Timetable posted in Notices.'
  },
  {
    id: 'ua-3',
    type: 'warning',
    icon: '⚠️',
    badge: 'ATTENDANCE WARNING',
    badgeColor: '#EF4444',
    bgGradient: 'linear-gradient(135deg, rgba(239,68,68,0.18) 0%, rgba(127,29,29,0.28) 100%)',
    borderColor: 'rgba(239, 68, 68, 0.55)',
    title: 'Attendance Shortage Detected — Computer Networks',
    message: 'Your Computer Networks attendance is 73.7% — below the 75% threshold. Attend all upcoming classes to avoid fine.'
  }
];

export default function UrgentAlertBanner() {
  const [dismissed, setDismissed] = useState(() => {
    try {
      return JSON.parse(sessionStorage.getItem(URGENT_ALERT_KEY) || '[]');
    } catch {
      return [];
    }
  });
  const [currentIndex, setCurrentIndex] = useState(0);

  const visible = URGENT_ALERTS.filter(a => !dismissed.includes(a.id));

  useEffect(() => {
    setCurrentIndex(0);
  }, [dismissed.length]);

  useEffect(() => {
    if (visible.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % visible.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [visible.length]);

  if (visible.length === 0) return null;

  const alert = visible[Math.min(currentIndex, visible.length - 1)];

  const dismiss = (id) => {
    const next = [...dismissed, id];
    setDismissed(next);
    sessionStorage.setItem(URGENT_ALERT_KEY, JSON.stringify(next));
  };

  return (
    <div
      role="alert"
      aria-live="polite"
      style={{
        background: alert.bgGradient,
        borderBottom: `2px solid ${alert.borderColor}`,
        padding: '0.65rem 1.25rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        position: 'sticky',
        top: 0,
        zIndex: 200,
        animation: 'fadeInDown 0.4s ease'
      }}
    >
      {/* Animated pulsing left accent */}
      <div style={{
        width: '4px',
        minWidth: '4px',
        height: '36px',
        borderRadius: '4px',
        background: alert.badgeColor,
        animation: 'pulse 1.8s ease-in-out infinite',
        boxShadow: '0 0 10px ' + alert.badgeColor
      }} />

      {/* Icon */}
      <span style={{ fontSize: '1.3rem', lineHeight: 1 }}>{alert.icon}</span>

      {/* Badge */}
      <span style={{
        padding: '0.2rem 0.55rem',
        borderRadius: '4px',
        background: alert.badgeColor,
        color: '#FFF',
        fontSize: '0.65rem',
        fontWeight: 800,
        letterSpacing: '0.07em',
        whiteSpace: 'nowrap',
        flexShrink: 0
      }}>
        {alert.badge}
      </span>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontWeight: 700,
          fontSize: '0.88rem',
          color: 'var(--text-main)',
          marginBottom: '0.1rem',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}>
          {alert.title}
        </div>
        <div style={{
          fontSize: '0.76rem',
          color: 'var(--text-secondary)',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}>
          {alert.message}
        </div>
      </div>

      {/* Alert counter when multiple */}
      {visible.length > 1 && (
        <button
          type="button"
          onClick={() => setCurrentIndex(prev => (prev + 1) % visible.length)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
            padding: '0.2rem 0.5rem',
            borderRadius: '4px',
            border: '1px solid ' + alert.borderColor,
            background: 'rgba(255,255,255,0.08)',
            color: 'var(--text-secondary)',
            fontSize: '0.7rem',
            fontWeight: 600,
            whiteSpace: 'nowrap',
            flexShrink: 0
          }}
        >
          {currentIndex + 1}/{visible.length} <ChevronRight size={11} />
        </button>
      )}

      {/* Dismiss */}
      <button
        type="button"
        onClick={() => dismiss(alert.id)}
        title="Dismiss this alert"
        style={{
          color: 'var(--text-muted)',
          padding: '0.2rem',
          borderRadius: '50%',
          transition: 'all 150ms',
          flexShrink: 0
        }}
        onMouseEnter={e => e.currentTarget.style.color = 'var(--text-main)'}
        onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
      >
        <X size={16} />
      </button>
    </div>
  );
}
