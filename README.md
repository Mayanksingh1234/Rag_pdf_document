# PDF RAG Document Assistant

A production-ready **PDF Question Answering application** built with **React, FastAPI, Supabase, pgvector, and Google Gemini**.

Users can securely upload PDF documents, process them into vector embeddings, and ask natural-language questions. The system retrieves the most relevant document chunks using semantic search and generates answers grounded in the uploaded document.

## Live Demo

**Frontend:**  
https://rag-pdf-document.vercel.app

---

## Features

- Secure email/password authentication
- Email verification
- Forgot password / password reset
- Protected routes
- PDF upload
- PDF document processing
- Automatic document chunking
- Vector embeddings using Gemini
- Semantic similarity search with pgvector
- Context-aware RAG question answering
- Document-specific question answering
- User-specific document isolation
- Document listing
- Document deletion
- Private PDF storage
- Responsive React UI
- Production deployment
- REST API architecture
- Supabase Row Level Security (RLS)

---

## How It Works

The application follows a Retrieval-Augmented Generation (RAG) pipeline.

```text
                    USER
                     │
                     ▼
             React + Vite Frontend
                     │
                     │ HTTPS
                     ▼
             FastAPI Backend
                     │
          ┌──────────┼──────────┐
          │          │          │
          ▼          ▼          ▼
      Supabase    Gemini     Supabase
       Storage    Embedding   Database
          │          │          │
          │          │          ▼
          │          │       pgvector
          │          │          │
          └──────────┼──────────┘
                     │
                     ▼
              Vector Search
                     │
                     ▼
             Relevant Chunks
                     │
                     ▼
              Gemini LLM
                     │
                     ▼
                Answer
```

---

# RAG Pipeline

## 1. Upload PDF

The authenticated user uploads a PDF from the React frontend.

The request is sent to the FastAPI backend with the user's Supabase access token.

```text
React
  ↓
POST /upload
  ↓
FastAPI
```

The backend:

1. Validates the PDF.
2. Generates a unique document ID.
3. Stores the PDF in Supabase Storage.
4. Creates a document record in PostgreSQL.
5. Loads the PDF.
6. Splits the document into chunks.
7. Generates embeddings.
8. Stores the chunks and embeddings.
9. Marks the document as `ready`.

---

## 2. Document Loading

PDF files are processed using `PyPDFLoader`.

```python
from langchain_community.document_loaders import PyPDFLoader
```

Each page is converted into a LangChain document object.

---

## 3. Text Chunking

Documents are divided into smaller chunks using `RecursiveCharacterTextSplitter`.

Current configuration:

```text
Chunk size: 1000
Chunk overlap: 100
```

This allows the retrieval system to search smaller, relevant sections instead of processing an entire PDF for every question.

---

## 4. Generate Embeddings

The application uses Google's Gemini embedding model:

```text
gemini-embedding-001
```

Embeddings are generated for each document chunk.

The current vector dimension is:

```text
768
```

The vectors are normalized before being stored.

---

## 5. Store Embeddings

Document chunks and their embeddings are stored in Supabase PostgreSQL.

The `embedding` column uses the pgvector extension:

```text
vector(768)
```

The database also uses an HNSW index for efficient vector similarity search.

---

## 6. Ask a Question

When a user asks a question:

```text
User Question
      ↓
Query Embedding
      ↓
pgvector Similarity Search
      ↓
Relevant Document Chunks
      ↓
Context + Question
      ↓
Gemini
      ↓
Answer
```

The search is restricted by both:

- `document_id`
- `user_id`

This prevents users from retrieving chunks belonging to other documents or users.

---

## 7. Generate the Answer

The retrieved chunks are provided to Gemini as context.

The model is instructed to answer using the retrieved document context and avoid inventing information that is not present in the retrieved content.

The response is then returned to the React frontend.

---

# Tech Stack

## Frontend

- React
- Vite
- React Router
- Redux Toolkit
- Tailwind CSS
- Supabase JavaScript SDK
- React Icons

## Backend

