// Shared type definitions for MeetPilot AI Chrome Extension

export interface Meeting {
    id: string
    title: string
    startTime: Date
    endTime?: Date
    platform: 'google_meet' | 'zoom' | 'teams'
    participants: Participant[]
    status: 'scheduled' | 'active' | 'ended'
}

export interface Participant {
    id: string
    name: string
    email?: string
    joinedAt?: Date
    leftAt?: Date
    speakingDuration?: number // seconds
    color?: string // for transcript speaker color tagging
}

export interface CaptionChunk {
    text: string
    speaker: string
    timestamp: number
    meetingId?: string
}

export interface AIResponse {
    id: string
    answer: string
    sources: Source[]
    confidence: 'high' | 'medium' | 'low'
    timestamp: number
}

export interface Source {
    file: string
    page?: number
    snippet: string
    score: number // relevance 0-1
}

export interface ActionItem {
    id: string
    meetingId: string
    description: string
    assignedTo?: string
    dueDate?: Date
    priority: 'high' | 'medium' | 'low'
    status: 'pending' | 'in_progress' | 'completed'
    createdAt: Date
    syncedTo?: ('jira' | 'slack' | 'email')[]
}

export interface FactCheck {
    id: string
    originalClaim: string
    correctedValue?: string
    isCorrect: boolean
    source: string
    confidence: number // 0-1
    timestamp: number
}

export interface ChatMessage {
    id: string
    role: 'user' | 'assistant'
    content: string
    sources?: Source[]
    confidence?: 'high' | 'medium' | 'low'
    timestamp: number
    isLoading?: boolean
}

// WebSocket message types
export type WebSocketMessage =
    | { type: 'CAPTION_CHUNK'; data: CaptionChunk }
    | { type: 'USER_QUERY'; data: { question: string; meetingId: string } }
    | { type: 'AI_RESPONSE'; data: AIResponse }
    | { type: 'ACTION_ITEM_DETECTED'; data: ActionItem }
    | { type: 'ACTION_ITEM_UPDATE'; data: { id: string; updates: Partial<ActionItem> } }
    | { type: 'FACT_CHECK_ALERT'; data: FactCheck }
    | { type: 'MEETING_SUMMARY'; data: { summary: string; keyPoints: string[] } }

// Extension internal messaging
export type ExtensionMessage =
    | { type: 'SIDEBAR_READY' }
    | { type: 'WS_SEND'; payload: WebSocketMessage }
    | { type: 'WS_MESSAGE'; payload: WebSocketMessage }
    | { type: 'WS_STATUS'; status: 'connected' | 'connecting' | 'disconnected' | 'error' }
    | { type: 'CAPTION_CHUNK'; data: CaptionChunk }
    | { type: 'MEETING_DETECTED'; meetingId: string; title: string }

export type WSStatus = 'connected' | 'connecting' | 'disconnected' | 'error'
