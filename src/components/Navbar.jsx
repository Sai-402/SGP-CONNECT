// ============================================================================
// SGP CONNECT TOP NAVBAR
// Sanjay Gandhi Polytechnic, Bellary
// ============================================================================

import React, { useState } from 'react';
import { useCampus } from '../context/CampusContext';
import {
  Bell,
  Sun,
  Moon,
  GraduationCap,
  Sparkles,
  ChevronDown,
  X,
  CheckCircle2,
  Calendar,
  AlertCircle,
  LogOut
} from 'lucide-react';

export default function Navbar() {
  const { theme, toggleTheme, currentUser, notifications, setNotifications, logout } = useCampus();
  const [showNotifications, setShowNotifications] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const roleBadgeColor = {
    student: 'badge-primary',
    teacher: 'badge-warning',
    admin: 'badge-danger'
  }[currentUser?.role || 'student'];

  return (
    <nav className="navbar">
      <div className="brand-wrapper">
        <div className="brand-logo-icon" style={{ overflow: 'hidden', background: '#fff', padding: '2px' }}>
          <img
            src="/sgp-logo.jpg"
            alt="SGP Logo"
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            onError={e => { e.currentTarget.style.display = 'none'; }}
          />
        </div>
        <div>
          <div className="brand-title">SGP CONNECT</div>
          <div className="brand-subtitle">Sanjay Gandhi Polytechnic, Bellary</div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
        {/* Theme Toggle Button */}
        <button
          type="button"
          onClick={toggleTheme}
          className="btn-icon btn-secondary"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          aria-label="Toggle Theme"
        >
          {theme === 'dark' ? <Sun size={18} color="#F59E0B" /> : <Moon size={18} color="#6366F1" />}
        </button>

        {/* Notifications Bell */}
        <div style={{ position: 'relative' }}>
          <button
            type="button"
            className="btn-icon btn-secondary"
            onClick={() => setShowNotifications(prev => !prev)}
            title="Notifications"
            aria-label="Notifications"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '6px',
                  right: '6px',
                  width: '9px',
                  height: '9px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--danger)',
                  border: '2px solid var(--surface-base)'
                }}
              />
            )}
          </button>

          {/* Notifications Dropdown Drawer */}
          {showNotifications && (
            <div
              className="card card-glass animate-fade-in"
              style={{
                position: 'absolute',
                top: '52px',
                right: 0,
                width: '340px',
                maxHeight: '440px',
                padding: '1rem',
                zIndex: 100,
                boxShadow: 'var(--shadow-lg)'
              }}
            >
              <div className="flex-between" style={{ marginBottom: '0.85rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Bell size={16} color="var(--primary-light)" />
                  <span style={{ fontWeight: 700, fontSize: '0.92rem' }}>Notifications</span>
                  {unreadCount > 0 && (
                    <span className="badge badge-primary">{unreadCount} New</span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={markAllRead}
                    style={{ fontSize: '0.75rem', color: 'var(--primary-light)', fontWeight: 600 }}
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', overflowY: 'auto', maxHeight: '340px' }}>
                {notifications.map(n => (
                  <div
                    key={n.id}
                    style={{
                      padding: '0.65rem',
                      borderRadius: 'var(--radius-sm)',
                      background: n.read ? 'transparent' : 'var(--primary-muted)',
                      border: '1px solid var(--border-light)'
                    }}
                  >
                    <div className="flex-between" style={{ marginBottom: '0.2rem' }}>
                      <span className="badge badge-secondary" style={{ fontSize: '0.65rem' }}>
                        {n.category}
                      </span>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{n.timestamp}</span>
                    </div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.2rem' }}>
                      {n.title}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.3 }}>
                      {n.message}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Mini Badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            padding: '0.35rem 0.75rem',
            background: 'var(--surface-raised)',
            borderRadius: 'var(--radius-full)',
            border: '1px solid var(--border-light)'
          }}
        >
          <img
            src={currentUser?.avatar}
            alt={currentUser?.name}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '1.5px solid var(--primary)'
            }}
          />
          <div style={{ display: 'none', lineHeight: 1.2 }} className="desktop-user-info">
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)' }}>
              {currentUser?.name?.split(' ')[0]}
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              {currentUser?.usn || currentUser?.staffId}
            </div>
          </div>
          <span className={`badge ${roleBadgeColor}`} style={{ fontSize: '0.68rem', padding: '0.15rem 0.5rem' }}>
            {currentUser?.role}
          </span>
        </div>

        {/* Sign Out / Switch User Button */}
        <button
          type="button"
          onClick={logout}
          className="btn btn-sm btn-secondary"
          style={{ fontSize: '0.78rem', color: 'var(--danger)', gap: '0.35rem' }}
          title="Sign Out to Login Page"
        >
          <LogOut size={14} /> Sign Out
        </button>
      </div>
    </nav>
  );
}
