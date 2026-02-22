# MeetPilot AI Backend Architecture
## Complete Backend Structure & Implementation Guide

---

## ARCHITECTURE OVERVIEW

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                             │
├─────────────────────────────────────────────────────────────────┤
│  Chrome Extension  │  Web Dashboard  │  Mobile App (Future)     │
└──────────┬──────────┴────────┬────────┴──────────────────────────┘
           │                   │
           ↓                   ↓
┌─────────────────────────────────────────────────────────────────┐
│                      API GATEWAY LAYER                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────┐     ┌────────────────────────┐          │
│  │  REST API        │     │  WebSocket Server      │          │
│  │  (FastAPI)       │     │  (Socket.io/FastAPI)   │          │
│  │  Port: 8000      │     │  Port: 3001            │          │
│  └──────────────────┘     └────────────────────────┘          │
│                                                                 │
└──────────┬────────────────────────┬─────────────────────────────┘
           │                        │
           ↓                        ↓
┌─────────────────────────────────────────────────────────────────┐
│                     CORE SERVICES LAYER                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌────────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │  AI Service    │  │  RAG Service │  │  Analytics       │  │
│  │  - LLM calls   │  │  - Embedding │  │  - Metrics       │  │
│  │  - Prompts     │  │  - Vector DB │  │  - Reports       │  │
│  └────────────────┘  └──────────────┘  └──────────────────┘  │
│                                                                 │
│  ┌────────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │  Fact Checker  │  │  Action Item │  │  Meeting Service │  │
│  │  - Validation  │  │  - Detection │  │  - Transcript    │  │
│  │  - Sources     │  │  - NLP/NER   │  │  - Summary       │  │
│  └────────────────┘  └──────────────┘  └──────────────────┘  │
│                                                                 │
│  ┌────────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │  Integration   │  │  Auth/User   │  │  Document        │  │
│  │  - Jira/Slack  │  │  - JWT/OAuth │  │  - Ingestion     │  │
│  │  - Calendar    │  │  - RBAC      │  │  - Processing    │  │
│  └────────────────┘  └──────────────┘  └──────────────────┘  │
│                                                                 │
└──────────┬────────────────────────┬─────────────────────────────┘
           │                        │
           ↓                        ↓
┌─────────────────────────────────────────────────────────────────┐
│                      WORKER/QUEUE LAYER                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │  Celery Workers (Async Task Processing)                  │ │
│  │  - Document embedding (heavy, slow)                      │ │
│  │  - Email notifications                                   │ │
│  │  - Report generation                                     │ │
│  │  - Integration syncs (Jira, Slack)                       │ │
│  │  - Batch analytics                                       │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │  Redis (Message Queue + Cache)                           │ │
│  │  - Task queue for Celery                                 │ │
│  │  - Session storage                                       │ │
│  │  - Rate limiting                                         │ │
│  │  - RAG response cache                                    │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                 │
└──────────┬────────────────────────┬─────────────────────────────┘
           │                        │
           ↓                        ↓
┌─────────────────────────────────────────────────────────────────┐
│                      DATA LAYER                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────┐  ┌──────────────┐  ┌────────────────┐  │
│  │  PostgreSQL      │  │  Pinecone    │  │  S3/Storage    │  │
│  │  - Users         │  │  - Vectors   │  │  - Documents   │  │
│  │  - Meetings      │  │  - Embeddings│  │  - Recordings  │  │
│  │  - Action Items  │  │  - Metadata  │  │  - Exports     │  │
│  │  - Companies     │  │              │  │                │  │
│  └──────────────────┘  └──────────────┘  └────────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## BACKEND TECH STACK (RECOMMENDED)

### Core Framework
```python
Language:       Python 3.11+
Framework:      FastAPI (async)
Server:         Uvicorn (ASGI)
Database ORM:   SQLAlchemy 2.0
Migrations:     Alembic
```

### AI/ML Stack
```python
LLM Framework:  LangChain / LlamaIndex
Embeddings:     OpenAI text-embedding-3-large
Vector DB:      Pinecone (or Qdrant self-hosted)
LLM Providers:  
  - Primary: OpenAI GPT-4o
  - Fallback: Anthropic Claude Sonnet 4
  - Local: Ollama (for on-premise)
```

### Data Storage
```python
Primary DB:     PostgreSQL 15+
Vector DB:      Pinecone / Qdrant
Cache:          Redis 7
Object Storage: AWS S3 / Cloudflare R2
```

### Background Jobs
```python
Task Queue:     Celery
Message Broker: Redis
Scheduler:      Celery Beat (cron jobs)
```

