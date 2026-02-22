// MeetingContext - Global state for the MeetPilot sidebar
import React, { createContext, useContext, useReducer, useEffect, useRef, useCallback } from 'react'
import type { CaptionChunk, ChatMessage, ActionItem, FactCheck, WSStatus, ExtensionMessage, WebSocketMessage } from '../../types'

interface MeetingState {
    meetingId: string
    title: string
    startTime: number
    wsStatus: WSStatus
    captions: CaptionChunk[]
    messages: ChatMessage[]
    actionItems: ActionItem[]
    factChecks: FactCheck[]
    isMinimized: boolean
}

type Action =
    | { type: 'SET_WS_STATUS'; status: WSStatus }
    | { type: 'ADD_CAPTION'; caption: CaptionChunk }
    | { type: 'UPDATE_CAPTION'; caption: CaptionChunk }  // replace last caption from same speaker (streaming)
    | { type: 'ADD_MESSAGE'; message: ChatMessage }
    | { type: 'UPDATE_MESSAGE'; id: string; updates: Partial<ChatMessage> }
    | { type: 'ADD_ACTION_ITEM'; item: ActionItem }
    | { type: 'UPDATE_ACTION_ITEM'; id: string; updates: Partial<ActionItem> }
    | { type: 'ADD_FACT_CHECK'; check: FactCheck }
    | { type: 'SET_MINIMIZED'; minimized: boolean }

const initialState: MeetingState = {
    meetingId: '',
    title: 'Google Meet',
    startTime: Date.now(),
    wsStatus: 'connecting',
    captions: [],
    messages: [],
    actionItems: [],
    factChecks: [],
    isMinimized: false,
}

function reducer(state: MeetingState, action: Action): MeetingState {
    switch (action.type) {
        case 'SET_WS_STATUS':
            return { ...state, wsStatus: action.status }
        case 'ADD_CAPTION':
            return { ...state, captions: [...state.captions.slice(-200), action.caption] }
        case 'UPDATE_CAPTION': {
            // Replace the last caption if it's from the same speaker (live streaming update)
            // otherwise just append as a new entry
            const last = state.captions[state.captions.length - 1]
            if (last && last.speaker === action.caption.speaker) {
                return {
                    ...state,
                    captions: [...state.captions.slice(-200, -1), action.caption],
                }
            }
            return { ...state, captions: [...state.captions.slice(-200), action.caption] }
        }
        case 'ADD_MESSAGE':
            return { ...state, messages: [...state.messages, action.message] }
        case 'UPDATE_MESSAGE':
            return {
                ...state,
                messages: state.messages.map((m) =>
                    m.id === action.id ? { ...m, ...action.updates } : m
                ),
            }
        case 'ADD_ACTION_ITEM':
            return { ...state, actionItems: [...state.actionItems, action.item] }
        case 'UPDATE_ACTION_ITEM':
            return {
                ...state,
                actionItems: state.actionItems.map((item) =>
                    item.id === action.id ? { ...item, ...action.updates } : item
                ),
            }
        case 'ADD_FACT_CHECK':
            return { ...state, factChecks: [...state.factChecks.slice(-20), action.check] }
        case 'SET_MINIMIZED':
            return { ...state, isMinimized: action.minimized }
        default:
            return state
    }
}

interface MeetingContextValue extends MeetingState {
    dispatch: React.Dispatch<Action>
    sendQuery: (question: string) => void
    updateActionItem: (id: string, updates: Partial<ActionItem>) => void
}

const MeetingContext = createContext<MeetingContextValue | null>(null)