- Python
- FastAPI
- Uvicorn
- LangChain
- LangChain Community
- LangChain Google GenAI
- LangChain Hugging Face
- PyPDFLoader
- RecursiveCharacterTextSplitter

## AI / RAG

- Google Gemini
- Gemini Embeddings
- Retrieval-Augmented Generation (RAG)
- Semantic Search
- Vector Embeddings
- pgvector

## Database & Storage

- Supabase PostgreSQL
- Supabase Auth
- Supabase Storage
- pgvector
- HNSW vector index
- Row Level Security (RLS)

## Deployment

- Vercel — Frontend
- Render — Backend
- Supabase — Database, Authentication & Storage

---

# Project Structure

```text
Rag_pdf_document/
│
├── Backend/
│   │
│   ├── app/
│   │   ├── rag/
│   │   │   ├── chain.py
│   │   │   ├── embedding.py
│   │   │   ├── loader.py
│   │   │   ├── retriever.py
│   │   │   ├── splitter.py
│   │   │   └── vector_store.py
│   │   │
│   │   ├── routes/
│   │   │   ├── ask.py
│   │   │   ├── documents.py
│   │   │   ├── home.py
│   │   │   └── upload.py
│   │   │
│   │   ├── auth.py
│   │   └── supabase_client.py
│   │
│   ├── main.py
│   ├── requirements.txt
│   └── .env
│
├── Frontend/
│   │
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── lib/
│   │   ├── api.js
│   │   └── App.jsx
│   │
│   ├── public/
│   ├── package.json
│   └── .env
│
├── .gitignore
└── README.md
```

---

# Database Schema

The application uses three primary PostgreSQL tables.

## Profiles

Stores user profile information.

```text
profiles
├── id
├── full_name
├── avatar_url
├── created_at
└── updated_at
```

The `id` references:

```text
auth.users(id)
```

---

## Documents

Stores metadata for uploaded PDFs.

```text
documents
├── id
├── user_id
├── file_name
├── storage_path
├── file_size
├── mime_type
├── page_count
├── chunk_count
├── status
├── created_at
└── updated_at
```

Document processing status can include:

```text
uploaded
processing
ready
failed
```

---

## Document Chunks

Stores the processed document chunks and their vector embeddings.

```text
document_chunks
├── id
├── document_id
├── content
├── chunk_index
├── page_number
├── token_count
├── embedding
└── created_at
```

The embedding column:

```text
vector(768)
```

---

# Vector Search

The application uses PostgreSQL's `pgvector` extension.

Similarity is calculated using cosine distance:

```text
1 - (embedding <=> query_embedding)
```

An HNSW index is used for efficient vector search:

```sql
CREATE INDEX document_chunks_embedding_hnsw
ON public.document_chunks
USING hnsw (embedding vector_cosine_ops);
```

The search function also filters results by user and document.

This ensures that retrieval remains document-specific and user-specific.

---

# Authentication

Authentication is handled by Supabase Auth.

The application supports:

- Sign up
- Email verification
- Login
- Logout
- Forgot password
- Password reset
- Protected application routes

The frontend obtains a Supabase access token after login.

The token is sent to the FastAPI backend:

```http
Authorization: Bearer <access_token>
```

The backend validates the token before allowing protected operations.

---

# Security

Security is handled at multiple layers.

### Authentication

Supabase Auth manages user authentication and sessions.

### Backend Authorization

FastAPI validates the Supabase Bearer token before accessing protected endpoints.

### Database Security

Supabase Row Level Security policies restrict users to their own records.

### Storage Security

PDF files are stored in a private Supabase Storage bucket.

Documents use a user-specific storage path:

```text
Pdfs/{user_id}/{document_id}/{filename}.pdf
```

### Secrets

Sensitive keys are stored in environment variables and are not committed to GitHub.

Never expose:

```text
SUPABASE_SECRET_KEY
GEMINI_API_KEY
```

in the frontend.

---

# API Endpoints

## Health Check

```http
GET /
```

Response:

```json
{
  "message": "PDF RAG API is running"
}
```

---

