// ============================================================================
// SGP CONNECT — DEV EVALUATION BAR & PERSONA SWITCHER
// Allows instant switching between Student, Teacher, and Admin roles
// ============================================================================

import React from 'react';
import { useCampus } from '../context/CampusContext';
import { UserCheck, MapPin, RefreshCw, Shield, Sparkles, Flame } from 'lucide-react';

export default function DevBar() {
  const {
    currentUser,
    switchPersona,
    simulateOnCampus,
    setSimulateOnCampus,
    resetToDemoData,
    logout,
    isCloudConnected,
    cloudSyncStatus
  } = useCampus();

  return (
    <div className="dev-banner">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 700 }}>
          <Shield size={14} color="#818CF8" /> SGP Dev Switcher:
        </span>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.25rem',
            padding: '0.15rem 0.5rem',
            borderRadius: '9999px',
            fontSize: '0.7rem',
            fontWeight: 700,
            background: isCloudConnected ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
            color: isCloudConnected ? '#34D399' : '#FBBF24',
            border: `1px solid ${isCloudConnected ? 'rgba(16, 185, 129, 0.4)' : 'rgba(245, 158, 11, 0.4)'}`
          }}
          title="Firebase Live Cloud Sync: sgp-connect-c97ab"
        >
          <Flame size={12} />
          {isCloudConnected ? 'Firebase Live' : 'Offline Mode'}
        </span>
        <div className="dev-role-pills">
          <button
            type="button"
            className={`dev-pill ${currentUser?.role === 'student' ? 'active' : ''}`}
            onClick={() => switchPersona('student')}
          >
            🎓 Student (Rahul)
          </button>
          <button
            type="button"
            className={`dev-pill ${currentUser?.role === 'teacher' ? 'active' : ''}`}
            onClick={() => switchPersona('teacher')}
          >
            👩‍🏫 Faculty (Prof. Anitha)
          </button>
          <button
            type="button"
            className={`dev-pill ${currentUser?.role === 'admin' ? 'active' : ''}`}
            onClick={() => switchPersona('admin')}
          >
            🏛️ Admin (Principal)
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
        {/* Geofence Simulator Toggle */}
        <button
          type="button"
          onClick={() => setSimulateOnCampus(prev => !prev)}
          className="btn btn-sm"
          style={{
            background: simulateOnCampus ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.25)',
            border: `1px solid ${simulateOnCampus ? '#10B981' : '#EF4444'}`,
            color: simulateOnCampus ? '#34D399' : '#FCA5A5',
            fontSize: '0.74rem'
          }}
          title="Toggle between simulating inside Bellary campus vs outside campus to test geofencing rejection"
        >
          <MapPin size={13} />
          {simulateOnCampus ? 'GPS: Inside SGP Bellary (In Radius)' : 'GPS: Off-Campus Simulator (Will Reject)'}
        </button>

        {/* Reset Demo Data */}
        <button
          type="button"
          onClick={() => {
            if (window.confirm('Reset all attendance, timetable, and marks to pristine demo records?')) {
              resetToDemoData();
            }
          }}
          className="btn btn-sm btn-secondary"
          style={{ fontSize: '0.74rem', padding: '0.2rem 0.5rem' }}
          title="Restore seed data"
        >
          <RefreshCw size={12} /> Reset Data
        </button>

        {/* View Dedicated Login Page */}
        <button
          type="button"
          onClick={logout}
          className="btn btn-sm btn-secondary"
          style={{ fontSize: '0.74rem', padding: '0.2rem 0.6rem', color: '#A5B4FC', border: '1px solid rgba(165, 180, 252, 0.3)' }}
          title="Go to Dedicated Student / Faculty Login Page"
        >
          🔑 Login Page
        </button>
      </div>
    </div>
  );
}
