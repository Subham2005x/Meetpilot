// Content Script Entry Point - MeetPilot AI
import { initCaptionCapture } from './caption-capture'
import { MEET_URL_PATTERN } from '../utils/constants'

function extractMeetingId(): string {
    const match = window.location.pathname.match(/\/([a-z]+-[a-z]+-[a-z]+)/)
    return match ? match[1] : 'unknown'
}

async function waitForMeetToLoad(): Promise<void> {
    return new Promise((resolve) => {
        if (document.querySelector('[data-meeting-title]') || document.querySelector('[jsname="r4nke"]')) {
            resolve()
            return
        }
        const observer = new MutationObserver(() => {
            if (document.querySelector('[data-meeting-title]') || document.querySelector('[jsname="r4nke"]') ||
                document.querySelector('.crqnQb') || document.querySelector('[data-allocation-index]')) {
                observer.disconnect()
                resolve()
            }
        })
        observer.observe(document.body, { childList: true, subtree: true })
        // Fallback: resolve after 5 seconds regardless
        setTimeout(resolve, 5000)
    })
}

async function init() {
    // Only run on actual Meet call pages
    if (!MEET_URL_PATTERN.test(window.location.href)) return

    await waitForMeetToLoad()

    const meetingId = extractMeetingId()
    const title = document.title || 'Google Meet'

    // Tell background we detected a meeting
    chrome.runtime.sendMessage({
        type: 'MEETING_DETECTED',
        meetingId,
        title,
    }).catch(() => { })

    // Start caption capture
    initCaptionCapture(meetingId)

    // Dynamically import sidebar injector (lazy)
    const { injectSidebar } = await import('./sidebar-injector')
    await injectSidebar(meetingId)
}

init()
