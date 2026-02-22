// Header component - Meeting info bar
import React, { useEffect, useState } from 'react'
import { Wifi, WifiOff, Loader2, Brain, ChevronRight } from 'lucide-react'
import { useMeeting } from '../context/MeetingContext'

function formatTime(seconds: number): string {
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0')
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0')
    const s = (seconds % 60).toString().padStart(2, '0')
    return `${h}:${m}:${s}`
}

export function Header() {
    const { title, wsStatus, startTime, dispatch } = useMeeting()
    const [elapsed, setElapsed] = useState(0)

    useEffect(() => {
        const interval = setInterval(() => {
            setElapsed(Math.floor((Date.now() - startTime) / 1000))
        }, 1000)
        return () => clearInterval(interval)
    }, [startTime])

    const statusConfig = {
        connected: { color: '#10b981', label: 'Live', Icon: Wifi },
        connecting: { color: '#f59e0b', label: 'Connecting', Icon: Loader2 },
        disconnected: { color: '#f43f5e', label: 'Offline', Icon: WifiOff },
        error: { color: '#f43f5e', label: 'Error', Icon: WifiOff },
    }[wsStatus]

    return (
        <div style={{
            padding: '12px 16px',
            background: 'linear-gradient(135deg, rgba(0,212,255,0.1) 0%, rgba(167,139,250,0.1) 100%)',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            flexShrink: 0,
        }}>
            {/* Logo */}
            <div style={{
                width: '32px', height: '32px',
                background: 'linear-gradient(135deg, #00d4ff, #a78bfa)',
                borderRadius: '8px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
            }}>
                <Brain size={18} color="#fff" />
            </div>

            {/* Title & status */}
            <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                    color: '#fff', fontWeight: 700, fontSize: '13px',
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                }}>
                    {title || 'Google Meet'}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                    {/* Pulsing dot */}
                    <span style={{ position: 'relative', display: 'inline-flex' }}>
                        <span style={{
                            width: '8px', height: '8px', borderRadius: '50%',
                            background: statusConfig.color,
                            display: 'block',
                        }} />
                        {wsStatus === 'connected' && (
                            <span style={{
                                position: 'absolute', top: 0, left: 0,
                                width: '8px', height: '8px', borderRadius: '50%',
                                background: statusConfig.color,
                                animation: 'mp-ping 1.5s ease-out infinite',
                            }} />
                        )}
                    </span>
                    <span style={{ color: statusConfig.color, fontSize: '11px', fontWeight: 600 }}>
                        {statusConfig.label}
                    </span>
                    <span style={{ color: '#64748b', fontSize: '11px' }}>•</span>
                    <span style={{ color: '#94a3b8', fontSize: '11px', fontFamily: 'monospace' }}>
                        {formatTime(elapsed)}
                    </span>
                </div>
            </div>

            {/* Minimize button */}
            <button
                onClick={() => dispatch({ type: 'SET_MINIMIZED', minimized: true })}
                title="Minimize sidebar"
                style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.09)',
                    borderRadius: '8px',
                    color: '#64748b',
                    cursor: 'pointer',
                    width: '30px',
                    height: '30px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    transition: 'background 0.15s, color 0.15s',
                }}
                onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLButtonElement
                    el.style.background = 'rgba(255,255,255,0.1)'
                    el.style.color = '#e2e8f0'
                }}
                onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLButtonElement
                    el.style.background = 'rgba(255,255,255,0.05)'
                    el.style.color = '#64748b'
                }}
            >
                <ChevronRight size={16} />
            </button>
        </div>
    )
}
