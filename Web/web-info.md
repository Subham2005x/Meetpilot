# MeetPilot AI Web Dashboard Architecture
## Complete Dashboard Structure & Implementation Guide

---

## ARCHITECTURE OVERVIEW

```
┌─────────────────────────────────────────────────────────────────┐
│                      WEB DASHBOARD                              │
│                   (Next.js 14 App Router)                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │  Public Pages (Marketing)                                │ │
│  │  - Landing page (SEO optimized)                          │ │
│  │  - Pricing page                                          │ │
│  │  - Features, About, Blog                                 │ │
│  │  - Login / Sign Up                                       │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │  Dashboard Pages (Authenticated)                         │ │
│  │                                                           │ │
│  │  ┌────────────────────────────────────────────────────┐ │ │
│  │  │  Overview Dashboard                                 │ │ │
│  │  │  - Today's meetings                                 │ │ │
│  │  │  - Upcoming meetings calendar                       │ │ │
│  │  │  - Recent action items                              │ │ │
│  │  │  - Quick stats (meetings this week, etc.)           │ │ │
│  │  │  - Activity feed                                    │ │ │
│  │  └────────────────────────────────────────────────────┘ │ │
│  │                                                           │ │
│  │  ┌────────────────────────────────────────────────────┐ │ │
│  │  │  Meetings Page                                      │ │ │
│  │  │  - All meetings list (table/card view)             │ │ │
│  │  │  - Filters (date, participants, platform)          │ │ │
│  │  │  - Search across transcripts                       │ │ │
│  │  │  - Export options                                  │ │ │
│  │  └────────────────────────────────────────────────────┘ │ │
│  │                                                           │ │
│  │  ┌────────────────────────────────────────────────────┐ │ │
│  │  │  Meeting Detail Page                                │ │ │
│  │  │  - Full transcript (searchable, timestamps)        │ │ │
│  │  │  - AI-generated summary                            │ │ │
│  │  │  - Key decisions extracted                         │ │ │
│  │  │  - Action items list                               │ │ │
│  │  │  - Participants & speaking time                    │ │ │
│  │  │  - Fact-checks performed                           │ │ │
│  │  │  - Recording playback (if available)               │ │ │
│  │  │  - Export (PDF, DOCX)                              │ │ │
│  │  └────────────────────────────────────────────────────┘ │ │
│  │                                                           │ │
│  │  ┌────────────────────────────────────────────────────┐ │ │
│  │  │  Action Items / Tasks                               │ │ │
│  │  │  - Kanban board (To Do, In Progress, Done)        │ │ │
│  │  │  - Table view with filters                         │ │ │
│  │  │  - Assigned to me / Assigned by me                 │ │ │
│  │  │  - Due date calendar view                          │ │ │
│  │  │  - Sync status (Jira, Slack, etc.)                │ │ │
│  │  └────────────────────────────────────────────────────┘ │ │
│  │                                                           │ │
│  │  ┌────────────────────────────────────────────────────┐ │ │
│  │  │  Knowledge Base                                     │ │ │
│  │  │  - Uploaded documents library                      │ │ │
│  │  │  - Drag & drop upload                              │ │ │
│  │  │  - Embedding status                                │ │ │
│  │  │  - Search across all documents                     │ │ │
│  │  │  - Ask AI about documents                          │ │ │
│  │  └────────────────────────────────────────────────────┘ │ │
│  │                                                           │ │
│  │  ┌────────────────────────────────────────────────────┐ │ │
│  │  │  Analytics & Insights                               │ │ │
│  │  │  - Meeting frequency trends                        │ │ │
│  │  │  - Average meeting duration                        │ │ │
│  │  │  - Speaking time distribution                      │ │ │
│  │  │  - Action item completion rate                     │ │ │
│  │  │  - Most active participants                        │ │ │
│  │  │  - Knowledge base usage stats                      │ │ │
│  │  │  - Export reports                                  │ │ │
│  │  └────────────────────────────────────────────────────┘ │ │
│  │                                                           │ │
│  │  ┌────────────────────────────────────────────────────┐ │ │
│  │  │  Team Management (Admin)                            │ │ │
│  │  │  - Invite team members                             │ │ │
│  │  │  - Manage roles & permissions                      │ │ │
│  │  │  - View team activity                              │ │ │
│  │  │  - Billing & subscription                          │ │ │
│  │  └────────────────────────────────────────────────────┘ │ │
│  │                                                           │ │
│  │  ┌────────────────────────────────────────────────────┐ │ │
│  │  │  Integrations                                       │ │ │
│  │  │  - Connect Jira, Slack, Google Drive, etc.        │ │ │
│  │  │  - OAuth flows                                     │ │ │
│  │  │  - Sync settings                                   │ │ │
│  │  │  - Test connections                                │ │ │
│  │  └────────────────────────────────────────────────────┘ │ │
│  │                                                           │ │
│  │  ┌────────────────────────────────────────────────────┐ │ │
│  │  │  Settings                                           │ │ │
│  │  │  - Profile settings                                │ │ │
│  │  │  - Extension preferences                           │ │ │
│  │  │  - Notification settings                           │ │ │
│  │  │  - Auto-join preferences                           │ │ │
│  │  │  - Privacy & security                              │ │ │
│  │  │  - API keys (for developers)                       │ │ │
│  │  └────────────────────────────────────────────────────┘ │ │
│  │                                                           │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## TECH STACK (RECOMMENDED)

### Frontend Framework
```typescript
Framework:        Next.js 14 (App Router)
Language:         TypeScript
UI Library:       React 18
Styling:          Tailwind CSS + shadcn/ui
State:            React Context + Hooks (or Zustand for complex state)
Data Fetching:    React Query (TanStack Query)
Forms:            React Hook Form + Zod validation
Charts:           Recharts or Chart.js
Tables:           TanStack Table (React Table v8)
Calendar:         React Big Calendar
Date Picker:      React DatePicker or Radix UI
```

### Authentication & API
```typescript
Auth:             NextAuth.js (OAuth + JWT)
API Client:       Axios or Fetch with React Query
WebSocket:        Socket.io-client (for real-time updates)
File Upload:      React Dropzone
PDF Export:       jsPDF or react-pdf
Excel Export:     xlsx.js
```

### Development Tools
```typescript
Package Manager:  pnpm (fast, efficient)
Linting:          ESLint + Prettier
Type Checking:    TypeScript strict mode
Testing:          Jest + React Testing Library
E2E Testing:      Playwright
Build:            Next.js built-in (Turbopack)
Deployment:       Vercel (recommended) or Railway
```

---

## PROJECT STRUCTURE

```
meetpilot-dashboard/
├── app/                                  # Next.js 14 App Router
│   ├── (auth)/                          # Auth layout group
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── signup/
│   │   │   └── page.tsx
│   │   └── layout.tsx                   # Auth layout (centered, minimal)
│   │
│   ├── (marketing)/                     # Public pages layout group
│   │   ├── page.tsx                     # Landing page (/)
│   │   ├── pricing/
│   │   │   └── page.tsx
│   │   ├── features/
│   │   │   └── page.tsx
│   │   ├── about/
│   │   │   └── page.tsx
│   │   └── layout.tsx                   # Marketing layout (header, footer)
│   │
│   ├── (dashboard)/                     # Dashboard layout group (protected)
│   │   ├── dashboard/                   # Overview page
│   │   │   └── page.tsx
│   │   │
│   │   ├── meetings/                    # Meetings section
│   │   │   ├── page.tsx                # List all meetings
│   │   │   └── [id]/
│   │   │       ├── page.tsx            # Meeting detail
│   │   │       ├── transcript/
│   │   │       │   └── page.tsx        # Full transcript view
│   │   │       └── analytics/
│   │   │           └── page.tsx        # Meeting analytics
│   │   │
│   │   ├── tasks/                       # Action items / tasks
│   │   │   ├── page.tsx                # Kanban / list view
│   │   │   └── calendar/
│   │   │       └── page.tsx            # Calendar view
│   │   │
│   │   ├── knowledge/                   # Knowledge base
│   │   │   ├── page.tsx                # Documents library
│   │   │   ├── upload/
│   │   │   │   └── page.tsx            # Upload interface
│   │   │   └── [id]/
│   │   │       └── page.tsx            # Document detail
│   │   │
│   │   ├── analytics/                   # Analytics & insights
│   │   │   └── page.tsx
│   │   │
│   │   ├── team/                        # Team management
│   │   │   ├── page.tsx                # Team members
│   │   │   ├── invite/
│   │   │   │   └── page.tsx
│   │   │   └── billing/
│   │   │       └── page.tsx
│   │   │
│   │   ├── integrations/                # External integrations
│   │   │   ├── page.tsx
│   │   │   └── [provider]/
│   │   │       └── callback/
│   │   │           └── page.tsx        # OAuth callback
│   │   │
│   │   ├── settings/                    # Settings
│   │   │   ├── page.tsx                # Profile
│   │   │   ├── preferences/
│   │   │   │   └── page.tsx
│   │   │   ├── notifications/
│   │   │   │   └── page.tsx
│   │   │   └── api-keys/
│   │   │       └── page.tsx
│   │   │
│   │   └── layout.tsx                   # Dashboard layout (sidebar, header)
│   │
│   ├── api/                             # API routes (if needed)
│   │   ├── auth/
│   │   │   └── [...nextauth]/
│   │   │       └── route.ts            # NextAuth.js config
│   │   └── webhooks/
│   │       └── stripe/
│   │           └── route.ts            # Stripe webhook
│   │
│   ├── layout.tsx                       # Root layout
│   ├── globals.css                      # Global styles
│   └── providers.tsx                    # Context providers
│
├── components/                          # React components
│   ├── ui/                             # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── input.tsx
│   │   ├── table.tsx
│   │   └── ...
│   │
│   ├── layout/                         # Layout components
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   ├── Footer.tsx
│   │   └── MobileNav.tsx
│   │
│   ├── meetings/                       # Meeting-specific components
│   │   ├── MeetingCard.tsx
│   │   ├── MeetingList.tsx
│   │   ├── MeetingFilters.tsx
│   │   ├── TranscriptViewer.tsx
│   │   ├── SpeakerTimeline.tsx
│   │   └── MeetingSummary.tsx
│   │
│   ├── tasks/                          # Task components
│   │   ├── TaskCard.tsx
│   │   ├── TaskList.tsx
│   │   ├── KanbanBoard.tsx
│   │   ├── TaskFilters.tsx
│   │   └── TaskForm.tsx
│   │
│   ├── analytics/                      # Analytics components
│   │   ├── MeetingFrequencyChart.tsx
│   │   ├── SpeakingTimeChart.tsx
│   │   ├── CompletionRateChart.tsx
│   │   └── StatsCard.tsx
│   │
│   ├── knowledge/                      # Knowledge base components
│   │   ├── DocumentCard.tsx
│   │   ├── DocumentUploader.tsx
│   │   ├── DocumentList.tsx
│   │   └── DocumentSearch.tsx
│   │
│   └── shared/                         # Shared/common components
│       ├── Avatar.tsx
│       ├── Badge.tsx
│       ├── EmptyState.tsx
│       ├── LoadingSpinner.tsx
│       ├── SearchBar.tsx
│       └── DateRangePicker.tsx
│
├── lib/                                # Utilities & helpers
│   ├── api/                            # API client
│   │   ├── client.ts                   # Axios instance
│   │   ├── meetings.ts                 # Meeting endpoints
│   │   ├── tasks.ts                    # Task endpoints
│   │   ├── documents.ts                # Document endpoints
│   │   ├── analytics.ts                # Analytics endpoints
│   │   └── auth.ts                     # Auth endpoints
│   │
│   ├── hooks/                          # Custom React hooks
│   │   ├── useUser.ts
│   │   ├── useMeetings.ts
│   │   ├── useTasks.ts
│   │   ├── useDocuments.ts
│   │   ├── useAnalytics.ts
│   │   └── useWebSocket.ts
│   │
│   ├── utils/                          # Utility functions
│   │   ├── date.ts                     # Date formatting
│   │   ├── format.ts                   # Text formatting
│   │   ├── export.ts                   # PDF/Excel export
│   │   └── validation.ts               # Validators
│   │
│   └── config/
│       ├── site.ts                     # Site metadata
│       └── constants.ts                # Constants
│
├── types/                              # TypeScript types
│   ├── index.ts                        # Shared types
│   ├── meeting.ts
│   ├── task.ts
│   ├── document.ts
│   ├── user.ts
│   └── api.ts
│
├── contexts/                           # React contexts
│   ├── AuthContext.tsx
│   ├── MeetingContext.tsx
│   └── ThemeContext.tsx
│
├── public/                             # Static assets
│   ├── images/
│   ├── icons/
│   └── fonts/
│
├── .env.local                          # Environment variables
├── .eslintrc.json
├── .prettierrc
├── next.config.js
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