## Upload Document

```http
POST /upload
```

Uploads and processes a PDF.

Authentication:

```http
Authorization: Bearer <token>
```

Request:

```text
multipart/form-data
file=<PDF>
```

---

## Ask Question

```http
POST /ask
```

Request:

```json
{
  "query": "What is this document about?",
  "document_id": "document-uuid",
  "k": 4
}
```

The backend performs vector retrieval and generates a contextual answer.

---

## Get Documents

```http
GET /documents
```

Returns documents belonging to the authenticated user.

---

## Delete Document

```http
DELETE /document/{document_id}
```

Deletes the document, associated chunks, and stored PDF.

---

# Environment Variables

## Backend

Create:

```text
Backend/.env
```

Example:

```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_SECRET_KEY=your_supabase_secret_key
GEMINI_API_KEY=your_gemini_api_key
```

Do not commit this file.

---

## Frontend

Create:

```text
Frontend/.env
```

Example:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
VITE_API_BASE_URL=http://127.0.0.1:8000
```

For production:

```env
VITE_API_BASE_URL=https://rag-pdf-document.onrender.com
```

Only public/publishable Supabase configuration should be used in the frontend.

---

# Local Development

## 1. Clone the repository

```bash
git clone https://github.com/Mayanksingh1234/Rag_pdf_document.git
cd Rag_pdf_document
```

---

# Backend Setup

Move into the backend:

```bash
cd Backend
```

Create a virtual environment:

### Windows

```bash
python -m venv venv
venv\Scripts\activate
```

### macOS / Linux

```bash
python3 -m venv venv
source venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Create your `.env` file:

```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_SECRET_KEY=your_supabase_secret_key
GEMINI_API_KEY=your_gemini_api_key
```

Start FastAPI:

```bash
uvicorn main:app --reload
```

Backend:

```text
http://127.0.0.1:8000
```

---

# Frontend Setup

Open another terminal:

```bash
cd Frontend
```

Install dependencies:

```bash
npm install
```

Create:

```text
.env
```

Add:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
VITE_API_BASE_URL=http://127.0.0.1:8000
```

Start the development server:

```bash
npm run dev
```

Frontend:

```text
http://localhost:5173
```

---

# Supabase Setup

Create a Supabase project and enable:

```text
Authentication
PostgreSQL
Storage
pgvector
```

Create the required tables:

```text
profiles
documents
document_chunks
```

Enable Row Level Security for application tables.

Create a private Storage bucket:

```text
Pdfs
```

The vector column should be:

```text
vector(768)
```

Enable the pgvector extension and create the HNSW index used for semantic search.

---

# Deployment

## Frontend — Vercel

The React/Vite frontend is deployed using Vercel.

Production URL:

```text
https://rag-pdf-document.vercel.app
```

Configure:

```env
VITE_SUPABASE_URL=...
VITE_SUPABASE_PUBLISHABLE_KEY=...
VITE_API_BASE_URL=https://rag-pdf-document.onrender.com
```

---

## Backend — Render

The FastAPI backend is deployed using Render.

Production URL:

```text
https://rag-pdf-document.onrender.com
```

Build command:

```bash
pip install -r requirements.txt
```

Start command:

```bash
uvicorn main:app --host 0.0.0.0 --port $PORT
```

Required environment variables:

```env
SUPABASE_URL=...
SUPABASE_SECRET_KEY=...
GEMINI_API_KEY=...
```

---

# Authentication Redirect Configuration

For production password reset functionality, configure Supabase Auth with:

```text
Site URL:
https://rag-pdf-document.vercel.app
```

Redirect URL:

```text
https://rag-pdf-document.vercel.app/reset-password
```

For local development, you can also keep:

```text
http://localhost:5173/reset-password
```

---

# Application Flow

## Authentication Flow

```text
User
 │
 ├── Sign Up
 │      ↓
 │   Supabase Auth
 │      ↓
 │   Email Verification
 │
 └── Login
        ↓
   Supabase Session
        ↓
   Redux User State
        ↓
   Protected Routes
