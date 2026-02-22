// Main Sidebar App - MeetPilot AI
import React, { useState, useEffect } from 'react'
import { Brain, Bot, Radio, CheckSquare, ShieldAlert } from 'lucide-react'
import { MeetingProvider } from './context/MeetingContext'
import { Header } from './components/Header'
import { AIChat } from './components/AIChat'
import { LiveTranscript } from './components/LiveTranscript'
import { ActionItems } from './components/ActionItems'
import { FactChecker } from './components/FactChecker'
import { QuickActions } from './components/QuickActions'
import { useMeeting } from './context/MeetingContext'

const SIDEBAR_ID = 'meetpilot-sidebar-root'

function adjustMeetLayout(sidebarWidth: number) {
    const selectors = [
        '[data-allocation-index]',
        '.crqnQb',
        '[jsname="x3Eknd"]',
        'c-wiz[data-is-active-participant]',
    ]
    for (const sel of selectors) {
        const el = document.querySelector<HTMLElement>(sel)
        if (el) {
            el.style.marginRight = `${sidebarWidth}px`
            el.style.transition = 'margin-right 0.2s ease'
            return
        }
    }
    document.body.style.marginRight = `${sidebarWidth}px`
}

type Tab = 'ai' | 'transcript' | 'actions' | 'facts'

const TABS: { id: Tab; label: string; Icon: React.ElementType }[] = [
    { id: 'ai', label: 'AI Chat', Icon: Bot },
    { id: 'transcript', label: 'Live', Icon: Radio },
    { id: 'actions', label: 'Tasks', Icon: CheckSquare },
    { id: 'facts', label: 'Facts', Icon: ShieldAlert },
]

function TabBadge({ tab }: { tab: Tab }) {
    const { actionItems, factChecks } = useMeeting()
    if (tab === 'actions') {
        const pending = actionItems.filter((i) => i.status !== 'completed').length
        if (pending === 0) return null
        return (
            <span style={{
                background: '#00d4ff',
                borderRadius: '8px', padding: '0 4px',
                color: '#0f0f23', fontSize: '9px', fontWeight: 800,
                minWidth: '14px', textAlign: 'center',
            }}>{pending}</span>
        )
    }
    if (tab === 'facts') {
        const incorrect = factChecks.filter((f) => !f.isCorrect).length
        if (incorrect === 0) return null
        return (
            <span style={{
                background: '#f43f5e',
                borderRadius: '8px', padding: '0 4px',
                color: '#fff', fontSize: '9px', fontWeight: 800,
                minWidth: '14px', textAlign: 'center',
            }}>{incorrect}</span>
        )
    }
    return null
}