### Real-time
```python
WebSocket:      FastAPI WebSockets (or Socket.io)
Pub/Sub:        Redis Pub/Sub (for multi-instance)
```

### Monitoring & Logging
```python
Logging:        Structlog (JSON logs)
Metrics:        Prometheus client
APM:            Sentry (error tracking)
Tracing:        OpenTelemetry (optional)
```

---

## PROJECT STRUCTURE

```
meetpilot-backend/
├── app/
│   ├── __init__.py
│   ├── main.py                      # FastAPI app entry point
│   │
│   ├── api/                         # API Routes
│   │   ├── __init__.py
│   │   ├── deps.py                  # Dependencies (DB, auth)
│   │   ├── v1/
│   │   │   ├── __init__.py
│   │   │   ├── auth.py              # Login, register, OAuth
│   │   │   ├── meetings.py          # CRUD for meetings
│   │   │   ├── documents.py         # Upload, list documents
│   │   │   ├── query.py             # RAG query endpoint
│   │   │   ├── action_items.py      # Task management
│   │   │   ├── analytics.py         # Meeting stats
│   │   │   └── integrations.py      # Jira, Slack, etc.
│   │   │
│   │   └── websocket.py             # WebSocket endpoints
│   │
│   ├── core/                        # Core Business Logic
│   │   ├── __init__.py
│   │   ├── config.py                # Settings (env vars)
│   │   ├── security.py              # JWT, hashing, encryption
│   │   └── dependencies.py          # Shared dependencies
│   │
│   ├── services/                    # Business Logic Services
│   │   ├── __init__.py
│   │   ├── ai_service.py            # LLM orchestration
│   │   ├── rag_service.py           # RAG pipeline
│   │   ├── fact_checker.py          # Claim verification
│   │   ├── action_item_detector.py  # NLP for task detection
│   │   ├── document_ingestion.py    # Document processing
│   │   ├── meeting_service.py       # Meeting management
│   │   ├── analytics_service.py     # Metrics & reports
│   │   └── integration_service.py   # External APIs
│   │
│   ├── models/                      # SQLAlchemy Models
│   │   ├── __init__.py
│   │   ├── user.py
│   │   ├── company.py
│   │   ├── meeting.py
│   │   ├── participant.py
│   │   ├── action_item.py
│   │   ├── document.py
│   │   └── transcript.py
│   │
│   ├── schemas/                     # Pydantic Schemas
│   │   ├── __init__.py
│   │   ├── user.py
│   │   ├── meeting.py
│   │   ├── action_item.py
│   │   ├── rag.py                   # RAG request/response
│   │   └── websocket.py             # WebSocket messages
│   │
│   ├── db/                          # Database
│   │   ├── __init__.py
│   │   ├── session.py               # DB session factory
│   │   └── base.py                  # Base model class
│   │
│   ├── workers/                     # Celery Tasks
│   │   ├── __init__.py
│   │   ├── celery_app.py            # Celery config
│   │   ├── document_tasks.py        # Embedding generation
│   │   ├── notification_tasks.py    # Email/Slack
│   │   └── integration_tasks.py     # Sync to Jira, etc.
│   │
│   └── utils/                       # Utilities
│       ├── __init__.py
│       ├── logger.py                # Structured logging
│       ├── cache.py                 # Redis cache wrapper
│       └── validators.py            # Custom validators
│
├── migrations/                      # Alembic migrations
│   ├── versions/
│   └── env.py
│
├── tests/                           # Tests
│   ├── __init__.py
│   ├── conftest.py                  # Pytest fixtures
│   ├── test_api/
│   ├── test_services/
│   └── test_models/
│
├── scripts/                         # Utility scripts
│   ├── seed_db.py                   # Sample data
│   └── migrate.py                   # Run migrations
│
├── .env.example                     # Environment variables template
├── .gitignore
├── alembic.ini                      # Alembic config
├── docker-compose.yml               # Local development
├── Dockerfile                       # Production image
├── pyproject.toml                   # Poetry dependencies
├── requirements.txt                 # pip dependencies
└── README.md
```

---

## DATABASE SCHEMA (PostgreSQL)

### Core Tables

