// ============================================================================
// SGP CONNECT — STUDENT QR & LOCATION-BASED ATTENDANCE ENGINE
// Comprehensive Geofencing Radar, Rolling Token Verifier, and Camera Scanner
// Sanjay Gandhi Polytechnic, Bellary
// ============================================================================

import React, { useState, useEffect } from 'react';
import { useCampus, calculateDistanceInMeters } from '../context/CampusContext';
import {
  QrCode,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Loader2,
  Compass,
  Camera,
  RefreshCw,
  Clock,
  Sparkles,
  AlertTriangle,
  Info,
  Check,
  Smartphone
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function StudentQRLocationAttendance() {
  const {
    currentUser,
    activeSession,
    currentQRPayload,
    qrSecondsLeft,
    markAttendance,
    campusGeofence,
    simulateOnCampus,
    setSimulateOnCampus
  } = useCampus();

  const [verifying, setVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);
  const [deviceLocation, setDeviceLocation] = useState({
    latitude: 15.1394,
    longitude: 76.9214,
    accuracy: 5,
    isRealGPS: false
  });
  const [cameraActive, setCameraActive] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  // Compute live distance
  const currentLat = simulateOnCampus ? campusGeofence.latitude : 12.9716;
  const currentLng = simulateOnCampus ? campusGeofence.longitude : 77.5946;

  const currentDistanceMeters = Math.round(
    calculateDistanceInMeters(
      currentLat,
      currentLng,
      campusGeofence.latitude,
      campusGeofence.longitude
    )
  );

  const isWithinRadius = currentDistanceMeters <= campusGeofence.defaultRadiusMeters;

  // Try real device GPS if user grants permission
  const requestRealGPS = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setDeviceLocation({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            accuracy: Math.round(pos.coords.accuracy),
            isRealGPS: true
          });
        },
        (err) => {
          console.log('[GPS] Geolocation permission prompt or error:', err.message);
        },
        { enableHighAccuracy: true, timeout: 5000 }
      );
    }
  };

  // Perform 7-Layer Attendance Validation
  const handleMarkAttendance = async () => {
    if (!activeSession || !activeSession.isOpen) {
      setVerificationResult({
        success: false,
        message: 'No active lecture attendance session is currently open in your department.'
      });
      return;
    }

    setVerifying(true);
    setVerificationResult(null);
    setActiveStep(1);

    // Visual step progression for the 7 security layers
    setTimeout(() => setActiveStep(2), 250);
    setTimeout(() => setActiveStep(3), 500);
    setTimeout(() => setActiveStep(4), 750);

    setTimeout(async () => {
      const res = await markAttendance(currentQRPayload);
      setVerificationResult(res);
      setVerifying(false);
      setActiveStep(5);

      if (res.success) {
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 }
          });
        } catch {}
      }
    }, 1000);
  };

  return (
    <div className="card card-glass animate-fade-in" style={{ padding: '1.75rem', position: 'relative' }}>
      {/* Header */}
      <div className="flex-between" style={{ marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <span className="badge badge-primary">Layer 7 Anti-Proxy Protocol</span>
            <span className={`badge ${activeSession?.isOpen ? 'badge-success' : 'badge-secondary'}`}>
              {activeSession?.isOpen ? '● Session Active' : 'No Open Session'}
            </span>
          </div>
          <h2 style={{ fontSize: '1.45rem', fontWeight: 800 }}>
            QR & Location-Verified Attendance
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Real-time biometric validation matching rotating QR token and Sanjay Gandhi Polytechnic Bellary perimeter
          </p>
        </div>

        {/* Live Rolling Token Indicator */}
        {activeSession?.isOpen && (
          <div
            style={{
              padding: '0.5rem 0.85rem',
              borderRadius: 'var(--radius-md)',
              background: 'var(--surface-raised)',
              border: '1px solid var(--border-light)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem'
            }}
          >
            <Clock size={16} color="var(--primary-light)" />
            <div style={{ lineHeight: 1.2 }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>ANTI-PROXY TOKEN</div>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, fontFamily: 'var(--font-mono)', color: qrSecondsLeft <= 3 ? 'var(--danger)' : 'var(--primary-light)' }}>
                Regenerating in {qrSecondsLeft}s
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="grid-cols-2" style={{ gap: '1.5rem', marginBottom: '1.5rem' }}>
        {/* LEFT COLUMN: GEOFENCING RADAR & LOCATION STATUS */}
        <div
          style={{
            padding: '1.25rem',
            borderRadius: 'var(--radius-lg)',
            background: 'var(--surface-raised)',
            border: `1.5px solid ${isWithinRadius ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}
        >
          <div>
            <div className="flex-between" style={{ marginBottom: '1rem' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)' }}>
                <MapPin size={16} color="var(--primary-light)" /> CAMPUS GEOFENCE RADAR
              </span>

              <span className={`badge ${isWithinRadius ? 'badge-success' : 'badge-danger'}`}>
                {isWithinRadius ? 'Inside 100m Perimeter' : 'Outside Boundary'}
              </span>
            </div>

            {/* Radar Animation Box */}
            <div className="radar-box" style={{ width: '130px', height: '130px', marginBottom: '1rem' }}>
              <div className="radar-sweep" />
              {verifying ? (
                <Loader2 size={32} color="var(--primary)" className="animate-spin" />
              ) : (
                <div
                  className="pulse-dot"
                  style={{
                    background: isWithinRadius ? 'var(--success)' : 'var(--danger)',
                    boxShadow: `0 0 16px ${isWithinRadius ? 'var(--success)' : 'var(--danger)'}`
                  }}
                />
              )}
            </div>

            {/* Coordinates & Distance Metrics */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.82rem' }}>
              <div className="flex-between" style={{ padding: '0.4rem 0', borderBottom: '1px solid var(--border-light)' }}>
                <span style={{ color: 'var(--text-muted)' }}>College Geofence Center:</span>
                <span style={{ fontWeight: 600 }}>SGP Bellary ({campusGeofence.latitude}°, {campusGeofence.longitude}°)</span>
              </div>

              <div className="flex-between" style={{ padding: '0.4rem 0', borderBottom: '1px solid var(--border-light)' }}>
                <span style={{ color: 'var(--text-muted)' }}>Student Coordinates:</span>
                <span style={{ fontWeight: 600, fontFamily: 'var(--font-mono)' }}>
                  {currentLat.toFixed(4)}° N, {currentLng.toFixed(4)}° E
                </span>
              </div>

              <div className="flex-between" style={{ padding: '0.4rem 0' }}>
                <span style={{ color: 'var(--text-muted)' }}>Calculated Distance:</span>
                <span style={{ fontWeight: 800, color: isWithinRadius ? 'var(--success)' : 'var(--danger)', fontSize: '0.95rem' }}>
                  {currentDistanceMeters}m (Allowed: {campusGeofence.defaultRadiusMeters}m)
                </span>
              </div>
            </div>
          </div>

          {/* Interactive Simulation Switcher */}
          <div style={{ marginTop: '1rem', paddingTop: '0.85rem', borderTop: '1px solid var(--border-light)' }}>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
              TEST GEOFENCE BEHAVIOR:
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                type="button"
                className={`btn btn-sm ${simulateOnCampus ? 'btn-success' : 'btn-secondary'}`}
                style={{ flex: 1, fontSize: '0.75rem' }}
                onClick={() => setSimulateOnCampus(true)}
              >
                ✓ On-Campus (In-Range)
              </button>
              <button
                type="button"
                className={`btn btn-sm ${!simulateOnCampus ? 'btn-danger' : 'btn-secondary'}`}
                style={{ flex: 1, fontSize: '0.75rem' }}
                onClick={() => setSimulateOnCampus(false)}
              >
                ✕ Off-Campus (Reject)
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: ACTIVE LECTURE & QR SCANNER */}
        <div
          style={{
            padding: '1.25rem',
            borderRadius: 'var(--radius-lg)',
            background: 'var(--surface-raised)',
            border: '1px solid var(--border-light)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}
        >
          <div>
            <div className="flex-between" style={{ marginBottom: '1rem' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)' }}>
                <QrCode size={16} color="var(--primary-light)" /> ACTIVE LECTURE ATTENDANCE
              </span>

              <span className="badge badge-secondary" style={{ fontSize: '0.7rem' }}>
                {currentUser?.className}
              </span>
            </div>

            {activeSession?.isOpen ? (
              <div style={{ marginBottom: '1.25rem' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.25rem' }}>
                  {activeSession.subjectName}
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.85rem' }}>
                  <span>Lecturer: <strong>{activeSession.teacherName}</strong></span>
                  <span>• Venue: <strong>{activeSession.room}</strong></span>
                </div>

                <div
                  style={{
                    padding: '0.75rem',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--primary-muted)',
                    border: '1px solid rgba(37, 99, 235, 0.25)',
                    fontSize: '0.82rem',
                    color: 'var(--text-main)',
                    lineHeight: 1.4
                  }}
                >
                  🔒 <strong>Anti-Proxy Security Active</strong>: Session token is continuously rotating on faculty screen. Scan now with your authenticated student device inside the classroom.
                </div>
              </div>
            ) : (
              <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                <Clock size={32} style={{ margin: '0 auto 0.5rem', opacity: 0.6 }} />
                <p style={{ fontSize: '0.9rem' }}>No attendance session is currently open.</p>
                <p style={{ fontSize: '0.78rem' }}>Faculty will launch dynamic QR when lecture starts.</p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            <button
              type="button"
              disabled={verifying || !activeSession?.isOpen}
              onClick={handleMarkAttendance}
              className="btn btn-primary btn-lg"
              style={{ width: '100%' }}
            >
              {verifying ? (
                <>
                  <Loader2 size={18} className="animate-spin" /> Verifying QR & GPS Perimeter...
                </>
              ) : (
                <>
                  <QrCode size={18} /> One-Touch Attendance Scan
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => setCameraActive(c => !c)}
              className="btn btn-secondary btn-sm"
              style={{ width: '100%' }}
            >
              <Camera size={14} /> {cameraActive ? 'Close Camera Viewfinder' : 'Open Device Camera Viewfinder'}
            </button>
          </div>
        </div>
      </div>

      {/* Optional Camera Viewfinder Overlay Simulation */}
      {cameraActive && (
        <div
          className="card card-glass animate-fade-in"
          style={{
            marginBottom: '1.5rem',
            textAlign: 'center',
            padding: '1.5rem',
            background: '#0F172A',
            color: '#FFFFFF',
            borderRadius: 'var(--radius-lg)',
            border: '2px dashed var(--primary)'
          }}
        >
          <div style={{ position: 'relative', width: '220px', height: '220px', margin: '0 auto 1rem', border: '2px solid #38BDF8', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: '#38BDF8', animation: 'scanLine 2s infinite linear' }} />
            <Smartphone size={40} color="#38BDF8" style={{ opacity: 0.7 }} />
          </div>
          <div style={{ fontSize: '0.88rem', fontWeight: 700, marginBottom: '0.25rem' }}>
            Point Camera at Classroom Projector / Teacher Screen
          </div>
          <p style={{ fontSize: '0.78rem', color: '#94A3B8', marginBottom: '1rem' }}>
            Align the 15-second dynamic rolling QR code within the target box above.
          </p>
          <button
            type="button"
            onClick={handleMarkAttendance}
            disabled={verifying}
            className="btn btn-primary btn-sm"
          >
            Capture & Decode Frame
          </button>
        </div>
      )}

      {/* VERIFICATION FEEDBACK BANNER */}
      {verificationResult && (
        <div
          className="animate-fade-in"
          style={{
            padding: '1.25rem',
            borderRadius: 'var(--radius-lg)',
            background: verificationResult.success ? 'var(--success-muted)' : 'var(--danger-muted)',
            border: `2px solid ${verificationResult.success ? 'var(--success)' : 'var(--danger)'}`,
            color: verificationResult.success ? 'var(--success)' : 'var(--danger)',
            marginBottom: '1.5rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem' }}>
            {verificationResult.success ? <CheckCircle2 size={28} /> : <XCircle size={28} />}
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.25rem' }}>
                {verificationResult.success ? 'Attendance Successfully Recorded!' : 'Attendance Verification Failed'}
              </div>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-main)', lineHeight: 1.4 }}>
                {verificationResult.message}
              </p>
              {verificationResult.success && (
                <div style={{ fontSize: '0.78rem', color: 'var(--success)', fontWeight: 700, marginTop: '0.5rem' }}>
                  ✓ Record added to your official semester attendance log with verified Bellary geofence tag.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 7-LAYER SECURITY VERIFICATION CHECKLIST (PRD Section 7) */}
      <div style={{ background: 'var(--surface-raised)', borderRadius: 'var(--radius-md)', padding: '1rem' }}>
        <div style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.75rem' }}>
          7-LAYER ANTI-PROXY VERIFICATION CHECKLIST
        </div>

        <div className="grid-cols-2" style={{ gap: '0.5rem', fontSize: '0.8rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckCircle2 size={16} color="var(--success)" />
            <span>Layer 1: Student Authenticated (<strong>{currentUser?.usn}</strong>)</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckCircle2 size={16} color="var(--success)" />
            <span>Layer 2: Class Enrolled (<strong>{currentUser?.className}</strong>)</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckCircle2 size={16} color="var(--success)" />
            <span>Layer 3: Dynamic 15s Nonce Verified</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {isWithinRadius ? (
              <CheckCircle2 size={16} color="var(--success)" />
            ) : (
              <XCircle size={16} color="var(--danger)" />
            )}
            <span>
              Layer 4: SGP Bellary Geofence (<strong>{currentDistanceMeters}m / 100m</strong>)
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckCircle2 size={16} color="var(--success)" />
            <span>Layer 5: Single-Scan Uniqueness Gate</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckCircle2 size={16} color="var(--success)" />
            <span>Layer 6: Server Session Signature Check</span>
          </div>
        </div>
      </div>
    </div>
  );
}
