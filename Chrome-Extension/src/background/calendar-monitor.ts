// Calendar Monitor - Auto-join scheduled Google Meet meetings
const POLL_INTERVAL_MS = 5 * 60 * 1000 // 5 minutes
const JOIN_WINDOW_MS = 5 * 60 * 1000   // Join 5 min before start

export class CalendarMonitor {
    private pollTimer: ReturnType<typeof setInterval> | null = null

    start() {
        this.checkUpcomingMeetings()
        this.pollTimer = setInterval(() => this.checkUpcomingMeetings(), POLL_INTERVAL_MS)
    }

    stop() {
        if (this.pollTimer) clearInterval(this.pollTimer)
    }

    private async getCalendarToken(): Promise<string | null> {
        return new Promise((resolve) => {
            chrome.identity.getAuthToken({ interactive: false }, (token) => {
                resolve(token ?? null)
            })
        })
    }

    async checkUpcomingMeetings() {
        const token = await this.getCalendarToken()
        if (!token) return

        const now = new Date()
        const windowEnd = new Date(now.getTime() + JOIN_WINDOW_MS)

        try {
            const resp = await fetch(
                `https://www.googleapis.com/calendar/v3/calendars/primary/events?` +
                `timeMin=${now.toISOString()}&timeMax=${windowEnd.toISOString()}&singleEvents=true&orderBy=startTime`,
                { headers: { Authorization: `Bearer ${token}` } }
            )
            const { items } = await resp.json()
            if (!items) return

            for (const event of items) {
                if (this.shouldJoin(event)) {
                    await this.joinMeeting(event)
                }
            }
        } catch (err) {
            console.error('[MeetPilot Calendar] Failed to fetch events:', err)
        }
    }

    private shouldJoin(event: any): boolean {
        const link = this.extractMeetLink(event)
        if (!link) return false
        // Only join if meeting starts within 5 minutes
        const start = new Date(event.start?.dateTime ?? event.start?.date)
        const diff = start.getTime() - Date.now()
        return diff >= 0 && diff <= JOIN_WINDOW_MS
    }

    private extractMeetLink(event: any): string | null {
        // Check conferenceData
        const entries = event.conferenceData?.entryPoints ?? []
        for (const ep of entries) {
            if (ep.entryPointType === 'video' && ep.uri?.includes('meet.google.com')) {
                return ep.uri
            }
        }
        // Check description
        const desc = event.description ?? ''
        const match = desc.match(/https:\/\/meet\.google\.com\/[a-z\-]+/)
        return match ? match[0] : null
    }

    private async joinMeeting(event: any) {
        const meetLink = this.extractMeetLink(event)
        if (!meetLink) return

        chrome.tabs.create({ url: meetLink })

        // Schedule intro message after 30s
        setTimeout(() => {
            this.sendIntroduction(event.summary ?? 'Meeting')
        }, 30000)
    }

    private sendIntroduction(title: string) {
        chrome.runtime.sendMessage({
            type: 'SEND_INTRO',
            title,
        }).catch(() => { })
    }
}

export const calendarMonitor = new CalendarMonitor()