---

## KEY PAGES DETAILED IMPLEMENTATION

### 1. DASHBOARD OVERVIEW PAGE

```typescript
// app/(dashboard)/dashboard/page.tsx
import { Suspense } from 'react';
import { Metadata } from 'next';
import { UpcomingMeetings } from '@/components/dashboard/UpcomingMeetings';
import { RecentActionItems } from '@/components/dashboard/RecentActionItems';
import { QuickStats } from '@/components/dashboard/QuickStats';
import { ActivityFeed } from '@/components/dashboard/ActivityFeed';

export const metadata: Metadata = {
  title: 'Dashboard | MeetPilot',
  description: 'Your meeting command center',
};

export default async function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's what's happening today.
        </p>
      </div>

      {/* Quick Stats */}
      <Suspense fallback={<StatsLoading />}>
        <QuickStats />
      </Suspense>

      {/* Main Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Upcoming Meetings */}
        <Suspense fallback={<CardLoading />}>
          <UpcomingMeetings />
        </Suspense>

        {/* Recent Action Items */}
        <Suspense fallback={<CardLoading />}>
          <RecentActionItems />
        </Suspense>
      </div>

      {/* Activity Feed */}
      <Suspense fallback={<FeedLoading />}>
        <ActivityFeed />
      </Suspense>
    </div>
  );
}
```

