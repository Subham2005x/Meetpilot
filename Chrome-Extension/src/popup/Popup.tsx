// MeetPilot AI Popup
import React, { useEffect, useState } from 'react'
import { Brain, Wifi, WifiOff, Loader2, ExternalLink, Settings, Mic, CheckSquare, ShieldAlert, Clock } from 'lucide-react'

type Status = 'connected' | 'connecting' | 'disconnected'

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  if (h > 0) return `${h}h ${m}m`
  if (m > 0) return `${m}m ${s}s`
  return `${s}s`
}

const S: Record<string, React.CSSProperties> = {
  root: {
    width: '350px',
    background: '#0d0d1f',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    color: '#fff',
    overflow: 'hidden',
    userSelect: 'none',
  },
  header: {
    padding: '14px 16px',
    background: 'linear-gradient(135deg, rgba(0,212,255,0.08) 0%, rgba(167,139,250,0.08) 100%)',
    borderBottom: '1px solid rgba(255,255,255,0.07)',
    display: 'flex',
    alignItems: 'center',
    gap: '11px',
  },
  logo: {
    width: '38px', height: '38px', flexShrink: 0,
    background: 'linear-gradient(135deg, #00d4ff, #a78bfa)',
    borderRadius: '10px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    boxShadow: '0 4px 14px rgba(0,212,255,0.3)',
  },
  divider: { height: '1px', background: 'rgba(255,255,255,0.06)' },
}

