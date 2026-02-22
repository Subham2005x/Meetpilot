// FactChecker - Displays fact-check alerts from backend
import React, { useState } from 'react'
import { CheckCircle2, XCircle, ChevronDown, ChevronRight } from 'lucide-react'
import { useMeeting } from '../context/MeetingContext'
import type { FactCheck } from '../../types'

function FactCard({ check }: { check: FactCheck }) {
    const [expanded, setExpanded] = useState(false)
    const isCorrect = check.isCorrect

    return (
        <div style={{
            background: isCorrect ? 'rgba(16,185,129,0.05)' : 'rgba(244,63,94,0.05)',
            border: `1px solid ${isCorrect ? 'rgba(16,185,129,0.25)' : 'rgba(244,63,94,0.25)'}`,
            borderRadius: '10px', marginBottom: '8px',
            overflow: 'hidden', animation: 'mp-slideDown 0.3s ease-out',
        }}>
            <button
                onClick={() => setExpanded(!expanded)}
                style={{
                    width: '100%', background: 'none', border: 'none', cursor: 'pointer',
                    padding: '10px 12px', display: 'flex', alignItems: 'center', gap: '10px',
                    textAlign: 'left',
                }}
            >
                {isCorrect
                    ? <CheckCircle2 size={16} color="#10b981" />
                    : <XCircle size={16} color="#f43f5e" />
                }

                <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{
                        color: '#cbd5e1', fontSize: '11px', margin: 0,
                        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                    }}>
                        "{check.originalClaim}"
                    </p>
                    {!isCorrect && check.correctedValue && (
                        <p style={{ color: '#f43f5e', fontSize: '11px', margin: '2px 0 0', fontWeight: 600 }}>
                            ✗ Actually: {check.correctedValue}
                        </p>
                    )}
                    {isCorrect && (
                        <p style={{ color: '#10b981', fontSize: '11px', margin: '2px 0 0', fontWeight: 600 }}>
                            ✓ Verified correct
                        </p>
                    )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                    <span style={{
                        background: `${isCorrect ? '#10b981' : '#f43f5e'}20`,
                        borderRadius: '8px', padding: '1px 6px',
                        color: isCorrect ? '#10b981' : '#f43f5e',
                        fontSize: '10px',
                    }}>
                        {Math.round(check.confidence * 100)}%
                    </span>
                    {expanded ? <ChevronDown size={12} color="#64748b" /> : <ChevronRight size={12} color="#64748b" />}
                </div>
            </button>

            {expanded && (
                <div style={{ padding: '0 12px 12px' }}>
                    <div style={{
                        borderTop: '1px solid rgba(255,255,255,0.06)',
                        paddingTop: '8px',
                    }}>
                        <p style={{ color: '#64748b', fontSize: '10px', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            Source
                        </p>
                        <div style={{
                            display: 'flex', alignItems: 'center', gap: '6px',
                            background: 'rgba(255,255,255,0.04)', borderRadius: '6px',
                            padding: '6px 10px',
                        }}>
                            <span style={{ fontSize: '14px' }}>📄</span>
                            <span style={{ color: '#94a3b8', fontSize: '11px' }}>{check.source}</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export function FactChecker() {
    const { factChecks } = useMeeting()

    if (factChecks.length === 0) {
        return (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '12px', overflowY: 'auto' }}>
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                        <span style={{ fontSize: '13px' }}>🔍</span>
                        <span style={{ color: '#64748b', fontSize: '12px', fontWeight: 600 }}>Fact Checks</span>
                        <span style={{
                            background: 'rgba(255,255,255,0.06)', borderRadius: '20px',
                            padding: '1px 7px', fontSize: '10px', color: '#475569',
                        }}>0</span>
                    </div>
                    {/* Live scanning pill */}
                    <span style={{
                        display: 'flex', alignItems: 'center', gap: '5px',
                        background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.2)',
                        borderRadius: '8px', padding: '2px 8px', fontSize: '10px', color: '#00d4ff',
                    }}>
                        <span style={{
                            width: '5px', height: '5px', borderRadius: '50%',
                            background: '#00d4ff',
                            animation: 'mp-pulse 1.4s ease-in-out infinite',
                            display: 'inline-block',
                        }} />
                        Scanning…
                    </span>
                </div>

                {/* Ghost fact cards */}
                {[
                    { correct: false, claim: 'Revenue grew by 40% last quarter', result: 'Actually: 14% growth', color: '#f43f5e', pct: '94%' },
                    { correct: true, claim: 'Team headcount is now 120 people', result: 'Verified correct', color: '#10b981', pct: '88%' },
                    { correct: false, claim: 'Market cap exceeded $2 billion', result: 'Actually: $1.4 billion', color: '#f43f5e', pct: '91%' },
                ].map((f, i) => (
                    <div key={i} style={{
                        background: f.correct ? 'rgba(16,185,129,0.04)' : 'rgba(244,63,94,0.04)',
                        border: `1px solid ${f.correct ? 'rgba(16,185,129,0.15)' : 'rgba(244,63,94,0.15)'}`,
                        borderRadius: '10px', padding: '10px 12px',
                        marginBottom: '8px', opacity: 0.4,
                    }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                            {f.correct
                                ? <CheckCircle2 size={16} color="#10b981" style={{ flexShrink: 0, marginTop: '1px' }} />
                                : <XCircle size={16} color="#f43f5e" style={{ flexShrink: 0, marginTop: '1px' }} />}
                            <div style={{ flex: 1 }}>
                                <div style={{
                                    height: '9px', background: 'rgba(255,255,255,0.07)',
                                    borderRadius: '4px', width: '80%', marginBottom: '6px',
                                }} />
                                <div style={{
                                    color: f.correct ? '#10b981' : '#f43f5e',
                                    fontSize: '10px', fontWeight: 600,
                                }}>{f.result}</div>
                            </div>
                            <span style={{
                                background: `${f.color}20`, borderRadius: '8px',
                                padding: '1px 6px', color: f.color, fontSize: '10px', flexShrink: 0,
                            }}>{f.pct}</span>
                        </div>
                    </div>
                ))}

                {/* Description */}
                <div style={{
                    marginTop: 'auto', paddingTop: '16px',
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: '10px', padding: '12px',
                }}>
                    <p style={{ color: '#475569', fontSize: '11px', textAlign: 'center', margin: 0, lineHeight: '1.6' }}>
                        MeetPilot AI automatically verifies claims made during the meeting and flags inaccuracies in real-time.
                    </p>
                </div>
            </div>
        )
    }

    const incorrect = factChecks.filter((f) => !f.isCorrect)
    const correct = factChecks.filter((f) => f.isCorrect)

    return (
        <div style={{ flex: 1, overflowY: 'auto', padding: '12px', scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.07) transparent' }}>
            {incorrect.length > 0 && (
                <>
                    <div style={{ color: '#f43f5e', fontSize: '11px', fontWeight: 700, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        ⚠ {incorrect.length} Incorrect Claim{incorrect.length > 1 ? 's' : ''} Detected
                    </div>
                    {incorrect.map((f) => <FactCard key={f.id} check={f} />)}
                </>
            )}
            {correct.length > 0 && (
                <>
                    <div style={{ color: '#64748b', fontSize: '11px', fontWeight: 600, margin: '8px 0 6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Verified Correct
                    </div>
                    {correct.map((f) => <FactCard key={f.id} check={f} />)}
                </>
            )}
        </div>
    )
}
