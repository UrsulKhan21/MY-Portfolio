# ABDUR URSUL KHAN Portfolio RAG Backend

This backend follows the same RAG stack as `rag_ai_webx/backend`:

- Qdrant for vector search
- `sentence-transformers` with `all-MiniLM-L6-v2` embeddings
- Groq OpenAI-compatible API
- `llama-3.1-8b-instant` for faster portfolio answers

## Add Or Update Data

Edit or add `.txt` files inside:

```text
rag_backend/data
```

Then reindex:

```bash
curl -X POST http://localhost:8080/api/rag/reindex -H "x-admin-token: change-this-token"
```

You can also add text through the API:

```bash
curl -X POST http://localhost:8080/api/rag/ingest-text ^
  -H "Content-Type: application/json" ^
  -H "x-admin-token: change-this-token" ^
  -d "{\"title\":\"new_info\",\"text\":\"Abdur ...\"}"
```

## Run Locally

```bash
cd rag_backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
uvicorn app.main:app --host 0.0.0.0 --port 8080
```

Make sure `.env` contains `QDRANT_URL`, `QDRANT_API_KEY`, and `GROQ_API_KEY`.