```sql
-- Companies (Multi-tenancy)
CREATE TABLE companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    domain VARCHAR(255),
    settings JSONB DEFAULT '{}',
    plan VARCHAR(50) DEFAULT 'free',  -- free, pro, team, enterprise
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Users
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    hashed_password VARCHAR(255),
    full_name VARCHAR(255),
    role VARCHAR(50) DEFAULT 'member',  -- admin, manager, member
    is_active BOOLEAN DEFAULT TRUE,
    oauth_provider VARCHAR(50),  -- google, microsoft, null
    oauth_id VARCHAR(255),
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Meetings
CREATE TABLE meetings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    title VARCHAR(500) NOT NULL,
    platform VARCHAR(50) DEFAULT 'google_meet',  -- google_meet, zoom, teams
    meeting_url TEXT,
    calendar_event_id VARCHAR(255),
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ,
    status VARCHAR(50) DEFAULT 'scheduled',  -- scheduled, active, ended
    transcript TEXT,
    summary TEXT,
    key_decisions JSONB DEFAULT '[]',
    metadata JSONB DEFAULT '{}',
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Participants
CREATE TABLE participants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    meeting_id UUID REFERENCES meetings(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    joined_at TIMESTAMPTZ,
    left_at TIMESTAMPTZ,
    speaking_duration INTEGER DEFAULT 0,  -- seconds
    participation_score FLOAT,
    UNIQUE(meeting_id, email)
);

-- Transcript Chunks
CREATE TABLE transcript_chunks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    meeting_id UUID REFERENCES meetings(id) ON DELETE CASCADE,
    participant_id UUID REFERENCES participants(id) ON DELETE SET NULL,
    text TEXT NOT NULL,
    speaker_name VARCHAR(255),
    timestamp TIMESTAMPTZ NOT NULL,
    sequence_number INTEGER,
    confidence FLOAT,
    metadata JSONB DEFAULT '{}'
);

-- Action Items
CREATE TABLE action_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    meeting_id UUID REFERENCES meetings(id) ON DELETE CASCADE,
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    due_date DATE,
    priority VARCHAR(20) DEFAULT 'medium',  -- high, medium, low
    status VARCHAR(50) DEFAULT 'pending',  -- pending, in_progress, completed, cancelled
    detection_confidence FLOAT,
    synced_to JSONB DEFAULT '[]',  -- ['jira', 'slack', etc.]
    external_ids JSONB DEFAULT '{}',  -- {jira: 'PROJ-123', slack: 'msg_id'}
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

-- Documents (for RAG)
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    filename VARCHAR(500) NOT NULL,
    file_type VARCHAR(50),  -- pdf, docx, txt, csv
    file_size INTEGER,
    storage_url TEXT NOT NULL,
    storage_key VARCHAR(500),
    uploaded_by UUID REFERENCES users(id) ON DELETE SET NULL,
    status VARCHAR(50) DEFAULT 'uploading',  -- uploading, processing, ready, failed
    chunk_count INTEGER DEFAULT 0,
    embedding_status VARCHAR(50) DEFAULT 'pending',  -- pending, processing, completed, failed
    metadata JSONB DEFAULT '{}',
    tags TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Fact Checks
CREATE TABLE fact_checks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    meeting_id UUID REFERENCES meetings(id) ON DELETE CASCADE,
    transcript_chunk_id UUID REFERENCES transcript_chunks(id) ON DELETE CASCADE,
    original_claim TEXT NOT NULL,
    corrected_value TEXT,
    is_correct BOOLEAN NOT NULL,
    confidence FLOAT NOT NULL,
    source_document_id UUID REFERENCES documents(id) ON DELETE SET NULL,
    source_reference TEXT,
    checked_at TIMESTAMPTZ DEFAULT NOW()
);

-- Analytics Events
CREATE TABLE analytics_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    meeting_id UUID REFERENCES meetings(id) ON DELETE CASCADE,
    participant_id UUID REFERENCES participants(id) ON DELETE SET NULL,
    event_type VARCHAR(100) NOT NULL,  -- join, leave, speak_start, speak_end, query, etc.
    timestamp TIMESTAMPTZ NOT NULL,
    metadata JSONB DEFAULT '{}'
);

-- Integration Configs
CREATE TABLE integration_configs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    integration_type VARCHAR(50) NOT NULL,  -- jira, slack, drive, etc.
    is_enabled BOOLEAN DEFAULT FALSE,
    config JSONB NOT NULL,  -- encrypted credentials, settings
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(company_id, integration_type)
);

-- Indexes for performance
CREATE INDEX idx_meetings_company_id ON meetings(company_id);
CREATE INDEX idx_meetings_start_time ON meetings(start_time);
CREATE INDEX idx_participants_meeting_id ON participants(meeting_id);
CREATE INDEX idx_transcript_meeting_id ON transcript_chunks(meeting_id);
CREATE INDEX idx_transcript_timestamp ON transcript_chunks(timestamp);
CREATE INDEX idx_action_items_company_id ON action_items(company_id);
CREATE INDEX idx_action_items_assigned_to ON action_items(assigned_to);
CREATE INDEX idx_action_items_status ON action_items(status);
CREATE INDEX idx_documents_company_id ON documents(company_id);
CREATE INDEX idx_documents_status ON documents(status);
CREATE INDEX idx_analytics_meeting_id ON analytics_events(meeting_id);
CREATE INDEX idx_analytics_timestamp ON analytics_events(timestamp);

-- Row Level Security (Multi-tenancy)
ALTER TABLE meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE action_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- Policies (example)
CREATE POLICY meeting_isolation ON meetings
    FOR ALL
    USING (company_id = current_setting('app.current_company_id')::uuid);
```

