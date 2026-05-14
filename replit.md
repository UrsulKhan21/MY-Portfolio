# Abdur Ursul Khan Portfolio

A personal portfolio website for **Abdur Ursul Khan** — AI Engineer & Full Stack Developer. Features a futuristic, cinematic design with a neural network background, animated hero orb, typing effect, and all real resume data.

## Run & Operate

- `pnpm --filter @workspace/portfolio run dev` — run the portfolio frontend (port assigned by workflow)
- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite, Tailwind CSS v4, Framer Motion, wouter
- API: Express 5 + Zod validation
- Build: esbuild (CJS bundle for api-server)

## Where things live

- `artifacts/portfolio/src/components/` — Hero, About, Skills, Projects, Experience, Contact, Footer, Navbar, NeuralBackground, HeroOrb
- `artifacts/portfolio/src/pages/Home.tsx` — main page composition
- `artifacts/portfolio/src/index.css` — full design system (CSS variables, glass, gradients, animations)
- `artifacts/api-server/src/routes/messages.ts` — contact form API (POST /api/messages)
- `lib/api-spec/openapi.yaml` — OpenAPI spec (source of truth for API contracts)

## Identity

- **Name**: Abdur Ursul Khan
- **Email**: abdurursulkhan@gmail.com
- **GitHub**: https://github.com/UrsulKhan21
- **LinkedIn**: https://www.linkedin.com/in/abdur-ursul-khan-0325522a9/
- **Project 1**: RAG AI Chatbot → https://rag-frontend-peach-mu.vercel.app/
- **Project 2**: AI Stock Market → https://huggingface.co/spaces/Ursul21/Stock_market_prediction

## Architecture decisions

- NeuralBackground uses canvas 2D (no WebGL needed) for the animated neural net grid.
- HeroOrb is a CSS/Framer Motion 3D-style sphere with rotating rings — no Three.js required (WebGL unavailable in Replit sandbox).
- Contact form posts to `/api/messages` (relative URL via shared proxy), not hardcoded localhost.
- Messages are stored in-memory in the api-server; no database needed for this MVP.
- Flask backend from original import was not ported — Express api-server handles the only backend feature.

## Design System

- **Colors**: `#050505` bg, `#8B5CF6` purple, `#06B6D4` cyan, `#3B82F6` blue
- **Font**: Space Grotesk (headings), Inter (body) via Google Fonts
- **Key classes**: `.glass`, `.glass-purple`, `.gradient-text`, `.gradient-text-purple`, `.mesh-bg`, `.btn-primary`, `.btn-secondary`, `.btn-cyan`, `.card-hover`
- **Animations**: float, pulse-glow, rotate-slow, blink, fadeInUp, shimmer, gradient-shift

## Sections

1. **Hero** — Split-screen, typed roles, animated orb, CTA buttons, stats
2. **About** — Bio card + AI interest cards + quick facts
3. **Skills** — Icon pills + categorized progress bars (AI/ML, RAG, Frontend, Backend)
4. **Projects** — RAG Chatbot, Stock Market AI, Fine-tuned LLM — with live demo + GitHub links
5. **Experience** — Futuristic vertical timeline (education, internship, projects)
6. **Contact** — Social links + contact form → API
7. **Footer** — Minimal with gradient line

## User preferences

- AI Engineer first, Full Stack Developer second
- Dark futuristic theme (Cyberpunk × Apple × Linear × Vercel aesthetic)
- Glassmorphism, neon glows, premium SaaS-style cards

## Gotchas

- WebGL/Three.js is not available in the Replit dev sandbox (no GPU). Hero orb is CSS-only. Three.js would work on a deployed environment with GPU.
- Google Fonts `@import` must come BEFORE `@import "tailwindcss"` in index.css (PostCSS requirement).
- Do not run `pnpm dev` at the workspace root — use workflows.
