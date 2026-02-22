// MeetPilot AI — Settings Page
import React, { useEffect, useState } from 'react'
import { Brain, Server, Zap, Trash2, Info, CheckSquare, ShieldAlert, Mic, Save, RotateCcw } from 'lucide-react'
import './Options.css'

interface Settings {
  wsUrl: string
  enableCaptions: boolean
  enableActionItems: boolean
  enableFactCheck: boolean
  sidebarWidth: number
}

const DEFAULT_SETTINGS: Settings = {
  wsUrl: 'wss://api.meetpilot.com/ws/meeting',
  enableCaptions: true,
  enableActionItems: true,
  enableFactCheck: true,
  sidebarWidth: 380,
}

function Toggle({ checked, onChange, disabled }: { checked: boolean; onChange: (v: boolean) => void; disabled?: boolean }) {
  return (
    <button
      onClick={() => !disabled && onChange(!checked)}
      style={{
        width: '40px', height: '22px', borderRadius: '11px', border: 'none', cursor: disabled ? 'not-allowed' : 'pointer',
        background: checked ? 'linear-gradient(135deg, #00d4ff, #0ea5e9)' : 'rgba(255,255,255,0.1)',
        padding: '2px', display: 'flex', alignItems: 'center',
        justifyContent: checked ? 'flex-end' : 'flex-start',
        transition: 'all 0.2s ease', flexShrink: 0, opacity: disabled ? 0.5 : 1,
      }}
    >
      <span style={{
        width: '18px', height: '18px', borderRadius: '50%',
        background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
        display: 'block', transition: 'all 0.2s ease',
      }} />
    </button>
  )
}

function Section({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: '12px', overflow: 'hidden', marginBottom: '12px',
    }}>
      <div style={{
        padding: '11px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)',
        display: 'flex', alignItems: 'center', gap: '8px',
        background: 'rgba(255,255,255,0.02)',
      }}>
        <span style={{ color: '#64748b' }}>{icon}</span>
        <span style={{ color: '#94a3b8', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.6px' }}>
          {title}
        </span>
      </div>
      {children}
    </div>
  )
}

function SettingRow({ label, description, children }: { label: string; description?: string; children: React.ReactNode }) {
  return (
    <div style={{
      padding: '12px 16px', display: 'flex', alignItems: 'center',
      justifyContent: 'space-between', gap: '16px',
      borderBottom: '1px solid rgba(255,255,255,0.04)',
    }}>
      <div style={{ flex: 1 }}>
        <div style={{ color: '#e2e8f0', fontSize: '13px', fontWeight: 500 }}>{label}</div>
        {description && <div style={{ color: '#475569', fontSize: '11px', marginTop: '2px', lineHeight: '1.4' }}>{description}</div>}
      </div>
      {children}
    </div>
  )
}