---

## VECTOR DATABASE SCHEMA (Pinecone)

```python
# Pinecone Index Configuration
index_config = {
    "name": "meetpilot-prod",
    "dimension": 3072,  # text-embedding-3-large
    "metric": "cosine",
    "pod_type": "p1.x1",  # or serverless
}

# Metadata Schema (stored with each vector)
metadata_schema = {
    "company_id": str,          # Multi-tenancy isolation
    "source_type": str,         # "document", "transcript", "decision"
    "source_id": str,           # UUID of source (document_id, meeting_id)
    "chunk_index": int,         # Position in source
    "text": str,                # Original text chunk
    "created_at": int,          # Unix timestamp
    "access_level": str,        # "public", "team", "confidential"
    "tags": List[str],          # Custom tags
    "file_name": str,           # For documents
    "file_type": str,           # pdf, docx, etc.
    "page_number": int,         # For PDFs
    "meeting_title": str,       # For transcripts
    "speaker": str,             # For transcripts
}

# Example vector upsert
vectors = [
    {
        "id": "doc_abc123_chunk_0",
        "values": [0.123, 0.456, ...],  # 3072 dimensions
        "metadata": {
            "company_id": "comp_xyz",
            "source_type": "document",
            "source_id": "doc_abc123",
            "chunk_index": 0,
            "text": "Q3 revenue was $18.7 million...",
            "created_at": 1703001234,
            "access_level": "team",
            "tags": ["finance", "quarterly"],
            "file_name": "Q3_Financial_Report.pdf",
            "file_type": "pdf",
            "page_number": 3
        }
    }
]
```

---

## CORE SERVICE IMPLEMENTATIONS

### 1. RAG Service (Most Critical)

```python
# app/services/rag_service.py
from langchain.embeddings import OpenAIEmbeddings
from langchain.chat_models import ChatOpenAI
from langchain.prompts import ChatPromptTemplate
from pinecone import Pinecone
from typing import List, Dict

class RAGService:
    def __init__(self):
        self.embeddings = OpenAIEmbeddings(
            model="text-embedding-3-large"
        )
        self.llm = ChatOpenAI(
            model="gpt-4o",
            temperature=0
        )
        self.pc = Pinecone(api_key=settings.PINECONE_API_KEY)
        self.index = self.pc.Index("meetpilot-prod")
        
    async def query(
        self,
        question: str,
        company_id: str,
        k: int = 5
    ) -> Dict:
        """
        Main RAG query function
        
        Args:
            question: User's question
            company_id: Company ID for filtering
            k: Number of chunks to retrieve
            
        Returns:
            {
                "answer": str,
                "sources": List[Source],
                "confidence": "high" | "medium" | "low"
            }
        """
        # 1. Generate question embedding
        query_embedding = await self.embeddings.aembed_query(question)
        
        # 2. Search Pinecone with company filter
        results = self.index.query(
            vector=query_embedding,
            filter={"company_id": company_id},
            top_k=k,
            include_metadata=True
        )
        
        # 3. Check relevance threshold
        if not results.matches or results.matches[0].score < 0.7:
            return {
                "answer": "I don't have enough information to answer that question confidently.",
                "sources": [],
                "confidence": "low"
            }
        
        # 4. Build context from top matches
        context_parts = []
        sources = []
        
        for match in results.matches:
            context_parts.append(f"""
Source: {match.metadata['file_name']} (Page {match.metadata.get('page_number', 'N/A')})
Content: {match.metadata['text']}
""")
            
            sources.append({
                "file": match.metadata['file_name'],
                "page": match.metadata.get('page_number'),
                "snippet": match.metadata['text'][:200],
                "score": match.score
            })
        
        context = "\n\n".join(context_parts)
        
        # 5. Build prompt
        prompt = ChatPromptTemplate.from_messages([
            ("system", """You are MeetPilot AI, an intelligent meeting assistant.
Use the provided context to answer the question accurately.
If the context doesn't contain the answer, say so clearly.
Always cite your sources by mentioning the file name."""),
            ("user", """Context:
{context}

Question: {question}

Answer (be concise and cite sources):""")
        ])
        
        # 6. Get LLM response
        chain = prompt | self.llm
        response = await chain.ainvoke({
            "context": context,
            "question": question
        })
        
        # 7. Determine confidence
        avg_score = sum(m.score for m in results.matches[:3]) / 3
        confidence = (
            "high" if avg_score > 0.85
            else "medium" if avg_score > 0.75
            else "low"
        )
        
        return {
            "answer": response.content,
            "sources": sources[:3],  # Top 3 only
            "confidence": confidence
        }
```