```typescript
// components/dashboard/QuickStats.tsx
import { Card } from '@/components/ui/card';
import { useMeetings } from '@/lib/hooks/useMeetings';
import { useTasks } from '@/lib/hooks/useTasks';
import { Calendar, CheckSquare, Clock, Users } from 'lucide-react';

export function QuickStats() {
  const { data: meetings } = useMeetings({ period: 'week' });
  const { data: tasks } = useTasks({ status: 'pending' });

  const stats = [
    {
      label: 'Meetings This Week',
      value: meetings?.total || 0,
      icon: Calendar,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
    },
    {
      label: 'Pending Tasks',
      value: tasks?.total || 0,
      icon: CheckSquare,
      color: 'text-green-500',
      bgColor: 'bg-green-50',
    },
    {
      label: 'Total Meeting Time',
      value: formatDuration(meetings?.totalDuration || 0),
      icon: Clock,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50',
    },
    {
      label: 'Active Participants',
      value: meetings?.uniqueParticipants || 0,
      icon: Users,
      color: 'text-orange-500',
      bgColor: 'bg-orange-50',
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.label} className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className="text-2xl font-bold">{stat.value}</p>
            </div>
            <div className={`${stat.bgColor} p-3 rounded-full`}>
              <stat.icon className={`h-6 w-6 ${stat.color}`} />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
```

