'use client';
import React from 'react';

/* ---------- HeroFlow ---------- */
const HeroFlow = () => {
  const nodes = [
    { id: 'entities',   x: 120, y: 120, label: 'Entities',   sub: 'Accounts · Contacts · Custom',  color: 'var(--indigo-500)' },
    { id: 'pipelines',  x: 330, y: 120, label: 'Pipelines',  sub: 'States · Transitions · Logic', color: 'var(--indigo-600)' },
    { id: 'ai',         x: 540, y: 120, label: 'AI Layer',   sub: 'Copilot · Eijents', color: 'var(--indigo-700)' },
    { id: 'actions',    x: 750, y: 120, label: 'Actions',    sub: 'Workflows · Updates', color: 'var(--indigo-500)' },
    { id: 'knowledge',  x: 225, y: 340, label: 'Knowledge',  sub: 'Docs · Context', color: 'var(--lilac-300)' },
    { id: 'activity',   x: 435, y: 340, label: 'Activity',   sub: 'Unified timeline', color: 'var(--peach-200)' },
    { id: 'pulse',      x: 645, y: 340, label: 'Pulse',      sub: 'Real-world signals', color: 'var(--ink-900)' },
  ];
  const edges = [
    ['entities','pipelines'], ['pipelines','ai'], ['ai','actions'],
    ['knowledge','ai'], ['pulse','activity'], ['activity','ai'], ['actions','entities'],
  ];
  const pos = Object.fromEntries(nodes.map(n => [n.id, n]));
  return (
    <div className="hero-flow">
      <svg viewBox="0 0 900 480" className="hero-flow__svg" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>
        {edges.map(([a, b], i) => {
          const A = pos[a], B = pos[b];
          return (
            <g key={i}>
              <line x1={A.x} y1={A.y} x2={B.x} y2={B.y}
                    stroke="var(--indigo-200)" strokeWidth="1.5" strokeDasharray="3 4" />
              <circle r="4" fill="var(--indigo-500)" filter="url(#glow)">
                <animateMotion dur={`${3 + i * 0.4}s`} repeatCount="indefinite" begin={`${i * 0.35}s`}
                  path={`M${A.x} ${A.y} L${B.x} ${B.y}`} />
              </circle>
            </g>
          );
        })}
        {nodes.map((n, i) => (
          <g key={n.id}>
            <circle cx={n.x} cy={n.y} r="30" fill="white" stroke={n.color} strokeWidth="2" />
            <circle cx={n.x} cy={n.y} r="30" fill={n.color} opacity="0.08" />
            <circle cx={n.x} cy={n.y} r="6" fill={n.color}>
              <animate attributeName="r" values="6;9;6" dur="2.4s" begin={`${i * 0.2}s`} repeatCount="indefinite" />
              <animate attributeName="opacity" values="1;0.5;1" dur="2.4s" begin={`${i * 0.2}s`} repeatCount="indefinite" />
            </circle>
            <text x={n.x} y={n.y + 56} textAnchor="middle" fontFamily="var(--display)" fontWeight="700" fontSize="14" fill="var(--ink-900)">{n.label}</text>
            <text x={n.x} y={n.y + 74} textAnchor="middle" fontFamily="var(--sans)" fontWeight="400" fontSize="11" fill="var(--ink-400)">{n.sub}</text>
          </g>
        ))}
        <path
          d={`M ${pos.actions.x} ${pos.actions.y - 30} Q ${pos.actions.x + 80} 60 450 30 Q 60 20 ${pos.entities.x - 30} ${pos.entities.y}`}
          fill="none" stroke="var(--indigo-300)" strokeWidth="1.5" strokeDasharray="4 4" />
      </svg>
    </div>
  );
};

export default HeroFlow;
