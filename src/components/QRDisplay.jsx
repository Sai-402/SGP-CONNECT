// ============================================================================
// SGP CONNECT — DYNAMIC ROLLING QR DISPLAY (FACULTY SIDE)
// High-security rotating QR code that regenerates every 15-20 seconds
// ============================================================================

import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useCampus } from '../context/CampusContext';
import { ShieldCheck, MapPin, Users, Timer, XCircle, RefreshCw } from 'lucide-react';

export default function QRDisplay() {
  const {
    activeSession,
    endAttendanceSession,
    currentQRPayload,
    qrSecondsLeft,
    campusGeofence
  } = useCampus();

  if (!activeSession || !activeSession.isOpen) {
    return (
      <div className="card card-glass" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
        <XCircle size={48} color="var(--text-muted)" style={{ margin: '0 auto 1rem' }} />
        <h3 style={{ marginBottom: '0.5rem' }}>No Active Attendance Session</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
          Select a subject and classroom to generate a temporary rolling QR code for your students.
        </p>
      </div>
    );
  }

  // Calculate percentage of 15 seconds remaining
  const timerPercentage = (qrSecondsLeft / 15) * 100;

  return (
    <div className="card card-glass animate-fade-in" style={{ maxWidth: '600px', margin: '0 auto' }}>
      {/* Session Header */}
      <div className="flex-between" style={{ marginBottom: '1.25rem', paddingBottom: '0.85rem', borderBottom: '1px solid var(--border-light)' }}>
        <div>
          <span className="badge badge-success" style={{ marginBottom: '0.4rem' }}>
            ● Live Attendance Session
          </span>
          <h2 style={{ fontSize: '1.3rem' }}>{activeSession.subjectName}</h2>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Class: <strong>{activeSession.className}</strong> • Venue: <strong>{activeSession.room}</strong>
          </div>
        </div>

        <button
          type="button"
          onClick={endAttendanceSession}
          className="btn btn-sm btn-danger"
        >
          End Session
        </button>
      </div>

      {/* Dynamic QR Code Display Container */}
      <div className="qr-container">
        {currentQRPayload ? (
          <div style={{ position: 'relative', padding: '12px', background: '#FFFFFF', borderRadius: '16px' }}>
            <QRCodeSVG
              value={currentQRPayload}
              size={240}
              level="H"
              includeMargin={true}
            />
          </div>
        ) : (
          <div>Session ended</div>
        )}

        {/* 15s Rotation Timer Bar */}
        <div style={{ width: '100%', marginTop: '1.25rem' }}>
          <div className="flex-between" style={{ fontSize: '0.8rem', color: '#1E293B', fontWeight: 700, marginBottom: '0.35rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <Timer size={15} color="#2563EB" /> Anti-Proxy Rotation
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', color: qrSecondsLeft <= 3 ? '#DC2626' : '#2563EB' }}>
              Refreshes in {qrSecondsLeft}s
            </span>
          </div>

          <div style={{ width: '100%', height: '6px', background: '#E2E8F0', borderRadius: '4px', overflow: 'hidden' }}>
            <div
              style={{
                width: `${timerPercentage}%`,
                height: '100%',
                background: qrSecondsLeft <= 3 ? '#DC2626' : '#2563EB',
                transition: 'width 1s linear'
              }}
            />
          </div>
        </div>
      </div>

      {/* Security Info & Live Ticker */}
      <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div className="grid-cols-2">
          <div
            style={{
              padding: '0.85rem',
              background: 'var(--surface-raised)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-light)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem'
            }}
          >
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: 'var(--success-muted)',
                color: 'var(--success)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Users size={18} />
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Students Marked</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800 }}>
                {activeSession.attendees.length} / 58
              </div>
            </div>
          </div>

          <div
            style={{
              padding: '0.85rem',
              background: 'var(--surface-raised)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-light)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem'
            }}
          >
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: 'var(--primary-muted)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <MapPin size={18} />
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Geofence Area</div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>
                SGP Bellary ({campusGeofence.defaultRadiusMeters}m)
              </div>
            </div>
          </div>
        </div>

        {/* Real-time attendee chips */}
        {activeSession.attendees.length > 0 && (
          <div style={{ padding: '0.85rem', background: 'var(--surface-raised)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
              RECENT VERIFIED SCANS:
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
              {activeSession.attendees.map(usn => (
                <span key={usn} className="badge badge-primary" style={{ fontFamily: 'var(--font-mono)' }}>
                  ✓ {usn}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