---

### 2. MEETINGS LIST PAGE

```typescript
// app/(dashboard)/meetings/page.tsx
'use client';

import { useState } from 'react';
import { useMeetings } from '@/lib/hooks/useMeetings';
import { MeetingCard } from '@/components/meetings/MeetingCard';
import { MeetingFilters } from '@/components/meetings/MeetingFilters';
import { SearchBar } from '@/components/shared/SearchBar';
import { Button } from '@/components/ui/button';
import { Plus, LayoutGrid, List } from 'lucide-react';

export default function MeetingsPage() {
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [filters, setFilters] = useState({
    search: '',
    dateRange: null,
    platform: null,
    participants: [],
  });

  const { data, isLoading } = useMeetings(filters);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Meetings</h1>
          <p className="text-muted-foreground">
            View and manage all your meetings
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Schedule Meeting
        </Button>
      </div>

      {/* Search & Filters */}
      <div className="flex items-center gap-4">
        <SearchBar
          placeholder="Search meetings, transcripts..."
          onSearch={(query) => setFilters({ ...filters, search: query })}
          className="flex-1"
        />
        <MeetingFilters filters={filters} onChange={setFilters} />
        
        {/* View Toggle */}
        <div className="flex rounded-lg border">
          <Button
            variant={view === 'grid' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setView('grid')}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button
            variant={view === 'list' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setView('list')}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Meetings Grid/List */}
      {isLoading ? (
        <MeetingsLoading view={view} />
      ) : data?.meetings.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title="No meetings found"
          description="Try adjusting your filters or schedule a new meeting"
        />
      ) : (
        <div
          className={
            view === 'grid'
              ? 'grid gap-6 md:grid-cols-2 lg:grid-cols-3'
              : 'space-y-4'
          }
        >
          {data?.meetings.map((meeting) => (
            <MeetingCard key={meeting.id} meeting={meeting} view={view} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {data && data.total > data.pageSize && (
        <Pagination
          currentPage={data.page}
          totalPages={Math.ceil(data.total / data.pageSize)}
          onPageChange={(page) => {/* handle page change */}}
        />
      )}
    </div>
  );
}
```