export function MeetingProvider({ children, meetingId }: { children: React.ReactNode; meetingId: string }) {
    const [state, dispatch] = useReducer(reducer, {
        ...initialState,
        meetingId,
        title: document?.title || 'Google Meet',
        startTime: Date.now(),
    })
    const portRef = useRef<chrome.runtime.Port | null>(null)

    // Track last text + timestamp per speaker for streaming detection
    const lastTextBySpeaker = useRef(new Map<string, string>())
    const lastTimeBySpeaker = useRef(new Map<string, number>())

    // STREAMING_WINDOW_MS: if same speaker sends a caption within this window,
    // treat it as a streaming update (replace last entry) rather than a new utterance.
    // Google Meet ASR fires many partial results rapidly; 5 s covers even slow speakers.
    const STREAMING_WINDOW_MS = 5000

    const addCaptionDeduped = useCallback((caption: CaptionChunk) => {
        const prevText = lastTextBySpeaker.current.get(caption.speaker) ?? ''
        const prevTime = lastTimeBySpeaker.current.get(caption.speaker) ?? 0

        // Exact duplicate — drop immediately
        if (caption.text === prevText) return

        lastTextBySpeaker.current.set(caption.speaker, caption.text)
        lastTimeBySpeaker.current.set(caption.speaker, caption.timestamp)

        const isSameStream =
            prevText.length > 0 &&
            caption.timestamp - prevTime < STREAMING_WINDOW_MS

        if (isSameStream) {
            // Same speech turn → replace the last caption bubble in place
            dispatch({ type: 'UPDATE_CAPTION', caption })
        } else {
            // New utterance or first caption → append a fresh bubble
            dispatch({ type: 'ADD_CAPTION', caption })
        }
    }, [])

    // Direct channel: window custom event fired by caption-capture in the same
    // content-script page context — fastest path, no service-worker round-trip.
    useEffect(() => {
        const handler = (e: Event) => {
            const caption = (e as CustomEvent<CaptionChunk>).detail
            if (caption) {
                console.debug('[MeetPilot] Sidebar received caption via window event:', caption.speaker, caption.text?.slice(0, 40))
                addCaptionDeduped(caption)
            }
        }
        window.addEventListener('meetpilot:caption', handler)
        return () => window.removeEventListener('meetpilot:caption', handler)
    }, [addCaptionDeduped])

    // Connect to background via long-lived port (also replays buffered captions
    // that arrived before the sidebar was mounted).
    useEffect(() => {
        const port = chrome.runtime.connect({ name: 'meetpilot-sidebar' })
        portRef.current = port

        port.onMessage.addListener((msg: ExtensionMessage) => {
            switch (msg.type) {
                case 'WS_STATUS':
                    dispatch({ type: 'SET_WS_STATUS', status: msg.status })
                    break
                case 'CAPTION_CHUNK':
                    addCaptionDeduped(msg.data)
                    break
                case 'WS_MESSAGE':
                    handleWsMessage(msg.payload)
                    break
            }
        })

        port.onDisconnect.addListener(() => {
            dispatch({ type: 'SET_WS_STATUS', status: 'disconnected' })
        })

        return () => port.disconnect()
    }, [addCaptionDeduped])

    function handleWsMessage(msg: WebSocketMessage) {
        switch (msg.type) {
            case 'AI_RESPONSE':
                dispatch({
                    type: 'ADD_MESSAGE',
                    message: {
                        id: `ai-${msg.data.timestamp}`,
                        role: 'assistant',
                        content: msg.data.answer,
                        sources: msg.data.sources,
                        confidence: msg.data.confidence,
                        timestamp: msg.data.timestamp,
                    },
                })
                // Remove loading message
                dispatch({
                    type: 'UPDATE_MESSAGE',
                    id: 'loading',
                    updates: { isLoading: false },
                })
                break
            case 'ACTION_ITEM_DETECTED':
                dispatch({ type: 'ADD_ACTION_ITEM', item: msg.data })
                break
            case 'FACT_CHECK_ALERT':
                dispatch({ type: 'ADD_FACT_CHECK', check: msg.data })
                break
        }
    }

    const sendQuery = useCallback((question: string) => {
        const userMsg: ChatMessage = {
            id: `user-${Date.now()}`,
            role: 'user',
            content: question,
            timestamp: Date.now(),
        }
        dispatch({ type: 'ADD_MESSAGE', message: userMsg })

        // Add loading placeholder
        dispatch({
            type: 'ADD_MESSAGE',
            message: {
                id: 'loading',
                role: 'assistant',
                content: '',
                timestamp: Date.now(),
                isLoading: true,
            },
        })

        // Forward to background → WS
        portRef.current?.postMessage({
            type: 'WS_SEND',
            payload: { type: 'USER_QUERY', data: { question, meetingId } },
        })
    }, [meetingId])

    const updateActionItem = useCallback((id: string, updates: Partial<ActionItem>) => {
        dispatch({ type: 'UPDATE_ACTION_ITEM', id, updates })
        portRef.current?.postMessage({
            type: 'WS_SEND',
            payload: { type: 'ACTION_ITEM_UPDATE', data: { id, updates } },
        })
    }, [])

    return (
        <MeetingContext.Provider value={{ ...state, dispatch, sendQuery, updateActionItem }}>
            {children}
        </MeetingContext.Provider>
    )
}

export function useMeeting() {
    const ctx = useContext(MeetingContext)
    if (!ctx) throw new Error('useMeeting must be used within MeetingProvider')
    return ctx
}