function SidebarContent() {
    const [activeTab, setActiveTab] = useState<Tab>('ai')
    const [hoveredTab, setHoveredTab] = useState<Tab | null>(null)
    const { isMinimized, dispatch, sendQuery } = useMeeting()

    // Collapse / expand the outer DOM container and adjust Meet layout
    useEffect(() => {
        const sidebar = document.getElementById(SIDEBAR_ID)
        if (!sidebar) return

        if (isMinimized) {
            // Save the current expanded width before collapsing
            const currentWidth = parseInt(sidebar.style.width)
            if (currentWidth > 0) {
                sidebar.dataset.expandedWidth = sidebar.style.width
            }
            sidebar.style.transition = 'width 0.2s ease'
            sidebar.style.width = '0px'
            adjustMeetLayout(0)

            // Hide resize handle while minimized
            const handle = document.getElementById('meetpilot-resize-handle')
            if (handle) handle.style.display = 'none'
        } else {
            const expanded = sidebar.dataset.expandedWidth || '380px'
            sidebar.style.transition = 'width 0.2s ease'
            sidebar.style.width = expanded
            adjustMeetLayout(parseInt(expanded))

            // Restore resize handle
            const handle = document.getElementById('meetpilot-resize-handle')
            if (handle) handle.style.display = ''
        }
    }, [isMinimized])

    if (isMinimized) {
        return (
            // position:fixed escapes the 0-width container and floats over the page
            <button
                onClick={() => dispatch({ type: 'SET_MINIMIZED', minimized: false })}
                title="Open MeetPilot"
                style={{
                    position: 'fixed',
                    right: '16px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '52px',
                    height: '52px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #00d4ff, #a78bfa)',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 24px rgba(0,212,255,0.45), 0 2px 8px rgba(0,0,0,0.4)',
                    zIndex: 2147483647,
                    transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                }}
                onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLButtonElement
                    el.style.transform = 'translateY(-50%) scale(1.1)'
                    el.style.boxShadow = '0 6px 32px rgba(0,212,255,0.6), 0 2px 12px rgba(0,0,0,0.5)'
                }}
                onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLButtonElement
                    el.style.transform = 'translateY(-50%) scale(1)'
                    el.style.boxShadow = '0 4px 24px rgba(0,212,255,0.45), 0 2px 8px rgba(0,0,0,0.4)'
                }}
            >
                <Brain size={24} color="#fff" />
            </button>
        )
    }

    return (
        <div style={{
            width: '100%', height: '100%',
            display: 'flex', flexDirection: 'column',
            background: 'linear-gradient(180deg, #0f0f23 0%, #1a1a2e 100%)',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        }}>
            {/* Header */}
            <Header />

            {/* Tabs */}
            <div style={{
                display: 'flex',
                borderBottom: '1px solid rgba(255,255,255,0.07)',
                background: 'rgba(0,0,0,0.25)',
                flexShrink: 0,
            }}>
                {TABS.map((tab) => {
                    const isActive = activeTab === tab.id
                    const isHovered = hoveredTab === tab.id
                    const color = isActive ? '#00d4ff' : isHovered ? '#94a3b8' : '#4a5568'
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            onMouseEnter={() => setHoveredTab(tab.id)}
                            onMouseLeave={() => setHoveredTab(null)}
                            style={{
                                flex: 1,
                                padding: '10px 4px 8px',
                                background: isActive ? 'rgba(0,212,255,0.06)' : 'none',
                                border: 'none',
                                borderBottom: `2px solid ${isActive ? '#00d4ff' : 'transparent'}`,
                                cursor: 'pointer',
                                color,
                                transition: 'all 0.18s ease',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '3px',
                            }}
                        >
                            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <tab.Icon size={15} />
                                <div style={{ position: 'absolute', top: '-4px', right: '-6px' }}>
                                    <TabBadge tab={tab.id} />
                                </div>
                            </div>
                            <span style={{ fontSize: '9px', fontWeight: 600, letterSpacing: '0.4px', textTransform: 'uppercase' }}>
                                {tab.label}
                            </span>
                        </button>
                    )
                })}
            </div>

            {/* Content */}
            <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                {activeTab === 'ai' && <AIChat />}
                {activeTab === 'transcript' && <LiveTranscript />}
                {activeTab === 'actions' && <ActionItems />}
                {activeTab === 'facts' && <FactChecker />}
            </div>

            {/* Quick actions bar */}
            <QuickActions onVoiceQuery={(text) => sendQuery(text)} />
        </div>
    )
}

interface AppProps {
    meetingId: string
}

export function App({ meetingId }: AppProps) {
    return (
        <MeetingProvider meetingId={meetingId}>
            <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }

        @keyframes mp-ping {
          0% { transform: scale(1); opacity: 0.8; }
          75%, 100% { transform: scale(2.5); opacity: 0; }
        }
        @keyframes mp-bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-6px); }
        }
        @keyframes mp-slideIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes mp-slideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes mp-confetti {
          0%   { opacity: 1; transform: translateY(0) scale(1); }
          100% { opacity: 0; transform: translateY(-30px) scale(1.4); }
        }
        @keyframes mp-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(244, 63, 94, 0.4); }
          50%       { box-shadow: 0 0 0 8px rgba(244, 63, 94, 0); }
        }

        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 2px; }
      `}</style>
            <SidebarContent />
        </MeetingProvider>
    )
}
