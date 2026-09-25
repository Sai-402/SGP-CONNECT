// ============================================================================
// SGP CONNECT — QR SCANNER & GEOFENCE VERIFIER MODAL (STUDENT SIDE)
// Implements 7-layer anti-proxy verification & GPS Geofence testing
// ============================================================================

import React, { useState } from 'react';
import { useCampus } from '../context/CampusContext';
import {
  QrCode,
  MapPin,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Loader2,
  Camera,
  Compass
} from 'lucide-react';

export default function QRScannerModal({ isOpen, onClose }) {
  const {
    currentQRPayload,
    markAttendance,
    simulateOnCampus,
    campusGeofence,
    currentUser,
    activeSession
  } = useCampus();

  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null);

  if (!isOpen) return null;

  const handleExecuteScan = async () => {
    setScanning(true);
    setResult(null);

    // Simulate scanning latency & GPS lock (800ms)
    setTimeout(async () => {
      if (!currentQRPayload) {
        setResult({
          success: false,
          message: 'No active QR code detected on teacher display or camera view.'
        });
        setScanning(false);
        return;
      }

      const res = await markAttendance(currentQRPayload);
      setResult(res);
      setScanning(false);
    }, 900);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(8px)',
        zIndex: 200,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem'
      }}
    >
      <div
        className="card card-glass animate-fade-in"
        style={{
          maxWidth: '500px',
          width: '100%',
          position: 'relative',
          padding: '1.75rem'
        }}
      >
        {/* Header */}
        <div className="flex-between" style={{ marginBottom: '1.25rem' }}>
          <div>
            <span className="badge badge-primary" style={{ marginBottom: '0.3rem' }}>
              Anti-Proxy Attendance
            </span>
            <h3 style={{ fontSize: '1.2rem' }}>Scan Attendance QR</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="btn-icon btn-secondary"
            style={{ width: '32px', height: '32px' }}
          >
            ✕
          </button>
        </div>

        {/* Verification Layers Status */}
        <div style={{ marginBottom: '1.5rem', background: 'var(--surface-raised)', borderRadius: 'var(--radius-md)', padding: '0.85rem' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
            SECURITY VERIFICATION CRITERIA:
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.8rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle2 size={15} color="var(--success)" />
              <span>Student Identity: <strong>{currentUser?.name} ({currentUser?.usn})</strong></span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle2 size={15} color="var(--success)" />
              <span>Class Registration: <strong>{currentUser?.className}</strong></span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Compass size={15} color={simulateOnCampus ? 'var(--success)' : 'var(--danger)'} />
              <span>
                Geofence Radius: <strong>{campusGeofence.defaultRadiusMeters}m</strong> (
                {simulateOnCampus ? (
                  <span style={{ color: 'var(--success)', fontWeight: 700 }}>In Range: SGP Bellary</span>
                ) : (
                  <span style={{ color: 'var(--danger)', fontWeight: 700 }}>Out of Range Simulator</span>
                )}
                )
              </span>
            </div>
          </div>
        </div>

        {/* Radar & Camera Viewport */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div className="radar-box">
            <div className="radar-sweep" />
            {scanning ? (
              <Loader2 size={36} color="var(--primary)" className="animate-spin" />
            ) : (
              <div className="pulse-dot" />
            )}
          </div>

          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            {activeSession?.isOpen ? (
              <div>
                Target Lecture: <strong>{activeSession.subjectName}</strong> in <strong>{activeSession.room}</strong>
              </div>
            ) : (
              <div style={{ color: 'var(--warning)' }}>No active attendance session is running.</div>
            )}
          </div>
        </div>

        {/* Scan Result Feedback */}
        {result && (
          <div
            style={{
              padding: '1rem',
              borderRadius: 'var(--radius-md)',
              marginBottom: '1.25rem',
              background: result.success ? 'var(--success-muted)' : 'var(--danger-muted)',
              border: `1.5px solid ${result.success ? 'var(--success)' : 'var(--danger)'}`,
              color: result.success ? 'var(--success)' : 'var(--danger)',
              display: 'flex',
              gap: '0.75rem',
              alignItems: 'flex-start'
            }}
          >
            {result.success ? <CheckCircle2 size={24} /> : <XCircle size={24} />}
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 800, fontSize: '0.95rem', marginBottom: '0.2rem' }}>
                {result.success ? 'Attendance Verified & Logged' : 'Verification Rejected'}
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-main)', lineHeight: 1.4 }}>
                {result.message}
              </div>
            </div>
          </div>
        )}

        {/* Scan Actions */}
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            type="button"
            onClick={handleExecuteScan}
            disabled={scanning || !activeSession?.isOpen}
            className="btn btn-primary"
            style={{ flex: 1, padding: '0.85rem' }}
          >
            {scanning ? (
              <>
                <Loader2 size={18} className="animate-spin" /> Verifying GPS & QR Token...
              </>
            ) : (
              <>
                <Camera size={18} /> Scan Live Dynamic QR
              </>
            )}
          </button>
        </div>

        <div style={{ marginTop: '0.85rem', textAlign: 'center', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
          Tip: You can use the top dev switcher to simulate being off-campus and test geofence rejection.
        </div>
      </div>
    </div>
  );
}