```typescript
// components/meetings/MeetingCard.tsx
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { formatDate, formatDuration } from '@/lib/utils/date';
import { Video, Calendar, Clock, Users } from 'lucide-react';
import Link from 'next/link';

interface MeetingCardProps {
  meeting: Meeting;
  view: 'grid' | 'list';
}

export function MeetingCard({ meeting, view }: MeetingCardProps) {
  return (
    <Link href={`/meetings/${meeting.id}`}>
      <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-1">{meeting.title}</h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              {formatDate(meeting.startTime)}
              <Clock className="h-4 w-4 ml-2" />
              {formatDuration(meeting.duration)}
            </div>
          </div>
          
          {/* Status Badge */}
          <Badge variant={meeting.status === 'active' ? 'default' : 'secondary'}>
            {meeting.status}
          </Badge>
        </div>

        {/* Platform */}
        <div className="flex items-center gap-2 mb-4">
          <Video className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm capitalize">{meeting.platform}</span>
        </div>

        {/* Participants */}
        <div className="flex items-center gap-2 mb-4">
          <Users className="h-4 w-4 text-muted-foreground" />
          <div className="flex -space-x-2">
            {meeting.participants.slice(0, 3).map((p) => (
              <Avatar key={p.id} className="h-6 w-6 border-2 border-background">
                <AvatarFallback className="text-xs">
                  {p.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
            ))}
            {meeting.participants.length > 3 && (
              <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center text-xs">
                +{meeting.participants.length - 3}
              </div>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t">
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Action Items</p>
            <p className="text-lg font-semibold">{meeting.actionItemCount}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Fact Checks</p>
            <p className="text-lg font-semibold">{meeting.factCheckCount}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground">AI Queries</p>
            <p className="text-lg font-semibold">{meeting.queryCount}</p>
          </div>
        </div>
      </Card>
    </Link>
  );
}
```

---

### 3. MEETING DETAIL PAGE

```typescript
// app/(dashboard)/meetings/[id]/page.tsx
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TranscriptViewer } from '@/components/meetings/TranscriptViewer';
import { MeetingSummary } from '@/components/meetings/MeetingSummary';
import { ActionItemsList } from '@/components/meetings/ActionItemsList';
import { ParticipantAnalytics } from '@/components/meetings/ParticipantAnalytics';
import { FactChecksList } from '@/components/meetings/FactChecksList';
import { Button } from '@/components/ui/button';
import { Download, Share2 } from 'lucide-react';

interface MeetingDetailPageProps {
  params: { id: string };
}

export async function generateMetadata({ params }: MeetingDetailPageProps): Promise<Metadata> {
  const meeting = await getMeeting(params.id);
  return {
    title: `${meeting.title} | MeetPilot`,
  };
}

export default async function MeetingDetailPage({ params }: MeetingDetailPageProps) {
  const meeting = await getMeeting(params.id);

  if (!meeting) {
    notFound();
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold">{meeting.title}</h1>
          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
            <span>{formatDate(meeting.startTime)}</span>
            <span>•</span>
            <span>{formatDuration(meeting.duration)}</span>
            <span>•</span>
            <span className="capitalize">{meeting.platform}</span>
            <span>•</span>
            <span>{meeting.participants.length} participants</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button variant="outline">
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* AI Summary (always visible) */}
      <MeetingSummary summary={meeting.summary} keyDecisions={meeting.keyDecisions} />

      {/* Tabs */}
      <Tabs defaultValue="transcript" className="space-y-6">
        <TabsList>
          <TabsTrigger value="transcript">Transcript</TabsTrigger>
          <TabsTrigger value="action-items">
            Action Items ({meeting.actionItems.length})
          </TabsTrigger>
          <TabsTrigger value="fact-checks">
            Fact Checks ({meeting.factChecks.length})
          </TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="transcript">
          <TranscriptViewer
            chunks={meeting.transcriptChunks}
            participants={meeting.participants}
          />
        </TabsContent>

        <TabsContent value="action-items">
          <ActionItemsList items={meeting.actionItems} meetingId={meeting.id} />
        </TabsContent>

        <TabsContent value="fact-checks">
          <FactChecksList checks={meeting.factChecks} />
        </TabsContent>

        <TabsContent value="analytics">
          <ParticipantAnalytics
            participants={meeting.participants}
            events={meeting.analyticsEvents}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
```