```

## Upload Flow

```text
PDF
 ↓
React
 ↓
FastAPI /upload
 ↓
Supabase Storage
 ↓
documents table
 ↓
PyPDFLoader
 ↓
Text Splitter
 ↓
Gemini Embeddings
 ↓
document_chunks
 ↓
pgvector
 ↓
Document Ready
```

## Question Answering Flow

```text
Question
   ↓
React
   ↓
FastAPI /ask
   ↓
Query Embedding
   ↓
pgvector Similarity Search
   ↓
Top K Relevant Chunks
   ↓
Context Construction
   ↓
Gemini LLM
   ↓
Answer
   ↓
React UI
```

---

# Key Design Decisions

### Why RAG?

Instead of sending an entire PDF to the LLM for every question, the application retrieves only the most relevant sections.

This improves:

- Relevance
- Context management
- Scalability
- Cost efficiency
- Document-specific answering

### Why pgvector?

The project already uses PostgreSQL through Supabase, so pgvector provides vector search without requiring a separate vector database.

### Why Supabase?

Supabase provides several required services in one platform:

- Authentication
- PostgreSQL
- Storage
- Row Level Security
- pgvector

### Why FastAPI?

FastAPI provides a lightweight Python API layer for:

- PDF processing
- Embedding generation
- Retrieval
- RAG orchestration
- Authentication validation

### Why React?

React provides the interactive document management and chat interface while keeping authentication/session state and UI state on the client.

---

# Error Handling

The backend handles common failures including:

- Invalid PDF uploads
- Authentication failures
- Expired authentication tokens
- Missing environment variables
- Document processing failures
- Embedding failures
- Retrieval failures
- Database errors

Failed document processing updates the document status to:

```text
failed
```

---

# Current Limitations

- Chat messages are maintained in frontend state and are not persisted as chat history.
- PDF processing is performed during the upload request.
- Large PDFs may require additional background processing for production-scale workloads.
- The current architecture is optimized for a lightweight deployment rather than large-scale concurrent document processing.

---

# Future Improvements

Potential improvements include:

- Background PDF processing with Celery or a task queue
- Streaming LLM responses
- Conversation persistence
- Hybrid keyword + vector search
- Reranking retrieved chunks
- Citation highlighting
- PDF page preview
- OCR support for scanned PDFs
- Multi-document question answering
- Document sharing
- Usage analytics
- Rate limiting
- File size limits
- Advanced observability and logging
- Queue-based processing for large documents

---

# Screenshots

Add screenshots of the following sections here:

```text
/screenshots
├── login.png
├── signup.png
├── dashboard.png
├── upload.png
├── document-list.png
└── qa.png
```

Example:

```markdown
## Dashboard

![Dashboard](./screenshots/dashboard.png)
```

---

# Security Notes

Never commit:

```text
.env
.env.local
.env.production
service-role keys
secret API keys
access tokens
```

Use environment variables for all production secrets.

The frontend should only contain public Supabase configuration.

---

# Learning & Concepts Demonstrated

This project demonstrates practical implementation of:

- Retrieval-Augmented Generation
- Large Language Models
- Vector Embeddings
- Semantic Search
- Vector Databases
- pgvector
- Prompt Engineering
- Document Processing
- Chunking Strategies
- REST APIs
- Authentication
- Authorization
- Row Level Security
- Cloud Storage
- React State Management
- Redux Toolkit
- FastAPI
- PostgreSQL
- Production Deployment
- API Security
- Full-stack application architecture

---

# Author

**Mayank Singh**

B.Tech Computer Science

GitHub:  
https://github.com/Mayanksingh1234

LinkedIn:  
https://www.linkedin.com/in/mayanksingh2702/

---

# License

This project is available for educational and portfolio purposes.

---

## Project Summary

**PDF RAG Document Assistant** is a full-stack AI application that combines React, FastAPI, Supabase, pgvector, and Gemini to provide secure, document-specific question answering.

The project demonstrates how a complete RAG pipeline can be taken from local development to production deployment using modern cloud infrastructure.