### 2. Document Ingestion Service

```python
# app/services/document_ingestion.py
from langchain.document_loaders import (
    PyPDFLoader,
    UnstructuredWordDocumentLoader,
    TextLoader
)
from langchain.text_splitter import RecursiveCharacterTextSplitter
import asyncio

class DocumentIngestionService:
    def __init__(self):
        self.embeddings = OpenAIEmbeddings(
            model="text-embedding-3-large"
        )
        self.pc = Pinecone(api_key=settings.PINECONE_API_KEY)
        self.index = self.pc.Index("meetpilot-prod")
        
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200,
            separators=["\n\n", "\n", ". ", " ", ""]
        )
    
    async def ingest_document(
        self,
        document_id: str,
        file_path: str,
        company_id: str,
        metadata: Dict
    ) -> int:
        """
        Ingest a document into vector database
        
        Returns: Number of chunks created
        """
        # 1. Load document
        loader = self._get_loader(file_path)
        documents = loader.load()
        
        # 2. Split into chunks
        chunks = self.text_splitter.split_documents(documents)
        
        # 3. Add metadata to each chunk
        for i, chunk in enumerate(chunks):
            chunk.metadata.update({
                "company_id": company_id,
                "source_type": "document",
                "source_id": document_id,
                "chunk_index": i,
                "created_at": int(time.time()),
                "access_level": metadata.get("access_level", "team"),
                "file_name": metadata.get("filename"),
                "file_type": metadata.get("file_type"),
                "tags": metadata.get("tags", [])
            })
            
            # For PDFs, add page number
            if "page" in chunk.metadata:
                chunk.metadata["page_number"] = chunk.metadata["page"]
        
        # 4. Generate embeddings in batches
        texts = [chunk.page_content for chunk in chunks]
        embeddings = await self._batch_embed(texts)
        
        # 5. Prepare vectors for upsert
        vectors = []
        for i, (chunk, embedding) in enumerate(zip(chunks, embeddings)):
            vectors.append({
                "id": f"{document_id}_chunk_{i}",
                "values": embedding,
                "metadata": {
                    **chunk.metadata,
                    "text": chunk.page_content
                }
            })
        
        # 6. Upsert to Pinecone in batches
        batch_size = 100
        for i in range(0, len(vectors), batch_size):
            batch = vectors[i:i + batch_size]
            self.index.upsert(vectors=batch)
            await asyncio.sleep(0.1)  # Rate limiting
        
        return len(chunks)
    
    async def _batch_embed(self, texts: List[str]) -> List[List[float]]:
        """Generate embeddings in batches"""
        all_embeddings = []
        batch_size = 2048  # OpenAI limit
        
        for i in range(0, len(texts), batch_size):
            batch = texts[i:i + batch_size]
            embeddings = await self.embeddings.aembed_documents(batch)
            all_embeddings.extend(embeddings)
        
        return all_embeddings
    
    def _get_loader(self, file_path: str):
        """Get appropriate document loader"""
        ext = file_path.split('.')[-1].lower()
        
        loaders = {
            'pdf': PyPDFLoader,
            'docx': UnstructuredWordDocumentLoader,
            'txt': TextLoader,
        }
        
        loader_class = loaders.get(ext, TextLoader)
        return loader_class(file_path)
```

### 3. Fact Checker Service

