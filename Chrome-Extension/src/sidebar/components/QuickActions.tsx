// QuickActions - Bottom fixed bar with utility buttons
import React, { useState } from 'react'
import { Mic, MicOff, Settings, Sparkles } from 'lucide-react'
import { useMeeting } from '../context/MeetingContext'

interface QuickActionsProps {
    onVoiceQuery: (text: string) => void
}

export function QuickActions({ onVoiceQuery }: QuickActionsProps) {
    const { sendQuery } = useMeeting()
    const [isRecording, setIsRecording] = useState(false)
    const [showSettings, setShowSettings] = useState(false)

    const toggleVoice = async () => {
        if (isRecording) {
            setIsRecording(false)
            return
        }

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
            setIsRecording(true)

            // Simple demo — in production, integrate Whisper
            const recognition = new (window as any).webkitSpeechRecognition()
            recognition.continuous = false
            recognition.interimResults = false
            recognition.lang = 'en-US'

            recognition.onresult = (event: any) => {
                const transcript = event.results[0][0].transcript
                sendQuery(transcript)
                setIsRecording(false)
                stream.getTracks().forEach((t: MediaStreamTrack) => t.stop())
            }

            recognition.onerror = () => {
                setIsRecording(false)
                stream.getTracks().forEach((t: MediaStreamTrack) => t.stop())
            }

            recognition.start()
        } catch {
            setIsRecording(false)
        }
    }

    return (
        <div style={{
            padding: '8px 12px',
            borderTop: '1px solid rgba(255,255,255,0.06)',
            background: 'rgba(0,0,0,0.25)',
            display: 'flex', alignItems: 'center', gap: '8px',
            flexShrink: 0,
        }}>
            {/* Voice button */}
            <button
                onClick={toggleVoice}
                title={isRecording ? 'Stop recording' : 'Voice query'}
                style={{
                    width: '34px', height: '34px', borderRadius: '50%',
                    background: isRecording
                        ? 'linear-gradient(135deg, #f43f5e, #fb923c)'
                        : 'linear-gradient(135deg, #00d4ff20, #a78bfa20)',
                    border: `1px solid ${isRecording ? '#f43f5e' : 'rgba(0,212,255,0.25)'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', transition: 'all 0.2s',
                    boxShadow: isRecording ? '0 0 12px rgba(244,63,94,0.4)' : 'none',
                    animation: isRecording ? 'mp-pulse 1.5s ease-in-out infinite' : 'none',
                }}
            >
                {isRecording
                    ? <MicOff size={16} color="#fff" />
                    : <Mic size={16} color="#00d4ff" />}
            </button>

            {/* Quick AI prompt */}
            <button
                onClick={() => sendQuery('Summarize the key points of this meeting so far')}
                title="Quick summary"
                style={{
                    height: '34px', flex: 1, borderRadius: '17px',
                    background: 'rgba(167,139,250,0.08)',
                    border: '1px solid rgba(167,139,250,0.2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                    cursor: 'pointer', color: '#a78bfa', fontSize: '11px',
                    transition: 'all 0.15s',
                }}
                onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background = 'rgba(167,139,250,0.15)'
                }}
                onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background = 'rgba(167,139,250,0.08)'
                }}
            >
                <Sparkles size={13} />
                Quick Summary
            </button>

            {/* Settings */}
            <button
                onClick={() => setShowSettings(!showSettings)}
                title="Settings"
                style={{
                    width: '34px', height: '34px', borderRadius: '50%',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', transition: 'all 0.15s',
                    color: showSettings ? '#fff' : '#64748b',
                }}
                onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.color = '#fff'}
                onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.color = showSettings ? '#fff' : '#64748b'}
            >
                <Settings size={15} />
            </button>

        </div>
    )
}
