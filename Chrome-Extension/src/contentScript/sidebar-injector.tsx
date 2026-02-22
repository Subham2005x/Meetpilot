// Sidebar Injector - mounts React sidebar into Google Meet
import React from 'react'
import { createRoot } from 'react-dom/client'
import { getSidebarWidth, setSidebarWidth } from '../utils/storage'
import { MIN_SIDEBAR_WIDTH, MAX_SIDEBAR_WIDTH } from '../utils/constants'

const SIDEBAR_ID = 'meetpilot-sidebar-root'
const RESIZE_HANDLE_ID = 'meetpilot-resize-handle'

export async function injectSidebar(meetingId: string) {
    if (document.getElementById(SIDEBAR_ID)) return // already injected

    const initialWidth = await getSidebarWidth()

    // Create sidebar container
    const sidebar = document.createElement('div')
    sidebar.id = SIDEBAR_ID
    Object.assign(sidebar.style, {
        position: 'fixed',
        right: '0',
        top: '0',
        width: `${initialWidth}px`,
        height: '100vh',
        zIndex: '2147483647',
        boxShadow: '-4px 0 30px rgba(0,0,0,0.5)',
        overflow: 'hidden',
        transition: 'width 0s', // instant during drag
        fontFamily: 'Inter, sans-serif',
    })

    // Resize handle
    const handle = document.createElement('div')
    handle.id = RESIZE_HANDLE_ID
    Object.assign(handle.style, {
        position: 'absolute',
        left: '0',
        top: '0',
        width: '6px',
        height: '100%',
        cursor: 'ew-resize',
        zIndex: '10',
        background: 'transparent',
    })
    handle.title = 'Drag to resize'

    // Hover effect
    handle.addEventListener('mouseenter', () => {
        handle.style.background = 'rgba(0, 212, 255, 0.25)'
    })
    handle.addEventListener('mouseleave', () => {
        handle.style.background = 'transparent'
    })

    // Drag-to-resize logic
    let isResizing = false
    let startX = 0
    let startWidth = initialWidth

    handle.addEventListener('mousedown', (e: MouseEvent) => {
        isResizing = true
        startX = e.clientX
        startWidth = parseInt(sidebar.style.width)
        document.body.style.userSelect = 'none'
        document.body.style.cursor = 'ew-resize'
        e.preventDefault()
    })

    document.addEventListener('mousemove', (e: MouseEvent) => {
        if (!isResizing) return
        const delta = startX - e.clientX
        const newWidth = Math.min(MAX_SIDEBAR_WIDTH, Math.max(MIN_SIDEBAR_WIDTH, startWidth + delta))
        sidebar.style.width = `${newWidth}px`
        adjustMeetLayout(newWidth)
    })

    document.addEventListener('mouseup', () => {
        if (!isResizing) return
        isResizing = false
        document.body.style.userSelect = ''
        document.body.style.cursor = ''
        const finalWidth = parseInt(sidebar.style.width)
        setSidebarWidth(finalWidth)
    })

    sidebar.appendChild(handle)
    document.body.appendChild(sidebar)

    // Adjust Meet layout
    adjustMeetLayout(initialWidth)

    // Mount React app (lazy import)
    try {
        const { App } = await import('../sidebar/App')
        const root = createRoot(sidebar)
        root.render(
            React.createElement(
                React.StrictMode,
                null,
                React.createElement(App, { meetingId })
            )
        )
    } catch (err) {
        console.error('[MeetPilot] Failed to mount sidebar:', err)
    }
}

function adjustMeetLayout(sidebarWidth: number) {
    // Try various Meet layout containers
    const selectors = [
        '[data-allocation-index]',
        '.crqnQb',
        '[jsname="x3Eknd"]',
        'c-wiz[data-is-active-participant]',
    ]
    for (const sel of selectors) {
        const el = document.querySelector<HTMLElement>(sel)
        if (el) {
            el.style.marginRight = `${sidebarWidth}px`
            el.style.transition = 'margin-right 0s'
            return
        }
    }
    // Fallback: push body content
    document.body.style.marginRight = `${sidebarWidth}px`
}
