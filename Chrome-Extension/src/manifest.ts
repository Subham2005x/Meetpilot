import { defineManifest } from '@crxjs/vite-plugin'
import packageData from '../package.json'

//@ts-ignore
const isDev = process.env.NODE_ENV == 'development'

export default defineManifest({
  name: `MeetPilot AI${isDev ? ' ➡️ Dev' : ''}`,
  description: 'AI meeting assistant with real-time knowledge retrieval and fact-checking',
  version: packageData.version,
  manifest_version: 3,
  icons: {
    16: 'img/logo-16.png',
    32: 'img/logo-32.png',
    48: 'img/logo-48.png',
    128: 'img/logo-128.png',
  },
  action: {
    default_popup: 'popup.html',
    default_icon: 'img/logo-48.png',
    default_title: 'MeetPilot AI',
  },
  background: {
    service_worker: 'src/background/index.ts',
    type: 'module',
  },
  content_scripts: [
    {
      matches: ['https://meet.google.com/*'],
      js: ['src/contentScript/index.ts'],
      run_at: 'document_end',
    },
  ],
  permissions: ['storage', 'tabs', 'activeTab', 'identity'],
  host_permissions: [
    'https://meet.google.com/*',
    'https://api.meetpilot.com/*',
    'wss://api.meetpilot.com/*',
    'https://www.googleapis.com/calendar/*',
  ],
  web_accessible_resources: [
    {
      resources: ['assets/*'],
      matches: ['https://meet.google.com/*'],
    },
  ],
  oauth2: {
    client_id: 'YOUR_GOOGLE_OAUTH_CLIENT_ID.apps.googleusercontent.com',
    scopes: ['https://www.googleapis.com/auth/calendar.readonly'],
  },
})
