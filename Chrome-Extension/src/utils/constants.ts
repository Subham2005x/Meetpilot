// Constants for MeetPilot Extension

export const WS_URL = 'wss://api.meetpilot.com/ws/meeting'
export const API_BASE = 'https://api.meetpilot.com/api/v1'

export const RECONNECT_DELAYS = [1000, 2000, 4000, 8000, 16000, 30000]

export const STORAGE_KEYS = {
    AUTH_TOKEN: 'meetpilot_auth_token',
    USER_INFO: 'meetpilot_user_info',
    SETTINGS: 'meetpilot_settings',
    SIDEBAR_WIDTH: 'meetpilot_sidebar_width',
}

export const DEFAULT_SIDEBAR_WIDTH = 380
export const MIN_SIDEBAR_WIDTH = 100
export const MAX_SIDEBAR_WIDTH = 1000

export const SPEAKER_COLORS = [
    '#00d4ff', // electric blue
    '#a78bfa', // violet
    '#34d399', // emerald
    '#f59e0b', // amber
    '#f43f5e', // rose
    '#60a5fa', // sky blue
    '#fb923c', // orange
    '#e879f9', // fuchsia
]

// Top-level caption wrapper selectors (the container we MutationObserver)
export const CAPTION_WRAPPER_SELECTORS = [
    '[jsname="tgaKEf"]',
    '[jsname="GCjF4e"]',
    '.a4cQT',
]

// Per-speaker caption block selectors (one block per speaking participant)
export const CAPTION_BLOCK_SELECTORS = [
    '[jsname="YSxPC"]',
    '.iOzk7',
    '[data-speaking-message]',
    '.CNusmb',
]

// Keep for backward compatibility
export const CAPTION_SELECTORS = [...CAPTION_WRAPPER_SELECTORS, ...CAPTION_BLOCK_SELECTORS]

export const MEET_URL_PATTERN = /meet\.google\.com\/[a-z]+-[a-z]+-[a-z]+/
