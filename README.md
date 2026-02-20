
# 🚀 MeetPilot AI  
### Autonomous AI Meeting Intelligence System

MeetPilot AI transforms meetings from passive documentation into active, intelligent collaboration.

Instead of just recording meetings, MeetPilot:

- 🧠 Retrieves knowledge in real-time (RAG)
- ✅ Fact-checks claims instantly
- 📌 Extracts action items automatically
- 🗂 Remembers historical decisions
- 📊 Tracks engagement & analytics

---

# 🏗 Overall System Architecture

```
Chrome Extension → WebSocket → FastAPI Backend
                         ↓
                AI Intelligence Layer
                         ↓
      Vector DB + PostgreSQL + Redis
                         ↓
                   Structured Response
                         ↓
                  Dashboard Display
```

---

# 📁 Complete Project Folder Structure

```
Meetpilot/
│
├── frontend/                 # Next.js dashboard
│
├── chrome-extension/         # Meeting UI injection
│
├── backend/
│   ├── app/
│   │   ├── main.py           # FastAPI entry
│   │   ├── config.py
│   │   ├── dependencies.py
│   │   │
│   │   ├── api/              # REST routes
│   │   │   ├── meetings.py
│   │   │   ├── documents.py
│   │   │   ├── action_items.py
│   │   │   └── analytics.py
│   │   │
│   │   ├── websocket/
│   │   │   ├── manager.py    # Connection manager
│   │   │   └── handlers.py   # Event handling
│   │   │
│   │   ├── core/             # Shared core logic
│   │   │   ├── security.py
│   │   │   ├── utils.py
│   │   │   └── logger.py
│   │   │
│   │   ├── services/         # Business logic layer
│   │   │   ├── rag_service.py
│   │   │   ├── action_service.py
│   │   │   ├── factcheck_service.py
│   │   │   └── analytics_service.py
│   │   │
│   │   ├── ai/               
│   │   │   ├── embeddings.py
│   │   │   ├── retriever.py
│   │   │   ├── chunking.py
│   │   │   ├── prompts.py
│   │   │   ├── orchestrator.py
│   │   │   └── memory.py
│   │   │
│   │   ├── db/
│   │   │   ├── models.py
│   │   │   ├── session.py
│   │   │   └── crud.py
│   │   │
│   │   └── workers/
│   │       └── celery_tasks.py
│   │
│   ├── alembic/              # Migrations
│   └── requirements.txt
│
├── docker-compose.yml
└── README.md
```

---

# 🧠 AI Intelligence Layer (Core Innovation)

The AI module is fully modular and production-ready.

```
backend/app/ai/
```

### Modules Overview

| File | Responsibility |
|------|----------------|
| embeddings.py | Generate OpenAI embeddings |
| chunking.py | Token-based text splitting |
| retriever.py | Vector DB semantic search |
| prompts.py | Structured LLM prompt templates |
| action_extractor.py | Extract structured tasks |
| fact_checker.py | Validate measurable claims |
| memory.py | Sliding window transcript memory |
| orchestrator.py | Routes transcript events intelligently |

---

# 🔁 Real-Time AI Flow

### Transcript Event

```json
{
  "event": "transcript_chunk",
  "text": "We should send the revised proposal by Friday."
}
```

### AI Orchestrator Logic

- Detect question → Trigger RAG
- Detect action statement → Extract task
- Detect numeric claim → Fact-check
- Otherwise → Ignore

### Response

```json
{
  "type": "action",
  "payload": {
    "description": "Send revised proposal",
    "deadline": "Friday",
    "confidence": 0.92
  }
}
```

---

# ⚙️ Technology Stack

## Backend
- Python 3.11+
- FastAPI
- Async WebSockets
- OpenAI GPT-4o
- text-embedding-3-large

## Database
- PostgreSQL
- Pinecone / Qdrant
- Redis

## Frontend
- Next.js 14
- React
- Tailwind CSS

## Extension
- React + TypeScript
- Chrome Manifest v3

---

# 🚀 Local Setup

### 1️⃣ Clone

```bash
git clone https://github.com/your-org/Meetpilot.git
cd Meetpilot
```

### 2️⃣ Configure Environment

```
OPENAI_API_KEY=
PINECONE_API_KEY=
DATABASE_URL=
REDIS_URL=
```

### 3️⃣ Run with Docker

```bash
docker-compose up --build
```

### 4️⃣ Run Migrations

```bash
docker-compose exec api alembic upgrade head
```

---

# 🧪 Testing Strategy

- Unit tests for AI modules
- WebSocket integration tests
- RAG pipeline validation
- Load testing for concurrent meetings

---

# 🔐 Security Principles

- Multi-tenant isolation
- Metadata filtering in vector search
- TLS encryption
- Role-based access control
- Optional on-prem confidential mode

---

# 🎯 Vision

MeetPilot AI is not a note-taker.

It is an **AI collaboration engine** that:

- Thinks during meetings  
- Verifies information  
- Tracks accountability  
- Builds institutional memory  

---

# 🏁 From Hackathon to Enterprise

Built to scale from:

> Hackathon MVP → Production SaaS → Enterprise AI Platform

---

### ⭐ If this project inspires you, consider starring the repository.
