// Caption Capture - MeetPilot content script
import type { CaptionChunk } from '../types'
import { SPEAKER_COLORS } from '../utils/constants'

const speakerColorMap = new Map<string, string>()
let colorIndex = 0

// Per-speaker dedup — track last emitted text per speaker
const lastTextBySpeaker = new Map<string, string>()

let meetingId = ''
let debounceTimer: ReturnType<typeof setTimeout> | null = null

export function initCaptionCapture(mId: string) {
    meetingId = mId
    observeCaptions()
}

// ─── Google Meet caption DOM structure (as of 2025) ──────────────────────────
//
//  <div jsname="tgaKEf">                ← outermost caption wrapper (the one we observe)
//    <div class="iOzk7" ...>            ← one block per active speaker
//      <div jsname="YSxPC">            ← speaker name container
//        <span jsname="bVBpue">Name</span>
//      </div>
//      <div jsname="GCcNlb" ...>       ← caption text container
//        <span jsname="...">partial text...</span>
//      </div>
//    </div>
//    ...more speaker blocks...
//  </div>
//
//  Older / alternative structure:
//  <div class="CNusmb">
//    <div class="zs7s8d">Speaker Name</div>
//    <span>caption text</span>
//  </div>
// ─────────────────────────────────────────────────────────────────────────────

// Selectors that identify the TOP wrapper of the whole caption area
const CAPTION_WRAPPER_SELECTORS = [
    '[jsname="tgaKEf"]',
    '[jsname="GCjF4e"]',   // alternate outer container
    '.a4cQT',
]

// Selectors that match ONE caption block (speaker + text together)
// In current Google Meet:
//   .iOzk7  = per-speaker row wrapper (contains both speaker label + caption text)
//   .CNusmb = older per-speaker row wrapper
const CAPTION_BLOCK_SELECTORS = [
    '.iOzk7',             // current Meet: one block per speaker
    '[data-speaking-message]',
    '.CNusmb',            // older Meet UI
]

// Known Google Meet UI strings that leak into the caption DOM and must be removed
const MEET_UI_NOISE: RegExp[] = [
    /jump to bottom/gi,
    /enable captions/gi,
    /captions are on/gi,
    /captions are off/gi,
    /caption settings/gi,
    /live captions/gi,
    /auto-generated captions/gi,
    /captions by google/gi,
]

// Selectors for the speaker name *within* a caption block
const SPEAKER_NAME_SELECTORS = [
    '[jsname="bVBpue"]',
    '[jsname="NWpY0d"]',
    '.NWpY0d',
    '.zs7s8d',
    '[data-self-name]',
    '[data-sender-name]',
    '[data-speaker-name]',
]

// Selectors for the caption text *within* a caption block
const CAPTION_TEXT_SELECTORS = [
    '[jsname="GCcNlb"]',
    '[jsname="wBMmRb"]',
    '.bj81Mc',
]

function observeCaptions() {
    const container = findCaptionWrapper()
    if (container) {
        attachObserver(container)
        return
    }
    // Retry until the user enables captions
    const bodyObserver = new MutationObserver(() => {
        const c = findCaptionWrapper()
        if (c) {
            bodyObserver.disconnect()
            attachObserver(c)
        }
    })
    bodyObserver.observe(document.body, { childList: true, subtree: true })
}

function findCaptionWrapper(): Element | null {
    // Strategy 1: known top-level caption wrapper selectors
    for (const sel of CAPTION_WRAPPER_SELECTORS) {
        const el = document.querySelector(sel)
        if (el) {
            console.log('[MeetPilot] Caption wrapper found via selector:', sel)
            return el
        }
    }

    // Strategy 2: if a caption block already exists, go up to its parent
    for (const sel of CAPTION_BLOCK_SELECTORS) {
        const el = document.querySelector(sel)
        if (el && el.parentElement && el.parentElement !== document.body) {
            console.log('[MeetPilot] Caption wrapper found via block parent:', sel)
            return el.parentElement
        }
    }

    return null
}

function attachObserver(container: Element) {
    console.log('[MeetPilot] Attaching observer to:', container.tagName, container.className?.slice?.(0, 60))
    const observer = new MutationObserver(() => {
        if (debounceTimer) clearTimeout(debounceTimer)
        // 150 ms debounce: Google Meet streams captions word-by-word; we wait
        // for a short pause so we emit complete phrases rather than fragments
        debounceTimer = setTimeout(() => processAllCaptionBlocks(container), 150)
    })
    observer.observe(container, { childList: true, subtree: true, characterData: true })

    // Process whatever text is already visible
    processAllCaptionBlocks(container)
}

function processAllCaptionBlocks(wrapper: Element) {
    // ── Phase 1: find structured caption blocks ────────────────────────────
    let blocks: Element[] = []
    for (const sel of CAPTION_BLOCK_SELECTORS) {
        const found = Array.from(wrapper.querySelectorAll(sel))
        if (found.length > 0) {
            blocks = found
            break
        }
    }

    if (blocks.length > 0) {
        for (const block of blocks) {
            processStructuredBlock(block as HTMLElement)
        }
        return
    }

    // ── Phase 2 fallback: no known block structure found ───────────────────
    // Treat direct children of the wrapper as caption blocks
    if (wrapper.children.length > 0) {
        for (const child of Array.from(wrapper.children)) {
            processStructuredBlock(child as HTMLElement)
        }
        return
    }

    // ── Phase 3 fallback: raw text in wrapper, speaker unknown ────────────
    const text = wrapper.textContent?.trim()
    if (text && text.length > 1) {
        emitCaption('Unknown', text)
    }
}