```typescript
// components/meetings/TranscriptViewer.tsx
'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Search } from 'lucide-react';
import { formatTime } from '@/lib/utils/date';

interface TranscriptViewerProps {
  chunks: TranscriptChunk[];
  participants: Participant[];
}

export function TranscriptViewer({ chunks, participants }: TranscriptViewerProps) {
  const [search, setSearch] = useState('');

  const filteredChunks = chunks.filter(
    (chunk) =>
      chunk.text.toLowerCase().includes(search.toLowerCase()) ||
      chunk.speakerName.toLowerCase().includes(search.toLowerCase())
  );

  // Group by speaker for better readability
  const groupedChunks = filteredChunks.reduce((acc, chunk, index) => {
    const prevChunk = filteredChunks[index - 1];
    const isSameSpeaker = prevChunk?.speakerName === chunk.speakerName;
    
    if (isSameSpeaker) {
      // Append to previous group
      acc[acc.length - 1].chunks.push(chunk);
    } else {
      // Create new group
      acc.push({
        speaker: chunk.speakerName,
        chunks: [chunk],
      });
    }
    
    return acc;
  }, [] as { speaker: string; chunks: TranscriptChunk[] }[]);

  return (
    <Card className="p-6">
      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search transcript..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Transcript */}
      <div className="space-y-6">
        {groupedChunks.map((group, groupIndex) => {
          const participant = participants.find((p) => p.name === group.speaker);
          
          return (
            <div key={groupIndex} className="flex gap-4">
              {/* Avatar */}
              <Avatar className="h-10 w-10">
                <AvatarFallback>{group.speaker.charAt(0)}</AvatarFallback>
              </Avatar>

              {/* Content */}
              <div className="flex-1 space-y-2">
                {/* Speaker name & timestamp */}
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{group.speaker}</span>
                  <span className="text-xs text-muted-foreground">
                    {formatTime(group.chunks[0].timestamp)}
                  </span>
                </div>

                {/* Text chunks */}
                <div className="space-y-2">
                  {group.chunks.map((chunk) => (
                    <p
                      key={chunk.id}
                      className={
                        search && chunk.text.toLowerCase().includes(search.toLowerCase())
                          ? 'bg-yellow-100 dark:bg-yellow-900/20 -mx-2 px-2 py-1 rounded'
                          : ''
                      }
                    >
                      {chunk.text}
                      
                      {/* Inline badges for detected items */}
                      {chunk.hasActionItem && (
                        <Badge variant="secondary" className="ml-2">
                          Action Item
                        </Badge>
                      )}
                      {chunk.hasFactCheck && (
                        <Badge variant="secondary" className="ml-2">
                          Fact Checked
                        </Badge>
                      )}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredChunks.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          No results found for "{search}"
        </div>
      )}
    </Card>
  );
}
```

---

### 4. ACTION ITEMS / TASKS PAGE

```typescript
// app/(dashboard)/tasks/page.tsx
'use client';

import { useState } from 'react';
import { useTasks } from '@/lib/hooks/useTasks';
import { KanbanBoard } from '@/components/tasks/KanbanBoard';
import { TaskList } from '@/components/tasks/TaskList';
import { TaskFilters } from '@/components/tasks/TaskFilters';
import { Button } from '@/components/ui/button';
import { Plus, Kanban, List } from 'lucide-react';

export default function TasksPage() {
  const [view, setView] = useState<'kanban' | 'list'>('kanban');
  const [filters, setFilters] = useState({
    status: null,
    assignee: null,
    priority: null,
    dueDate: null,
  });

  const { data, isLoading } = useTasks(filters);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Tasks</h1>
          <p className="text-muted-foreground">
            Manage action items from all meetings
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Task
        </Button>
      </div>

      {/* Filters & View Toggle */}
      <div className="flex items-center justify-between">
        <TaskFilters filters={filters} onChange={setFilters} />
        
        <div className="flex rounded-lg border">
          <Button
            variant={view === 'kanban' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setView('kanban')}
          >
            <Kanban className="h-4 w-4 mr-2" />
            Kanban
          </Button>
          <Button
            variant={view === 'list' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setView('list')}
          >
            <List className="h-4 w-4 mr-2" />
            List
          </Button>
        </div>
      </div>

      {/* Tasks View */}
      {isLoading ? (
        <TasksLoading view={view} />
      ) : view === 'kanban' ? (
        <KanbanBoard tasks={data?.tasks} />
      ) : (
        <TaskList tasks={data?.tasks} />
      )}
    </div>
  );
}
```