```python
# app/services/fact_checker.py
class FactCheckerService:
    def __init__(self):
        self.llm = ChatOpenAI(model="gpt-4o", temperature=0)
        self.rag = RAGService()
    
    async def verify_claim(
        self,
        claim: str,
        company_id: str
    ) -> Dict:
        """
        Verify a factual claim
        
        Returns:
            {
                "is_correct": bool,
                "corrected_value": str or None,
                "source": str,
                "confidence": float
            }
        """
        # 1. Extract factual components from claim
        facts = await self._extract_facts(claim)
        
        if not facts:
            return {
                "is_correct": True,
                "corrected_value": None,
                "source": None,
                "confidence": 0.0
            }
        
        # 2. For each fact, search for ground truth
        for fact in facts:
            evidence = await self.rag.query(
                question=f"What is the correct value for: {fact['statement']}",
                company_id=company_id,
                k=3
            )
            
            # 3. Compare claim with evidence
            is_correct = await self._compare(fact, evidence)
            
            if not is_correct:
                return {
                    "is_correct": False,
                    "corrected_value": evidence['answer'],
                    "source": evidence['sources'][0]['file'],
                    "confidence": evidence['sources'][0]['score']
                }
        
        return {
            "is_correct": True,
            "corrected_value": None,
            "source": None,
            "confidence": 0.95
        }
    
    async def _extract_facts(self, text: str) -> List[Dict]:
        """Extract verifiable facts from text"""
        prompt = f"""Extract factual claims from this text that can be verified.
Only extract claims with specific numbers, dates, or names.
Do NOT extract opinions or subjective statements.

Text: {text}

Return as JSON array:
[
  {{"statement": "Q3 revenue was 20 million", "type": "numeric", "value": "20 million"}},
  ...
]

If no verifiable claims, return empty array [].
"""
        
        response = await self.llm.apredict(prompt)
        
        try:
            facts = json.loads(response)
            return facts
        except:
            return []
```

### 4. Action Item Detector

```python
# app/services/action_item_detector.py
class ActionItemDetector:
    def __init__(self):
        self.llm = ChatOpenAI(model="gpt-4o", temperature=0)
    
    async def detect_from_transcript(
        self,
        transcript_chunks: List[str],
        participants: List[str]
    ) -> List[Dict]:
        """
        Detect action items from meeting transcript
        
        Args:
            transcript_chunks: Recent transcript segments
            participants: List of participant names
            
        Returns:
            List of detected action items
        """
        transcript = "\n".join(transcript_chunks)
        
        prompt = f"""Analyze this meeting transcript and extract action items.

Transcript:
{transcript}

Participants: {', '.join(participants)}

For each action item, identify:
- Task description (clear, actionable)
- Assigned to (person's name if mentioned, otherwise null)
- Deadline (if mentioned, otherwise null)
- Priority (high/medium/low based on urgency indicators)

Return as JSON array:
[
  {{
    "description": "Follow up with Sarah about Q1 budget",
    "assigned_to": "John",
    "due_date": "2024-01-15",
    "priority": "high"
  }},
  ...
]

If no action items detected, return empty array [].
"""
        
        response = await self.llm.apredict(prompt)
        
        try:
            action_items = json.loads(response)
            return action_items
        except:
            return []
```

---

## API ENDPOINTS

### REST API Routes

```python
# app/api/v1/meetings.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.api.deps import get_db, get_current_user

router = APIRouter()

@router.post("/meetings", response_model=MeetingResponse)
async def create_meeting(
    meeting: MeetingCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new meeting"""
    db_meeting = Meeting(
        company_id=current_user.company_id,
        title=meeting.title,
        platform=meeting.platform,
        start_time=meeting.start_time,
        created_by=current_user.id
    )
    db.add(db_meeting)
    db.commit()
    db.refresh(db_meeting)
    return db_meeting

@router.get("/meetings/{meeting_id}", response_model=MeetingResponse)
async def get_meeting(
    meeting_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get meeting by ID"""
    meeting = db.query(Meeting).filter(
        Meeting.id == meeting_id,
        Meeting.company_id == current_user.company_id
    ).first()
    
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")
    
    return meeting

@router.get("/meetings", response_model=List[MeetingResponse])
async def list_meetings(
    skip: int = 0,
    limit: int = 20,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """List meetings with pagination"""
    meetings = db.query(Meeting).filter(
        Meeting.company_id == current_user.company_id
    ).order_by(Meeting.start_time.desc()).offset(skip).limit(limit).all()
    
    return meetings
```

```python
# app/api/v1/query.py
@router.post("/query", response_model=RAGResponse)
async def query_knowledge(
    query: RAGQuery,
    current_user: User = Depends(get_current_user),
    rag_service: RAGService = Depends(get_rag_service)
):
    """Query company knowledge base"""
    result = await rag_service.query(
        question=query.question,
        company_id=current_user.company_id,
        k=query.top_k or 5
    )
    
    return RAGResponse(**result)
```

```python
# app/api/v1/documents.py
@router.post("/documents/upload")
async def upload_document(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Upload document for RAG"""
    # 1. Save to S3
    file_key = f"{current_user.company_id}/{uuid.uuid4()}/{file.filename}"
    storage_url = await s3_client.upload(file, file_key)
    
    # 2. Create DB record
    document = Document(
        company_id=current_user.company_id,
        filename=file.filename,
        file_type=file.filename.split('.')[-1],
        file_size=file.size,
        storage_url=storage_url,
        storage_key=file_key,
        uploaded_by=current_user.id,
        status="processing"
    )
    db.add(document)
    db.commit()
    
    # 3. Queue embedding task
    document_tasks.embed_document.delay(
        document_id=str(document.id),
        file_path=storage_url
    )
    
    return {"id": document.id, "status": "processing"}
```

