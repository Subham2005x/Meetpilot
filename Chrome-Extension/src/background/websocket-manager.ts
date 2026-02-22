// WebSocket Manager for MeetPilot Extension
import type { WebSocketMessage, WSStatus } from '../types'
import { WS_URL, RECONNECT_DELAYS } from '../utils/constants'

type StatusListener = (status: WSStatus) => void
type MessageListener = (msg: WebSocketMessage) => void

export class WebSocketManager {
    private ws: WebSocket | null = null
    private meetingId: string | null = null
    private token: string | null = null
    private reconnectAttempt = 0
    private reconnectTimer: ReturnType<typeof setTimeout> | null = null
    private statusListeners: StatusListener[] = []
    private messageListeners: MessageListener[] = []
    private messageQueue: WebSocketMessage[] = []
    private intentionalClose = false

    connect(meetingId: string, token: string) {
        this.meetingId = meetingId
        this.token = token
        this.intentionalClose = false
        this.reconnectAttempt = 0
        this._open()
    }

    private _open() {
        if (!this.meetingId || !this.token) return
        const url = `${WS_URL}/${this.meetingId}?token=${this.token}`

        this._setStatus('connecting')
        try {
            this.ws = new WebSocket(url)
        } catch {
            this._scheduleReconnect()
            return
        }

        this.ws.onopen = () => {
            this.reconnectAttempt = 0
            this._setStatus('connected')
            // Drain queued messages
            while (this.messageQueue.length > 0) {
                const msg = this.messageQueue.shift()!
                this._rawSend(msg)
            }
        }

        this.ws.onmessage = (event) => {
            try {
                const msg = JSON.parse(event.data) as WebSocketMessage
                this.messageListeners.forEach((l) => l(msg))
            } catch {
                console.error('[MeetPilot WS] Failed to parse message', event.data)
            }
        }

        this.ws.onerror = () => {
            this._setStatus('error')
        }

        this.ws.onclose = () => {
            if (!this.intentionalClose) {
                this._scheduleReconnect()
            } else {
                this._setStatus('disconnected')
            }
        }
    }

    private _scheduleReconnect() {
        const delay = RECONNECT_DELAYS[Math.min(this.reconnectAttempt, RECONNECT_DELAYS.length - 1)]
        this.reconnectAttempt++
        this._setStatus('connecting')
        this.reconnectTimer = setTimeout(() => this._open(), delay)
    }

    disconnect() {
        this.intentionalClose = true
        if (this.reconnectTimer) clearTimeout(this.reconnectTimer)
        this.ws?.close()
        this.ws = null
        this._setStatus('disconnected')
    }

    send(message: WebSocketMessage) {
        if (this.ws?.readyState === WebSocket.OPEN) {
            this._rawSend(message)
        } else {
            this.messageQueue.push(message)
        }
    }

    private _rawSend(message: WebSocketMessage) {
        this.ws?.send(JSON.stringify(message))
    }

    private _setStatus(status: WSStatus) {
        this.statusListeners.forEach((l) => l(status))
    }

    onStatus(listener: StatusListener) {
        this.statusListeners.push(listener)
    }

    onMessage(listener: MessageListener) {
        this.messageListeners.push(listener)
    }

    getReadyState(): number {
        return this.ws?.readyState ?? WebSocket.CLOSED
    }
}

export const wsManager = new WebSocketManager()