function processStructuredBlock(block: HTMLElement) {
    // 1. Try to find the speaker name using known selectors WITHIN the block
    const speaker = extractSpeakerFromBlock(block)

    // 2. Try to find dedicated caption text container
    let text = extractTextFromBlock(block, speaker)

    if (!text || text.length < 2) return

    emitCaption(speaker, text)
}

function extractSpeakerFromBlock(block: HTMLElement): string {
    for (const sel of SPEAKER_NAME_SELECTORS) {
        const el = block.querySelector(sel)
        if (el) {
            const name = el.textContent?.trim()
            if (name && name.length > 0 && name.length < 60) {
                return name
            }
        }
        // Also check if the block itself matches
        if (block.matches(sel)) {
            const name = block.textContent?.trim()
            if (name && name.length > 0 && name.length < 60) return name
        }
    }

    // Heuristic: first child that looks like a name (short text, no sub-children)
    const firstChild = block.firstElementChild as HTMLElement | null
    if (firstChild) {
        const childText = firstChild.textContent?.trim()
        // A speaker name: short, mostly letters, no punctuation
        if (childText && childText.length > 1 && childText.length < 60 &&
            /^[A-Za-z\u00C0-\u024F\s'-]+$/.test(childText)) {
            return childText
        }
    }

    return 'Unknown'
}

function extractTextFromBlock(block: HTMLElement, speakerName: string): string {
    // Try known caption-text selectors first
    for (const sel of CAPTION_TEXT_SELECTORS) {
        const el = block.querySelector(sel)
        if (el) {
            const t = el.textContent?.trim()
            if (t && t.length > 1) return t
        }
    }

    // Fallback: gather text from all descendants, exclude any element whose
    // text content matches the detected speakerName exactly
    const parts: string[] = []
    block.querySelectorAll('span, div, p').forEach((el) => {
        // Skip elements that are (or contain) the speaker name label
        if (isSpeakerLabel(el as HTMLElement, speakerName)) return
        // Only collect leaf text nodes (no child elements)
        if (el.children.length === 0) {
            const t = el.textContent?.trim()
            if (t) parts.push(t)
        }
    })

    if (parts.length > 0) {
        // Deduplicate consecutive identical parts (Meet sometimes repeats)
        const deduped = parts.filter((p, i) => i === 0 || p !== parts[i - 1])
        return deduped.join(' ')
    }

    // Absolute last resort: full block text minus speaker name
    const fullText = block.textContent?.trim() ?? ''
    if (speakerName !== 'Unknown' && fullText.startsWith(speakerName)) {
        return fullText.slice(speakerName.length).trim()
    }
    return fullText
}

function isSpeakerLabel(el: HTMLElement, speakerName: string): boolean {
    // Check if this element IS a speaker-name element
    for (const sel of SPEAKER_NAME_SELECTORS) {
        if (el.matches(sel)) return true
    }
    // Check if this element's text exactly matches the speaker name
    const text = el.textContent?.trim()
    if (text && speakerName !== 'Unknown' && text === speakerName) return true
    return false
}

/** Strip Google Meet UI noise from caption text */
function cleanCaptionText(raw: string): string {
    let text = raw
    for (const re of MEET_UI_NOISE) {
        text = text.replace(re, '')
    }
    // Collapse multiple spaces / trim
    return text.replace(/\s{2,}/g, ' ').trim()
}

function emitCaption(speaker: string, text: string) {
    const cleaned = cleanCaptionText(text)
    if (!cleaned || cleaned.length < 2) return

    const prevText = lastTextBySpeaker.get(speaker) ?? ''

    // Only skip exact duplicates — all other updates (including streaming
    // word-by-word additions) are forwarded to MeetingContext, which decides
    // whether to UPDATE (replace last) or ADD (new utterance).
    if (cleaned === prevText) return

    lastTextBySpeaker.set(speaker, cleaned)

    const caption: CaptionChunk = {
        text: cleaned,
        speaker,
        timestamp: Date.now(),
        meetingId,
    }

    // Channel 1: via background service worker (also persists to buffer)
    chrome.runtime.sendMessage({ type: 'CAPTION_CHUNK', data: caption }).catch(() => { })

    // Channel 2: direct DOM event — shared page context makes this instant
    window.dispatchEvent(new CustomEvent('meetpilot:caption', { detail: caption }))

    console.debug('[MeetPilot] Caption emitted:', speaker, ':', text.slice(0, 80))
}

export function getSpeakerColor(speaker: string): string {
    if (!speakerColorMap.has(speaker)) {
        speakerColorMap.set(speaker, SPEAKER_COLORS[colorIndex % SPEAKER_COLORS.length])
        colorIndex++
    }
    return speakerColorMap.get(speaker)!
}