### WebSocket Endpoints

```python
# app/api/websocket.py
from fastapi import WebSocket, WebSocketDisconnect
from typing import Dict

class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, WebSocket] = {}
    
    async def connect(self, meeting_id: str, websocket: WebSocket):
        await websocket.accept()
        self.active_connections[meeting_id] = websocket
    
    def disconnect(self, meeting_id: str):
        self.active_connections.pop(meeting_id, None)
    
    async def send_to_meeting(self, meeting_id: str, message: dict):
        if meeting_id in self.active_connections:
            await self.active_connections[meeting_id].send_json(message)

manager = ConnectionManager()

@app.websocket("/ws/meeting/{meeting_id}")
async def websocket_endpoint(
    websocket: WebSocket,
    meeting_id: str,
    token: str
):
    # Verify JWT token
    user = verify_jwt_token(token)
    if not user:
        await websocket.close(code=1008)
        return
    
    await manager.connect(meeting_id, websocket)
    
    try:
        while True:
            # Receive message from extension
            data = await websocket.receive_json()
            
            # Process based on message type
            await process_websocket_message(
                message_type=data['type'],
                data=data['data'],
                meeting_id=meeting_id,
                user=user
            )
            
    except WebSocketDisconnect:
        manager.disconnect(meeting_id)

async def process_websocket_message(
    message_type: str,
    data: dict,
    meeting_id: str,
    user: User
):
    """Process incoming WebSocket messages"""
    
    if message_type == 'CAPTION_CHUNK':
        # Save transcript
        await save_transcript_chunk(meeting_id, data)
        
        # Check for action items
        action_items = await action_item_detector.detect(data['text'])
        if action_items:
            for item in action_items:
                await manager.send_to_meeting(meeting_id, {
                    'type': 'ACTION_ITEM_DETECTED',
                    'data': item
                })
        
        # Check for facts to verify
        facts = await fact_checker.extract_facts(data['text'])
        for fact in facts:
            verification = await fact_checker.verify(fact, user.company_id)
            if not verification['is_correct']:
                await manager.send_to_meeting(meeting_id, {
                    'type': 'FACT_CHECK_ALERT',
                    'data': verification
                })
    
    elif message_type == 'USER_QUERY':
        # Process RAG query
        result = await rag_service.query(
            question=data['question'],
            company_id=user.company_id
        )
        
        await manager.send_to_meeting(meeting_id, {
            'type': 'AI_RESPONSE',
            'data': result
        })
```

---

## CELERY TASKS (Background Workers)

```python
# app/workers/document_tasks.py
from app.workers.celery_app import celery_app
from app.services.document_ingestion import DocumentIngestionService

@celery_app.task
def embed_document(document_id: str, file_path: str):
    """
    Background task to embed document chunks
    (Heavy operation, runs async)
    """
    ingestion_service = DocumentIngestionService()
    
    # Update status
    db = SessionLocal()
    document = db.query(Document).filter(Document.id == document_id).first()
    document.embedding_status = "processing"
    db.commit()
    
    try:
        # Perform ingestion
        chunk_count = asyncio.run(
            ingestion_service.ingest_document(
                document_id=document_id,
                file_path=file_path,
                company_id=document.company_id,
                metadata={
                    "filename": document.filename,
                    "file_type": document.file_type
                }
            )
        )
        
        # Update status
        document.embedding_status = "completed"
        document.chunk_count = chunk_count
        document.status = "ready"
        db.commit()
        
    except Exception as e:
        document.embedding_status = "failed"
        document.status = "failed"
        db.commit()
        raise
    finally:
        db.close()

@celery_app.task
def generate_meeting_summary(meeting_id: str):
    """Generate AI summary after meeting ends"""
    # Fetch transcript
    # Call LLM to summarize
    # Save to DB
    pass
```

```python
# app/workers/integration_tasks.py
@celery_app.task
def sync_to_jira(action_item_id: str):
    """Sync action item to Jira"""
    db = SessionLocal()
    action_item = db.query(ActionItem).filter(
        ActionItem.id == action_item_id
    ).first()
    
    company = db.query(Company).filter(
        Company.id == action_item.company_id
    ).first()
    
    # Get Jira config
    jira_config = db.query(IntegrationConfig).filter(
        IntegrationConfig.company_id == company.id,
        IntegrationConfig.integration_type == "jira"
    ).first()
    
    if not jira_config or not jira_config.is_enabled:
        return
    
    # Create Jira issue
    jira_client = JiraClient(jira_config.config)
    issue = jira_client.create_issue(
        project=jira_config.config['project_key'],
        summary=action_item.description,
        assignee=action_item.assigned_to,
        due_date=action_item.due_date
    )
    
    # Save Jira issue ID
    action_item.external_ids = {
        **action_item.external_ids,
        "jira": issue.key
    }
    action_item.synced_to = action_item.synced_to + ["jira"]
    db.commit()
    db.close()
```

