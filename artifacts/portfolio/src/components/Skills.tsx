import { motion } from 'framer-motion';

const categories = [
  {
    label: 'AI / Machine Learning',
    color: '#8B5CF6',
    glow: 'rgba(139,92,246,0.4)',
    skills: [
      { name: 'Python', level: 95, icon: '🐍' },
      { name: 'TensorFlow', level: 82, icon: '🧠' },
      { name: 'PyTorch', level: 75, icon: '🔥' },
      { name: 'Scikit-learn', level: 85, icon: '📊' },
      { name: 'HuggingFace', level: 80, icon: '🤗' },
    ],
  },
  {
    label: 'RAG & LLM Stack',
    color: '#06B6D4',
    glow: 'rgba(6,182,212,0.4)',
    skills: [
      { name: 'LangChain', level: 85, icon: '🔗' },
      { name: 'LangGraph', level: 78, icon: '🕸️' },
      { name: 'Qdrant', level: 82, icon: '📦' },
      { name: 'OpenAI API', level: 90, icon: '⚡' },
      { name: 'RAG Systems', level: 88, icon: '🔍' },
    ],
  },
  {
    label: 'Frontend',
    color: '#3B82F6',
    glow: 'rgba(59,130,246,0.4)',
    skills: [
      { name: 'React', level: 85, icon: '⚛️' },
      { name: 'Next.js', level: 80, icon: '▲' },
      { name: 'Tailwind CSS', level: 88, icon: '🎨' },
      { name: 'JavaScript', level: 86, icon: '📘' },
      { name: 'Framer Motion', level: 76, icon: '✨' },
    ],
  },
  {
    label: 'Backend & DevOps',
    color: '#10B981',
    glow: 'rgba(16,185,129,0.4)',
    skills: [
      { name: 'Django', level: 82, icon: '🟢' },
      { name: 'FastAPI', level: 78, icon: '🚀' },
      { name: 'Docker', level: 72, icon: '🐳' },
      { name: 'AWS', level: 65, icon: '☁️' },
      { name: 'MySQL / Qdrant', level: 80, icon: '🗄️' },
    ],
  },
];

const iconSkills = [
  { name: 'Python', icon: '🐍', col: '#3776ab' },
  { name: 'React', icon: '⚛️', col: '#61dafb' },
  { name: 'Next.js', icon: '▲', col: '#fff' },
  { name: 'TensorFlow', icon: '🧠', col: '#ff6f00' },
  { name: 'PyTorch', icon: '🔥', col: '#ee4c2c' },
  { name: 'LangChain', icon: '🔗', col: '#1c7c54' },
  { name: 'FastAPI', icon: '🚀', col: '#009688' },
  { name: 'Docker', icon: '🐳', col: '#2496ed' },
  { name: 'HuggingFace', icon: '🤗', col: '#ffca28' },
  { name: 'Django', icon: '🟢', col: '#092e20' },
  { name: 'Qdrant', icon: '📦', col: '#8B5CF6' },
  { name: 'RAG', icon: '🔍', col: '#06B6D4' },
  { name: 'AWS', icon: '☁️', col: '#ff9900' },
  { name: 'Firebase', icon: '🔴', col: '#ffca28' },
];

export default function Skills() {
  return (
    <section id="skills" className="section-padding" style={{ background: 'rgba(0,0,0,0.3)' }}>
      <div className="content-shell">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="text-cyan-400 text-sm font-medium tracking-widest uppercase">Technical Arsenal</span>
          <h2 className="font-display font-bold text-4xl md:text-5xl text-white mt-3 mb-4">
            Skills & <span className="gradient-text">Expertise</span>
          </h2>
          <div className="w-16 h-0.5 mx-auto" style={{ background: 'linear-gradient(90deg, #8B5CF6, #06B6D4)' }} />
        </motion.div>

        {/* Glowing icon pills */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex flex-wrap justify-center gap-3 mb-14"
        >
          {iconSkills.map((s, i) => (
            <motion.div
              key={s.name}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
              whileHover={{ scale: 1.1, y: -4 }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl cursor-default transition-all"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                backdropFilter: 'blur(10px)',
              }}
            >
              <span className="text-lg">{s.icon}</span>
              <span className="text-slate-300 text-sm font-medium">{s.name}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Category cards with progress bars */}
        <div className="grid md:grid-cols-2 gap-6">
          {categories.map((cat, ci) => (
            <motion.div
              key={cat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: ci * 0.1 }}
              className="rounded-2xl p-6 card-hover"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: `1px solid rgba(255,255,255,0.07)`,
                backdropFilter: 'blur(20px)',
              }}
              whileHover={{
                borderColor: `${cat.color}40`,
                boxShadow: `0 0 30px ${cat.glow}20`,
              }}
            >
              {/* Category header */}
              <div className="flex items-center gap-3 mb-5">
                <div className="w-2 h-2 rounded-full" style={{ background: cat.color, boxShadow: `0 0 8px ${cat.color}` }} />
                <h3 className="font-display font-semibold text-white">{cat.label}</h3>
              </div>

              {/* Skills */}
              <div className="space-y-4">
                {cat.skills.map((skill, si) => (
                  <div key={skill.name}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{skill.icon}</span>
                        <span className="text-slate-300 text-sm font-medium">{skill.name}</span>
                      </div>
                      <span className="text-xs font-mono" style={{ color: cat.color }}>{skill.level}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: ci * 0.1 + si * 0.08, ease: 'easeOut' }}
                        className="h-full rounded-full"
                        style={{ background: `linear-gradient(90deg, ${cat.color}aa, ${cat.color})` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
