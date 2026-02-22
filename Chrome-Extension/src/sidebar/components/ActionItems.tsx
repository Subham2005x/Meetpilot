// ActionItems - Task management panel
import React, { useState, useRef } from 'react'
import { CheckCircle2, Circle, Pencil, Check, X, AlertCircle, Minus, Hash } from 'lucide-react'
import { useMeeting } from '../context/MeetingContext'
import type { ActionItem } from '../../types'

const priorityConfig = {
    high: { color: '#f43f5e', label: 'High', icon: '🔥' },
    medium: { color: '#f59e0b', label: 'Med', icon: '⚡' },
    low: { color: '#10b981', label: 'Low', icon: '📋' },
}

function Confetti({ show }: { show: boolean }) {
    if (!show) return null
    return (
        <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', pointerEvents: 'none', zIndex: 10 }}>
            {['🎉', '✨', '⭐'].map((e, i) => (
                <span key={i} style={{
                    position: 'absolute', fontSize: '14px',
                    animation: `mp-confetti 0.7s ease-out ${i * 0.1}s forwards`,
                    left: `${-10 + i * 10}px`,
                }}>{e}</span>
            ))}
        </div>
    )
}

function ActionCard({ item }: { item: ActionItem }) {
    const { updateActionItem } = useMeeting()
    const [editing, setEditing] = useState(false)
    const [editText, setEditText] = useState(item.description)
    const [showConfetti, setShowConfetti] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)

    const isDone = item.status === 'completed'

    const toggleComplete = () => {
        const newStatus = isDone ? 'pending' : 'completed'
        updateActionItem(item.id, { status: newStatus })
        if (!isDone) {
            setShowConfetti(true)
            setTimeout(() => setShowConfetti(false), 800)
        }
    }

    const saveEdit = () => {
        updateActionItem(item.id, { description: editText })
        setEditing(false)
    }

    const pc = priorityConfig[item.priority]

    return (
        <div style={{
            position: 'relative',
            background: isDone ? 'rgba(16,185,129,0.05)' : 'rgba(255,255,255,0.03)',
            border: `1px solid ${isDone ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.07)'}`,
            borderRadius: '10px', padding: '10px 12px',
            marginBottom: '8px', transition: 'all 0.2s',
        }}>
            <Confetti show={showConfetti} />

            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                {/* Checkbox */}
                <button onClick={toggleComplete} style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    padding: '2px', flexShrink: 0, marginTop: '1px',
                    transition: 'transform 0.15s',
                }}
                    onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.transform = 'scale(1.2)'}
                    onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.transform = 'scale(1)'}
                >
                    {isDone
                        ? <CheckCircle2 size={18} color="#10b981" />
                        : <Circle size={18} color="#475569" />}
                </button>

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                    {editing ? (
                        <div style={{ display: 'flex', gap: '6px' }}>
                            <input
                                ref={inputRef}
                                value={editText}
                                onChange={(e) => setEditText(e.target.value)}
                                onKeyDown={(e) => { if (e.key === 'Enter') saveEdit(); if (e.key === 'Escape') setEditing(false) }}
                                autoFocus
                                style={{
                                    flex: 1, background: 'rgba(255,255,255,0.06)',
                                    border: '1px solid #00d4ff', borderRadius: '6px',
                                    color: '#e2e8f0', padding: '4px 8px', fontSize: '12px', outline: 'none',
                                }}
                            />
                            <button onClick={saveEdit} style={{ background: '#10b981', border: 'none', borderRadius: '6px', padding: '4px 8px', cursor: 'pointer' }}>
                                <Check size={12} color="#fff" />
                            </button>
                            <button onClick={() => setEditing(false)} style={{ background: '#475569', border: 'none', borderRadius: '6px', padding: '4px 8px', cursor: 'pointer' }}>
                                <X size={12} color="#fff" />
                            </button>
                        </div>
                    ) : (
                        <p style={{
                            color: isDone ? '#475569' : '#cbd5e1',
                            fontSize: '12px', margin: 0,
                            textDecoration: isDone ? 'line-through' : 'none',
                            lineHeight: '1.5',
                        }}>
                            {item.description}
                        </p>
                    )}

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px', flexWrap: 'wrap' }}>
                        {/* Priority badge */}
                        <span style={{
                            background: `${pc.color}15`,
                            border: `1px solid ${pc.color}40`,
                            borderRadius: '8px', padding: '1px 6px',
                            color: pc.color, fontSize: '10px',
                        }}>
                            {pc.icon} {pc.label}
                        </span>

                        {/* Assignee */}
                        {item.assignedTo && (
                            <span style={{
                                background: 'rgba(167,139,250,0.1)',
                                border: '1px solid rgba(167,139,250,0.25)',
                                borderRadius: '8px', padding: '1px 6px',
                                color: '#a78bfa', fontSize: '10px',
                            }}>
                                👤 {item.assignedTo}
                            </span>
                        )}

                        {/* Due date */}
                        {item.dueDate && (
                            <span style={{ color: '#64748b', fontSize: '10px' }}>
                                📅 {new Date(item.dueDate).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                            </span>
                        )}
                    </div>
                </div>

                {/* Edit button */}
                {!editing && !isDone && (
                    <button onClick={() => setEditing(true)} style={{
                        background: 'none', border: 'none', cursor: 'pointer', padding: '2px',
                        color: '#475569', flexShrink: 0,
                        transition: 'color 0.15s',
                    }}
                        onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.color = '#00d4ff'}
                        onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.color = '#475569'}
                    >
                        <Pencil size={13} />
                    </button>
                )}
            </div>
        </div>
    )
}

