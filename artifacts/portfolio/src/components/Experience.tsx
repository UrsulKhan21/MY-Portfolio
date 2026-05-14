import { motion } from 'framer-motion';

const timeline = [
  {
    year: '2022–2026',
    title: 'B.Tech — CS & Artificial Intelligence',
    org: 'Aravali Institute',
    type: 'education',
    desc: 'Passed out with a B.Tech in Computer Science & Artificial Intelligence. Focused on deep learning, NLP, intelligent systems, algorithms, DBMS, and machine learning. CGPA: 8.5.',
    tags: ['AI', 'Machine Learning', 'NLP', 'Python'],
    icon: '🎓',
    color: '#8B5CF6',
  },
  {
    year: 'Jun–Jul 2025',
    title: 'Web Development Intern',
    org: 'ANWIMAC Technologies Pvt. Ltd.',
    type: 'work',
    desc: '45-day internship in the IT Department. Worked on Django & JavaScript web development — contributed to backend logic, frontend integration, and feature delivery.',
    tags: ['Django', 'JavaScript', 'Backend', 'Frontend'],
    icon: '🏢',
    color: '#06B6D4',
  },
  {
    year: '2024',
    title: 'RAG AI Web Application',
    org: 'Independent Project',
    type: 'project',
    desc: 'Built a full-stack RAG platform using Qdrant, SentenceTransformers, and OpenAI API. Deployed with Next.js frontend and Django backend on Vercel.',
    tags: ['RAG', 'Qdrant', 'OpenAI', 'Next.js'],
    icon: '🔍',
    color: '#8B5CF6',
  },
  {
    year: '2024',
    title: 'AI Stock Market Trading System',
    org: 'Research Project',
    type: 'project',
    desc: 'Developed hybrid trading model combining technical analysis with NLP sentiment. Deployed on HuggingFace Spaces. Featured backtesting and risk management.',
    tags: ['ML', 'NLP', 'Pandas', 'HuggingFace'],
    icon: '📈',
    color: '#06B6D4',
  },
  {
    year: '2023',
    title: 'LLM Fine-Tuning Research',
    org: 'Personal Research',
    type: 'research',
    desc: 'Fine-tuned transformer models on custom datasets using PyTorch and HuggingFace Transformers. Explored prompt engineering, tokenization, and response personalization.',
    tags: ['PyTorch', 'Transformers', 'Fine-tuning', 'NLP'],
    icon: '🤖',
    color: '#3B82F6',
  },
];

const typeColors: Record<string, string> = {
  education: '#8B5CF6',
  work: '#06B6D4',
  project: '#10B981',
  research: '#3B82F6',
};

const typeLabels: Record<string, string> = {
  education: 'Education',
  work: 'Internship',
  project: 'Project',
  research: 'Research',
};

export default function Experience() {
  return (
    <section id="experience" className="section-padding" style={{ background: 'rgba(0,0,0,0.2)' }}>
      <div className="content-shell-narrow">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="text-blue-400 text-sm font-medium tracking-widest uppercase">Journey</span>
          <h2 className="font-display font-bold text-4xl md:text-5xl text-white mt-3 mb-4">
            Experience & <span className="gradient-text">Timeline</span>
          </h2>
          <div className="w-16 h-0.5 mx-auto" style={{ background: 'linear-gradient(90deg, #8B5CF6, #06B6D4)' }} />
        </motion.div>

        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-8 top-0 bottom-0 w-px"
            style={{ background: 'linear-gradient(180deg, transparent, rgba(139,92,246,0.5), rgba(6,182,212,0.5), transparent)' }} />

          <div className="space-y-8">
            {timeline.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="relative flex gap-6"
              >
                {/* Node */}
                <div className="relative flex-shrink-0">
                  <motion.div
                    whileInView={{ scale: [0, 1.2, 1] }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.1 }}
                    className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl z-10 relative"
                    style={{
                      background: `${item.color}18`,
                      border: `1px solid ${item.color}40`,
                      boxShadow: `0 0 20px ${item.color}20`,
                    }}
                  >
                    {item.icon}
                  </motion.div>
                </div>

                {/* Content */}
                <div className="flex-1 pb-2">
                  <div className="rounded-2xl p-5 card-hover"
                    style={{
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.07)',
                      backdropFilter: 'blur(20px)',
                    }}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                      <div>
                        <h3 className="font-display font-semibold text-white">{item.title}</h3>
                        <p className="text-slate-400 text-sm">{item.org}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                          style={{ background: `${typeColors[item.type]}18`, color: typeColors[item.type], border: `1px solid ${typeColors[item.type]}30` }}>
                          {typeLabels[item.type]}
                        </span>
                        <span className="text-xs text-slate-500 font-mono">{item.year}</span>
                      </div>
                    </div>
                    <p className="text-slate-400 text-sm leading-relaxed mb-3">{item.desc}</p>
                    <div className="flex flex-wrap gap-2">
                      {item.tags.map(t => (
                        <span key={t} className="px-2 py-0.5 rounded-md text-xs"
                          style={{ background: `${item.color}12`, color: item.color, border: `1px solid ${item.color}25` }}>
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