```typescript
// components/tasks/KanbanBoard.tsx
'use client';

import { Card } from '@/components/ui/card';
import { TaskCard } from './TaskCard';
import { useDrop } from 'react-dnd';

const columns = [
  { id: 'pending', title: 'To Do', color: 'border-gray-300' },
  { id: 'in_progress', title: 'In Progress', color: 'border-blue-300' },
  { id: 'completed', title: 'Done', color: 'border-green-300' },
];

export function KanbanBoard({ tasks }: { tasks: Task[] }) {
  return (
    <div className="grid grid-cols-3 gap-6">
      {columns.map((column) => {
        const columnTasks = tasks?.filter((t) => t.status === column.id) || [];

        return (
          <div key={column.id} className="space-y-4">
            {/* Column Header */}
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">{column.title}</h3>
              <span className="text-sm text-muted-foreground">
                {columnTasks.length}
              </span>
            </div>

            {/* Column Cards */}
            <div className={`border-t-4 ${column.color} rounded-t-lg`}>
              <Card className="p-4 min-h-[500px] space-y-3">
                {columnTasks.map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </Card>
            </div>
          </div>
        );
      })}
    </div>
  );
}
```

---

### 5. KNOWLEDGE BASE PAGE

```typescript
// app/(dashboard)/knowledge/page.tsx
'use client';

import { useState } from 'react';
import { useDocuments } from '@/lib/hooks/useDocuments';
import { DocumentCard } from '@/components/knowledge/DocumentCard';
import { DocumentUploader } from '@/components/knowledge/DocumentUploader';
import { SearchBar } from '@/components/shared/SearchBar';
import { Button } from '@/components/ui/button';
import { Upload, FileText } from 'lucide-react';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';

export default function KnowledgePage() {
  const [search, setSearch] = useState('');
  const { data, isLoading } = useDocuments({ search });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Knowledge Base</h1>
          <p className="text-muted-foreground">
            Upload and manage documents for AI-powered insights
          </p>
        </div>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Upload className="mr-2 h-4 w-4" />
              Upload Document
            </Button>
          </DialogTrigger>
          <DocumentUploader />
        </Dialog>
      </div>

      {/* Search */}
      <SearchBar
        placeholder="Search documents..."
        onSearch={setSearch}
      />

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Total Documents</div>
          <div className="text-2xl font-bold">{data?.stats.total || 0}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Processing</div>
          <div className="text-2xl font-bold">{data?.stats.processing || 0}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Ready</div>
          <div className="text-2xl font-bold text-green-600">
            {data?.stats.ready || 0}
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Total Size</div>
          <div className="text-2xl font-bold">{formatBytes(data?.stats.totalSize || 0)}</div>
        </Card>
      </div>

      {/* Documents Grid */}
      {isLoading ? (
        <DocumentsLoading />
      ) : data?.documents.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No documents yet"
          description="Upload your first document to get started with AI-powered insights"
          action={
            <Dialog>
              <DialogTrigger asChild>
                <Button>Upload Document</Button>
              </DialogTrigger>
              <DocumentUploader />
            </Dialog>
          }
        />
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {data?.documents.map((doc) => (
            <DocumentCard key={doc.id} document={doc} />
          ))}
        </div>
      )}
    </div>
  );
}
```

---

### 6. ANALYTICS PAGE

```typescript
// app/(dashboard)/analytics/page.tsx
import { Suspense } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MeetingFrequencyChart } from '@/components/analytics/MeetingFrequencyChart';
import { SpeakingTimeChart } from '@/components/analytics/SpeakingTimeChart';
import { CompletionRateChart } from '@/components/analytics/CompletionRateChart';
import { TopParticipantsTable } from '@/components/analytics/TopParticipantsTable';
import { DateRangePicker } from '@/components/shared/DateRangePicker';

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Analytics</h1>
          <p className="text-muted-foreground">
            Insights and trends from your meetings
          </p>
        </div>
        <DateRangePicker />
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="meetings">Meetings</TabsTrigger>
          <TabsTrigger value="participants">Participants</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Meeting Frequency */}
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Meeting Frequency</h3>
            <Suspense fallback={<ChartLoading />}>
              <MeetingFrequencyChart />
            </Suspense>
          </Card>

          {/* Grid */}
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Speaking Time Distribution</h3>
              <Suspense fallback={<ChartLoading />}>
                <SpeakingTimeChart />
              </Suspense>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold mb-4">Task Completion Rate</h3>
              <Suspense fallback={<ChartLoading />}>
                <CompletionRateChart />
              </Suspense>
            </Card>
          </div>

          {/* Top Participants */}
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Most Active Participants</h3>
            <Suspense fallback={<TableLoading />}>
              <TopParticipantsTable />
            </Suspense>
          </Card>
        </TabsContent>

        {/* Other tabs... */}
      </Tabs>
    </div>
  );
}
```

