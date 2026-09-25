// ============================================================================
// SGP CONNECT — SECURE CAMPUS LOGIN PORTAL
// Dedicated Role-Based Authentication for Students, Faculty, and Admin
// Sanjay Gandhi Polytechnic, Bellary
// ============================================================================

import React, { useState } from 'react';
import { useCampus } from '../../context/CampusContext';
import {
  GraduationCap,
  ShieldCheck,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  MapPin,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  QrCode,
  Flame
} from 'lucide-react';

export default function LoginPage() {
  const { login, theme, toggleTheme, isCloudConnected } = useCampus();

  const [activeRoleTab, setActiveRoleTab] = useState('student'); // 'student' | 'teacher' | 'admin'
  const [identifier, setIdentifier] = useState('23SGP001');
  const [password, setPassword] = useState('sgp@2026');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Switch role and update default placeholder/credential
  const handleTabChange = (role) => {
    setActiveRoleTab(role);
    setErrorMsg('');
    if (role === 'student') {
      setIdentifier('23SGP001');
      setPassword('sgp@2026');
    } else if (role === 'teacher') {
      setIdentifier('SGP-FAC-014');
      setPassword('sgp@fac2026');
    } else {
      setIdentifier('SGP-ADM-001');
      setPassword('sgp@admin2026');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!identifier.trim()) {
      setErrorMsg('Please enter your valid college identification.');
      return;
    }

    setLoading(true);
    try {
      const res = await login(identifier, password, activeRoleTab);
      setLoading(false);
      if (!res.success) {
        setErrorMsg('Authentication failed. Please verify your credentials.');
      }
    } catch (err) {
      setLoading(false);
      setErrorMsg(err.message || 'Authentication error occurred.');
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '2rem 1rem',
        position: 'relative'
      }}
    >
      {/* Background Decorative Rings */}
      <div
        style={{
          position: 'absolute',
          top: '10%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(37, 99, 235, 0.15) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0
        }}
      />

      <div style={{ width: '100%', maxWidth: '520px', zIndex: 1 }}>
        {/* College Emblem & Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div
            style={{
              width: '80px',
              height: '80px',
              borderRadius: 'var(--radius-lg)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 0.75rem',
              boxShadow: '0 8px 24px var(--primary-glow)',
              overflow: 'hidden',
              background: '#fff',
              padding: '4px'
            }}
          >
            <img
              src="/sgp-logo.jpg"
              alt="Sanjay Gandhi Polytechnic Logo"
              style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: 'calc(var(--radius-lg) - 2px)' }}
              onError={e => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.parentElement.style.background = 'linear-gradient(135deg, var(--primary) 0%, #1D4ED8 100%)';
                e.currentTarget.insertAdjacentHTML('afterend', '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>');
              }}
            />
          </div>

          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, marginBottom: '0.2rem', letterSpacing: '-0.02em' }}>
            SANJAY GANDHI POLYTECHNIC
          </h1>
          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary-light)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            BELLARY, KARNATAKA • ESTD. 1992
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            SGP Connect — One Campus. One Platform. Everything Connected.
          </p>
        </div>

        {/* Main Login Card */}
        <div className="card card-glass animate-fade-in" style={{ padding: '2rem 2.25rem' }}>
          {/* Role Tabs */}
          <div
            style={{
              display: 'flex',
              background: 'var(--surface-raised)',
              padding: '0.35rem',
              borderRadius: 'var(--radius-md)',
              marginBottom: '1.75rem',
              border: '1px solid var(--border-light)'
            }}
          >
            <button
              type="button"
              onClick={() => handleTabChange('student')}
              style={{
                flex: 1,
                padding: '0.65rem',
                fontSize: '0.85rem',
                fontWeight: 700,
                borderRadius: 'var(--radius-sm)',
                transition: 'all 200ms',
                background: activeRoleTab === 'student' ? 'var(--primary)' : 'transparent',
                color: activeRoleTab === 'student' ? '#FFFFFF' : 'var(--text-secondary)'
              }}
            >
              🎓 Student
            </button>

            <button
              type="button"
              onClick={() => handleTabChange('teacher')}
              style={{
                flex: 1,
                padding: '0.65rem',
                fontSize: '0.85rem',
                fontWeight: 700,
                borderRadius: 'var(--radius-sm)',
                transition: 'all 200ms',
                background: activeRoleTab === 'teacher' ? 'var(--primary)' : 'transparent',
                color: activeRoleTab === 'teacher' ? '#FFFFFF' : 'var(--text-secondary)'
              }}
            >
              👩‍🏫 Faculty
            </button>

            <button
              type="button"
              onClick={() => handleTabChange('admin')}
              style={{
                flex: 1,
                padding: '0.65rem',
                fontSize: '0.85rem',
                fontWeight: 700,
                borderRadius: 'var(--radius-sm)',
                transition: 'all 200ms',
                background: activeRoleTab === 'admin' ? 'var(--primary)' : 'transparent',
                color: activeRoleTab === 'admin' ? '#FFFFFF' : 'var(--text-secondary)'
              }}
            >
              🏛️ Admin
            </button>
          </div>

          {/* Role Header Description */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>
              {activeRoleTab === 'student' && 'Student Portal Sign In'}
              {activeRoleTab === 'teacher' && 'Faculty & HOD Sign In'}
              {activeRoleTab === 'admin' && 'Central Administration Login'}
            </h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              {activeRoleTab === 'student' && 'Enter your USN or registered institutional email to access your attendance, timetable, and study notes.'}
              {activeRoleTab === 'teacher' && 'Sign in to start dynamic QR attendance sessions, review correction requests, and update marks.'}
              {activeRoleTab === 'admin' && 'Access institution-wide analytics, timetable conflict engine, and geofencing management.'}
            </p>
          </div>

          {errorMsg && (
            <div
              style={{
                padding: '0.75rem 1rem',
                background: 'var(--danger-muted)',
                border: '1px solid var(--danger)',
                color: 'var(--danger)',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.85rem',
                marginBottom: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <AlertCircle size={16} /> {errorMsg}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <User size={14} color="var(--primary-light)" />
                {activeRoleTab === 'student' && 'University Seat Number (USN) or Email'}
                {activeRoleTab === 'teacher' && 'Faculty Employee ID or Email'}
                {activeRoleTab === 'admin' && 'Administrative ID or Email'}
              </label>
              <input
                type="text"
                className="form-input"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder={
                  activeRoleTab === 'student'
                    ? 'e.g. 23SGP001 or rahul.23sgp001@sgp.edu.in'
                    : activeRoleTab === 'teacher'
                    ? 'e.g. SGP-FAC-014 or anitha.cse@sgp.edu.in'
                    : 'e.g. SGP-ADM-001 or principal@sgp.edu.in'
                }
                required
              />
            </div>

            <div>
              <div className="flex-between" style={{ marginBottom: '0.4rem' }}>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', margin: 0 }}>
                  <Lock size={14} color="var(--primary-light)" /> Password
                </label>
                <button
                  type="button"
                  onClick={() => alert('For testing, use the 1-Click Demo Fill button below or enter any sample password.')}
                  style={{ fontSize: '0.74rem', color: 'var(--primary-light)', fontWeight: 600 }}
                >
                  Forgot Password?
                </button>
              </div>

              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your security password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(p => !p)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--text-muted)'
                  }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary btn-lg"
              style={{ width: '100%', marginTop: '0.5rem' }}
            >
              {loading ? (
                'Authenticating with SGP Server...'
              ) : (
                <>
                  Sign In to Digital Campus <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Pre-Fill Action */}
          <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-light)', textAlign: 'center' }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.65rem' }}>
              QUICK EVALUATION PRESETS:
            </div>
            {activeRoleTab === 'student' && (
              <button
                type="button"
                className="btn btn-sm btn-secondary"
                style={{ width: '100%', fontSize: '0.8rem' }}
                onClick={() => {
                  setIdentifier('23SGP001');
                  setPassword('sgp@2026');
                  login('23SGP001', 'sgp@2026', 'student');
                }}
              >
                ⚡ 1-Click Login: Rahul Kumar (23SGP001 • 3rd Year CSE)
              </button>
            )}
            {activeRoleTab === 'teacher' && (
              <button
                type="button"
                className="btn btn-sm btn-secondary"
                style={{ width: '100%', fontSize: '0.8rem' }}
                onClick={() => {
                  setIdentifier('SGP-FAC-014');
                  setPassword('sgp@fac2026');
                  login('SGP-FAC-014', 'sgp@fac2026', 'teacher');
                }}
              >
                ⚡ 1-Click Login: Prof. Anitha (HOD & Associate Professor - CSE)
              </button>
            )}
            {activeRoleTab === 'admin' && (
              <button
                type="button"
                className="btn btn-sm btn-secondary"
                style={{ width: '100%', fontSize: '0.8rem' }}
                onClick={() => {
                  setIdentifier('SGP-ADM-001');
                  setPassword('sgp@admin2026');
                  login('SGP-ADM-001', 'sgp@admin2026', 'admin');
                }}
              >
                ⚡ 1-Click Login: Dr. B. Nagaraj (Principal & Academic Director)
              </button>
            )}
          </div>
        </div>

        {/* Security & Polytechnic Policy Footer */}
        <div
          style={{
            marginTop: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1.25rem',
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
            flexWrap: 'wrap'
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <ShieldCheck size={14} color="#10B981" /> 7-Layer Anti-Proxy
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <MapPin size={14} color="#3B82F6" /> SGP Bellary Geofence (100m)
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <QrCode size={14} color="#8B5CF6" /> Dynamic 15s QR
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: isCloudConnected ? '#10B981' : '#F59E0B', fontWeight: 600 }}>
            <Flame size={14} color={isCloudConnected ? '#10B981' : '#F59E0B'} />
            {isCloudConnected ? 'Firebase Fullstack Live' : 'Standalone Mode'}
          </span>
        </div>
      </div>
    </div>
  );
}
