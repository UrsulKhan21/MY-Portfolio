# Local Development and Deployment

## Windows local development

1. Install dependencies from repository root:
   - `pnpm.cmd install`
   - If `pnpm` already works in your terminal, `pnpm install` is also fine. `pnpm.cmd` avoids the common PowerShell script execution policy error.

2. Run frontend locally from the repository root:
   - `pnpm.cmd --filter @workspace/portfolio run dev`

3. Run backend locally from the repository root in another terminal:
   - `pnpm.cmd --filter @workspace/api-server run dev`

4. If you want to override values manually:
   - Frontend: `pnpm.cmd --filter @workspace/portfolio run dev`
   - Backend: `pnpm.cmd --filter @workspace/api-server run dev`

5. Local URLs:
   - Frontend: `http://localhost:4173`
   - Backend health check: `http://localhost:8080/api/health`

## Frontend deployment on Vercel

- Root directory: repository root
- Install command: `pnpm install --frozen-lockfile`
- Build command: `pnpm --filter @workspace/portfolio run build`
- Output directory: `artifacts/portfolio/dist/public`
- Environment variable (optional if backend URL is external):
  - `VITE_API_BASE_URL=https://<your-hf-backend-url>`

Vercel can use the root `vercel.json` to build only the portfolio app while still resolving workspace packages from the monorepo.

## RAG chatbot backend on Hugging Face Spaces

The root `Dockerfile` now builds the Python RAG backend from `rag_backend`. It uses the same core stack as your `rag_ai_webx/backend` project:

- Qdrant for vector storage
- `sentence-transformers` with `all-MiniLM-L6-v2`
- Groq with `llama-3.1-8b-instant`

### Deploy steps

1. Create a new Hugging Face Space and choose Docker as the SDK/runtime.
2. Push this repository to the Space.
3. Ensure the Space uses the root `Dockerfile`.
4. Add these Space secrets:
   - `QDRANT_URL`
   - `QDRANT_API_KEY`
   - `GROQ_API_KEY`
   - `ADMIN_TOKEN`
   - `ALLOWED_ORIGINS=https://your-vercel-app.vercel.app,http://localhost:4173`
5. After the Space is live, copy its public URL.
6. In Vercel, set `VITE_API_BASE_URL` to that Hugging Face Space URL, for example `https://username-space-name.hf.space`.

### Add or update chatbot data

Put your knowledge-base text files in:

- `rag_backend/data/*.txt`

The default file is:

- `rag_backend/data/about_me.txt`

After editing text locally or after deploying, reindex into Qdrant:

```bash
curl -X POST https://username-space-name.hf.space/api/rag/reindex -H "x-admin-token: <ADMIN_TOKEN>"
```

You can also add text without editing files:

```bash
curl -X POST https://username-space-name.hf.space/api/rag/ingest-text ^
  -H "Content-Type: application/json" ^
  -H "x-admin-token: <ADMIN_TOKEN>" ^
  -d "{\"title\":\"new_info\",\"text\":\"Add anything you want the chatbot to know about you.\"}"
```

Ask the chatbot API directly:

```bash
curl -X POST https://username-space-name.hf.space/api/rag/query ^
  -H "Content-Type: application/json" ^
  -d "{\"question\":\"What projects has Abdur built?\",\"top_k\":5}"
```

## API URL behavior

- The frontend chatbot will send RAG requests to:
  - `VITE_API_BASE_URL + /api/rag/query` if `VITE_API_BASE_URL` is set
  - otherwise `/api/rag/query`

- The contact form will send message requests to:
  - `VITE_API_BASE_URL + /api/messages` if `VITE_API_BASE_URL` is set
  - otherwise `/api/messages`

So when the RAG backend is hosted on Hugging Face, set `VITE_API_BASE_URL` to the published backend URL.
