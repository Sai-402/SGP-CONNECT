// ============================================================================
// SGP CONNECT — DIGITAL STUDENT ID CARD
// Section 30: Official college identity card with QR and verifiable details
// ============================================================================

import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useCampus } from '../context/CampusContext';
import { ShieldCheck, GraduationCap, MapPin, Sparkles, Download } from 'lucide-react';

export default function DigitalStudentIdCard() {
  const { currentUser } = useCampus();

  const isStudent = currentUser?.role === 'student';
  const qrVerificationPayload = JSON.stringify({
    institution: 'Sanjay Gandhi Polytechnic, Bellary',
    identifier: currentUser?.usn || currentUser?.staffId,
    name: currentUser?.name,
    role: currentUser?.role,
    validUntil: '2027-06-30'
  });

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', padding: '1rem 0' }}>
      <div className="student-id-card">
        {/* College Header */}
        <div className="student-id-header">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
            <GraduationCap size={20} color="#FFFFFF" />
            <span style={{ fontSize: '0.85rem', fontWeight: 800, letterSpacing: '0.08em', color: '#FFFFFF' }}>
              SANJAY GANDHI POLYTECHNIC
            </span>
          </div>
          <div style={{ fontSize: '0.68rem', color: '#E0F2FE', letterSpacing: '0.05em' }}>
            BELLARY, KARNATAKA • ESTD. 1992
          </div>
          <div style={{ fontSize: '0.64rem', color: '#93C5FD', fontWeight: 700, marginTop: '0.25rem', textTransform: 'uppercase' }}>
            OFFICIAL DIGITAL CAMPUS IDENTITY CARD
          </div>
        </div>

        {/* Card Body */}
        <div className="student-id-body">
          <div className="student-id-photo">
            <img
              src={currentUser?.avatar}
              alt={currentUser?.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#FFFFFF', lineHeight: 1.2 }}>
              {currentUser?.name}
            </div>

            <div style={{ fontSize: '0.78rem', color: '#38BDF8', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
              {isStudent ? `USN: ${currentUser?.usn}` : `STAFF ID: ${currentUser?.staffId}`}
            </div>

            <div style={{ fontSize: '0.78rem', color: '#CBD5E1', marginTop: '0.2rem' }}>
              {currentUser?.department}
            </div>

            <div style={{ fontSize: '0.74rem', color: '#94A3B8' }}>
              {isStudent ? currentUser?.className : currentUser?.designation}
            </div>

            <div style={{ fontSize: '0.7rem', color: '#64748B' }}>
              Valid: Academic Year 2026-2027
            </div>
          </div>
        </div>

        {/* Card QR Verification Footer */}
        <div className="student-id-footer">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.7rem', color: '#10B981', fontWeight: 700 }}>
              <ShieldCheck size={14} /> DTE VERIFIED
            </div>
            <div style={{ fontSize: '0.65rem', color: '#94A3B8' }}>
              Scan at library & exam hall
            </div>
          </div>

          <div style={{ background: '#FFFFFF', padding: '4px', borderRadius: '6px' }}>
            <QRCodeSVG value={qrVerificationPayload} size={54} level="M" />
          </div>
        </div>
      </div>

      <div style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
        Authorized for campus entry, examination identification, and digital library borrowing.
      </div>
    </div>
  );
}