export function ActionItems() {
    const { actionItems } = useMeeting()
    const pending = actionItems.filter((i) => i.status !== 'completed')
    const done = actionItems.filter((i) => i.status === 'completed')

    if (actionItems.length === 0) {
        return (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '12px', overflowY: 'auto' }}>
                {/* Header row */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                        <span style={{ fontSize: '13px' }}>📋</span>
                        <span style={{ color: '#64748b', fontSize: '12px', fontWeight: 600 }}>Action Items</span>
                        <span style={{
                            background: 'rgba(255,255,255,0.06)', borderRadius: '20px',
                            padding: '1px 7px', fontSize: '10px', color: '#475569',
                        }}>0</span>
                    </div>
                    <span style={{
                        background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)',
                        borderRadius: '8px', padding: '2px 8px', fontSize: '10px', color: '#10b981',
                    }}>↑ Syncs to Calendar</span>
                </div>

                {/* Progress bar */}
                <div style={{ marginBottom: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span style={{ color: '#334155', fontSize: '11px' }}>Progress</span>
                        <span style={{ color: '#334155', fontSize: '11px' }}>0 / 0 done</span>
                    </div>
                    <div style={{ height: '3px', background: 'rgba(255,255,255,0.06)', borderRadius: '2px' }} />
                </div>

                {/* Ghost task cards */}
                {[
                    { label: 'Follow up with the team', priority: '#00d4ff', pLabel: 'Med', w: '72%' },
                    { label: 'Review the proposal doc', priority: '#f59e0b', pLabel: 'High', w: '58%' },
                    { label: 'Schedule design review', priority: '#10b981', pLabel: 'Low', w: '65%' },
                ].map((t, i) => (
                    <div key={i} style={{
                        background: 'rgba(255,255,255,0.025)',
                        border: '1px solid rgba(255,255,255,0.06)',
                        borderRadius: '10px', padding: '10px 12px',
                        marginBottom: '8px', opacity: 0.45,
                    }}>
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                            <Circle size={18} color="#1e293b" />
                            <div style={{ flex: 1 }}>
                                <div style={{
                                    height: '10px', background: 'rgba(255,255,255,0.07)',
                                    borderRadius: '4px', width: t.w, marginBottom: '7px',
                                }} />
                                <span style={{
                                    background: `${t.priority}15`, border: `1px solid ${t.priority}30`,
                                    borderRadius: '8px', padding: '1px 6px',
                                    color: t.priority, fontSize: '10px',
                                }}>{t.pLabel}</span>
                            </div>
                        </div>
                    </div>
                ))}

                {/* CTA */}
                <div style={{ marginTop: 'auto', paddingTop: '16px' }}>
                    <p style={{ color: '#334155', fontSize: '11px', textAlign: 'center', marginBottom: '12px' }}>
                        Action items detected from the meeting will appear here automatically
                    </p>
                    <button style={{
                        width: '100%', padding: '10px',
                        background: 'linear-gradient(135deg, rgba(0,212,255,0.15), rgba(16,185,129,0.15))',
                        border: '1px solid rgba(0,212,255,0.25)', borderRadius: '10px',
                        color: '#00d4ff', fontSize: '12px', fontWeight: 600,
                        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                    }}>
                        <span style={{ fontSize: '14px' }}>＋</span> Add Task Manually
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div style={{ flex: 1, overflowY: 'auto', padding: '12px', scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.07) transparent' }}>
            {/* Progress bar */}
            <div style={{ marginBottom: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ color: '#64748b', fontSize: '11px' }}>Progress</span>
                    <span style={{ color: '#10b981', fontSize: '11px', fontWeight: 700 }}>
                        {done.length}/{actionItems.length} done
                    </span>
                </div>
                <div style={{ height: '3px', background: 'rgba(255,255,255,0.06)', borderRadius: '2px' }}>
                    <div style={{
                        height: '100%',
                        width: `${actionItems.length ? (done.length / actionItems.length) * 100 : 0}%`,
                        background: 'linear-gradient(90deg, #00d4ff, #10b981)',
                        borderRadius: '2px', transition: 'width 0.4s ease',
                    }} />
                </div>
            </div>

            {pending.map((item) => <ActionCard key={item.id} item={item} />)}

            {done.length > 0 && (
                <>
                    <div style={{ color: '#475569', fontSize: '11px', fontWeight: 600, margin: '8px 0 6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Completed
                    </div>
                    {done.map((item) => <ActionCard key={item.id} item={item} />)}
                </>
            )}
        </div>
    )
}