export function Popup() {
  const [status, setStatus] = useState<Status>('disconnected')
  const [meetingTitle, setMeetingTitle] = useState<string | null>(null)
  const [actionCount, setActionCount] = useState(0)
  const [captionCount, setCaptionCount] = useState(0)
  const [factCount, setFactCount] = useState(0)
  const [startTime, setStartTime] = useState<number | null>(null)
  const [elapsed, setElapsed] = useState(0)
  const [btnHover, setBtnHover] = useState(false)
  const [settingsHover, setSettingsHover] = useState(false)

  useEffect(() => {
    const keys = ['mp_ws_status', 'mp_meeting_title', 'mp_action_count', 'mp_caption_count', 'mp_fact_count', 'mp_start_time']

    // Initial read
    chrome.storage.local.get(keys, (r) => {
      if (r.mp_ws_status) setStatus(r.mp_ws_status)
      if (r.mp_meeting_title) setMeetingTitle(r.mp_meeting_title)
      if (r.mp_action_count != null) setActionCount(r.mp_action_count)
      if (r.mp_caption_count != null) setCaptionCount(r.mp_caption_count)
      if (r.mp_fact_count != null) setFactCount(r.mp_fact_count)
      if (r.mp_start_time) setStartTime(r.mp_start_time)
    })

    // Live updates — fires whenever background writes to storage
    const onChange = (changes: Record<string, chrome.storage.StorageChange>, area: string) => {
      if (area !== 'local') return
      if (changes.mp_ws_status) setStatus(changes.mp_ws_status.newValue)
      if (changes.mp_meeting_title) setMeetingTitle(changes.mp_meeting_title.newValue ?? null)
      if (changes.mp_action_count) setActionCount(changes.mp_action_count.newValue ?? 0)
      if (changes.mp_caption_count) setCaptionCount(changes.mp_caption_count.newValue ?? 0)
      if (changes.mp_fact_count) setFactCount(changes.mp_fact_count.newValue ?? 0)
      if (changes.mp_start_time) setStartTime(changes.mp_start_time.newValue ?? null)
    }
    chrome.storage.onChanged.addListener(onChange)
    return () => chrome.storage.onChanged.removeListener(onChange)
  }, [])

  useEffect(() => {
    if (!startTime || status !== 'connected') return
    const id = setInterval(() => setElapsed(Math.floor((Date.now() - startTime) / 1000)), 1000)
    return () => clearInterval(id)
  }, [startTime, status])

  const openMeet = () => chrome.tabs.create({ url: 'https://meet.google.com' })
  const openSettings = () => chrome.runtime.openOptionsPage()

  const isLive = status === 'connected'
  const isConnecting = status === 'connecting'

  const statusDot = isLive ? '#10b981' : isConnecting ? '#f59e0b' : '#374151'
  const statusLabel = isLive ? 'Live — AI Active' : isConnecting ? 'Connecting…' : 'Not in a meeting'

  return (
    <div style={S.root}>
      {/* ── Header ── */}
      <div style={S.header}>
        <div style={S.logo}><Brain size={20} color="#fff" /></div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: '14px', letterSpacing: '-0.2px' }}>MeetPilot AI</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '3px' }}>
            <span style={{
              width: '7px', height: '7px', borderRadius: '50%',
              background: statusDot,
              boxShadow: isLive ? `0 0 6px ${statusDot}` : 'none',
              display: 'inline-block',
              animation: isConnecting ? 'mp-blink 1s ease-in-out infinite' : 'none',
            }} />
            <span style={{ color: statusDot, fontSize: '11px', fontWeight: 600 }}>{statusLabel}</span>
          </div>
        </div>
        {isLive && startTime && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '4px',
            background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)',
            borderRadius: '20px', padding: '3px 9px',
          }}>
            <Clock size={10} color="#10b981" />
            <span style={{ color: '#10b981', fontSize: '11px', fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>
              {formatDuration(elapsed)}
            </span>
          </div>
        )}
      </div>

      {/* ── Meeting card ── */}
      {isLive && meetingTitle && (
        <div style={{
          margin: '12px 14px 0',
          padding: '10px 12px',
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '10px',
        }}>
          <div style={{ color: '#94a3b8', fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '4px' }}>Active meeting</div>
          <div style={{ color: '#e2e8f0', fontSize: '12px', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {meetingTitle}
          </div>
        </div>
      )}

      {/* ── Stats row ── */}
      {isLive && (
        <div style={{ display: 'flex', gap: '8px', margin: '10px 14px 0' }}>
          {[
            { icon: <Mic size={13} color="#00d4ff" />, value: captionCount, label: 'Captions', c: '#00d4ff' },
            { icon: <CheckSquare size={13} color="#a78bfa" />, value: actionCount, label: 'Tasks', c: '#a78bfa' },
            { icon: <ShieldAlert size={13} color="#f59e0b" />, value: factCount, label: 'Facts', c: '#f59e0b' },
          ].map(({ icon, value, label, c }) => (
            <div key={label} style={{
              flex: 1, padding: '8px 6px',
              background: `${c}0d`,
              border: `1px solid ${c}30`,
              borderRadius: '8px',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
            }}>
              {icon}
              <span style={{ color: '#e2e8f0', fontSize: '14px', fontWeight: 700 }}>{value}</span>
              <span style={{ color: '#64748b', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.4px' }}>{label}</span>
            </div>
          ))}
        </div>
      )}

      {/* ── Idle hint ── */}
      {!isLive && (
        <div style={{ padding: '18px 16px 4px', textAlign: 'center' }}>
          <div style={{
            width: '44px', height: '44px', borderRadius: '50%',
            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px',
          }}>
            {isConnecting
              ? <Loader2 size={20} color="#f59e0b" style={{ animation: 'mp-spin 1s linear infinite' }} />
              : <WifiOff size={20} color="#374151" />}
          </div>
          <p style={{ color: '#475569', fontSize: '12px', lineHeight: '1.5', margin: 0 }}>
            {isConnecting ? 'Looking for an active meeting…' : 'Open Google Meet to get started.'}
          </p>
        </div>
      )}

      {/* ── Actions ── */}
      <div style={{ padding: '14px', display: 'flex', gap: '8px', marginTop: isLive ? '10px' : '12px' }}>
        <button
          onClick={openMeet}
          onMouseEnter={() => setBtnHover(true)}
          onMouseLeave={() => setBtnHover(false)}
          style={{
            flex: 1, height: '38px',
            background: btnHover
              ? 'linear-gradient(135deg, #22e5ff, #38b6ff)'
              : 'linear-gradient(135deg, #00d4ff, #0ea5e9)',
            border: 'none', borderRadius: '9px', cursor: 'pointer',
            color: '#0a0a1a', fontWeight: 700, fontSize: '12px',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
            transition: 'background 0.15s, transform 0.1s',
            transform: btnHover ? 'scale(1.01)' : 'scale(1)',
            boxShadow: '0 4px 16px rgba(0,212,255,0.25)',
          }}
        >
          <ExternalLink size={13} />
          {isLive ? 'Go to Meeting' : 'Open Meet'}
        </button>
        <button
          onClick={openSettings}
          onMouseEnter={() => setSettingsHover(true)}
          onMouseLeave={() => setSettingsHover(false)}
          title="Settings"
          style={{
            width: '38px', height: '38px',
            background: settingsHover ? 'rgba(255,255,255,0.09)' : 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '9px', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: settingsHover ? '#e2e8f0' : '#64748b',
            transition: 'all 0.15s',
          }}
        >
          <Settings size={15} />
        </button>
      </div>

      <style>{`
        @keyframes mp-blink { 0%,100%{opacity:1} 50%{opacity:0.3} }
        @keyframes mp-spin  { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        * { box-sizing: border-box; margin: 0; padding: 0; }
      `}</style>
    </div>
  )
}

export default Popup
