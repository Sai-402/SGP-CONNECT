// ============================================================================
// SGP CONNECT — TEACHER / FACULTY PORTAL
// Implements QR Session Generator, Attendance Correction Review,
// Internal Marks Entry, Study Materials Upload, and Student Doubt Resolution
// ============================================================================

import React, { useState } from 'react';
import { useCampus } from '../../context/CampusContext';
import QRDisplay from '../../components/QRDisplay';
import {
  QrCode,
  Users,
  CheckCircle,
  XCircle,
  Award,
  Upload,
  FileText,
  MessageSquare,
  Clock,
  Sparkles,
  Save,
  PlusCircle,
  AlertTriangle,
  Send
} from 'lucide-react';

export default function TeacherPortal({ activeTab, setActiveTab }) {
  const {
    currentUser,
    activeSession,
    startAttendanceSession,
    correctionRequests,
    approveCorrectionRequest,
    rejectCorrectionRequest,
    internalMarks,
    setInternalMarks,
    studyMaterials,
    setStudyMaterials,
    assignments,
    setAssignments,
    discussions,
    setDiscussions,
    subjects,
    classes
  } = useCampus();

  // QR Generation form state
  const [selectedSubjectId, setSelectedSubjectId] = useState('20CS31P');
  const [selectedClassId, setSelectedClassId] = useState('3-CSE-A');

  // New Study Material Form State
  const [newMatTitle, setNewMatTitle] = useState('');
  const [newMatUnit, setNewMatUnit] = useState('Unit 3');
  const [newMatSubject, setNewMatSubject] = useState('DBMS');
  const [matSuccess, setMatSuccess] = useState(false);

  // New Assignment Form State
  const [newAsgTitle, setNewAsgTitle] = useState('');
  const [newAsgDesc, setNewAsgDesc] = useState('');
  const [newAsgDeadline, setNewAsgDeadline] = useState('08 Oct 2026');
  const [asgSuccess, setAsgSuccess] = useState(false);

  // Marks Editing State
  const [editableMarks, setEditableMarks] = useState(internalMarks);
  const [marksSaved, setMarksSaved] = useState(false);

  // Reply to Student State
  const [replyTextMap, setReplyTextMap] = useState({});

  const handleStartSession = (e) => {
    e.preventDefault();
    startAttendanceSession(selectedSubjectId, selectedClassId);
  };

  const handleSaveMarks = () => {
    setInternalMarks(editableMarks);
    setMarksSaved(true);
    setTimeout(() => setMarksSaved(false), 2000);
  };

  const handleUploadMaterial = (e) => {
    e.preventDefault();
    if (!newMatTitle.trim()) return;

    const newMat = {
      id: `mat-${Date.now()}`,
      subject: newMatSubject,
      subjectCode: '20CS31P',
      title: newMatTitle,
      unit: newMatUnit,
      type: 'PDF',
      size: '4.8 MB',
      uploadedBy: currentUser.name,
      uploadDate: 'Today',
      downloadUrl: '#'
    };

    setStudyMaterials(prev => [newMat, ...prev]);
    setNewMatTitle('');
    setMatSuccess(true);
    setTimeout(() => setMatSuccess(false), 2200);
  };

  const handleCreateAssignment = (e) => {
    e.preventDefault();
    if (!newAsgTitle.trim()) return;

    const newAsg = {
      id: `asg-${Date.now()}`,
      subject: 'DBMS',
      title: newAsgTitle,
      deadline: newAsgDeadline,
      description: newAsgDesc,
      totalPoints: 20,
      submissionsCount: 0,
      totalStudents: 58,
      status: 'Active (Accepting Submissions)',
      isSubmitted: false
    };

    setAssignments(prev => [newAsg, ...prev]);
    setNewAsgTitle('');
    setNewAsgDesc('');
    setAsgSuccess(true);
    setTimeout(() => setAsgSuccess(false), 2200);
  };

  const handleSendReply = (discId) => {
    const reply = replyTextMap[discId];
    if (!reply || !reply.trim()) return;

    setDiscussions(prev =>
      prev.map(d =>
        d.id === discId
          ? { ...d, reply, repliedBy: currentUser.name }
          : d
      )
    );

    setReplyTextMap(prev => ({ ...prev, [discId]: '' }));
  };

  // -------------------------------------------------------------------------
  // 1. TEACHER DASHBOARD
  // -------------------------------------------------------------------------
  const renderDashboard = () => (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="card card-glass flex-between" style={{ flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <span className="badge badge-warning" style={{ marginBottom: '0.4rem' }}>
            Faculty & Department Portal
          </span>
          <h1 style={{ fontSize: '1.8rem', marginBottom: '0.25rem' }}>
            Welcome, {currentUser?.name}
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            {currentUser?.designation} • {currentUser?.department} (ID: {currentUser?.staffId})
          </p>
        </div>

        <button
          type="button"
          onClick={() => setActiveTab('qr-generator')}
          className="btn btn-primary btn-lg"
        >
          <QrCode size={20} /> Launch Attendance QR
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid-cols-3">
        <div className="card card-interactive">
          <div className="flex-between" style={{ marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
              ASSIGNED CLASSES
            </span>
            <span className="badge badge-primary">Odd Sem 2026</span>
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--primary-light)' }}>
            2 Sections
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
            3rd Year CSE (Sec A & Sec B) • 114 Enrolled Students
          </div>
        </div>

        <div className="card card-interactive">
          <div className="flex-between" style={{ marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
              PENDING CORRECTIONS
            </span>
            <span className="badge badge-warning">Action Required</span>
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--warning)' }}>
            {correctionRequests.filter(r => r.status === 'Pending').length} Requests
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
            Student attendance discrepancy appeals
          </div>
        </div>

        <div className="card card-interactive">
          <div className="flex-between" style={{ marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
              ACTIVE ATTENDANCE
            </span>
            <span className={`badge ${activeSession?.isOpen ? 'badge-success' : 'badge-secondary'}`}>
              {activeSession?.isOpen ? 'Running Now' : 'Closed'}
            </span>
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: activeSession?.isOpen ? 'var(--success)' : 'var(--text-muted)' }}>
            {activeSession?.isOpen ? `${activeSession.attendees.length} Scanned` : 'Inactive'}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
            {activeSession?.isOpen ? activeSession.subjectName : 'Ready to start lecture'}
          </div>
        </div>
      </div>

      {/* Quick Launch QR Session if open */}
      {activeSession?.isOpen && <QRDisplay />}
    </div>
  );

  // -------------------------------------------------------------------------
  // 2. DYNAMIC QR GENERATOR
  // -------------------------------------------------------------------------
  const renderQRGenerator = () => (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="card card-glass">
        <h2 style={{ fontSize: '1.4rem', marginBottom: '0.25rem' }}>Dynamic Attendance QR Generator</h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
          Launches an anti-proxy session with a rotating 15-second dynamic cryptographic QR code
        </p>

        <form onSubmit={handleStartSession} className="grid-cols-3" style={{ alignItems: 'flex-end', gap: '1rem' }}>
          <div>
            <label className="form-label">Subject</label>
            <select
              className="form-select"
              value={selectedSubjectId}
              onChange={(e) => setSelectedSubjectId(e.target.value)}
            >
              {subjects.map(s => (
                <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="form-label">Class / Section</label>
            <select
              className="form-select"
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
            >
              {classes.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem' }}>
            <QrCode size={18} /> Generate Rolling QR
          </button>
        </form>
      </div>

      <QRDisplay />
    </div>
  );

  // -------------------------------------------------------------------------
  // 3. ATTENDANCE & CORRECTION REQUESTS (PRD Section 14)
  // -------------------------------------------------------------------------
  const renderAttendanceReports = () => (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="card card-glass flex-between">
        <div>
          <h2 style={{ fontSize: '1.4rem' }}>Attendance Review & Correction Requests</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Approve or reject student attendance correction appeals with automatic audit logging
          </p>
        </div>
        <span className="badge badge-warning">Audit Trail Enforced</span>
      </div>

      <div className="card card-glass">
        <h3 style={{ fontSize: '1.15rem', marginBottom: '1rem' }}>PENDING CORRECTION REQUESTS</h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {correctionRequests.map(req => (
            <div
              key={req.id}
              style={{
                padding: '1.25rem',
                borderRadius: 'var(--radius-md)',
                background: 'var(--surface-raised)',
                border: '1px solid var(--border-light)'
              }}
            >
              <div className="flex-between" style={{ marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                  <span style={{ fontWeight: 800, fontSize: '1.05rem' }}>{req.studentName}</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--primary-light)', fontFamily: 'var(--font-mono)', marginLeft: '0.5rem' }}>
                    ({req.usn})
                  </span>
                </div>
                <span className={`badge ${req.status === 'Approved' ? 'badge-success' : req.status === 'Rejected' ? 'badge-danger' : 'badge-warning'}`}>
                  {req.status}
                </span>
              </div>

              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                Missed Date: <strong>{req.date}</strong> • Subject: <strong>{req.subject}</strong> • Requested at: {req.requestedAt}
              </div>

              <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', background: 'var(--surface-base)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', marginBottom: '1rem' }}>
                "{req.reason}"
              </p>

              {req.status === 'Pending' && (
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button
                    type="button"
                    onClick={() => approveCorrectionRequest(req.id)}
                    className="btn btn-success btn-sm"
                  >
                    <CheckCircle size={15} /> Approve & Mark Present
                  </button>
                  <button
                    type="button"
                    onClick={() => rejectCorrectionRequest(req.id)}
                    className="btn btn-danger btn-sm"
                  >
                    <XCircle size={15} /> Reject Appeal
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // -------------------------------------------------------------------------
  // 4. INTERNAL MARKS ENTRY (PRD Section 19)
  // -------------------------------------------------------------------------
  const renderMarksEntry = () => (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="card card-glass flex-between" style={{ flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem' }}>Internal Assessment Marks Management</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Enter and modify IA-1, IA-2, and IA-3 marks for 3rd Year CSE (Section A)
          </p>
        </div>

        <button
          type="button"
          onClick={handleSaveMarks}
          className="btn btn-primary"
        >
          <Save size={16} /> {marksSaved ? '✓ Saved & Logged!' : 'Save All Marks'}
        </button>
      </div>

      <div className="card card-glass">
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-light)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '0.85rem 1rem' }}>Subject Name</th>
                <th style={{ padding: '0.85rem 1rem' }}>IA-1 (Max 20)</th>
                <th style={{ padding: '0.85rem 1rem' }}>IA-2 (Max 20)</th>
                <th style={{ padding: '0.85rem 1rem' }}>IA-3 (Max 20)</th>
                <th style={{ padding: '0.85rem 1rem' }}>Average</th>
                <th style={{ padding: '0.85rem 1rem' }}>Class Rating</th>
              </tr>
            </thead>
            <tbody>
              {editableMarks.map((m, idx) => (
                <tr key={m.subjectCode} style={{ borderBottom: '1px solid var(--border-light)' }}>
                  <td style={{ padding: '1rem', fontWeight: 700 }}>
                    {m.subjectName} ({m.subjectCode})
                  </td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <input
                      type="number"
                      min="0"
                      max="20"
                      value={m.ia1}
                      onChange={(e) => {
                        const val = parseInt(e.target.value, 10) || 0;
                        const updated = [...editableMarks];
                        updated[idx].ia1 = val;
                        updated[idx].average = parseFloat(((val + updated[idx].ia2 + updated[idx].ia3) / 3).toFixed(1));
                        setEditableMarks(updated);
                      }}
                      className="form-input"
                      style={{ width: '70px', padding: '0.4rem' }}
                    />
                  </td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <input
                      type="number"
                      min="0"
                      max="20"
                      value={m.ia2}
                      onChange={(e) => {
                        const val = parseInt(e.target.value, 10) || 0;
                        const updated = [...editableMarks];
                        updated[idx].ia2 = val;
                        updated[idx].average = parseFloat(((updated[idx].ia1 + val + updated[idx].ia3) / 3).toFixed(1));
                        setEditableMarks(updated);
                      }}
                      className="form-input"
                      style={{ width: '70px', padding: '0.4rem' }}
                    />
                  </td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <input
                      type="number"
                      min="0"
                      max="20"
                      value={m.ia3}
                      onChange={(e) => {
                        const val = parseInt(e.target.value, 10) || 0;
                        const updated = [...editableMarks];
                        updated[idx].ia3 = val;
                        updated[idx].average = parseFloat(((updated[idx].ia1 + updated[idx].ia2 + val) / 3).toFixed(1));
                        setEditableMarks(updated);
                      }}
                      className="form-input"
                      style={{ width: '70px', padding: '0.4rem' }}
                    />
                  </td>
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
  // 5. UPLOAD STUDY MATERIALS (PRD Section 21)
  // -------------------------------------------------------------------------
  const renderMaterialsManager = () => (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="card card-glass">
        <h2 style={{ fontSize: '1.4rem', marginBottom: '0.25rem' }}>Upload Study Materials</h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
          Upload PDF notes, PPT presentations, and question banks to Firebase Storage
        </p>

        {matSuccess && (
          <div style={{ padding: '0.85rem', background: 'var(--success-muted)', color: 'var(--success)', borderRadius: 'var(--radius-md)', marginBottom: '1rem' }}>
            ✓ Study material uploaded and broadcast to students in 3rd Year CSE!
          </div>
        )}

        <form onSubmit={handleUploadMaterial} className="grid-cols-3" style={{ alignItems: 'flex-end', gap: '1rem' }}>
          <div>
            <label className="form-label">Material Title</label>
            <input
              type="text"
              className="form-input"
              value={newMatTitle}
              onChange={(e) => setNewMatTitle(e.target.value)}
              placeholder="e.g. Unit 3: Normalization Guide & Cheatsheet"
              required
            />
          </div>

          <div>
            <label className="form-label">Unit / Module</label>
            <select
              className="form-select"
              value={newMatUnit}
              onChange={(e) => setNewMatUnit(e.target.value)}
            >
              <option value="Unit 1">Unit 1: ER Modeling</option>
              <option value="Unit 2">Unit 2: SQL & Relational Algebra</option>
              <option value="Unit 3">Unit 3: Normalization & BCNF</option>
              <option value="Important Questions">Important Questions & Solved Papers</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem' }}>
            <Upload size={16} /> Publish Material
          </button>
        </form>
      </div>

      <div className="card card-glass">
        <h3 style={{ fontSize: '1.15rem', marginBottom: '1rem' }}>CURRENTLY PUBLISHED STUDY MATERIALS</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {studyMaterials.map(mat => (
            <div
              key={mat.id}
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
              <div>
                <span className="badge badge-primary" style={{ marginRight: '0.5rem' }}>{mat.unit}</span>
                <span style={{ fontWeight: 700, fontSize: '0.92rem' }}>{mat.title}</span>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                  Uploaded by {mat.uploadedBy} on {mat.uploadDate} • {mat.type} ({mat.size})
                </div>
              </div>
              <span className="badge badge-secondary">{mat.type}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // -------------------------------------------------------------------------
  // 6. MANAGE ASSIGNMENTS (PRD Section 20)
  // -------------------------------------------------------------------------
  const renderAssignmentsManager = () => (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="card card-glass">
        <h2 style={{ fontSize: '1.4rem', marginBottom: '0.25rem' }}>Create New Coursework Assignment</h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
          Post assignments with deadlines and track student submission counts in real time
        </p>

        {asgSuccess && (
          <div style={{ padding: '0.85rem', background: 'var(--success-muted)', color: 'var(--success)', borderRadius: 'var(--radius-md)', marginBottom: '1rem' }}>
            ✓ Assignment published to 3rd Year CSE students!
          </div>
        )}

        <form onSubmit={handleCreateAssignment} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="grid-cols-2">
            <div>
              <label className="form-label">Assignment Title</label>
              <input
                type="text"
                className="form-input"
                value={newAsgTitle}
                onChange={(e) => setNewAsgTitle(e.target.value)}
                placeholder="e.g. Normalization 1NF to 3NF Problem Set"
                required
              />
            </div>
            <div>
              <label className="form-label">Submission Deadline</label>
              <input
                type="text"
                className="form-input"
                value={newAsgDeadline}
                onChange={(e) => setNewAsgDeadline(e.target.value)}
                placeholder="e.g. 05 Oct 2026"
                required
              />
            </div>
          </div>

          <div>
            <label className="form-label">Assignment Instructions & Description</label>
            <textarea
              className="form-textarea"
              rows="2"
              value={newAsgDesc}
              onChange={(e) => setNewAsgDesc(e.target.value)}
              placeholder="State the problem statements and submission format..."
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>
            <PlusCircle size={16} /> Create Assignment
          </button>
        </form>
      </div>

      <div className="card card-glass">
        <h3 style={{ fontSize: '1.15rem', marginBottom: '1rem' }}>ACTIVE ASSIGNMENT SUBMISSION TRACKER</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {assignments.map(asg => (
            <div
              key={asg.id}
              style={{
                padding: '1.25rem',
                borderRadius: 'var(--radius-md)',
                background: 'var(--surface-raised)',
                border: '1px solid var(--border-light)'
              }}
            >
              <div className="flex-between" style={{ marginBottom: '0.5rem' }}>
                <span className="badge badge-primary">{asg.subject}</span>
                <span style={{ fontSize: '0.78rem', color: 'var(--danger)', fontWeight: 700 }}>
                  Due: {asg.deadline}
                </span>
              </div>
              <h4 style={{ fontSize: '1.1rem', marginBottom: '0.35rem' }}>{asg.title}</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.85rem' }}>
                {asg.description}
              </p>

              <div className="flex-between" style={{ borderTop: '1px solid var(--border-light)', paddingTop: '0.75rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  Submissions: {asg.submissionsCount} / {asg.totalStudents} Students
                </span>
                <span className="badge badge-success">Accepting Submissions</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // -------------------------------------------------------------------------
  // 7. STUDENT QUESTIONS & INQUIRIES (PRD Section 26, 27)
  // -------------------------------------------------------------------------
  const renderStudentQuestions = () => (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="card card-glass">
        <h2 style={{ fontSize: '1.4rem', marginBottom: '0.25rem' }}>Student Academic Inquiries</h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Provide clear explanations and guidance to student queries in your subjects
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {discussions.map(disc => (
          <div key={disc.id} className="card card-glass">
            <div className="flex-between" style={{ marginBottom: '0.5rem' }}>
              <span className="badge badge-primary">{disc.subject}</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{disc.timestamp}</span>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.2rem' }}>
                {disc.isAnonymous ? '👤 Anonymous Student Inquiry' : `🎓 ${disc.studentName} (${disc.studentUsn})`}:
              </div>
              <p style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-main)' }}>
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
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary-light)', marginBottom: '0.2rem' }}>
                  Your Reply ({disc.repliedBy}):
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{disc.reply}</p>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '0.65rem' }}>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Type your explanation or guidance here..."
                  value={replyTextMap[disc.id] || ''}
                  onChange={(e) => setReplyTextMap({ ...replyTextMap, [disc.id]: e.target.value })}
                />
                <button
                  type="button"
                  onClick={() => handleSendReply(disc.id)}
                  className="btn btn-primary"
                >
                  <Send size={15} /> Reply
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div>
      {activeTab === 'teacher-dashboard' && renderDashboard()}
      {activeTab === 'qr-generator' && renderQRGenerator()}
      {activeTab === 'attendance-reports' && renderAttendanceReports()}
      {activeTab === 'marks-entry' && renderMarksEntry()}
      {activeTab === 'materials-manager' && renderMaterialsManager()}
      {activeTab === 'assignments-manager' && renderAssignmentsManager()}
      {activeTab === 'student-questions' && renderStudentQuestions()}
    </div>
  );
}
