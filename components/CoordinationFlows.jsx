'use client';
import React from 'react';

const CoordinationFlows = () => {
  return (
    <div className="coord">
      <svg viewBox="0 0 800 360" className="coord__svg" aria-hidden="true">
        <defs>
          <marker id="coordArrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M0 0 L10 5 L0 10 z" fill="var(--indigo-500)" />
          </marker>
        </defs>
        <g>
          <text x="80" y="60" fontFamily="var(--display)" fontWeight="700" fontSize="13" fill="var(--ink-900)">Sales Pipeline</text>
          {['Discovery','Qualified','Proposal','Won'].map((s, i) => (
            <g key={s}>
              <rect x={80 + i * 150} y="80" width="120" height="42" rx="10" fill="white" stroke="var(--indigo-200)" />
              <text x={140 + i * 150} y="106" textAnchor="middle" fontFamily="var(--display)" fontWeight="600" fontSize="12" fill="var(--ink-900)">{s}</text>
              {i < 3 && <line x1={200 + i * 150} y1="101" x2={230 + i * 150} y2="101" stroke="var(--indigo-300)" strokeWidth="1.5" markerEnd="url(#coordArrow)" />}
            </g>
          ))}
        </g>
        <g>
          <text x="80" y="240" fontFamily="var(--display)" fontWeight="700" fontSize="13" fill="var(--ink-900)">Onboarding Pipeline</text>
          {['Kickoff','Setup','Training','Live'].map((s, i) => (
            <g key={s}>
              <rect x={80 + i * 150} y="260" width="120" height="42" rx="10" fill="white" stroke="var(--lilac-300)" />
              <text x={140 + i * 150} y="286" textAnchor="middle" fontFamily="var(--display)" fontWeight="600" fontSize="12" fill="var(--ink-900)">{s}</text>
              {i < 3 && <line x1={200 + i * 150} y1="281" x2={230 + i * 150} y2="281" stroke="var(--lilac-300)" strokeWidth="1.5" markerEnd="url(#coordArrow)" />}
            </g>
          ))}
        </g>
        <path d="M 590 122 C 590 180, 200 200, 200 260" fill="none" stroke="var(--peach-300)" strokeWidth="2" strokeDasharray="4 4" markerEnd="url(#coordArrow)" />
        <rect x="300" y="170" width="200" height="40" rx="10" fill="var(--peach-50)" stroke="var(--peach-200)" />
        <text x="400" y="195" textAnchor="middle" fontFamily="var(--display)" fontWeight="700" fontSize="12" fill="var(--indigo-800)">Won → triggers Kickoff</text>
      </svg>
    </div>
  );
};

export default CoordinationFlows;
