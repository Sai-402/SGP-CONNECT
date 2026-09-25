// ============================================================================
// SGP CONNECT — STUDENT PORTAL
// Implements "My Day" dashboard, attendance tracker, what-if calculator,
// timetable, internal marks, study materials, and correction requests
// ============================================================================

import React, { useState } from 'react';
import { useCampus } from '../../context/CampusContext';
import QRScannerModal from '../../components/QRScannerModal';
import StudentQRLocationAttendance from '../../components/StudentQRLocationAttendance';
import WhatIfCalculator from '../../components/WhatIfCalculator';
import DigitalStudentIdCard from '../../components/DigitalStudentIdCard';
import AIAssistantWindow from '../../components/AIAssistantWindow';
import confetti from 'canvas-confetti';
import {
  QrCode,
  Calendar,
  Clock,
  MapPin,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  FileText,
  BookOpen,
  Award,
  Sparkles,
  Send,
  HelpCircle,
  Download,
  Filter,
  ArrowRight,
  Shield,
  Layers,
  CheckSquare
} from 'lucide-react';

export default function StudentPortal({ activeTab, setActiveTab }) {
  const {
    currentUser,
    nextClass,
    fineCalculation,
    studentSubjectAttendance,
    attendanceHistory,
    internalMarks,
    studyMaterials,
    assignments,
    setAssignments,
    notifications,
    campusEvents,
    discussions,
    setDiscussions,
    timetable,
    submitCorrectionRequest
  } = useCampus();

  const [scannerOpen, setScannerOpen] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState('All');
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState('All');

  // Correction Request Modal State
  const [correctionModalOpen, setCorrectionModalOpen] = useState(false);
  const [corrSubject, setCorrSubject] = useState('DBMS');
  const [corrDate, setCorrDate] = useState('2026-09-23');
  const [corrReason, setCorrReason] = useState('');
  const [corrSuccessMsg, setCorrSuccessMsg] = useState('');

  // Ask Question State
  const [newQuestionText, setNewQuestionText] = useState('');
  const [newQuestionSubject, setNewQuestionSubject] = useState('DBMS');
  const [isAnonymousQuestion, setIsAnonymousQuestion] = useState(false);

  // Handle Assignment Submission
  const handleSubmitAssignment = (asgId) => {
    setAssignments(prev =>
      prev.map(a =>
        a.id === asgId
          ? { ...a, status: 'Submitted (Grading Pending)', isSubmitted: true }
          : a
      )
    );
    try {
      confetti({ particleCount: 60, spread: 55, origin: { y: 0.6 } });
    } catch {}
  };

  const handlePostQuestion = (e) => {
    e.preventDefault();
    if (!newQuestionText.trim()) return;

    const newDisc = {
      id: `disc-${Date.now()}`,
      subject: newQuestionSubject,
      studentName: isAnonymousQuestion ? 'Anonymous Student' : currentUser.name,
      studentUsn: isAnonymousQuestion ? 'SGP-ANON' : currentUser.usn,
      question: newQuestionText,
      reply: null,
      timestamp: 'Just now',
      isAnonymous: isAnonymousQuestion
    };

    setDiscussions(prev => [newDisc, ...prev]);
    setNewQuestionText('');
  };

  const handleCorrectionSubmit = (e) => {
    e.preventDefault();
    if (!corrReason.trim()) return;
    submitCorrectionRequest(corrSubject, corrDate, corrReason);
    setCorrSuccessMsg('Attendance correction request submitted to Prof. Anitha for verification.');
    setTimeout(() => {
      setCorrSuccessMsg('');
      setCorrectionModalOpen(false);
      setCorrReason('');
    }, 1800);
  };

  // -------------------------------------------------------------------------
  // 1. DASHBOARD VIEW ("MY DAY" EXPERIENCE)
  // -------------------------------------------------------------------------
  const renderDashboard = () => (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Greeting Banner */}
      <div className="card card-glass flex-between" style={{ padding: '1.5rem 1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <span className="badge badge-primary" style={{ marginBottom: '0.4rem' }}>
            Academic Session 2026-2027
          </span>
          <h1 style={{ fontSize: '1.8rem', marginBottom: '0.25rem' }}>
            Good Morning, {currentUser?.name?.split(' ')[0]} 👋
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            {currentUser?.department} • {currentUser?.className} (USN: {currentUser?.usn})
          </p>
        </div>

        <button
          type="button"
          onClick={() => setActiveTab('attendance')}
          className="btn btn-primary btn-lg"
        >
          <QrCode size={20} /> Mark Class Attendance
        </button>
      </div>

      {/* Primary KPI Metrics: Attendance %, Shortage %, Applicable Fine */}
      <div className="grid-cols-3">
        {/* Overall Attendance */}
        <div className="card card-interactive card-glow">
          <div className="flex-between" style={{ marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
              OVERALL ATTENDANCE
            </span>
            <span className="badge badge-success">Target: 75%</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
            <span style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--primary-light)', fontFamily: 'var(--font-heading)' }}>
              {currentUser?.overallAttendance}%
            </span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              ({currentUser?.presentCount} / {currentUser?.totalClasses} classes)
            </span>
          </div>
          <div style={{ marginTop: '0.75rem', height: '6px', background: 'var(--surface-raised)', borderRadius: '4px', overflow: 'hidden' }}>
            <div
              style={{
                width: `${currentUser?.overallAttendance}%`,
                height: '100%',
                background: 'linear-gradient(90deg, var(--primary) 0%, #38BDF8 100%)',
                borderRadius: '4px'
              }}
            />
          </div>
        </div>

        {/* Shortage Status */}
        <div className="card card-interactive">
          <div className="flex-between" style={{ marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
              ATTENDANCE SHORTAGE
            </span>
            <span className={`badge ${fineCalculation.isShortage ? 'badge-danger' : 'badge-success'}`}>
              {fineCalculation.isShortage ? 'Deficit' : 'Safe Standing'}
            </span>
          </div>
          <div style={{ fontSize: '2.4rem', fontWeight: 800, color: fineCalculation.isShortage ? 'var(--danger)' : 'var(--success)' }}>
            {fineCalculation.shortagePercentage}%
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.4rem' }}>
            {fineCalculation.isShortage
              ? `You need ${fineCalculation.consecutiveClassesNeeded} consecutive classes to reach 75%.`
              : 'You are currently above the mandatory 75% institutional requirement.'}
          </p>
        </div>

        {/* Applicable Fine */}
        <div className="card card-interactive">
          <div className="flex-between" style={{ marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
              APPLICABLE FINE
            </span>
            <span className="badge badge-secondary">College Rule</span>
          </div>
          <div style={{ fontSize: '2.4rem', fontWeight: 800, color: fineCalculation.applicableFine > 0 ? 'var(--warning)' : 'var(--text-main)' }}>
            ₹{fineCalculation.applicableFine}
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.4rem' }}>
            {fineCalculation.fineLabel} • Payment Status: {fineCalculation.applicableFine > 0 ? 'Pending' : 'N/A'}
          </p>
        </div>
      </div>

      {/* Smart Next Class & Today's Schedule Card */}
      <div className="grid-cols-2" style={{ gap: '1.5rem' }}>
        {/* Smart Next Class Card (PRD Section 4.1 & 17) */}
        <div className="card card-glass" style={{ borderLeft: '4px solid var(--primary)' }}>
          <div className="flex-between" style={{ marginBottom: '1rem' }}>
            <span className="badge badge-primary">
              <Clock size={12} /> NEXT UPCOMING CLASS
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--primary-light)', fontWeight: 700 }}>
              Starts soon
            </span>
          </div>

          {nextClass ? (
            <div>
              <h2 style={{ fontSize: '1.4rem', marginBottom: '0.35rem' }}>
                {nextClass.subjectName}
              </h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <Clock size={15} /> {nextClass.startTime} – {nextClass.endTime}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <MapPin size={15} /> {nextClass.room}
                </span>
                <span>• {nextClass.teacherName}</span>
              </div>

              <button
                type="button"
                onClick={() => setScannerOpen(true)}
                className="btn btn-primary"
                style={{ width: '100%' }}
              >
                <QrCode size={18} /> Ready to Scan Attendance
              </button>
            </div>
          ) : (
            <p style={{ color: 'var(--text-secondary)' }}>All scheduled classes for today have concluded.</p>
          )}
        </div>

        {/* Today's Classes List (PRD Section 4.1) */}
        <div className="card card-glass">
          <div className="flex-between" style={{ marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.1rem' }}>TODAY'S CLASSES</h3>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Monday Schedule
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.65rem 0.85rem',
                borderRadius: 'var(--radius-md)',
                background: 'var(--surface-raised)',
                border: '1px solid var(--border-light)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <CheckCircle2 size={18} color="var(--success)" />
                <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Applied Mathematics III</span>
              </div>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>09:00 - 10:00 (Room 201)</span>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.65rem 0.85rem',
                borderRadius: 'var(--radius-md)',
                background: 'var(--primary-muted)',
                border: '1px solid rgba(37, 99, 235, 0.3)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <ArrowRight size={18} color="var(--primary)" />
                <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--primary-light)' }}>
                  Java Programming & OOP
                </span>
              </div>
              <span className="badge badge-primary">10:00 - 11:00 (Lab 2)</span>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.65rem 0.85rem',
                borderRadius: 'var(--radius-md)',
                background: 'var(--surface-raised)',
                border: '1px solid var(--border-light)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Clock size={18} color="var(--text-muted)" />
                <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>DBMS (Relational Database)</span>
              </div>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>11:15 - 12:15 (Room 203)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Important Announcements Feed (PRD Section 4.1) */}
      <div className="card card-glass">
        <div className="flex-between" style={{ marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '1.1rem' }}>🔔 IMPORTANT CAMPUS NOTICES</h3>
          <button
            type="button"
            onClick={() => setActiveTab('attendance')}
            style={{ fontSize: '0.8rem', color: 'var(--primary-light)', fontWeight: 600 }}
          >
            View Attendance Records →
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {notifications.slice(0, 3).map(n => (
            <div
              key={n.id}
              style={{
                padding: '0.85rem 1rem',
                borderRadius: 'var(--radius-md)',
                background: 'var(--surface-raised)',
                borderLeft: `4px solid ${n.category === 'Attendance' ? 'var(--warning)' : 'var(--primary)'}`
              }}
            >
              <div className="flex-between" style={{ marginBottom: '0.25rem' }}>
                <span style={{ fontWeight: 700, fontSize: '0.92rem' }}>{n.title}</span>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{n.timestamp}</span>
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                {n.message}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // -------------------------------------------------------------------------
  // 2. ATTENDANCE & QR SECTION (PRD Sections 9, 10, 11, 12, 13, 14)
  // -------------------------------------------------------------------------
  const renderAttendance = () => (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Dedicated QR & Location-Based Attendance Verifier */}
      <StudentQRLocationAttendance />

      {/* Attendance Actions & Correction Link */}
      <div className="card card-glass flex-between" style={{ flexWrap: 'wrap', gap: '1rem', padding: '1rem 1.5rem' }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Discrepancy in your attendance log?</div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Submit an official correction request to subject faculty for indoor GPS or connectivity glitches.
          </div>
        </div>

        <button
          type="button"
          onClick={() => setCorrectionModalOpen(true)}
          className="btn btn-secondary btn-sm"
        >
          Submit Attendance Correction Appeal
        </button>
      </div>

      {/* Subject-wise Breakdown Table (PRD Section 9) */}
      <div className="card card-glass">
        <h3 style={{ fontSize: '1.15rem', marginBottom: '1rem' }}>SUBJECT-WISE ATTENDANCE BREAKDOWN</h3>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-light)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '0.75rem 1rem' }}>Subject Name</th>
                <th style={{ padding: '0.75rem 1rem' }}>Classes Attended</th>
                <th style={{ padding: '0.75rem 1rem' }}>Total Held</th>
                <th style={{ padding: '0.75rem 1rem' }}>Percentage</th>
                <th style={{ padding: '0.75rem 1rem' }}>Standing Status</th>
              </tr>
            </thead>
            <tbody>
              {studentSubjectAttendance.map(sub => {
                const isShort = sub.percentage < 75;
                return (
                  <tr key={sub.subjectId} style={{ borderBottom: '1px solid var(--border-light)' }}>
                    <td style={{ padding: '1rem', fontWeight: 600 }}>{sub.subjectName}</td>
                    <td style={{ padding: '1rem' }}>{sub.present}</td>
                    <td style={{ padding: '1rem' }}>{sub.total}</td>
                    <td style={{ padding: '1rem', fontWeight: 800, color: isShort ? 'var(--danger)' : 'var(--success)' }}>
                      {sub.percentage}%
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span className={`badge ${isShort ? 'badge-danger' : 'badge-success'}`}>
                        {isShort ? `Shortage (-${(75 - sub.percentage).toFixed(1)}%)` : 'Normal Standing'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Attendance What-If Calculator (PRD Section 12) */}
      <WhatIfCalculator />

      {/* Attendance History Log (PRD Section 10) */}
      <div className="card card-glass">
        <div className="flex-between" style={{ marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '1.15rem' }}>RECENT ATTENDANCE LOG</h3>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Showing last 7 verified sessions
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          {attendanceHistory.map(item => (
            <div
              key={item.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.85rem 1rem',
                borderRadius: 'var(--radius-md)',
                background: 'var(--surface-raised)',
                border: '1px solid var(--border-light)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <span
                  style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    backgroundColor: item.status === 'Present' ? 'var(--success)' : 'var(--danger)'
                  }}
                />
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>
                    {item.subject} • {item.teacher}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {item.date} at {item.time} • Verified: {item.verifiedBy}
                  </div>
                </div>
              </div>

              <span className={`badge ${item.status === 'Present' ? 'badge-success' : 'badge-danger'}`}>
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // -------------------------------------------------------------------------
  // 3. TIMETABLE VIEW (PRD Section 16)
  // -------------------------------------------------------------------------
  const renderTimetable = () => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return (
      <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div className="card card-glass flex-between">
          <div>
            <h2 style={{ fontSize: '1.4rem' }}>Weekly Academic Timetable</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              3rd Year Computer Science & Engineering (Section A) • Odd Semester 2026
            </p>
          </div>
          <span className="badge badge-primary">DTE Karnataka Curriculum</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {days.map(day => {
            const periods = timetable.filter(t => t.day === day).sort((a, b) => a.startTime.localeCompare(b.startTime));
            return (
              <div key={day} className="card card-glass" style={{ padding: '1.25rem' }}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.85rem', color: 'var(--primary-light)' }}>
                  {day.toUpperCase()}
                </h3>

                <div className="grid-cols-4" style={{ gap: '0.85rem' }}>
                  {periods.map(p => (
                    <div
                      key={p.id}
                      style={{
                        padding: '0.85rem',
                        borderRadius: 'var(--radius-md)',
                        background: 'var(--surface-raised)',
                        border: '1px solid var(--border-light)'
                      }}
                    >
                      <div className="flex-between" style={{ marginBottom: '0.35rem' }}>
                        <span style={{ fontSize: '0.74rem', color: 'var(--primary-light)', fontWeight: 700 }}>
                          {p.startTime} – {p.endTime}
                        </span>
                        <span className="badge badge-secondary" style={{ fontSize: '0.65rem' }}>
                          {p.room}
                        </span>
                      </div>
                      <div style={{ fontWeight: 700, fontSize: '0.92rem', marginBottom: '0.2rem' }}>
                        {p.subjectName}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {p.teacherName}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // -------------------------------------------------------------------------
  // 4. INTERNAL MARKS VIEW (PRD Section 19)
  // -------------------------------------------------------------------------
  const renderInternalMarks = () => (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="card card-glass flex-between">
        <div>
          <h2 style={{ fontSize: '1.4rem' }}>Internal Assessment Marks</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            IA-1, IA-2, IA-3 performance records for Odd Semester 2026
          </p>
        </div>
        <span className="badge badge-success">Average Standing: Distinction</span>
      </div>

      <div className="card card-glass">
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-light)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '0.85rem 1rem' }}>Subject Name</th>
                <th style={{ padding: '0.85rem 1rem' }}>IA-1 (20)</th>
                <th style={{ padding: '0.85rem 1rem' }}>IA-2 (20)</th>
                <th style={{ padding: '0.85rem 1rem' }}>IA-3 (20)</th>
                <th style={{ padding: '0.85rem 1rem' }}>Average</th>
                <th style={{ padding: '0.85rem 1rem' }}>Class Rating</th>
              </tr>
            </thead>
            <tbody>
              {internalMarks.map(m => (
                <tr key={m.subjectCode} style={{ borderBottom: '1px solid var(--border-light)' }}>
                  <td style={{ padding: '1rem', fontWeight: 700 }}>
                    {m.subjectName} ({m.subjectCode})
                  </td>
                  <td style={{ padding: '1rem' }}>{m.ia1}</td>
                  <td style={{ padding: '1rem' }}>{m.ia2}</td>
                  <td style={{ padding: '1rem' }}>{m.ia3}</td>
                  <td style={{ padding: '1rem', fontWeight: 800, color: 'var(--primary-light)' }}>
                    {m.average}
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <span className="badge badge-primary">{m.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // -------------------------------------------------------------------------
  // 5. STUDY MATERIALS (PRD Section 21)
  // -------------------------------------------------------------------------
  const renderStudyMaterials = () => {
    const filtered = selectedUnit === 'All'
      ? studyMaterials
      : studyMaterials.filter(m => m.unit === selectedUnit);

    return (
      <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div className="card card-glass flex-between" style={{ flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.4rem' }}>Study Materials & Lecture Notes</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Official DTE syllabus modules, solved question papers, and PPT presentations
            </p>
          </div>

          {/* Unit Filter */}
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            {['All', 'Unit 1', 'Unit 2', 'Unit 3', 'Important Questions'].map(u => (
              <button
                key={u}
                type="button"
                className={`btn btn-sm ${selectedUnit === u ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setSelectedUnit(u)}
              >
                {u}
              </button>
            ))}
          </div>
        </div>

        <div className="grid-cols-2" style={{ gap: '1rem' }}>
          {filtered.map(mat => (
            <div
              key={mat.id}
              className="card card-glass card-interactive"
              style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '1rem' }}
            >
              <div>
                <div className="flex-between" style={{ marginBottom: '0.5rem' }}>
                  <span className="badge badge-primary">{mat.subject} • {mat.unit}</span>
                  <span className="badge badge-secondary">{mat.type} ({mat.size})</span>
                </div>
                <h4 style={{ fontSize: '1.05rem', marginBottom: '0.4rem' }}>{mat.title}</h4>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Uploaded by: {mat.uploadedBy} • {mat.uploadDate}
                </div>
              </div>

              <button
                type="button"
                onClick={() => alert(`Downloading ${mat.title} from Firebase Storage...`)}
                className="btn btn-secondary btn-sm"
                style={{ alignSelf: 'flex-start' }}
              >
                <Download size={14} /> Download File
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // -------------------------------------------------------------------------
  // 6. ASSIGNMENTS VIEW (PRD Section 20)
  // -------------------------------------------------------------------------
  const renderAssignments = () => (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="card card-glass flex-between">
        <div>
          <h2 style={{ fontSize: '1.4rem' }}>Classroom Assignments</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Submit coursework online and view evaluation scores
          </p>
        </div>
        <span className="badge badge-primary">Semester Assessment</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {assignments.map(asg => (
          <div key={asg.id} className="card card-glass">
            <div className="flex-between" style={{ marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div>
                <span className="badge badge-primary" style={{ marginRight: '0.5rem' }}>{asg.subject}</span>
                <span style={{ fontSize: '0.78rem', color: 'var(--danger)', fontWeight: 700 }}>
                  Deadline: {asg.deadline}
                </span>
              </div>
              <span className={`badge ${asg.isSubmitted ? 'badge-success' : 'badge-warning'}`}>
                {asg.status}
              </span>
            </div>

            <h3 style={{ fontSize: '1.15rem', marginBottom: '0.4rem' }}>{asg.title}</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
              {asg.description}
            </p>

            <div className="flex-between" style={{ borderTop: '1px solid var(--border-light)', paddingTop: '0.85rem' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Max Score: <strong>{asg.totalPoints} Points</strong>
              </span>

              {asg.isSubmitted ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--success)', fontWeight: 700, fontSize: '0.85rem' }}>
                  <CheckCircle2 size={16} /> Submitted Successfully
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => handleSubmitAssignment(asg.id)}
                  className="btn btn-primary btn-sm"
                >
                  <FileText size={15} /> Upload & Submit Solution
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // -------------------------------------------------------------------------
  // 7. Q&A DISCUSSIONS (PRD Sections 26, 27, 28)
  // -------------------------------------------------------------------------
  const renderQuestions = () => (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="card card-glass">
        <h2 style={{ fontSize: '1.4rem', marginBottom: '0.25rem' }}>Student–Faculty Discussion Room</h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
          Ask academic doubts to subject lecturers with optional anonymous mode
        </p>

        {/* Post Question Form */}
        <form onSubmit={handlePostQuestion} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <div className="grid-cols-2">
            <div>
              <label className="form-label">Subject</label>
              <select
                className="form-select"
                value={newQuestionSubject}
                onChange={(e) => setNewQuestionSubject(e.target.value)}
              >
                <option value="DBMS">Database Management Systems (Prof. Anitha)</option>
                <option value="Java">Java Programming (Prof. Ravi)</option>
                <option value="Mathematics">Applied Mathematics III (Prof. Sunitha)</option>
                <option value="Networking">Computer Networks (Prof. Chetan)</option>
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginTop: '1.5rem' }}>
              <input
                type="checkbox"
                id="anonCheck"
                checked={isAnonymousQuestion}
                onChange={(e) => setIsAnonymousQuestion(e.target.checked)}
                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
              />
              <label htmlFor="anonCheck" style={{ fontSize: '0.85rem', cursor: 'pointer' }}>
                Ask Anonymously (Hide my USN and Name)
              </label>
            </div>
          </div>

          <textarea
            className="form-textarea"
            rows="3"
            value={newQuestionText}
            onChange={(e) => setNewQuestionText(e.target.value)}
            placeholder="Type your question or academic doubt here..."
          />

          <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>
            <Send size={15} /> Post Academic Question
          </button>
        </form>
      </div>

      {/* Discussion Thread Feed */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {discussions.map(disc => (
          <div key={disc.id} className="card card-glass">
            <div className="flex-between" style={{ marginBottom: '0.5rem' }}>
              <span className="badge badge-primary">{disc.subject}</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{disc.timestamp}</span>
            </div>

            <div style={{ marginBottom: '0.85rem' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.2rem' }}>
                {disc.isAnonymous ? '👤 Anonymous Student' : `🎓 ${disc.studentName} (${disc.studentUsn})`}:
              </div>
              <p style={{ fontSize: '0.92rem', color: 'var(--text-main)', fontWeight: 600 }}>
                "{disc.question}"
              </p>
            </div>

            {disc.reply ? (
              <div
                style={{
                  padding: '0.85rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--surface-raised)',
                  borderLeft: '3px solid var(--primary)'
                }}
              >
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--primary-light)', marginBottom: '0.2rem' }}>
                  👩‍🏫 {disc.repliedBy}:
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  {disc.reply}
                </p>
              </div>
            ) : (
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                Awaiting faculty response...
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div>
      {activeTab === 'dashboard' && renderDashboard()}
      {activeTab === 'attendance' && renderAttendance()}
      {activeTab === 'timetable' && renderTimetable()}
      {activeTab === 'marks' && renderInternalMarks()}
      {activeTab === 'materials' && renderStudyMaterials()}
      {activeTab === 'assignments' && renderAssignments()}
      {activeTab === 'questions' && renderQuestions()}
      {activeTab === 'ai' && <AIAssistantWindow />}
      {activeTab === 'idcard' && <DigitalStudentIdCard />}
      {activeTab === 'events' && (
        <div className="grid-cols-2" style={{ gap: '1.25rem' }}>
          {campusEvents.map(evt => (
            <div key={evt.id} className="card card-glass" style={{ padding: '0', overflow: 'hidden' }}>
              <img src={evt.banner} alt={evt.title} style={{ width: '100%', height: '160px', objectFit: 'cover' }} />
              <div style={{ padding: '1.25rem' }}>
                <span className="badge badge-primary" style={{ marginBottom: '0.4rem' }}>{evt.category}</span>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.4rem' }}>{evt.title}</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                  {evt.description}
                </p>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  📅 {evt.date} • 📍 {evt.venue}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* QR Scanner Modal */}
      <QRScannerModal isOpen={scannerOpen} onClose={() => setScannerOpen(false)} />

      {/* Attendance Correction Modal (PRD Section 14) */}
      {correctionModalOpen && (
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
          <div className="card card-glass animate-fade-in" style={{ maxWidth: '480px', width: '100%' }}>
            <div className="flex-between" style={{ marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.2rem' }}>Request Attendance Correction</h3>
              <button
                type="button"
                onClick={() => setCorrectionModalOpen(false)}
                className="btn-icon btn-secondary"
                style={{ width: '32px', height: '32px' }}
              >
                ✕
              </button>
            </div>

            {corrSuccessMsg ? (
              <div style={{ padding: '1rem', background: 'var(--success-muted)', color: 'var(--success)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                ✓ {corrSuccessMsg}
              </div>
            ) : (
              <form onSubmit={handleCorrectionSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label className="form-label">Subject</label>
                  <select
                    className="form-select"
                    value={corrSubject}
                    onChange={(e) => setCorrSubject(e.target.value)}
                  >
                    <option value="DBMS">DBMS (Prof. Anitha)</option>
                    <option value="Java">Java Programming (Prof. Ravi)</option>
                    <option value="Mathematics">Mathematics (Prof. Sunitha)</option>
                    <option value="Networking">Networking (Prof. Chetan)</option>
                  </select>
                </div>

                <div>
                  <label className="form-label">Date of Missed/Incorrect Record</label>
                  <input
                    type="date"
                    className="form-input"
                    value={corrDate}
                    onChange={(e) => setCorrDate(e.target.value)}
                  />
                </div>

                <div>
                  <label className="form-label">Reason for Discrepancy</label>
                  <textarea
                    className="form-textarea"
                    rows="3"
                    value={corrReason}
                    onChange={(e) => setCorrReason(e.target.value)}
                    placeholder="e.g. Attended lecture in Room 203, but mobile GPS had indoor drift..."
                    required
                  />
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                  <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                    Submit to Faculty
                  </button>
                  <button
                    type="button"
                    onClick={() => setCorrectionModalOpen(false)}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
