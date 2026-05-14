import { motion } from 'framer-motion';

export default function HeroOrb() {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div className="relative w-80 h-80 md:w-96 md:h-96">
        {/* Outer rotating ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0 rounded-full"
          style={{
            border: '1px solid rgba(139,92,246,0.25)',
            borderTopColor: 'rgba(139,92,246,0.8)',
          }}
        />
        {/* Middle rotating ring */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-6 rounded-full"
          style={{
            border: '1px solid rgba(6,182,212,0.2)',
            borderBottomColor: 'rgba(6,182,212,0.7)',
          }}
        />
        {/* Inner ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-12 rounded-full"
          style={{
            border: '1px dashed rgba(139,92,246,0.3)',
          }}
        />

        {/* Orb core */}
        <motion.div
          animate={{ scale: [1, 1.04, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute inset-16 rounded-full"
          style={{
            background: 'radial-gradient(circle at 35% 35%, rgba(167,139,250,0.9) 0%, rgba(139,92,246,0.7) 30%, rgba(109,40,217,0.8) 65%, rgba(30,5,102,0.9) 100%)',
            boxShadow: '0 0 60px rgba(139,92,246,0.7), 0 0 120px rgba(139,92,246,0.3), inset 0 0 40px rgba(167,139,250,0.2)',
          }}
        />

        {/* Scan line effect */}
        <div className="absolute inset-16 rounded-full overflow-hidden">
          <motion.div
            animate={{ y: ['-100%', '300%'] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear', repeatDelay: 1.5 }}
            style={{
              height: '1px',
              background: 'linear-gradient(90deg, transparent, rgba(167,139,250,0.8), transparent)',
              width: '100%',
            }}
          />
        </div>

        {/* Floating dots on orbits */}
        {[0, 1, 2].map(i => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full"
            style={{
              background: i === 1 ? '#06B6D4' : '#8B5CF6',
              boxShadow: `0 0 8px ${i === 1 ? '#06B6D4' : '#8B5CF6'}`,
              top: '50%',
              left: '50%',
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 8 + i * 4, repeat: Infinity, ease: 'linear' }}
            transformTemplate={({ rotate }) =>
              `rotate(${rotate}) translateX(${120 + i * 25}px) rotate(-${rotate})`
            }
          />
        ))}

        {/* Data points floating around */}
        {['AI', 'ML', 'RAG', 'LLM'].map((label, i) => {
          const angles = [45, 135, 225, 315];
          const rad = (angles[i] * Math.PI) / 180;
          const r = 155;
          const x = Math.cos(rad) * r;
          const y = Math.sin(rad) * r;
          return (
            <motion.div
              key={label}
              className="absolute text-xs font-bold font-display"
              style={{
                left: `calc(50% + ${x}px)`,
                top: `calc(50% + ${y}px)`,
                transform: 'translate(-50%, -50%)',
                color: i % 2 === 0 ? '#a78bfa' : '#22d3ee',
                textShadow: `0 0 10px ${i % 2 === 0 ? '#8B5CF6' : '#06B6D4'}`,
              }}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2 + i * 0.5, repeat: Infinity, delay: i * 0.4 }}
            >
              {label}
            </motion.div>
          );
        })}
      </div>

      {/* Background glow */}
      <div className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle at center, rgba(139,92,246,0.15) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />
    </div>
  );
}
