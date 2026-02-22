// AIChat - Main AI assistant chat interface
import React, { useState, useRef, useEffect } from 'react'
import { Send, Sparkles, ChevronDown, ChevronRight, FileText } from 'lucide-react'
import { useMeeting } from '../context/MeetingContext'
import type { ChatMessage } from '../../types'

const SUGGESTED_PROMPTS = [
    "What's our current MRR?",
    "Summarize key decisions so far",
    "Who owns the next action item?",
    "What was the last fact-checked claim?",
]

const confidenceColors: Record<string, string> = {
    high: '#10b981',
    medium: '#f59e0b',
    low: '#f43f5e',
}

function LoadingDots() {
    return (
        <div style={{ display: 'flex', gap: '5px', alignItems: 'center', padding: '8px 0' }}>
            {[0, 1, 2].map((i) => (
                <span key={i} style={{
                    width: '7px', height: '7px', borderRadius: '50%',
                    background: '#00d4ff',
                    animation: `mp-bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
                    display: 'inline-block',
                }} />
            ))}
            <span style={{ color: '#64748b', fontSize: '11px', marginLeft: '6px' }}>AI is thinking...</span>
        </div>
    )
}

function SourceChip({ file, snippet }: { file: string; snippet: string }) {
    const [expanded, setExpanded] = useState(false)
    return (
        <div>
            <button
                onClick={() => setExpanded(!expanded)}
                style={{
                    display: 'inline-flex', alignItems: 'center', gap: '4px',
                    background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.25)',
                    borderRadius: '12px', padding: '2px 8px', color: '#00d4ff',
                    fontSize: '10px', cursor: 'pointer', marginTop: '4px', marginRight: '4px',
                }}
            >
                <FileText size={10} />
                {file}
                {expanded ? <ChevronDown size={10} /> : <ChevronRight size={10} />}
            </button>
            {expanded && (
                <div style={{
                    background: 'rgba(0,0,0,0.3)', borderLeft: '2px solid #00d4ff',
                    padding: '6px 10px', marginTop: '4px', borderRadius: '0 6px 6px 0',
                    color: '#94a3b8', fontSize: '11px', fontStyle: 'italic',
                }}>
                    "{snippet}"
                </div>
            )}
        </div>
    )
}

function MessageBubble({ msg }: { msg: ChatMessage }) {
    const isUser = msg.role === 'user'
    return (
        <div style={{
            display: 'flex',
            justifyContent: isUser ? 'flex-end' : 'flex-start',
            marginBottom: '10px',
            animation: 'mp-slideIn 0.25s ease-out',
        }}>
            <div style={{
                maxWidth: '90%',
                background: isUser
                    ? 'linear-gradient(135deg, #00d4ff20, #a78bfa20)'
                    : 'rgba(255,255,255,0.04)',
                border: `1px solid ${isUser ? 'rgba(0,212,255,0.3)' : 'rgba(255,255,255,0.06)'}`,
                borderRadius: isUser ? '14px 14px 4px 14px' : '4px 14px 14px 14px',
                padding: '10px 13px',
            }}>
                {msg.isLoading ? (
                    <LoadingDots />
                ) : (
                    <>
                        <p style={{ color: '#e2e8f0', fontSize: '12px', lineHeight: '1.6', margin: 0 }}>
                            {msg.content}
                        </p>
                        {msg.confidence && (
                            <span style={{
                                display: 'inline-block', marginTop: '6px',
                                background: `${confidenceColors[msg.confidence]}20`,
                                border: `1px solid ${confidenceColors[msg.confidence]}50`,
                                borderRadius: '10px', padding: '1px 7px',
                                color: confidenceColors[msg.confidence], fontSize: '10px',
                            }}>
                                {msg.confidence} confidence
                            </span>
                        )}
                        {msg.sources?.map((s, i) => (
                            <SourceChip key={i} file={s.file} snippet={s.snippet} />
                        ))}
                    </>
                )}
            </div>
        </div>
    )
}

export function AIChat() {
    const { messages, sendQuery } = useMeeting()
    const [input, setInput] = useState('')
    const [focused, setFocused] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const textareaRef = useRef<HTMLTextAreaElement>(null)

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    const handleSubmit = () => {
        const q = input.trim()
        if (!q) return
        sendQuery(q)
        setInput('')
    }

    const handleKey = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSubmit()
        }
    }

    return (
        <div style={{
            display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden',
        }}>
            {/* Messages */}
            <div style={{
                flex: 1, overflowY: 'auto', padding: '12px',
                scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.1) transparent',
            }}>
                {messages.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '24px 12px' }}>
                        <div style={{
                            width: '48px', height: '48px',
                            background: 'linear-gradient(135deg, #00d4ff20, #a78bfa20)',
                            border: '1px solid rgba(0,212,255,0.2)',
                            borderRadius: '50%', margin: '0 auto 12px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                            <Sparkles size={22} color="#00d4ff" />
                        </div>
                        <p style={{ color: '#64748b', fontSize: '12px', marginBottom: '16px' }}>
                            Ask anything about your company data
                        </p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            {SUGGESTED_PROMPTS.map((p) => (
                                <button
                                    key={p}
                                    onClick={() => { setInput(p); textareaRef.current?.focus() }}
                                    style={{
                                        background: 'rgba(0,212,255,0.05)',
                                        border: '1px solid rgba(0,212,255,0.15)',
                                        borderRadius: '8px', padding: '8px 12px',
                                        color: '#94a3b8', fontSize: '11px', cursor: 'pointer',
                                        textAlign: 'left', transition: 'all 0.15s',
                                    }}
                                    onMouseEnter={(e) => {
                                        (e.target as HTMLElement).style.background = 'rgba(0,212,255,0.12)'
                                            ; (e.target as HTMLElement).style.color = '#00d4ff'
                                    }}
                                    onMouseLeave={(e) => {
                                        (e.target as HTMLElement).style.background = 'rgba(0,212,255,0.05)'
                                            ; (e.target as HTMLElement).style.color = '#94a3b8'
                                    }}
                                >
                                    {p}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
                {messages.map((msg) => (
                    <MessageBubble key={msg.id} msg={msg} />
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div style={{
                padding: '10px 12px',
                borderTop: '1px solid rgba(255,255,255,0.06)',
                background: 'rgba(0,0,0,0.2)',
            }}>
                <div style={{
                    display: 'flex', gap: '8px', alignItems: 'flex-end',
                    background: 'rgba(255,255,255,0.04)',
                    border: `1px solid ${focused ? '#00d4ff' : 'rgba(255,255,255,0.1)'}`,
                    borderRadius: '12px', padding: '8px 10px',
                    transition: 'border-color 0.2s',
                    boxShadow: focused ? '0 0 0 2px rgba(0,212,255,0.15)' : 'none',
                }}>
                    <textarea
                        ref={textareaRef}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKey}
                        onFocus={() => setFocused(true)}
                        onBlur={() => setFocused(false)}
                        placeholder="Ask AI anything..."
                        rows={1}
                        style={{
                            flex: 1, background: 'transparent', border: 'none', outline: 'none',
                            color: '#e2e8f0', fontSize: '12px', resize: 'none',
                            fontFamily: 'Inter, sans-serif', lineHeight: '1.5',
                            maxHeight: '80px', overflowY: 'auto',
                        }}
                    />
                    {input.trim() && (
                        <button
                            onClick={handleSubmit}
                            style={{
                                background: '#00d4ff',
                                border: 'none', borderRadius: '8px',
                                width: '30px', height: '30px',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                cursor: 'pointer', flexShrink: 0,
                                transition: 'transform 0.15s, opacity 0.15s',
                            }}
                            onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.transform = 'scale(1.1)'}
                            onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.transform = 'scale(1)'}
                        >
                            <Send size={13} color="#0f0f23" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}
