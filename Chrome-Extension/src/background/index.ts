// Background Service Worker - MeetPilot AI
import { wsManager } from './websocket-manager'
import { calendarMonitor } from './calendar-monitor'
import type { ExtensionMessage, WebSocketMessage } from '../types'

// Track active meeting sidebar ports (for forwarding WS messages)
const sidebarPorts = new Set<chrome.runtime.Port>()

// Replay buffer — captions arrive before the sidebar React app finishes
// mounting and connecting its port. Buffer the last 150 captions so a
// newly-connected sidebar can catch up immediately.
const captionBuffer: ExtensionMessage[] = []
const CAPTION_BUFFER_MAX = 150

// Sidebar connections via long-lived ports
chrome.runtime.onConnect.addListener((port) => {
  if (port.name === 'meetpilot-sidebar') {
    sidebarPorts.add(port)

    // Replay any captions that arrived before this sidebar connected
    if (captionBuffer.length > 0) {
      captionBuffer.forEach((msg) => {
        try { port.postMessage(msg) } catch { /* port already dead */ }
      })
    }

    port.onDisconnect.addListener(() => sidebarPorts.delete(port))
    port.onMessage.addListener((msg: ExtensionMessage) => {
      handleSidebarMessage(msg)
    })
  }
})

// Short-lived messages (from content script)
chrome.runtime.onMessage.addListener((message: ExtensionMessage, _sender, sendResponse) => {
  handleMessage(message)
  sendResponse({ ok: true })
  return true
})

function handleMessage(message: ExtensionMessage) {
  switch (message.type) {
    case 'CAPTION_CHUNK':
      // Buffer for late-connecting sidebars
      captionBuffer.push(message)
      if (captionBuffer.length > CAPTION_BUFFER_MAX) captionBuffer.shift()
      // Increment caption count in storage so popup can read it
      chrome.storage.local.get('mp_caption_count', (r) => {
        chrome.storage.local.set({ mp_caption_count: (r.mp_caption_count ?? 0) + 1 })
      })
      // Forward caption to backend via WS
      wsManager.send({ type: 'CAPTION_CHUNK', data: message.data })
      // Broadcast to already-connected sidebars
      broadcastToSidebar(message)
      break

    case 'MEETING_DETECTED':
      // Persist meeting state so popup reflects it immediately
      chrome.storage.local.set({
        mp_meeting_title: message.title ?? 'Google Meet',
        mp_start_time: Date.now(),
        mp_ws_status: 'connecting',
        mp_caption_count: 0,
        mp_action_count: 0,
        mp_fact_count: 0,
      })
      // Connect WebSocket
      chrome.storage.local.get('meetpilot_auth_token', (result) => {
        const token = result['meetpilot_auth_token'] ?? 'demo-token'
        wsManager.connect(message.meetingId, token)
      })
      broadcastToSidebar(message)
      break

    case 'WS_SEND':
      wsManager.send(message.payload)
      break
  }
}

function handleSidebarMessage(message: ExtensionMessage) {
  if (message.type === 'WS_SEND') {
    wsManager.send(message.payload)
  }
}

function broadcastToSidebar(message: unknown) {
  sidebarPorts.forEach((port) => {
    try {
      port.postMessage(message)
    } catch {
      sidebarPorts.delete(port)
    }
  })
}

// Forward WebSocket messages to sidebars
wsManager.onMessage((wsMsg: WebSocketMessage) => {
  broadcastToSidebar({ type: 'WS_MESSAGE', payload: wsMsg })
  // Keep popup counts in sync
  if (wsMsg.type === 'ACTION_ITEM_DETECTED') {
    chrome.storage.local.get('mp_action_count', (r) => {
      chrome.storage.local.set({ mp_action_count: (r.mp_action_count ?? 0) + 1 })
    })
  }
  if (wsMsg.type === 'FACT_CHECK_ALERT') {
    chrome.storage.local.get('mp_fact_count', (r) => {
      chrome.storage.local.set({ mp_fact_count: (r.mp_fact_count ?? 0) + 1 })
    })
  }
})

wsManager.onStatus((status) => {
  chrome.storage.local.set({ mp_ws_status: status })
  if (status === 'disconnected') {
    // Clear meeting state so popup returns to idle
    chrome.storage.local.remove(['mp_meeting_title', 'mp_start_time', 'mp_caption_count', 'mp_action_count', 'mp_fact_count'])
  }
  broadcastToSidebar({ type: 'WS_STATUS', status })
})

// Start calendar monitor
calendarMonitor.start()

console.log('[MeetPilot] Background service worker started')
