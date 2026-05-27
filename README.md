# 🌸 Gluzo AI — Smart Beauty Advisor

AI-powered skincare chatbot that recommends products based on your skin type, concerns & budget.

---

## ⚙️ What You Need Before Starting

- Python 3.10+ → [python.org](https://python.org)
- Node.js 18+ → [nodejs.org](https://nodejs.org)
- Groq API Key (Free) → [groq.com](https://groq.com) → Sign up → API Keys → Create Key

---

## 🖥️ Windows Setup

### Step 1 — Backend
Open terminal in the `Backend` folder and run these one by one:

```bash
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
pip install sentence-transformers
copy .env.example .env
```

Now open `.env` file and add your Groq key:
LLM_PROVIDER=groq
LLM_MODEL=llama-3.3-70b-versatile
GROQ_API_KEY=paste_your_groq_key_here

Start the backend:
```bash
uvicorn app.main:app --reload --port 8000
```

✅ You should see: `Application startup complete`

---

### Step 2 — Frontend
Open a **new terminal** in the `frontend` folder:

```bash
npm install
copy .env.example .env.local
npm run dev
```

✅ Open [http://localhost:3000](http://localhost:3000)

---

## 🍎 Mac Setup

### Step 1 — Backend
Open terminal in the `Backend` folder and run these one by one:

```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
pip install sentence-transformers
cp .env.example .env
```

Now open `.env` file and add your Groq key:
LLM_PROVIDER=groq
LLM_MODEL=llama-3.3-70b-versatile
GROQ_API_KEY=paste_your_groq_key_here

Start the backend:
```bash
uvicorn app.main:app --reload --port 8000
```

✅ You should see: `Application startup complete`

---

### Step 2 — Frontend
Open a **new terminal** in the `frontend` folder:

```bash
npm install
cp .env.example .env.local
npm run dev
```

✅ Open [http://localhost:3000](http://localhost:3000)

---

## 🔑 How to Get Groq API Key (Free)

1. Go to [groq.com](https://groq.com)
2. Click **Sign Up** (it's free)
3. After login, go to **API Keys** in the left menu
4. Click **Create API Key**
5. Copy the key (starts with `gsk_...`)
6. Paste it in your `.env` file

---

## ❓ Common Issues

**Backend not starting?**
- Make sure `(venv)` is showing in your terminal
- Check that your Groq key is correctly added in `.env`

**Products not loading?**
- Make sure backend is running on port 8000
- Check `frontend/.env.local` has: `VITE_API_URL=http://localhost:8000/api/v1`

**Chat not working?**
- Restart the backend after any `.env` changes

---

## 🛠️ Tech Stack

- **Frontend:** React + TypeScript + Tailwind CSS
- **Backend:** FastAPI + Python
- **AI:** Groq (llama-3.3-70b) — Free & Fast
- **Search:** FAISS + Sentence Transformers (Free, runs locally)

---