---

## CONFIGURATION & ENVIRONMENT

```python
# app/core/config.py
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # App
    APP_NAME: str = "MeetPilot API"
    VERSION: str = "1.0.0"
    DEBUG: bool = False
    
    # Database
    DATABASE_URL: str
    
    # Redis
    REDIS_URL: str = "redis://localhost:6379"
    
    # AI/ML
    OPENAI_API_KEY: str
    ANTHROPIC_API_KEY: str
    PINECONE_API_KEY: str
    PINECONE_ENVIRONMENT: str = "us-east-1"
    
    # Storage
    S3_BUCKET: str
    S3_ACCESS_KEY: str
    S3_SECRET_KEY: str
    S3_REGION: str = "us-east-1"
    
    # Auth
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    
    # Integrations
    GOOGLE_CLIENT_ID: str
    GOOGLE_CLIENT_SECRET: str
    
    # Celery
    CELERY_BROKER_URL: str = "redis://localhost:6379/0"
    CELERY_RESULT_BACKEND: str = "redis://localhost:6379/0"
    
    class Config:
        env_file = ".env"

settings = Settings()
```

```bash
# .env.example
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/meetpilot

# Redis
REDIS_URL=redis://localhost:6379

# OpenAI
OPENAI_API_KEY=sk-...

# Anthropic
ANTHROPIC_API_KEY=sk-ant-...

# Pinecone
PINECONE_API_KEY=...
PINECONE_ENVIRONMENT=us-east-1

# AWS S3
S3_BUCKET=meetpilot-documents
S3_ACCESS_KEY=...
S3_SECRET_KEY=...

# Auth
SECRET_KEY=your-secret-key-here

# Google OAuth
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
```

---

## DOCKER DEPLOYMENT

```yaml
# docker-compose.yml
version: '3.8'

services:
  api:
    build: .
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - REDIS_URL=redis://redis:6379
      - OPENAI_API_KEY=${OPENAI_API_KEY}
      - PINECONE_API_KEY=${PINECONE_API_KEY}
    depends_on:
      - db
      - redis
    command: uvicorn app.main:app --host 0.0.0.0 --port 8000

  worker:
    build: .
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - REDIS_URL=redis://redis:6379
      - OPENAI_API_KEY=${OPENAI_API_KEY}
    depends_on:
      - db
      - redis
    command: celery -A app.workers.celery_app worker --loglevel=info

  beat:
    build: .
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - REDIS_URL=redis://redis:6379
    depends_on:
      - redis
    command: celery -A app.workers.celery_app beat --loglevel=info

  db:
    image: postgres:15
    environment:
      POSTGRES_USER: meetpilot
      POSTGRES_PASSWORD: password
      POSTGRES_DB: meetpilot
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  postgres_data:
```

```dockerfile
# Dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application
COPY . .

# Run migrations
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

---

## DEPLOYMENT CHECKLIST

### Development Environment
- [ ] PostgreSQL running
- [ ] Redis running
- [ ] Environment variables set
- [ ] Database migrations run
- [ ] Seed data loaded (optional)
- [ ] Celery worker running
- [ ] API accessible at localhost:8000

### Production Environment
- [ ] Database backups configured
- [ ] Redis persistence enabled
- [ ] SSL certificates installed
- [ ] Environment variables secured
- [ ] Rate limiting enabled
- [ ] Monitoring (Sentry, Prometheus)
- [ ] Logging configured
- [ ] Auto-scaling enabled
- [ ] CI/CD pipeline set up

---

## PERFORMANCE OPTIMIZATION

### Database
- Use connection pooling (SQLAlchemy)
- Add indexes on frequently queried columns
- Use pagination for large result sets
- Implement database-level caching

### API
- Enable response compression (gzip)
- Use Redis for caching
- Implement rate limiting
- Use async/await throughout

### Vector Search
- Cache frequent queries (1 hour TTL)
- Batch embedding generation
- Use appropriate k value (5-10 max)

### Background Jobs
- Use Celery for heavy operations
- Implement retry logic with exponential backoff
- Monitor task queue length

---

This is your complete backend blueprint. The backend team should use this as their master reference for building the API that your Chrome Extension will connect to.