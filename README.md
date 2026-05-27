# Gluzo AI 🌸
> AI-powered beauty commerce platform — startup-grade MVP

---

## Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 18 + **Vite** + TypeScript + Tailwind CSS + Framer Motion |
| State | Zustand |
| Backend | FastAPI + Python |
| AI/RAG | LangChain + FAISS + OpenAI Embeddings |
| LLM | Groq (llama3-70b) / Gemini / OpenAI — switchable |
| Deployment | Vercel (frontend) + Render (backend) |

---

## Folder Structure

```
gluzo-ai/
├── frontend/                    # React + Vite
│   ├── src/
│   │   ├── components/
│   │   │   ├── chat/
│   │   │   │   ├── ChatSidebar.tsx      # Animated slide-in chat panel
│   │   │   │   ├── ChatMessages.tsx     # Messages + product cards
│   │   │   │   ├── ChatInput.tsx        # Auto-resize input + quick chips
│   │   │   │   └── FloatingChatButton.tsx
│   │   │   ├── products/
│   │   │   │   ├── ProductCard.tsx      # compact + full variants
│   │   │   │   └── ProductGrid.tsx      # skeleton loading grid
│   │   │   ├── ui/
│   │   │   │   └── HeroSection.tsx
│   │   │   └── layout/
│   │   │       └── Navbar.tsx
│   │   ├── pages/
│   │   │   ├── HomePage.tsx
│   │   │   ├── ProductsPage.tsx         # filter by category + skin type
│   │   │   └── RoutinePage.tsx          # AM/PM routine builder
│   │   ├── store/
│   │   │   └── chatStore.ts             # Zustand: messages, session, products
│   │   ├── lib/
│   │   │   ├── api.ts                   # Axios API client
│   │   │   └── utils.ts
│   │   └── styles/
│   │       └── globals.css
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── package.json
│
└── backend/                     # FastAPI
    ├── app/
    │   ├── main.py               # App + lifespan + CORS
    │   ├── api/
    │   │   ├── chat.py           # POST /chat
    │   │   ├── products.py       # GET /products
    │   │   ├── recommend.py      # POST /recommend
    │   │   ├── memory.py         # GET/DELETE /memory/{session}
    │   │   └── routine.py        # POST /routine
    │   ├── core/
    │   │   ├── config.py         # Pydantic settings
    │   │   ├── vectorstore.py    # FAISS embed + search
    │   │   ├── rag_pipeline.py   # Full RAG pipeline
    │   │   └── prompts.py        # System prompt + builder
    │   ├── models/
    │   │   ├── product.py
    │   │   └── memory.py
    │   └── services/
    │       ├── llm_client.py     # Groq/Gemini/OpenAI
    │       └── memory.py         # Session memory store
    ├── data/
    │   └── products.csv          # YOUR dataset goes here
    ├── requirements.txt
    └── .env.example
```

---

## RAG Architecture

```
User message
    │
    ▼
[Query Understanding]
  Extract: skin_type, concerns, budget, category, intent
    │
    ▼
[Query Rewriting]
  "glow for my wedding" → "brightening hydrating skincare glowing skin"
    │
    ▼
[FAISS Semantic Search]
  Embed query → cosine similarity → top-15 candidates
    │
    ▼
[Metadata Filter]
  skin_type match · price filter · category filter
    │
    ▼
[Product Reranking]
  concern match +0.15 · skin compat +0.10 · novelty -0.20
    │
    ▼
[Context Compression]
  Only relevant fields passed to LLM (< 800 tokens)
    │
    ▼
[LLM Response]
  Glow persona · conversation history · guardrails
    │
    ▼
  AI message + product cards → frontend
```

---

## Local Setup

### Backend

```bash
cd backend

# 1. Create virtualenv
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate

# 2. Install dependencies
pip install -r requirements.txt

# 3. Configure environment
cp .env.example .env
# Edit .env — add GROQ_API_KEY and OPENAI_API_KEY

# 4. Add your products CSV
# Place your file at: data/products.csv
# Required columns: name, brand, category, price, skin_type, concern, ingredients, description, image_url

# 5. Start the server
uvicorn app.main:app --reload --port 8000
```

On first start, the FAISS index is built automatically from your CSV.
Subsequent starts load it from disk (~instant).

### Frontend

```bash
cd frontend

# 1. Install
npm install

# 2. Configure
cp .env.example .env.local
# VITE_API_URL=http://localhost:8000/api/v1

# 3. Start dev server
npm run dev
# → http://localhost:3000
```

---

## API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/chat` | Main AI chat with full RAG |
| GET | `/api/v1/products` | Browse products (filterable) |
| POST | `/api/v1/recommend` | Direct recommendation |
| POST | `/api/v1/routine` | Generate AM/PM routine |
| GET | `/api/v1/memory/{session_id}` | Get session profile |
| DELETE | `/api/v1/memory/{session_id}` | Clear session |

### Chat request/response
```json
// POST /api/v1/chat
{
  "message": "I have oily skin with acne marks",
  "session_id": null
}

// Response
{
  "session_id": "uuid-here",
  "message": "Got you ✨ For oily acne-prone skin...",
  "products": [
    { "id": "...", "name": "...", "brand": "...", "price": 799, "image_url": "..." }
  ],
  "profile": { "skin_type": "oily", "concerns": ["acne marks"] }
}
```

---

## Switching LLM Provider

In `backend/.env`:

```bash
# Groq — recommended (fast, free tier)
LLM_PROVIDER=groq
LLM_MODEL=llama3-70b-8192
GROQ_API_KEY=gsk_...

# OpenAI
LLM_PROVIDER=openai
LLM_MODEL=gpt-4o-mini
OPENAI_API_KEY=sk-...

# Gemini
LLM_PROVIDER=gemini
LLM_MODEL=gemini-1.5-pro
GOOGLE_API_KEY=AIza...
```

---

## Deployment

### Frontend → Vercel

```bash
cd frontend
npm run build

# Or connect GitHub repo to Vercel:
# Build command: npm run build
# Output dir: dist
# Env: VITE_API_URL=https://your-backend.onrender.com/api/v1
```

### Backend → Render

1. Create a new **Web Service** on render.com
2. Connect your GitHub repo, root = `backend/`
3. Build command: `pip install -r requirements.txt`
4. Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. Add environment variables from `.env.example`
6. Upload `data/products.csv` via a persistent disk or bundle it in the repo

---

## CSV Format

Your `data/products.csv` must have these columns:

```
id, name, brand, category, price, skin_type, concern, ingredients, description, image_url
```

Example row:
```
1, Niacinamide 10% + Zinc 1%, The Ordinary, Serum, 599, oily/combination, acne/pores, niacinamide zinc pca, Reduces blemishes and pore appearance, https://...
```

---

## Performance Tips

- **FAISS index** is built once on startup and cached to disk — zero rebuild cost after first run
- Use **Groq** for ~100ms LLM response times vs 1-2s for OpenAI
- Product embeddings are batch-generated with rate-limit handling
- Frontend uses **skeleton loading** and **optimistic UI** for perceived speed
- Chat sidebar uses CSS `will-change: transform` via Framer Motion for 60fps animations

---

## Security Checklist

- [ ] API keys in `.env` never committed to git
- [ ] Add `.env` to `.gitignore`
- [ ] CORS `ALLOWED_ORIGINS` locked to your actual domains in production
- [ ] Rate limit `/chat` with `slowapi` in production
- [ ] Validate `session_id` format before memory lookup
- [ ] Add auth (Clerk / Supabase Auth) before launch

---

Built with 💖 by Gluzo AI
