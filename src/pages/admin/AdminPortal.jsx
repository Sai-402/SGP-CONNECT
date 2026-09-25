// ============================================================================
// SGP CONNECT — ADMIN PORTAL
// Implements Institution KPI Overview, Timetable Conflict Detector,
// Geofencing & Fine Rules Configurator, Academic Risk Watch, and Audit Logs
// ============================================================================

import React, { useState } from 'react';
import { useCampus } from '../../context/CampusContext';
import {
  Building2,
  Users,
  GraduationCap,
  CalendarDays,
  Settings,
  ShieldAlert,
  FileSpreadsheet,
  AlertTriangle,
  CheckCircle,
  PlusCircle,
  Clock,
  MapPin,
  Save,
  Trash2
} from 'lucide-react';

export default function AdminPortal({ activeTab, setActiveTab }) {
  const {
    currentUser,
    campusGeofence,
    setCampusGeofence,
    fineRules,
    setFineRules,
    timetable,
    setTimetable,
    checkTimetableConflict,
    auditLogs
  } = useCampus();

  // Geofence & Fine Rules State
  const [geoLat, setGeoLat] = useState(campusGeofence.latitude);
  const [geoLng, setGeoLng] = useState(campusGeofence.longitude);
  const [geoRadius, setGeoRadius] = useState(campusGeofence.defaultRadiusMeters);
  const [geoSaved, setGeoSaved] = useState(false);

  // New Timetable Slot Form State with Conflict Detection
  const [newDay, setNewDay] = useState('Monday');
  const [newStartTime, setNewStartTime] = useState('09:00');
  const [newEndTime, setNewEndTime] = useState('10:00');
  const [newSubjectName, setNewSubjectName] = useState('Computer Networks');
  const [newTeacherName, setNewTeacherName] = useState('Prof. Ravi');
  const [newRoom, setNewRoom] = useState('Lab 2');
  const [conflictWarning, setConflictWarning] = useState(null);
  const [slotCreatedSuccess, setSlotCreatedSuccess] = useState(false);

  const handleSaveGeofence = (e) => {
    e.preventDefault();
    setCampusGeofence({
      name: 'Sanjay Gandhi Polytechnic, Bellary',
      latitude: parseFloat(geoLat),
      longitude: parseFloat(geoLng),
      defaultRadiusMeters: parseInt(geoRadius, 10)
    });
    setGeoSaved(true);
    setTimeout(() => setGeoSaved(false), 2000);
  };

  const handleAddTimetableSlot = (e) => {
    e.preventDefault();
    setConflictWarning(null);

    // Section 18: Timetable Conflict Detection!
    const conflictResult = checkTimetableConflict(newDay, newStartTime, newTeacherName, newRoom);
    if (conflictResult.hasConflict) {
      setConflictWarning(conflictResult.message);
      return;
    }

    const newSlot = {
      id: `tt-${Date.now()}`,
      day: newDay,
      startTime: newStartTime,
      endTime: newEndTime,
      subjectId: '20CS33P',
      subjectName: newSubjectName,
      teacherName: newTeacherName,
      room: newRoom,
      classId: '3-CSE-A'
    };

    setTimetable(prev => [...prev, newSlot]);
    setSlotCreatedSuccess(true);
    setTimeout(() => setSlotCreatedSuccess(false), 2000);
  };

  const handleDeleteSlot = (id) => {
    setTimetable(prev => prev.filter(t => t.id !== id));
  };

  // -------------------------------------------------------------------------
  // 1. ADMIN DASHBOARD (PRD Section 38)
  // -------------------------------------------------------------------------
  const renderDashboard = () => (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="card card-glass flex-between" style={{ flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <span className="badge badge-danger" style={{ marginBottom: '0.4rem' }}>
            College Executive Administration
          </span>
          <h1 style={{ fontSize: '1.8rem', marginBottom: '0.25rem' }}>
            Campus Command Center
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Dr. B. Nagaraj (Principal) • Sanjay Gandhi Polytechnic, Bellary
          </p>
        </div>

        <button
          type="button"
          onClick={() => setActiveTab('academic-risk')}
          className="btn btn-secondary"
        >
          <ShieldAlert size={18} /> View Academic Risk Watch
        </button>
      </div>

      {/* Institutional Overview Metrics (PRD Section 38) */}
      <div className="grid-cols-4">
        <div className="card card-interactive">
          <div className="flex-between" style={{ marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>ENROLLED STUDENTS</span>
            <Users size={16} color="var(--primary)" />
          </div>
          <div style={{ fontSize: '2.1rem', fontWeight: 800, color: 'var(--primary-light)' }}>1,842</div>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>Across 4 Diploma Branches</div>
        </div>

        <div className="card card-interactive">
          <div className="flex-between" style={{ marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>FACULTY & STAFF</span>
            <GraduationCap size={16} color="var(--secondary)" />
          </div>
          <div style={{ fontSize: '2.1rem', fontWeight: 800, color: 'var(--secondary)' }}>86</div>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>CSE, ME, EEE, Civil Depts</div>
        </div>

        <div className="card card-interactive">
          <div className="flex-between" style={{ marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>AVG ATTENDANCE</span>
            <CheckCircle size={16} color="var(--success)" />
          </div>
          <div style={{ fontSize: '2.1rem', fontWeight: 800, color: 'var(--success)' }}>81.4%</div>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>Today's Live: 89.2%</div>
        </div>

        <div className="card card-interactive">
          <div className="flex-between" style={{ marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>BELOW 75% TARGET</span>
            <AlertTriangle size={16} color="var(--danger)" />
          </div>
          <div style={{ fontSize: '2.1rem', fontWeight: 800, color: 'var(--danger)' }}>214</div>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>Students requiring follow-up</div>
        </div>
      </div>

      {/* Quick Action Panels */}
      <div className="grid-cols-2" style={{ gap: '1.5rem' }}>
        <div className="card card-glass">
          <h3 style={{ fontSize: '1.15rem', marginBottom: '0.75rem' }}>Campus Operations Snapshot</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.88rem' }}>
            <div className="flex-between" style={{ padding: '0.65rem 0', borderBottom: '1px solid var(--border-light)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Active Academic Year</span>
              <span style={{ fontWeight: 700 }}>2026-2027 (Odd Semester)</span>
            </div>
            <div className="flex-between" style={{ padding: '0.65rem 0', borderBottom: '1px solid var(--border-light)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Geofence Area</span>
              <span style={{ fontWeight: 700 }}>SGP Bellary ({campusGeofence.defaultRadiusMeters}m radius)</span>
            </div>
            <div className="flex-between" style={{ padding: '0.65rem 0', borderBottom: '1px solid var(--border-light)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Pending Attendance Corrections</span>
              <span className="badge badge-warning">18 Pending Verification</span>
            </div>
            <div className="flex-between" style={{ padding: '0.65rem 0' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Internal Exam Status</span>
              <span className="badge badge-primary">IA-2 Commencing 05 Oct</span>
            </div>
          </div>
        </div>

        <div className="card card-glass">
          <h3 style={{ fontSize: '1.15rem', marginBottom: '0.75rem' }}>Department Performance</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <div>
              <div className="flex-between" style={{ fontSize: '0.85rem', marginBottom: '0.3rem' }}>
                <span>Computer Science & Engg (CSE)</span>
                <span style={{ fontWeight: 800, color: 'var(--success)' }}>84.2%</span>
              </div>
              <div style={{ height: '6px', background: 'var(--surface-raised)', borderRadius: '4px' }}>
                <div style={{ width: '84.2%', height: '100%', background: '#10B981', borderRadius: '4px' }} />
              </div>
            </div>

            <div>
              <div className="flex-between" style={{ fontSize: '0.85rem', marginBottom: '0.3rem' }}>
                <span>Mechanical Engineering (ME)</span>
                <span style={{ fontWeight: 800, color: 'var(--primary)' }}>79.5%</span>
              </div>
              <div style={{ height: '6px', background: 'var(--surface-raised)', borderRadius: '4px' }}>
                <div style={{ width: '79.5%', height: '100%', background: '#3B82F6', borderRadius: '4px' }} />
              </div>
            </div>

            <div>
              <div className="flex-between" style={{ fontSize: '0.85rem', marginBottom: '0.3rem' }}>
                <span>Electrical & Electronics (EEE)</span>
                <span style={{ fontWeight: 800, color: 'var(--warning)' }}>74.8%</span>
              </div>
              <div style={{ height: '6px', background: 'var(--surface-raised)', borderRadius: '4px' }}>
                <div style={{ width: '74.8%', height: '100%', background: '#F59E0B', borderRadius: '4px' }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // -------------------------------------------------------------------------
  // 2. TIMETABLE MANAGER & CONFLICT DETECTOR (PRD Section 18)
  // -------------------------------------------------------------------------
  const renderTimetableManager = () => (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="card card-glass">
        <h2 style={{ fontSize: '1.4rem', marginBottom: '0.25rem' }}>Timetable Slot Creator & Conflict Engine</h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
          Assigns faculty and rooms with automatic validation to prevent double-booking conflicts
        </p>

        {conflictWarning && (
          <div
            style={{
              padding: '1rem',
              borderRadius: 'var(--radius-md)',
              background: 'var(--danger-muted)',
              border: '1.5px solid var(--danger)',
              color: 'var(--danger)',
              marginBottom: '1.25rem',
              display: 'flex',
              gap: '0.75rem',
              alignItems: 'center'
            }}
          >
            <AlertTriangle size={24} />
            <div>
              <div style={{ fontWeight: 800 }}>⚠ Timetable Conflict Detected!</div>
              <div style={{ fontSize: '0.85rem' }}>{conflictWarning}</div>
            </div>
          </div>
        )}

        {slotCreatedSuccess && (
          <div style={{ padding: '0.85rem', background: 'var(--success-muted)', color: 'var(--success)', borderRadius: 'var(--radius-md)', marginBottom: '1rem' }}>
            ✓ Timetable period allocated without conflicts!
          </div>
        )}

        <form onSubmit={handleAddTimetableSlot} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="grid-cols-3">
            <div>
              <label className="form-label">Day</label>
              <select className="form-select" value={newDay} onChange={e => setNewDay(e.target.value)}>
                <option value="Monday">Monday</option>
                <option value="Tuesday">Tuesday</option>
                <option value="Wednesday">Wednesday</option>
                <option value="Thursday">Thursday</option>
                <option value="Friday">Friday</option>
                <option value="Saturday">Saturday</option>
              </select>
            </div>

            <div>
              <label className="form-label">Start Time</label>
              <select className="form-select" value={newStartTime} onChange={e => setNewStartTime(e.target.value)}>
                <option value="09:00">09:00 AM</option>
                <option value="10:00">10:00 AM</option>
                <option value="11:15">11:15 AM</option>
                <option value="12:15">12:15 PM</option>
                <option value="14:00">02:00 PM</option>
              </select>
            </div>

            <div>
              <label className="form-label">End Time</label>
              <select className="form-select" value={newEndTime} onChange={e => setNewEndTime(e.target.value)}>
                <option value="10:00">10:00 AM</option>
                <option value="11:00">11:00 AM</option>
                <option value="12:15">12:15 PM</option>
                <option value="13:15">01:15 PM</option>
                <option value="16:00">04:00 PM</option>
              </select>
            </div>
          </div>

          <div className="grid-cols-3">
            <div>
              <label className="form-label">Subject</label>
              <input
                type="text"
                className="form-input"
                value={newSubjectName}
                onChange={e => setNewSubjectName(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="form-label">Assigned Faculty</label>
              <select className="form-select" value={newTeacherName} onChange={e => setNewTeacherName(e.target.value)}>
                <option value="Prof. Anitha">Prof. Anitha (CSE)</option>
                <option value="Prof. Ravi">Prof. Ravi (CSE)</option>
                <option value="Prof. Sunitha">Prof. Sunitha (Maths)</option>
                <option value="Prof. Chetan">Prof. Chetan (Networks)</option>
              </select>
            </div>

            <div>
              <label className="form-label">Classroom / Lab</label>
              <select className="form-select" value={newRoom} onChange={e => setNewRoom(e.target.value)}>
                <option value="Room 201">Room 201</option>
                <option value="Room 203">Room 203</option>
                <option value="Room 204">Room 204</option>
                <option value="Lab 2">Computer Lab 2</option>
                <option value="Lab 1">Computer Lab 1</option>
              </select>
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>
            <PlusCircle size={16} /> Validate & Allocate Slot
          </button>
        </form>
      </div>

      {/* Current Timetable Slot Table */}
      <div className="card card-glass">
        <h3 style={{ fontSize: '1.15rem', marginBottom: '1rem' }}>ACTIVE TIMETABLE ALLOCATIONS (3-CSE-A)</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-light)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '0.75rem 1rem' }}>Day</th>
                <th style={{ padding: '0.75rem 1rem' }}>Period Time</th>
                <th style={{ padding: '0.75rem 1rem' }}>Subject</th>
                <th style={{ padding: '0.75rem 1rem' }}>Faculty</th>
                <th style={{ padding: '0.75rem 1rem' }}>Venue</th>
                <th style={{ padding: '0.75rem 1rem' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {timetable.slice(0, 10).map(t => (
                <tr key={t.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>{t.day}</td>
                  <td style={{ padding: '0.85rem 1rem' }}>{t.startTime} – {t.endTime}</td>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>{t.subjectName}</td>
                  <td style={{ padding: '0.85rem 1rem' }}>{t.teacherName}</td>
                  <td style={{ padding: '0.85rem 1rem' }}><span className="badge badge-secondary">{t.room}</span></td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <button
                      type="button"
                      onClick={() => handleDeleteSlot(t.id)}
                      className="btn-icon btn-secondary"
                      style={{ width: '28px', height: '28px', color: 'var(--danger)' }}
                      title="Remove Slot"
                    >
                      <Trash2 size={14} />
                    </button>
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
  // 3. GEOFENCING & FINE RULES (PRD Section 8 & 13)
  // -------------------------------------------------------------------------
  const renderGeofenceRules = () => (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="card card-glass">
        <h2 style={{ fontSize: '1.4rem', marginBottom: '0.25rem' }}>Campus Geofencing & Location Configuration</h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
          Configure Sanjay Gandhi Polytechnic Bellary coordinates and allowed attendance radius
        </p>

        {geoSaved && (
          <div style={{ padding: '0.85rem', background: 'var(--success-muted)', color: 'var(--success)', borderRadius: 'var(--radius-md)', marginBottom: '1rem' }}>
            ✓ Geofencing perimeter rules updated successfully!
          </div>
        )}

        <form onSubmit={handleSaveGeofence} className="grid-cols-3" style={{ alignItems: 'flex-end', gap: '1rem' }}>
          <div>
            <label className="form-label">Campus Latitude</label>
            <input
              type="number"
              step="0.0001"
              className="form-input"
              value={geoLat}
              onChange={e => setGeoLat(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="form-label">Campus Longitude</label>
            <input
              type="number"
              step="0.0001"
              className="form-input"
              value={geoLng}
              onChange={e => setGeoLng(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="form-label">Allowed Perimeter Radius (Meters)</label>
            <input
              type="number"
              min="20"
              max="500"
              className="form-input"
              value={geoRadius}
              onChange={e => setGeoRadius(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem' }}>
            <Save size={16} /> Save Geofence Settings
          </button>
        </form>
      </div>

      {/* Configurable Fine Brackets Table (PRD Section 13) */}
      <div className="card card-glass">
        <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>ATTENDANCE SHORTAGE FINE BRACKETS</h3>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
          Configurable institutional fine schedule based on overall attendance percentage
        </p>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-light)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '0.75rem 1rem' }}>Attendance Range</th>
                <th style={{ padding: '0.75rem 1rem' }}>Fine Amount</th>
                <th style={{ padding: '0.75rem 1rem' }}>Policy Status</th>
              </tr>
            </thead>
            <tbody>
              {fineRules.map(rule => (
                <tr key={rule.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>
                    {rule.min}% – {rule.max}%
                  </td>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 800, color: rule.fine > 0 ? 'var(--warning)' : 'var(--success)' }}>
                    ₹{rule.fine}
                  </td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <span className="badge badge-secondary">{rule.label}</span>
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
  // 4. ACADEMIC RISK DASHBOARD (PRD Section 40)
  // -------------------------------------------------------------------------
  const renderAcademicRisk = () => {
    const atRiskStudents = [
      { id: '1', name: 'Kiran Patil', usn: '23SGP015', attendance: 67.2, missingAssignments: 2, status: 'Parent Meeting Triggered' },
      { id: '2', name: 'Manjunath B.', usn: '23SGP028', attendance: 64.0, missingAssignments: 3, status: 'Critical Shortage' },
      { id: '3', name: 'Rahul Kumar', usn: '23SGP001', attendance: 82.0, missingAssignments: 0, status: 'Normal Standing' },
      { id: '4', name: 'Praveen G.', usn: '23SGP035', attendance: 71.4, missingAssignments: 1, status: 'Warning Level' }
    ];

    return (
      <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div className="card card-glass flex-between">
          <div>
            <h2 style={{ fontSize: '1.4rem' }}>Student Academic Risk Early Warning System</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Identifies students requiring academic follow-up based on attendance deficit and coursework gaps
            </p>
          </div>
          <span className="badge badge-danger">214 Campuswide At-Risk</span>
        </div>

        <div className="card card-glass">
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-light)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '0.85rem 1rem' }}>Student Name & USN</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Overall Attendance</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Missing Assignments</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Action Recommendation</th>
                </tr>
              </thead>
              <tbody>
                {atRiskStudents.map(st => {
                  const isRisk = st.attendance < 75;
                  return (
                    <tr key={st.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                      <td style={{ padding: '1rem' }}>
                        <div style={{ fontWeight: 700 }}>{st.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{st.usn}</div>
                      </td>
                      <td style={{ padding: '1rem', fontWeight: 800, color: isRisk ? 'var(--danger)' : 'var(--success)' }}>
                        {st.attendance}%
                      </td>
                      <td style={{ padding: '1rem' }}>
                        {st.missingAssignments > 0 ? (
                          <span className="badge badge-warning">{st.missingAssignments} Missing</span>
                        ) : (
                          <span className="badge badge-success">All Submitted</span>
                        )}
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <span className={`badge ${isRisk ? 'badge-danger' : 'badge-primary'}`}>
                          {st.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  // -------------------------------------------------------------------------
  // 5. AUDIT LOGS (PRD Section 44)
  // -------------------------------------------------------------------------
  const renderAuditLogs = () => (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="card card-glass flex-between">
        <div>
          <h2 style={{ fontSize: '1.4rem' }}>System Security & Attendance Audit Logs</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Immutable ledger tracking all attendance approvals, marks modifications, and session events
          </p>
        </div>
        <span className="badge badge-primary">ISO / DTE Audit Ready</span>
      </div>

      <div className="card card-glass">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {auditLogs.map(log => (
            <div
              key={log.id}
              style={{
                padding: '0.85rem 1rem',
                borderRadius: 'var(--radius-md)',
                background: 'var(--surface-raised)',
                borderLeft: '4px solid var(--primary)'
              }}
            >
              <div className="flex-between" style={{ marginBottom: '0.25rem' }}>
                <span style={{ fontWeight: 700, fontSize: '0.92rem' }}>{log.action}</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{log.timestamp}</span>
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '0.2rem' }}>
                {log.details}
              </p>
              <div style={{ fontSize: '0.72rem', color: 'var(--primary-light)', fontWeight: 600 }}>
                Executed by: {log.user}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div>
      {activeTab === 'admin-dashboard' && renderDashboard()}
      {activeTab === 'timetable-manager' && renderTimetableManager()}
      {activeTab === 'geofence-rules' && renderGeofenceRules()}
      {activeTab === 'academic-risk' && renderAcademicRisk()}
      {activeTab === 'audit-logs' && renderAuditLogs()}
    </div>
  );
}