---

## API INTEGRATION (React Query)

```typescript
// lib/api/meetings.ts
import { apiClient } from './client';
import { Meeting, MeetingListResponse } from '@/types';

export const meetingsApi = {
  list: async (filters?: any): Promise<MeetingListResponse> => {
    const { data } = await apiClient.get('/meetings', { params: filters });
    return data;
  },

  getById: async (id: string): Promise<Meeting> => {
    const { data } = await apiClient.get(`/meetings/${id}`);
    return data;
  },

  create: async (meeting: Partial<Meeting>): Promise<Meeting> => {
    const { data } = await apiClient.post('/meetings', meeting);
    return data;
  },

  update: async (id: string, updates: Partial<Meeting>): Promise<Meeting> => {
    const { data } = await apiClient.patch(`/meetings/${id}`, updates);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/meetings/${id}`);
  },
};
```

```typescript
// lib/hooks/useMeetings.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { meetingsApi } from '@/lib/api/meetings';

export function useMeetings(filters?: any) {
  return useQuery({
    queryKey: ['meetings', filters],
    queryFn: () => meetingsApi.list(filters),
  });
}

export function useMeeting(id: string) {
  return useQuery({
    queryKey: ['meetings', id],
    queryFn: () => meetingsApi.getById(id),
    enabled: !!id,
  });
}

export function useCreateMeeting() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: meetingsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meetings'] });
    },
  });
}

export function useUpdateMeeting() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: any }) =>
      meetingsApi.update(id, updates),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['meetings'] });
      queryClient.invalidateQueries({ queryKey: ['meetings', variables.id] });
    },
  });
}
```

---

## REAL-TIME UPDATES (WebSocket)

```typescript
// lib/hooks/useWebSocket.ts
import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useQueryClient } from '@tanstack/react-query';

export function useWebSocket(meetingId?: string) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!meetingId) return;

    const token = localStorage.getItem('access_token');
    const newSocket = io('wss://api.meetpilot.com', {
      query: { meetingId, token },
    });

    newSocket.on('connect', () => {
      setIsConnected(true);
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
    });

    // Listen for real-time updates
    newSocket.on('meeting:updated', (data) => {
      queryClient.setQueryData(['meetings', meetingId], data);
    });

    newSocket.on('action_item:created', (data) => {
      queryClient.invalidateQueries({ queryKey: ['action-items'] });
    });

    newSocket.on('transcript:chunk', (data) => {
      // Update transcript in real-time
      queryClient.setQueryData(['meetings', meetingId], (old: any) => ({
        ...old,
        transcriptChunks: [...(old?.transcriptChunks || []), data],
      }));
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [meetingId, queryClient]);

  return { socket, isConnected };
}
```

---

## AUTHENTICATION (NextAuth.js)

```typescript
// app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'Email',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        // Call backend API
        const res = await fetch('https://api.meetpilot.com/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(credentials),
        });

        const user = await res.json();

        if (res.ok && user) {
          return user;
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.accessToken = token.accessToken;
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
```

---

## DEPLOYMENT CHECKLIST

### Development
- [ ] Environment variables configured
- [ ] API endpoints working
- [ ] Authentication flow tested
- [ ] Real-time updates working
- [ ] All pages rendering correctly

### Production (Vercel)
- [ ] Environment variables set in Vercel
- [ ] Custom domain configured
- [ ] Analytics integrated (Vercel Analytics)
- [ ] Error tracking (Sentry)
- [ ] Performance monitoring
- [ ] SEO metadata complete
- [ ] OG images generated
- [ ] Sitemap generated

---

This is your complete dashboard blueprint! The dashboard team should use this to build the web interface that complements your Chrome Extension.