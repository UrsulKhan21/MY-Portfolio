import { motion } from 'framer-motion';

const cards = [
  {
    icon: '🧠',
    title: 'AI & Machine Learning',
    desc: 'Specializing in NLP, transformer architectures, LLM fine-tuning, and deploying production-grade AI models.',
    color: 'rgba(139,92,246,0.15)',
    border: 'rgba(139,92,246,0.25)',
    glow: 'rgba(139,92,246,0.3)',
  },
  {
    icon: '🔍',
    title: 'RAG Systems',
    desc: 'Building Retrieval-Augmented Generation pipelines with Qdrant, SentenceTransformers, and OpenAI for semantic document intelligence.',
    color: 'rgba(6,182,212,0.12)',
    border: 'rgba(6,182,212,0.25)',
    glow: 'rgba(6,182,212,0.3)',
  },
  {
    icon: '📈',
    title: 'Stock Market Analytics',
    desc: 'Developing hybrid trading models using technical indicators, NLP sentiment, and time-series ML for automated market analysis.',
    color: 'rgba(59,130,246,0.12)',
    border: 'rgba(59,130,246,0.25)',
    glow: 'rgba(59,130,246,0.3)',
  },
  {
    icon: '⚡',
    title: 'Full Stack Development',
    desc: 'End-to-end applications with React, Next.js, Django, FastAPI, and modern DevOps practices with Docker & AWS.',
    color: 'rgba(139,92,246,0.1)',
    border: 'rgba(139,92,246,0.2)',
    glow: 'rgba(139,92,246,0.2)',
  },
];

export default function About() {
  return (
    <section id="about" className="section-padding relative">
      <div className="content-shell">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="text-purple-400 text-sm font-medium tracking-widest uppercase">About Me</span>
          <h2 className="font-display font-bold text-4xl md:text-5xl text-white mt-3 mb-4">
            Building the <span className="gradient-text">AI Future</span>
          </h2>
          <div className="w-16 h-0.5 mx-auto" style={{ background: 'linear-gradient(90deg, #8B5CF6, #06B6D4)' }} />
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left — Bio */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="glass rounded-2xl p-8 card-hover relative overflow-hidden"
              style={{ border: '1px solid rgba(139,92,246,0.15)', boxShadow: '0 0 40px rgba(139,92,246,0.08)' }}>
              <div className="absolute top-0 right-0 w-32 h-32 rounded-full"
                style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)' }} />

              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold font-display"
                  style={{ background: 'linear-gradient(135deg, #8B5CF6, #06B6D4)', boxShadow: '0 0 20px rgba(139,92,246,0.4)' }}>
                  AU
                </div>
                <div>
                  <h3 className="font-display font-bold text-xl text-white">Abdur Ursul Khan</h3>
                  <p className="text-slate-400 text-sm">AI Engineer · Udaipur, Rajasthan</p>
                </div>
              </div>

              <p className="text-slate-300 leading-relaxed mb-4">
                Passed out B.Tech graduate in <span className="text-purple-300 font-medium">Computer Science & Artificial Intelligence</span> from Aravali Institute (CGPA: 8.5). I bridge the gap between cutting-edge AI research and real-world deployments.
              </p>
              <p className="text-slate-400 leading-relaxed mb-6">
                From fine-tuning transformers and building RAG pipelines to developing AI-powered trading systems — I build things that push boundaries. Completed a 45-day internship at ANWIMAC Technologies in web development.
              </p>

              <div className="flex flex-wrap gap-2">
                {['Python', 'LangChain', 'TensorFlow', 'Next.js', 'Qdrant', 'Docker'].map(tag => (
                  <span key={tag} className="px-3 py-1 rounded-full text-xs font-medium text-purple-300"
                    style={{ background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.2)' }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Quick facts */}
            <div className="grid grid-cols-2 gap-4 mt-4">
              {[
                { icon: '🎓', label: 'Education', val: 'B.Tech AI, 8.5 CGPA' },
                { icon: '🏢', label: 'Internship', val: 'ANWIMAC Technologies' },
                { icon: '📍', label: 'Location', val: 'Udaipur, Rajasthan' },
                { icon: '📧', label: 'Email', val: 'abdurursulkhan@gmail.com' },
              ].map(f => (
                <div key={f.label} className="glass rounded-xl p-4 card-hover"
                  style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div className="text-xl mb-1">{f.icon}</div>
                  <div className="text-slate-500 text-xs">{f.label}</div>
                  <div className="text-slate-200 text-sm font-medium mt-0.5 truncate">{f.val}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right — Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {cards.map((card, i) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="rounded-2xl p-6 card-hover relative overflow-hidden"
                style={{
                  background: card.color,
                  border: `1px solid ${card.border}`,
                  backdropFilter: 'blur(20px)',
                }}
                whileHover={{ boxShadow: `0 0 30px ${card.glow}` }}
              >
                <div className="text-3xl mb-3">{card.icon}</div>
                <h4 className="font-display font-semibold text-white text-sm mb-2">{card.title}</h4>
                <p className="text-slate-400 text-xs leading-relaxed">{card.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
