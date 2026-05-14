import { motion } from 'framer-motion';

const projects = [
  {
    id: 1,
    title: 'RAG AI Chatbot Platform',
    subtitle: 'Full-Stack AI Application',
    description:
      'A production-grade Retrieval-Augmented Generation (RAG) platform for querying user-provided PDFs and APIs. Built with semantic search, vector embeddings, and role-based AI responses.',
    tags: ['Django', 'Next.js', 'Qdrant', 'SentenceTransformers', 'OpenAI API', 'Python'],
    features: [
      'Text chunking & embedding generation',
      'Semantic vector search with Qdrant',
      'Role-based contextual AI responses',
      'Scalable backend with auth & data isolation',
    ],
    live: 'https://rag-frontend-peach-mu.vercel.app/',
    github: 'https://github.com/UrsulKhan21',
    color1: '#8B5CF6',
    color2: '#06B6D4',
    glow: 'rgba(139,92,246,0.3)',
    badge: 'LIVE',
    badgeColor: '#8B5CF6',
    icon: '🔍',
  },
  {
    id: 2,
    title: 'AI Stock Market Predictor',
    subtitle: 'ML Trading System',
    description:
      'Hybrid AI trading system combining technical indicators with NLP sentiment analysis. Features time-series feature engineering, backtesting, and automated risk management strategies.',
    tags: ['Python', 'Pandas', 'scikit-learn', 'NLP', 'HuggingFace', 'Matplotlib'],
    features: [
      'Technical indicators + sentiment fusion',
      'Time-series feature engineering',
      'Backtesting & performance analytics',
      'Stop-loss & risk allocation strategies',
    ],
    live: 'https://huggingface.co/spaces/Ursul21/Stock_market_prediction',
    github: 'https://github.com/UrsulKhan21',
    color1: '#06B6D4',
    color2: '#3B82F6',
    glow: 'rgba(6,182,212,0.3)',
    badge: 'HF SPACE',
    badgeColor: '#06B6D4',
    icon: '📈',
  },
  {
    id: 3,
    title: 'Personalized LLM Chatbot',
    subtitle: 'Fine-Tuned Language Model',
    description:
      'Fine-tuned a transformer-based language model on custom chat and Atlas datasets. Built complete preprocessing, tokenization, and prompt engineering pipeline for improved personalization.',
    tags: ['Python', 'Transformers', 'PyTorch', 'HuggingFace', 'Fine-tuning', 'NLP'],
    features: [
      'Custom dataset preprocessing & tokenization',
      'Prompt engineering optimization',
      'Improved contextual consistency',
      'Response personalization pipeline',
    ],
    live: 'https://github.com/UrsulKhan21',
    github: 'https://github.com/UrsulKhan21',
    color1: '#3B82F6',
    color2: '#8B5CF6',
    glow: 'rgba(59,130,246,0.3)',
    badge: 'RESEARCH',
    badgeColor: '#3B82F6',
    icon: '🤖',
  },
];

export default function Projects() {
  return (
    <section id="projects" className="section-padding">
      <div className="content-shell">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="text-purple-400 text-sm font-medium tracking-widest uppercase">Portfolio</span>
          <h2 className="font-display font-bold text-4xl md:text-5xl text-white mt-3 mb-4">
            Featured <span className="gradient-text">Projects</span>
          </h2>
          <div className="w-16 h-0.5 mx-auto" style={{ background: 'linear-gradient(90deg, #8B5CF6, #06B6D4)' }} />
          <p className="text-slate-400 mt-6 max-w-xl mx-auto text-sm">
            Real-world AI systems deployed in production — from RAG pipelines to financial ML models.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {projects.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.12 }}
              className="group rounded-2xl overflow-hidden relative flex flex-col"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.07)',
                backdropFilter: 'blur(20px)',
              }}
              whileHover={{ y: -8, boxShadow: `0 20px 60px ${p.glow}` }}
            >
              {/* Header gradient */}
              <div className="h-2 w-full" style={{ background: `linear-gradient(90deg, ${p.color1}, ${p.color2})` }} />

              <div className="p-6 flex flex-col flex-1">
                {/* Top row */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                      style={{ background: `${p.color1}20`, border: `1px solid ${p.color1}30` }}>
                      {p.icon}
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-white text-sm leading-tight">{p.title}</h3>
                      <p className="text-slate-500 text-xs">{p.subtitle}</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full"
                    style={{ background: `${p.badgeColor}20`, color: p.badgeColor, border: `1px solid ${p.badgeColor}40` }}>
                    {p.badge}
                  </span>
                </div>

                <p className="text-slate-400 text-sm leading-relaxed mb-4">{p.description}</p>

                {/* Features */}
                <ul className="space-y-1.5 mb-5 flex-1">
                  {p.features.map(f => (
                    <li key={f} className="flex items-start gap-2 text-xs text-slate-400">
                      <span className="mt-0.5 flex-shrink-0 w-1.5 h-1.5 rounded-full" style={{ background: p.color1 }} />
                      {f}
                    </li>
                  ))}
                </ul>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {p.tags.map(t => (
                    <span key={t} className="px-2 py-0.5 rounded-md text-xs font-medium"
                      style={{ background: 'rgba(255,255,255,0.05)', color: '#94a3b8', border: '1px solid rgba(255,255,255,0.08)' }}>
                      {t}
                    </span>
                  ))}
                </div>

                {/* Action buttons */}
                <div className="flex gap-3 mt-auto">
                  <a
                    href={p.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all"
                    style={{
                      background: `linear-gradient(135deg, ${p.color1}, ${p.color2})`,
                      color: 'white',
                      boxShadow: `0 0 15px ${p.glow}`,
                    }}
                  >
                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    Live Demo
                  </a>
                  <a
                    href={p.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all"
                    style={{ background: 'rgba(255,255,255,0.05)', color: '#94a3b8', border: '1px solid rgba(255,255,255,0.08)' }}
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                    GitHub
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View all */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-10"
        >
          <a
            href="https://github.com/UrsulKhan21"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary inline-flex items-center gap-2"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            View All on GitHub
          </a>
        </motion.div>
      </div>
    </section>
  );
}
