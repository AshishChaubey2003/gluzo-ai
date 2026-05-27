# Gluzo AI — Setup Guide

## Backend Setup

```bash
cd Backend

# 1. Virtual environment
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # Mac/Linux

# 2. Install dependencies
pip install -r requirements.txt
pip install sentence-transformers

# 3. Create .env file
copy .env.example .env

# 4. Edit .env — add your API keys:
#    GROQ_API_KEY=gsk_...
#    OPENAI_API_KEY=sk-...  (optional, not needed anymore)

# 5. Start server
uvicorn app.main:app --reload --port 8000
```

## Frontend Setup

```bash
cd frontend

# 1. Install
npm install

# 2. Create env file
copy .env.example .env.local

# 3. Start
npm run dev
# → http://localhost:3000
```

## Important Notes
- LLM Model: llama-3.3-70b-versatile (Groq)
- Embeddings: sentence-transformers (FREE, no OpenAI needed)
- Products CSV: already included in Backend/data/products.csv
