// LiveTranscript - Real-time caption display (speaker-grouped, no stacking)
import React, { useRef, useEffect } from 'react'
import { useMeeting } from '../context/MeetingContext'
import { SPEAKER_COLORS } from '../../utils/constants'

// ── Speaker colour assignment ────────────────────────────────────────────────
const speakerColorCache = new Map<string, string>()
let colorIdx = 0

function getSpeakerColor(speaker: string): string {
    if (!speakerColorCache.has(speaker)) {
        speakerColorCache.set(speaker, SPEAKER_COLORS[colorIdx % SPEAKER_COLORS.length])
        colorIdx++
    }
    return speakerColorCache.get(speaker)!
}

function speakerInitial(name: string): string {
    return name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()
}

function formatTime(ts: number): string {
    return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

// ── Main component ───────────────────────────────────────────────────────────
export function LiveTranscript() {
    const { captions } = useMeeting()
    const bottomRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [captions])

    if (captions.length === 0) {
        return (
            <div style={{
                flex: 1, display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                padding: '24px', gap: '10px',
            }}>
                <div style={{
                    width: '44px', height: '44px', borderRadius: '50%',
                    background: 'rgba(255,255,255,0.04)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '20px',
                }}>
                    🎤
                </div>
                <p style={{ color: '#334155', fontSize: '12px', textAlign: 'center', margin: 0 }}>
                    Enable captions in Google Meet<br />to see live transcript
                </p>
            </div>
        )
    }

    // Group consecutive same-speaker captions visually (header shown once per run)
    // Each entry's text is already the final/replaced value from UPDATE_CAPTION —
    // do NOT concatenate, just display as-is.
    interface Group {
        speaker: string
        timestamp: number
        entries: { text: string; ts: number }[]
    }
    const groups: Group[] = []
    for (const cap of captions) {
        const last = groups[groups.length - 1]
        if (last && last.speaker === cap.speaker) {
            last.entries.push({ text: cap.text, ts: cap.timestamp })
        } else {
            groups.push({ speaker: cap.speaker, timestamp: cap.timestamp, entries: [{ text: cap.text, ts: cap.timestamp }] })
        }
    }

    return (
        <div style={{
            flex: 1, overflowY: 'auto', padding: '14px 12px',
            scrollbarWidth: 'thin',
            scrollbarColor: 'rgba(255,255,255,0.06) transparent',
        }}>
            {groups.map((g, gi) => {
                const color = getSpeakerColor(g.speaker)
                const initial = speakerInitial(g.speaker)
                const isLastGroup = gi === groups.length - 1

                return (
                    <div key={gi} style={{ display: 'flex', gap: '8px', marginBottom: '14px', animation: 'mp-slideIn 0.18s ease-out' }}>
                        {/* Avatar */}
                        <div style={{
                            flexShrink: 0, width: '28px', height: '28px', borderRadius: '50%',
                            background: `${color}22`, border: `1.5px solid ${color}55`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '10px', fontWeight: 700, color, marginTop: '1px',
                        }}>
                            {initial}
                        </div>

                        {/* Content */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                            {/* Speaker + time */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                                <span style={{ color, fontSize: '11px', fontWeight: 700, letterSpacing: '0.3px' }}>
                                    {g.speaker}
                                </span>
                                <span style={{ color: '#334155', fontSize: '10px' }}>
                                    {formatTime(g.timestamp)}
                                </span>
                                {isLastGroup && (
                                    <span style={{
                                        marginLeft: 'auto', width: '6px', height: '6px',
                                        borderRadius: '50%', background: color,
                                        boxShadow: `0 0 6px ${color}88`, flexShrink: 0,
                                        animation: 'mp-pulse 1.2s ease-in-out infinite',
                                    }} />
                                )}
                            </div>

                            {/* One bubble per caption entry */}
                            {g.entries.map((e, ei) => (
                                <div key={ei} style={{
                                    background: 'rgba(255,255,255,0.03)',
                                    border: `1px solid ${color}18`,
                                    borderLeft: `2px solid ${color}`,
                                    borderRadius: '0 8px 8px 8px',
                                    padding: '8px 10px', marginBottom: ei < g.entries.length - 1 ? '4px' : 0,
                                    color: '#cbd5e1', fontSize: '12.5px', lineHeight: '1.65',
                                    wordBreak: 'break-word',
                                }}>
                                    {e.text}
                                </div>
                            ))}
                        </div>
                    </div>
                )
            })}
            <div ref={bottomRef} />
        </div>
    )
}