export const Options = () => {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS)
  const [saved, setSaved] = useState(false)
  const [cleared, setCleared] = useState(false)

  useEffect(() => {
    chrome.storage.sync.get(['meetpilot_settings'], (r) => {
      if (r.meetpilot_settings) {
        setSettings({ ...DEFAULT_SETTINGS, ...r.meetpilot_settings })
      }
    })
  }, [])

  const update = (patch: Partial<Settings>) => {
    setSettings((prev) => ({ ...prev, ...patch }))
    setSaved(false)
  }

  const save = () => {
    chrome.storage.sync.set({ meetpilot_settings: settings }, () => {
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    })
  }

  const clearData = () => {
    chrome.storage.local.clear(() => {
      setCleared(true)
      setTimeout(() => setCleared(false), 2000)
    })
  }

  const reset = () => {
    setSettings(DEFAULT_SETTINGS)
    setSaved(false)
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0d0d1f',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      color: '#fff',
      padding: '0',
    }}>
      {/* Top bar */}
      <div style={{
        padding: '16px 24px',
        background: 'linear-gradient(135deg, rgba(0,212,255,0.07) 0%, rgba(167,139,250,0.07) 100%)',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        display: 'flex', alignItems: 'center', gap: '12px',
      }}>
        <div style={{
          width: '36px', height: '36px',
          background: 'linear-gradient(135deg, #00d4ff, #a78bfa)',
          borderRadius: '9px', flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 14px rgba(0,212,255,0.25)',
        }}>
          <Brain size={18} color="#fff" />
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: '15px' }}>MeetPilot AI</div>
          <div style={{ color: '#475569', fontSize: '11px' }}>Settings</div>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: '560px', margin: '0 auto', padding: '20px 20px 80px' }}>

        {/* Connection */}
        <Section title="Connection" icon={<Server size={14} />}>
          <SettingRow label="WebSocket Server" description="Backend server URL for AI processing">
            <input
              value={settings.wsUrl}
              onChange={(e) => update({ wsUrl: e.target.value })}
              style={{
                width: '220px', background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)', borderRadius: '7px',
                color: '#e2e8f0', padding: '6px 10px', fontSize: '12px',
                outline: 'none', fontFamily: 'monospace',
              }}
              onFocus={(e) => (e.target.style.borderColor = '#00d4ff')}
              onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
              placeholder="wss://..."
            />
          </SettingRow>
          <SettingRow label="Sidebar Width" description={`Default width: ${settings.sidebarWidth}px (100–1000)`}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type="range" min={100} max={1000} step={10}
                value={settings.sidebarWidth}
                onChange={(e) => update({ sidebarWidth: Number(e.target.value) })}
                style={{ width: '100px', accentColor: '#00d4ff' }}
              />
              <span style={{ color: '#94a3b8', fontSize: '12px', minWidth: '38px', textAlign: 'right' }}>
                {settings.sidebarWidth}
              </span>
            </div>
          </SettingRow>
        </Section>

        {/* Features */}
        <Section title="Features" icon={<Zap size={14} />}>
          <SettingRow label="Caption Capture" description="Capture live captions from Google Meet">
            <Toggle checked={settings.enableCaptions} onChange={(v) => update({ enableCaptions: v })} />
          </SettingRow>
          <SettingRow label="Auto Action Items" description="Automatically detect and extract action items">
            <Toggle checked={settings.enableActionItems} onChange={(v) => update({ enableActionItems: v })} />
          </SettingRow>
          <SettingRow label="Fact Checking" description="Automatically verify claims made in the meeting">
            <Toggle checked={settings.enableFactCheck} onChange={(v) => update({ enableFactCheck: v })} />
          </SettingRow>
        </Section>

        {/* Data */}
        <Section title="Data & Storage" icon={<Trash2 size={14} />}>
          <SettingRow label="Clear Meeting Data" description="Removes all cached transcripts, action items, and fact checks">
            <button
              onClick={clearData}
              style={{
                padding: '6px 14px', borderRadius: '7px', cursor: 'pointer', fontSize: '12px', fontWeight: 600,
                background: cleared ? 'rgba(16,185,129,0.15)' : 'rgba(244,63,94,0.1)',
                border: `1px solid ${cleared ? 'rgba(16,185,129,0.4)' : 'rgba(244,63,94,0.3)'}`,
                color: cleared ? '#10b981' : '#f43f5e',
                transition: 'all 0.2s',
              }}
            >
              {cleared ? '✓ Cleared' : 'Clear Data'}
            </button>
          </SettingRow>
        </Section>

        {/* About */}
        <Section title="About" icon={<Info size={14} />}>
          <SettingRow label="Version"><span style={{ color: '#475569', fontSize: '12px' }}>v1.0.0</span></SettingRow>
          <SettingRow label="Links">
            <div style={{ display: 'flex', gap: '8px' }}>
              <a href="https://meetpilot.com" target="_blank" rel="noreferrer"
                style={{ color: '#00d4ff', fontSize: '12px', textDecoration: 'none' }}>Website</a>
              <span style={{ color: '#374151' }}>·</span>
              <a href="https://meetpilot.com/privacy" target="_blank" rel="noreferrer"
                style={{ color: '#64748b', fontSize: '12px', textDecoration: 'none' }}>Privacy</a>
            </div>
          </SettingRow>
        </Section>
      </div>

      {/* Sticky footer */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        padding: '12px 24px',
        background: 'rgba(13,13,31,0.95)',
        backdropFilter: 'blur(8px)',
        borderTop: '1px solid rgba(255,255,255,0.07)',
        display: 'flex', justifyContent: 'flex-end', gap: '8px',
      }}>
        <button
          onClick={reset}
          style={{
            padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: 600,
            background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#64748b',
            display: 'flex', alignItems: 'center', gap: '5px', transition: 'all 0.15s',
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = '#94a3b8' }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = '#64748b' }}
        >
          <RotateCcw size={12} /> Reset defaults
        </button>
        <button
          onClick={save}
          style={{
            padding: '8px 20px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: 700,
            background: saved ? 'linear-gradient(135deg, #10b981, #059669)' : 'linear-gradient(135deg, #00d4ff, #0ea5e9)',
            border: 'none', color: '#0a0a1a',
            display: 'flex', alignItems: 'center', gap: '5px', transition: 'all 0.2s',
            boxShadow: '0 4px 14px rgba(0,212,255,0.25)',
          }}
        >
          <Save size={13} /> {saved ? 'Saved!' : 'Save Settings'}
        </button>
      </div>

      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        input[type=range]::-webkit-slider-thumb { cursor: pointer; }
        a:hover { opacity: 0.8; }
      `}</style>
    </div>
  )
}

export default Options
