// ============================================================================
// SGP CONNECT — ATTENDANCE WHAT-IF CALCULATOR
// Interactive simulation allowing students to forecast attendance outcomes
// ============================================================================

import React, { useState } from 'react';
import { useCampus } from '../context/CampusContext';
import { Calculator, TrendingUp, TrendingDown, Info, CheckCircle2, AlertCircle } from 'lucide-react';

export default function WhatIfCalculator() {
  const { currentUser } = useCampus();

  const currentPresent = currentUser?.presentCount || 164;
  const currentTotal = currentUser?.totalClasses || 200;
  const currentPct = currentUser?.overallAttendance || 82.0;

  const [attendNext, setAttendNext] = useState(5);
  const [missNext, setMissNext] = useState(0);

  // If you attend next X classes without missing any:
  const simAttendPct = parseFloat(
    (((currentPresent + attendNext) / (currentTotal + attendNext)) * 100).toFixed(1)
  );

  // If you miss next Y classes:
  const simMissPct = parseFloat(
    ((currentPresent / (currentTotal + missNext)) * 100).toFixed(1)
  );

  return (
    <div className="card card-glass animate-fade-in">
      <div className="flex-between" style={{ marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--primary-muted)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Calculator size={20} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.15rem' }}>Attendance "What-If" Forecaster</h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Simulate upcoming attendance scenarios without modifying real institutional records.
            </p>
          </div>
        </div>

        <span className="badge badge-secondary" style={{ fontSize: '0.72rem' }}>
          Real Standing: {currentPct}%
        </span>
      </div>

      <div className="grid-cols-2" style={{ gap: '1.5rem' }}>
        {/* Scenario 1: Attend Next X Classes */}
        <div
          style={{
            padding: '1.25rem',
            background: 'var(--surface-raised)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-light)'
          }}
        >
          <div className="flex-between" style={{ marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.88rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--success)' }}>
              <TrendingUp size={16} /> If you attend next:
            </span>
            <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--success)', fontFamily: 'var(--font-mono)' }}>
              +{attendNext} classes
            </span>
          </div>

          <input
            type="range"
            min="1"
            max="30"
            value={attendNext}
            onChange={(e) => setAttendNext(parseInt(e.target.value, 10))}
            style={{ width: '100%', accentColor: 'var(--success)', cursor: 'pointer', marginBottom: '1rem' }}
          />

          <div
            style={{
              padding: '0.85rem',
              borderRadius: 'var(--radius-md)',
              background: 'var(--success-muted)',
              border: '1px solid rgba(16, 185, 129, 0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Projected Attendance</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--success)' }}>
                {simAttendPct}%
              </div>
            </div>
            <span className="badge badge-success">
              +{(simAttendPct - currentPct).toFixed(1)}% Gain
            </span>
          </div>
        </div>

        {/* Scenario 2: Miss Next Y Classes */}
        <div
          style={{
            padding: '1.25rem',
            background: 'var(--surface-raised)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-light)'
          }}
        >
          <div className="flex-between" style={{ marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.88rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--danger)' }}>
              <TrendingDown size={16} /> If you miss next:
            </span>
            <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--danger)', fontFamily: 'var(--font-mono)' }}>
              {missNext} classes
            </span>
          </div>

          <input
            type="range"
            min="0"
            max="20"
            value={missNext}
            onChange={(e) => setMissNext(parseInt(e.target.value, 10))}
            style={{ width: '100%', accentColor: 'var(--danger)', cursor: 'pointer', marginBottom: '1rem' }}
          />

          <div
            style={{
              padding: '0.85rem',
              borderRadius: 'var(--radius-md)',
              background: 'var(--danger-muted)',
              border: '1px solid rgba(239, 68, 68, 0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Projected Attendance</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--danger)' }}>
                {simMissPct}%
              </div>
            </div>
            <span className="badge badge-danger">
              {(simMissPct - currentPct).toFixed(1)}% Drop
            </span>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.76rem', color: 'var(--text-muted)' }}>
        <Info size={14} /> Note: Polytechnic board policy requires a minimum of 75% overall attendance to appear for final semester board examinations.
      </div>
    </div>
  );
}
